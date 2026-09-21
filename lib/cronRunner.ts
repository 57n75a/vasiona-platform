import { fetchTleGroup } from "@/lib/tle";
import { currentSubPoint } from "@/lib/propagate";
import { isOverSerbia } from "@/lib/serbia";
import { ensureSchema, upsertSatellite, logOverflight } from "@/lib/db";
import { ensureCronStatusSchema, recordCronRun, getCronEnabled } from "@/lib/cronStatusService";

export interface CronRunResult {
  ranAt: string;
  group: string;
  catalogSize: number;
  checked: number;
  failed: number;
  overSerbiaRightNow: number;
  skipped?: boolean;
  reason?: string;
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
  await ensureSchema();
  await ensureCronStatusSchema();

  const enabled = await getCronEnabled();
  if (!enabled && !options.force) {
    return {
      ranAt: startedAt.toISOString(),
      group: process.env.CELESTRAK_GROUP || "active",
      catalogSize: 0,
      checked: 0,
      failed: 0,
      overSerbiaRightNow: 0,
      skipped: true,
      reason: "Cron is toggled off in the admin console.",
    };
  }

  const group = process.env.CELESTRAK_GROUP || "active";
  const tles = await fetchTleGroup(group);

  let checked = 0;
  let overSerbia = 0;
  let failed = 0;

  for (const tle of tles) {
    checked++;
    const point = currentSubPoint(tle, startedAt);
    if (!point) {
      failed++;
      continue;
    }
    if (isOverSerbia(point.lat, point.lon)) {
      overSerbia++;
      await upsertSatellite(tle.noradId, tle.name, point.altKm);
      await logOverflight({
        noradId: tle.noradId,
        lat: point.lat,
        lon: point.lon,
        altKm: point.altKm,
        observedAt: startedAt,
      });
    }
  }

  await recordCronRun({
    catalogSize: tles.length,
    checked,
    failed,
    overSerbia,
  });

  return {
    ranAt: startedAt.toISOString(),
    group,
    catalogSize: tles.length,
    checked,
    failed,
    overSerbiaRightNow: overSerbia,
  };
}
