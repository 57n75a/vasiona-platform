import { fetchTleGroup } from "@/lib/tle";
import { buildSatrec, subPointAt, tleInclinationDeg } from "@/lib/propagate";
import { isOverSerbia } from "@/lib/serbia";
import { ensureSchema, upsertSatellite, logOverflight } from "@/lib/db";
import { ensureCronStatusSchema, recordCronRun, getCronEnabled } from "@/lib/cronStatusService";

// Serbia's polygon spans roughly 41.8-46.2°N. A satellite's ground track never
// reaches a latitude higher than min(inclination, 180 - inclination), so
// anything well under Serbia's southern edge can be skipped without ever
// building a satrec or propagating it. This is what makes scanning the
// ~10,000+ object "active" catalog affordable inside one request — it mainly
// prunes the geostationary belt and other low-inclination traffic, which is a
// large fraction of that catalog and can never cross Serbia at any time of day.
const MIN_RELEVANT_INCLINATION_DEG = 40; // small safety margin under Serbia's ~41.8° southern edge
function reachesSerbiaLatitude(inclDeg: number | null): boolean {
  if (inclDeg === null) return true; // unparseable — don't risk skipping a real satellite
  const maxLat = Math.min(inclDeg, 180 - inclDeg);
  return maxLat >= MIN_RELEVANT_INCLINATION_DEG;
}

// A single instant is a coin flip: Serbia is small and a LEO satellite's
// ground track crosses it in well under a minute, so checking only
// `new Date()` at the moment the job runs makes "did this run find anything?"
// mostly luck — see docs/BUILD_LOG.md for the incident this fixed. Sampling a
// short forward window turns one invocation into many chances instead of one,
// which matters even more given Vercel Hobby-tier accounts can only schedule
// this job once a day (see vercel.json / app/api/admin/cron-settings/route.ts).
const WINDOW_SECONDS = Number(process.env.CRON_WINDOW_SECONDS ?? 240); // 4 minutes forward
const STEP_SECONDS = Number(process.env.CRON_STEP_SECONDS ?? 15); // 17 samples per candidate

// Vercel kills the function outright at `maxDuration` (see the route files) —
// if that happens mid-loop, recordCronRun() never runs and `lastRunAt` never
// moves, which is indistinguishable from "nothing happened" on the homepage.
// Bailing out early and writing whatever was found so far, every time, is
// what actually fixes that: a run is now either complete or clearly marked
// `truncated`, but it always finishes and always updates the status row.
// Override via env if your plan's real function-timeout ceiling differs from
// the `maxDuration = 60` set in the route files (Vercel plans vary — see
// DEPLOY.md). Keep TIME_BUDGET_MS comfortably under whatever that ceiling
// actually is; it must leave room for the CelesTrak fetch plus the final
// recordCronRun() write.
const TIME_BUDGET_MS = Number(process.env.CRON_TIME_BUDGET_MS ?? 45_000);
const FETCH_TIMEOUT_MS = Number(process.env.CRON_FETCH_TIMEOUT_MS ?? 15_000);

export interface CronRunResult {
  ranAt: string;
  group: string;
  catalogSize: number;
  checked: number;
  candidatesAfterInclinationFilter: number;
  failed: number;
  overSerbiaRightNow: number;
  matchedThisRun: number;
  matchedSatellites: string[];
  windowSeconds: number;
  stepSeconds: number;
  durationMs: number;
  truncated?: boolean;
  skipped?: boolean;
  reason?: string;
  error?: string;
}

/**
 * The actual cron job logic, extracted so both the scheduled endpoint
 * (app/api/cron/fetch-tles/route.ts, CRON_SECRET-protected) and the admin
 * manual-trigger endpoint (app/api/admin/run-cron/route.ts,
 * ADMIN_SECRET-protected) call this function directly rather than one
 * making an HTTP request to the other — that self-fetch pattern caused a
 * real bug earlier in this project (see docs/BUILD_LOG.md) and isn't worth
 * repeating here.
 */
