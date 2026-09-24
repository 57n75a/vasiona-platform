import { sql } from "@/lib/pg";
import { normalizeEmail, type FormError } from "@/lib/validation";

// This is an INTEREST SIGNAL, not a payment or a binding pledge — no money
// changes hands here. See docs/CROWDFUNDING_PLAN.md section 0 for why.
export async function ensureCrowdfundSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS crowdfund_interest (
      id              BIGSERIAL PRIMARY KEY,
      email           TEXT,
      name            TEXT,
      indicative_usd  NUMERIC,
      comment         TEXT,
      contact_consent BOOLEAN NOT NULL DEFAULT false,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
  await sql`ALTER TABLE crowdfund_interest ADD COLUMN IF NOT EXISTS contact_consent BOOLEAN NOT NULL DEFAULT false;`;
  await sql`CREATE INDEX IF NOT EXISTS idx_crowdfund_email ON crowdfund_interest (lower(email));`;
}

function clip(s: unknown, max: number): string | null {
  if (typeof s !== "string") return null;
  const trimmed = s.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export type AddInterestResult =
  | ({ ok: true } & { count: number; indicativeTotalUsd: number })
  | { ok: false; error: FormError };

/**
 * Records an interest signal. Email and explicit consent to be contacted are
 * required so VASIONA can follow up when the campaign moves forward. Emails are
 * never published — only aggregate totals are.
 *
 * One entry per email: a repeat submission is accepted but not counted twice
 * and never overwrites the original row.
 */
export async function addInterest(input: {
  email?: unknown;
  name?: unknown;
  indicativeUsd?: unknown;
  comment?: unknown;
  contactConsent?: unknown;
}): Promise<AddInterestResult> {
  const email = normalizeEmail(input.email);
  if (!email) return { ok: false, error: "invalid_email" };
  if (input.contactConsent !== true) return { ok: false, error: "consent_required" };

  await ensureCrowdfundSchema();
  const name = clip(input.name, 120);
  const comment = clip(input.comment, 500);
  const indicativeUsd =
    typeof input.indicativeUsd === "number" && isFinite(input.indicativeUsd) && input.indicativeUsd >= 0
      ? Math.min(input.indicativeUsd, 1_000_000)
      : null;

  const existing = await sql`SELECT id FROM crowdfund_interest WHERE lower(email) = ${email} LIMIT 1;`;
  if (existing.rows.length === 0) {
    await sql`
      INSERT INTO crowdfund_interest (email, name, indicative_usd, comment, contact_consent)
      VALUES (${email}, ${name}, ${indicativeUsd}, ${comment}, true);
    `;
  }

  return { ok: true, ...(await getInterestSummary()) };
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
    SELECT id, name, email, indicative_usd, comment, contact_consent, created_at
    FROM crowdfund_interest
    ORDER BY created_at DESC
    LIMIT ${limit};
  `;
  return rows;
}
