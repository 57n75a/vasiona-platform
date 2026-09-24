import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { sql } from "@/lib/pg";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// Bump this whenever the cron/TLE code changes so a response from this route
// also proves which version of the code is actually serving the request.
const CODE_MARKER = "tle-cache-v1";

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

/** Short, non-reversible fingerprint of the DB host + name, safe to compare across hosts. */
function dbFingerprint(): string | null {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) return null;
  try {
    const u = new URL(url);
    return createHash("sha256").update(`${u.hostname}${u.pathname}`).digest("hex").slice(0, 10);
  } catch {
    return "unparseable-url";
  }
}

async function safe<T>(fn: () => Promise<T>): Promise<T | { error: string }> {
  try {
    return await fn();
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Read-only "is this the deployment/database I think it is, and is the data
 * fresh?" check. Call it on the public domain AND on whichever host you click
 * "Run cron now" from, then compare `deployment` and `database.fingerprint`:
 * if they differ, the cron is writing somewhere the public site doesn't read.
 */
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const database = await safe(async () => {
    const [now, name] = await Promise.all([
      sql`SELECT now() AS now;`,
      sql`SELECT current_database() AS name;`,
    ]);
    return {
      fingerprint: dbFingerprint(),
      name: name.rows[0]?.name ?? null,
      dbNow: now.rows[0]?.now ? new Date(now.rows[0].now).toISOString() : null,
    };
  });

  const data = await safe(async () => {
    const [events, status, tle] = await Promise.all([
      sql`
        SELECT MAX(observed_at) AS latest,
               COUNT(*)::int AS total,
               COUNT(*) FILTER (WHERE observed_at > now() - interval '24 hours')::int AS last_24h
        FROM overflight_events;
      `,
      sql`SELECT last_run_at, over_serbia, enabled FROM cron_status WHERE id = 1;`,
      sql`SELECT grp, fetched_at FROM tle_cache;`.catch(() => ({ rows: [] as any[] })),
    ]);
    const iso = (v: unknown) => (v ? new Date(v as string).toISOString() : null);
    return {
      latestEventObservedAt: iso(events.rows[0]?.latest),
      eventsTotal: events.rows[0]?.total ?? 0,
      eventsLast24h: events.rows[0]?.last_24h ?? 0,
      cronStatusLastRunAt: iso(status.rows[0]?.last_run_at),
      cronStatusMatched: status.rows[0]?.over_serbia ?? null,
      cronEnabled: status.rows[0]?.enabled ?? null,
      tleCache: tle.rows.map((r: any) => ({ group: r.grp, fetchedAt: iso(r.fetched_at) })),
    };
  });

  return NextResponse.json({
    codeMarker: CODE_MARKER,
    servedAt: new Date().toISOString(),
    requestHost: req.headers.get("host"),
    deployment: {
      env: process.env.VERCEL_ENV ?? null,
      url: process.env.VERCEL_URL ?? null,
      productionUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL ?? null,
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? null,
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
      branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
    },
    database,
    data,
  });
}
