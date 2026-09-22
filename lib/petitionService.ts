import { sql } from "@vercel/postgres";
import { normalizeEmail, type FormError } from "@/lib/validation";

export async function ensurePetitionSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS petition_signatures (
      id              BIGSERIAL PRIMARY KEY,
      name            TEXT,
      country         TEXT,
      comment         TEXT,
      email           TEXT,
      contact_consent BOOLEAN NOT NULL DEFAULT false,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
  // Safe to run repeatedly — upgrades tables created before email capture existed.
  await sql`ALTER TABLE petition_signatures ADD COLUMN IF NOT EXISTS email TEXT;`;
  await sql`ALTER TABLE petition_signatures ADD COLUMN IF NOT EXISTS contact_consent BOOLEAN NOT NULL DEFAULT false;`;
  await sql`CREATE INDEX IF NOT EXISTS idx_petition_email ON petition_signatures (lower(email));`;
}

// Basic length caps — this is a public write endpoint, so keep inputs bounded
// regardless of what the client sends.
function clip(s: unknown, max: number): string | null {
  if (typeof s !== "string") return null;
  const trimmed = s.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export type AddSignatureResult = { ok: true; count: number } | { ok: false; error: FormError };

/**
 * Records a petition signature. An email address and explicit consent to be
 * contacted are required, so VASIONA can reach out to supporters. The email is
 * never shown publicly (only the running total is).
 *
 * One signature per email: a repeat submission is accepted but not counted
 * twice, and never overwrites the original row (nobody can alter someone
 * else's entry by typing their address).
 */
export async function addSignature(input: {
  name?: unknown;
  country?: unknown;
  comment?: unknown;
  email?: unknown;
  contactConsent?: unknown;
}): Promise<AddSignatureResult> {
  const email = normalizeEmail(input.email);
  if (!email) return { ok: false, error: "invalid_email" };
  if (input.contactConsent !== true) return { ok: false, error: "consent_required" };

  await ensurePetitionSchema();
  const name = clip(input.name, 120);
  const country = clip(input.country, 80);
  const comment = clip(input.comment, 500);

  const existing = await sql`SELECT id FROM petition_signatures WHERE lower(email) = ${email} LIMIT 1;`;
  if (existing.rows.length === 0) {
    await sql`
      INSERT INTO petition_signatures (name, country, comment, email, contact_consent)
      VALUES (${name}, ${country}, ${comment}, ${email}, true);
    `;
  }

  return { ok: true, count: await getSignatureCount() };
}

export async function getSignatureCount(): Promise<number> {
  await ensurePetitionSchema();
  const { rows } = await sql`SELECT COUNT(*)::int AS count FROM petition_signatures;`;
  return rows[0]?.count ?? 0;
}

export async function listSignatures(limit = 1000) {
  await ensurePetitionSchema();
  const { rows } = await sql`
    SELECT id, name, email, country, comment, contact_consent, created_at
    FROM petition_signatures
    ORDER BY created_at DESC
    LIMIT ${limit};
  `;
  return rows;
}
