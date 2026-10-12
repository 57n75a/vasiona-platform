import { NextRequest, NextResponse } from "next/server";
import { getSignatureCount } from "@/lib/petitionService";
import { corsHeaders, handleOptions } from "@/lib/cors";

export const dynamic = "force-dynamic";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function GET(req: NextRequest) {
  const cors = corsHeaders(req.headers.get("origin"));
  const count = await getSignatureCount();
  return NextResponse.json({ count }, { headers: { ...cors, "Cache-Control": "public, max-age=30" } });
}
