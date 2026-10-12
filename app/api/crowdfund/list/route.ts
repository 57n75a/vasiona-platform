import { NextRequest, NextResponse } from "next/server";
import { ensureCrowdfundSchema, listInterest } from "@/lib/crowdfundService";

export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

function toCsv(rows: any[]): string {
  const headers = ["id", "name", "email", "indicative_usd", "comment", "contact_consent", "created_at"];
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

  await ensureCrowdfundSchema();
  const rows = await listInterest(5000);

  const format = req.nextUrl.searchParams.get("format");
  if (format === "csv") {
    return new NextResponse(toCsv(rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=crowdfund_interest.csv",
      },
    });
  }

  return NextResponse.json({ count: rows.length, interest: rows });
}
