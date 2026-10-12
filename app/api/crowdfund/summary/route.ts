import { NextRequest, NextResponse } from "next/server";
import { getInterestSummary } from "@/lib/crowdfundService";
import { corsHeaders, handleOptions } from "@/lib/cors";

export const dynamic = "force-dynamic";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function GET(req: NextRequest) {
  const cors = corsHeaders(req.headers.get("origin"));
  const summary = await getInterestSummary();
  return NextResponse.json(summary, { headers: { ...cors, "Cache-Control": "public, max-age=30" } });
}
