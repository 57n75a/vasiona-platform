import { NextRequest, NextResponse } from "next/server";
import { ensurePetitionSchema, addSignature } from "@/lib/petitionService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  await ensurePetitionSchema();

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const result = await addSignature({
    name: body?.name,
    country: body?.country,
    comment: body?.comment,
    email: body?.email,
    contactConsent: body?.contactConsent === true,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ success: true, count: result.count });
}
