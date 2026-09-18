import { sql } from "@vercel/postgres";

export async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS satellites (
      norad_id     INTEGER PRIMARY KEY,
      name         TEXT NOT NULL,
      last_updated TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
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
}

export async function upsertSatellite(noradId: number, name: string) {
  await sql`
    INSERT INTO satellites (norad_id, name, last_updated)
    VALUES (${noradId}, ${name}, now())
    ON CONFLICT (norad_id) DO UPDATE SET name = EXCLUDED.name, last_updated = now();
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
    SELECT e.observed_at, e.lat, e.lon, e.alt_km, s.name, s.norad_id
    FROM overflight_events e
    JOIN satellites s ON s.norad_id = e.norad_id
    ORDER BY e.observed_at DESC
    LIMIT ${limit};
  `;
  return rows;
}
