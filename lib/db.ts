import { sql } from "@vercel/postgres";
import { classifyOperator, classifyObjectType } from "@/lib/operatorLookup";

export async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS satellites (
      norad_id     INTEGER PRIMARY KEY,
      name         TEXT NOT NULL,
      last_updated TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
  // Safe to run repeatedly — adds these columns if this table was created
  // before this classification existed.
  await sql`ALTER TABLE satellites ADD COLUMN IF NOT EXISTS operator_name TEXT;`;
  await sql`ALTER TABLE satellites ADD COLUMN IF NOT EXISTS operator_country TEXT;`;
  await sql`ALTER TABLE satellites ADD COLUMN IF NOT EXISTS object_type TEXT;`;

  await sql`
    CREATE TABLE IF NOT EXISTS overflight_events (
      id            BIGSERIAL PRIMARY KEY,
      norad_id      INTEGER REFERENCES satellites(norad_id),
      observed_at   TIMESTAMPTZ NOT NULL,
      lat           NUMERIC NOT NULL,
      lon           NUMERIC NOT NULL,
      alt_km        NUMERIC,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_overflight_time ON overflight_events (observed_at);
  `;

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

export async function upsertSatellite(noradId: number, name: string, altKm: number | null = null) {
  const { operator, country } = classifyOperator(name);
  const { type } = classifyObjectType(name, altKm);
  await sql`
    INSERT INTO satellites (norad_id, name, operator_name, operator_country, object_type, last_updated)
    VALUES (${noradId}, ${name}, ${operator}, ${country}, ${type}, now())
    ON CONFLICT (norad_id) DO UPDATE SET
      name = EXCLUDED.name,
      operator_name = EXCLUDED.operator_name,
      operator_country = EXCLUDED.operator_country,
      object_type = EXCLUDED.object_type,
      last_updated = now();
  `;
}

export async function logOverflight(params: {
  noradId: number;
  lat: number;
  lon: number;
  altKm: number | null;
  observedAt: Date;
}) {
  const { noradId, lat, lon, altKm, observedAt } = params;
  await sql`
    INSERT INTO overflight_events (norad_id, observed_at, lat, lon, alt_km)
    VALUES (${noradId}, ${observedAt.toISOString()}, ${lat}, ${lon}, ${altKm});
  `;
}

export async function countLoggedEvents(): Promise<number> {
  const { rows } = await sql`SELECT COUNT(*)::int AS count FROM overflight_events;`;
  return rows[0]?.count ?? 0;
}

export async function firstLoggedEventDate(): Promise<Date | null> {
  const { rows } = await sql`SELECT MIN(observed_at) AS first FROM overflight_events;`;
  return rows[0]?.first ? new Date(rows[0].first) : null;
}

export async function recentEvents(limit = 50) {
  const { rows } = await sql`
    SELECT e.observed_at, e.lat, e.lon, e.alt_km, s.name, s.norad_id,
           s.operator_name, s.operator_country, s.object_type
    FROM overflight_events e
    JOIN satellites s ON s.norad_id = e.norad_id
    ORDER BY e.observed_at DESC
    LIMIT ${limit};
  `;
  return rows;
}
