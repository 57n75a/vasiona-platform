import { NextRequest, NextResponse } from "next/server";
import { fetchTleGroup } from "@/lib/tle";
import { currentSubPoint } from "@/lib/propagate";
import { isOverSerbia } from "@/lib/serbia";
import { ensureSchema, upsertSatellite, logOverflight } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // seconds — raise on Pro plan if the catalog group is large

/**
 * Vercel Cron calls this on the schedule set in vercel.json.
 * Vercel automatically sends `Authorization: Bearer ${CRON_SECRET}` when the
 * CRON_SECRET env var is set in your Project Settings — this checks it so the
 * route can't be triggered by anyone who finds the URL.
 * https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
 */
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // no secret configured — fine for local/dev testing only
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const group = process.env.CELESTRAK_GROUP || "active";
  const startedAt = new Date();

  await ensureSchema();

  let tles;
  try {
    tles = await fetchTleGroup(group);
  } catch (err: any) {
    return NextResponse.json(
      { error: "tle_fetch_failed", detail: String(err?.message ?? err) },
      { status: 502 }
    );
  }

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
      await upsertSatellite(tle.noradId, tle.name);
      await logOverflight({
        noradId: tle.noradId,
        lat: point.lat,
        lon: point.lon,
        altKm: point.altKm,
        observedAt: startedAt,
      });
    }
  }

  return NextResponse.json({
    ranAt: startedAt.toISOString(),
    group,
    catalogSize: tles.length,
    checked,
    failed,
    overSerbiaRightNow: overSerbia,
  });
}
