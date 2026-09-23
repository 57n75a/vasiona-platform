import { NextRequest, NextResponse } from "next/server";
import { getCronStatus, getCronRunHistory } from "@/lib/cronStatusService";

export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

/**
 * Read-only status for the admin console's "Run cron now" button: `lastRunAt`
 * (so a page reload can correctly restore the manual-run cooldown — see
 * RUN_COOLDOWN_MS in app/admin/page.tsx — instead of resetting it to
 * "available" just because the browser tab was refreshed) plus recent-run
 * history (for the "average time to run" figure and recent-runs list).
 */
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const [status, history] = await Promise.all([getCronStatus(), getCronRunHistory(20)]);
  return NextResponse.json({ ...status, history });
}
