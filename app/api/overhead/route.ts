import { NextResponse } from "next/server";
import { ensureSchema, recentEvents } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSchema();
  const events = await recentEvents(100);
  return NextResponse.json({ events });
}
