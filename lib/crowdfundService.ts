import { sql } from "@vercel/postgres";

// This is an INTEREST SIGNAL, not a payment or a binding pledge — no money
// changes hands here. See docs/CROWDFUNDING_PLAN.md section 0 for why.
export async function ensureCrowdfundSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS crowdfund_interest (
      id            BIGSERIAL PRIMARY KEY,
      email         TEXT,
      name          TEXT,
      indicative_usd NUMERIC,
      comment       TEXT,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
}

function clip(s: unknown, max: number): string | null {
  if (typeof s !== "string") return null;
  const trimmed = s.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export async function addInterest(input: { email?: unknown; name?: unknown; indicativeUsd?: unknown; comment?: unknown }) {
  await ensureCrowdfundSchema();
  const email = clip(input.email, 200);
  const name = clip(input.name, 120);
  const comment = clip(input.comment, 500);
  const indicativeUsd =
    typeof input.indicativeUsd === "number" && isFinite(input.indicativeUsd) && input.indicativeUsd >= 0
      ? Math.min(input.indicativeUsd, 1_000_000)
      : null;

  await sql`
    INSERT INTO crowdfund_interest (email, name, indicative_usd, comment)
    VALUES (${email}, ${name}, ${indicativeUsd}, ${comment});
  `;

  return getInterestSummary();
}

export async function getInterestSummary(): Promise<{ count: number; indicativeTotalUsd: number }> {
  await ensureCrowdfundSchema();
  const { rows } = await sql`
    SELECT COUNT(*)::int AS count, COALESCE(SUM(indicative_usd), 0)::numeric AS total
    FROM crowdfund_interest;
  `;
  return {
    count: rows[0]?.count ?? 0,
    indicativeTotalUsd: Number(rows[0]?.total ?? 0),
  };
}

export async function listInterest(limit = 5000) {
  await ensureCrowdfundSchema();
  const { rows } = await sql`
    SELECT id, name, email, indicative_usd, comment, created_at
    FROM crowdfund_interest
    ORDER BY created_at DESC
    LIMIT ${limit};
  `;
  return rows;
}
