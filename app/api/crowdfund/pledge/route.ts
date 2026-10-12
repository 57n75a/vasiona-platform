import { NextRequest, NextResponse } from "next/server";
import { ensureCrowdfundSchema, addInterest } from "@/lib/crowdfundService";
import { corsHeaders, handleOptions } from "@/lib/cors";

export const dynamic = "force-dynamic";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  const cors = corsHeaders(req.headers.get("origin"));
  await ensureCrowdfundSchema();

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400, headers: cors });
  }

  const result = await addInterest({
    email: body?.email,
    name: body?.name,
    indicativeUsd: typeof body?.indicativeUsd === "string" ? parseFloat(body.indicativeUsd) : body?.indicativeUsd,
    comment: body?.comment,
    contactConsent: body?.contactConsent === true,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400, headers: cors });
  }
  return NextResponse.json(
    { success: true, count: result.count, indicativeTotalUsd: result.indicativeTotalUsd },
    { headers: cors }
  );
}
