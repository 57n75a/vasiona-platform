import { NextResponse } from "next/server";
import { getOverheadEvents } from "@/lib/overheadService";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getOverheadEvents(100);
  return NextResponse.json(data);
}
