import { sql } from "@vercel/postgres";

export async function ensurePetitionSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS petition_signatures (
      id          BIGSERIAL PRIMARY KEY,
      name        TEXT,
      country     TEXT,
      comment     TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
}

// Basic length caps — this is a public write endpoint, so keep inputs bounded
// regardless of what the client sends.
function clip(s: unknown, max: number): string | null {
  if (typeof s !== "string") return null;
  const trimmed = s.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export async function addSignature(input: { name?: unknown; country?: unknown; comment?: unknown }) {
  const name = clip(input.name, 120);
  const country = clip(input.country, 80);
  const comment = clip(input.comment, 500);

  await sql`
    INSERT INTO petition_signatures (name, country, comment)
    VALUES (${name}, ${country}, ${comment});
  `;

  return getSignatureCount();
}

export async function getSignatureCount(): Promise<number> {
  const { rows } = await sql`SELECT COUNT(*)::int AS count FROM petition_signatures;`;
  return rows[0]?.count ?? 0;
}
