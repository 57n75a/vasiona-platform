import { NextRequest, NextResponse } from "next/server";
import { ensureCrowdfundSchema, addInterest } from "@/lib/crowdfundService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  await ensureCrowdfundSchema();

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const result = await addInterest({
    email: body?.email,
    name: body?.name,
    indicativeUsd: typeof body?.indicativeUsd === "string" ? parseFloat(body.indicativeUsd) : body?.indicativeUsd,
    comment: body?.comment,
    contactConsent: body?.contactConsent === true,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ success: true, count: result.count, indicativeTotalUsd: result.indicativeTotalUsd });
}