export async function runCronJob(options: { force?: boolean } = {}): Promise<CronRunResult> {
  const startedAt = new Date();
  const deadline = Date.now() + TIME_BUDGET_MS;
  await ensureSchema();
  await ensureCronStatusSchema();

  const group = process.env.CELESTRAK_GROUP || "active";

  const enabled = await getCronEnabled();
  if (!enabled && !options.force) {
    // Deliberately NOT calling recordCronRun here — a skip isn't a run, and
    // shouldn't overwrite the last real lastRunAt / catalogSize / etc.
    return {
      ranAt: startedAt.toISOString(),
      group,
      catalogSize: 0,
      checked: 0,
      candidatesAfterInclinationFilter: 0,
      failed: 0,
      overSerbiaRightNow: 0,
      matchedThisRun: 0,
      matchedSatellites: [],
      windowSeconds: WINDOW_SECONDS,
      stepSeconds: STEP_SECONDS,
      durationMs: Date.now() - startedAt.getTime(),
      skipped: true,
      reason:
        "Cron is toggled off in the admin console. The admin console's manual 'Run now' bypasses this; a plain curl to /api/cron/fetch-tles does not.",
    };
  }

  let checked = 0;
  let candidates = 0;
  let failed = 0;
  let overSerbiaRightNow = 0;
  let matchedThisRun = 0;
  const matchedSatellites: string[] = [];
  let truncated = false;
  let catalogSize = 0;
  let runError: string | undefined;

  try {
    const controller = new AbortController();
    const fetchTimeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let tles;
    try {
      tles = await fetchTleGroup(group, controller.signal);
    } finally {
      clearTimeout(fetchTimeout);
    }
    catalogSize = tles.length;

    const sampleOffsets: number[] = [];
    for (let s = 0; s <= WINDOW_SECONDS; s += STEP_SECONDS) sampleOffsets.push(s);

    for (const tle of tles) {
      checked++;

      if (Date.now() > deadline) {
        truncated = true;
        break;
      }

      const inclDeg = tleInclinationDeg(tle.line2);
      if (!reachesSerbiaLatitude(inclDeg)) continue;
      candidates++;

      const satrec = buildSatrec(tle);
      if (!satrec) {
        failed++;
        continue;
      }

      for (const offsetSec of sampleOffsets) {
        const sampleTime = offsetSec === 0 ? startedAt : new Date(startedAt.getTime() + offsetSec * 1000);
        const point = subPointAt(satrec, sampleTime);
        if (!point) continue;

        const over = isOverSerbia(point.lat, point.lon);
        if (offsetSec === 0 && over) overSerbiaRightNow++;

        if (over) {
          matchedThisRun++;
          matchedSatellites.push(tle.name);
          await upsertSatellite(tle.noradId, tle.name, point.altKm);
          await logOverflight({
            noradId: tle.noradId,
            lat: point.lat,
            lon: point.lon,
            altKm: point.altKm,
            observedAt: sampleTime,
          });
          break; // one logged pass per satellite per run — avoid near-duplicate rows seconds apart
        }
      }
    }
  } catch (err) {
    // Any failure in the fetch-or-scan block (CelesTrak timeout/network error,
    // an unexpected DB error mid-loop, etc.) still gets recorded below rather
    // than vanishing — see the comment on TIME_BUDGET_MS above for why that
    // matters: a run that fails is now visibly different from a run that
    // simply found nothing, instead of both looking identical (no status update).
    runError = err instanceof Error ? err.message : String(err);
  }

  const durationMs = Date.now() - startedAt.getTime();

  // Always write a status row — this is the line that makes "lastRunAt never
  // moves" impossible short of the whole function being killed before this
  // point, which TIME_BUDGET_MS is specifically sized to avoid.
  await recordCronRun({
    catalogSize,
    checked,
    candidates,
    failed,
    overSerbia: matchedThisRun,
    durationMs,
    truncated,
    error: runError,
  });

  return {
    ranAt: startedAt.toISOString(),
    group,
    catalogSize,
    checked,
    candidatesAfterInclinationFilter: candidates,
    failed,
    overSerbiaRightNow,
    matchedThisRun,
    matchedSatellites,
    windowSeconds: WINDOW_SECONDS,
    stepSeconds: STEP_SECONDS,
    durationMs,
    ...(truncated ? { truncated } : {}),
    ...(runError ? { error: runError } : {}),
  };
}
