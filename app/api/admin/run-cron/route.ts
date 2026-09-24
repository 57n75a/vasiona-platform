import { NextRequest, NextResponse } from "next/server";
import { runCronJob } from "@/lib/cronRunner";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const maxDuration = 60;

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const result = await runCronJob({ force: true });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: "cron_run_failed", detail: String(err?.message ?? err) },
      { status: 502 }
    );
  }
}
