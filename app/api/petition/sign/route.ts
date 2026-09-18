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

  const count = await addSignature({
    name: body?.name,
    country: body?.country,
    comment: body?.comment,
  });

  return NextResponse.json({ success: true, count });
}
