import { sql } from "@vercel/postgres";
import { fetchTleText, parseTleText, type TleRecord } from "@/lib/tle";

// CelesTrak refreshes each group every 2 hours and answers 403 to anyone who
// downloads the same group again sooner (repeat offenders get their IP blocked).
// Vercel egress IPs are shared, and every manual "Run cron now" used to trigger a
// full re-download of the ~16,000-satellite catalog — so runs after the first
// could fail with a 403 while still looking like they "ran". Keeping the last
// good download in Postgres means a run only goes to the network when the copy
// is at least MIN_REFETCH_MS old, and falls back to the stored copy if
// CelesTrak refuses or times out.
const MIN_REFETCH_MS = 2 * 60 * 60 * 1000; // matches CelesTrak's 2-hour refresh
// SGP4 accuracy degrades by roughly a few km per day for LEO objects; Serbia is
// hundreds of km across, so a few days is still a meaningful geofence test.
const MAX_STALE_MS = 3 * 24 * 60 * 60 * 1000;

export type TleSource = "cache" | "network" | "stale-cache";

export interface TleLoadResult {
  tles: TleRecord[];
  source: TleSource;
  fetchedAt: Date;
  /** Set only when source is "stale-cache": why the network fetch didn't happen. */
  networkError?: string;
}

export async function ensureTleCacheSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS tle_cache (
      grp        TEXT PRIMARY KEY,
      fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      body       TEXT NOT NULL
    );
  `;
}

async function readCache(group: string): Promise<{ fetchedAt: Date; body: string } | null> {
  const { rows } = await sql`SELECT fetched_at, body FROM tle_cache WHERE grp = ${group};`;
  const row = rows[0];
  if (!row) return null;
  return { fetchedAt: new Date(row.fetched_at), body: String(row.body) };
}

async function writeCache(group: string, body: string) {
  await sql`
    INSERT INTO tle_cache (grp, fetched_at, body)
    VALUES (${group}, now(), ${body})
    ON CONFLICT (grp) DO UPDATE SET fetched_at = now(), body = EXCLUDED.body;
  `;
}

export async function loadTles(group: string, signal?: AbortSignal): Promise<TleLoadResult> {
  await ensureTleCacheSchema();

  let cached: { fetchedAt: Date; body: string } | null = null;
  try {
    cached = await readCache(group);
  } catch {
    // A cache read problem must never block a run — just go to the network.
  }

  const ageMs = cached ? Date.now() - cached.fetchedAt.getTime() : Infinity;

  if (cached && ageMs < MIN_REFETCH_MS) {
    const tles = parseTleText(cached.body);
    if (tles.length > 0) return { tles, source: "cache", fetchedAt: cached.fetchedAt };
  }

  try {
    const body = await fetchTleText(group, signal);
    const tles = parseTleText(body);
    if (tles.length === 0) {
      // CelesTrak sometimes answers 200 with a text message instead of TLEs.
      throw new Error(`CelesTrak returned no TLE data: ${body.replace(/\s+/g, " ").trim().slice(0, 160)}`);
    }
    try {
      await writeCache(group, body);
    } catch {
      // Not being able to cache this download shouldn't fail the run.
    }
    return { tles, source: "network", fetchedAt: new Date() };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (cached && ageMs < MAX_STALE_MS) {
      const tles = parseTleText(cached.body);
      if (tles.length > 0) {
        return { tles, source: "stale-cache", fetchedAt: cached.fetchedAt, networkError: message };
      }
    }
    throw err;
  }
}
