import { NextRequest, NextResponse } from "next/server";
import { ensurePetitionSchema, listSignatures } from "@/lib/petitionService";

export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false; // admin endpoint requires an explicit secret — no open-by-default fallback
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

function toCsv(rows: any[]): string {
  const headers = ["id", "name", "country", "comment", "created_at"];
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\n");
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  await ensurePetitionSchema();
  const rows = await listSignatures(5000);

  const format = req.nextUrl.searchParams.get("format");
  if (format === "csv") {
    return new NextResponse(toCsv(rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=petition_signatures.csv",
      },
    });
  }

  return NextResponse.json({ count: rows.length, signatures: rows });
}
