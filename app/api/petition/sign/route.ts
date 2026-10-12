import { NextRequest, NextResponse } from "next/server";
import { ensurePetitionSchema, addSignature } from "@/lib/petitionService";
import { corsHeaders, handleOptions } from "@/lib/cors";

export const dynamic = "force-dynamic";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  const cors = corsHeaders(req.headers.get("origin"));
  await ensurePetitionSchema();

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400, headers: cors });
  }

  const result = await addSignature({
    name: body?.name,
    country: body?.country,
    comment: body?.comment,
    email: body?.email,
    contactConsent: body?.contactConsent === true,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400, headers: cors });
  }
  return NextResponse.json({ success: true, count: result.count }, { headers: cors });
}
