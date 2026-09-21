import { NextRequest, NextResponse } from "next/server";
import { runCronJob } from "@/lib/cronRunner";

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

  try {
    const result = await runCronJob();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: "cron_run_failed", detail: String(err?.message ?? err) },
      { status: 502 }
    );
  }
}
