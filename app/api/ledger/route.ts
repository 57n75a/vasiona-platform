import { NextRequest, NextResponse } from "next/server";
import { getLedgerData } from "@/lib/ledgerService";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get("lang") === "sr" ? "sr" : "en";
  const data = await getLedgerData(lang);
  return NextResponse.json(data);
}
