import { NextRequest, NextResponse } from "next/server";
import { ensureCronStatusSchema, getCronEnabled, setCronEnabled } from "@/lib/cronStatusService";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  await ensureCronStatusSchema();
  const enabled = await getCronEnabled();
  return NextResponse.json({
    enabled,
    // Informational only — this is what's actually in vercel.json. Changing
    // it requires editing that file and redeploying; Vercel doesn't support
    // changing a cron's schedule at runtime via API, and Hobby-tier accounts
    // are limited to once-per-day schedules regardless.
    configuredSchedule: "0 6 * * * (06:00 UTC daily = ~08:00 Belgrade in summer, ~07:00 in winter; set in vercel.json)",
  });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  await ensureCronStatusSchema();
  await setCronEnabled(Boolean(body?.enabled));
  return NextResponse.json({ enabled: Boolean(body?.enabled) });
}
