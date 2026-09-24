import { sql } from "@vercel/postgres";

export async function ensureCronStatusSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS cron_status (
      id               INTEGER PRIMARY KEY DEFAULT 1,
      last_run_at      TIMESTAMPTZ,
      catalog_size     INTEGER,
      checked          INTEGER,
      failed           INTEGER,
      over_serbia      INTEGER,
      CONSTRAINT single_row CHECK (id = 1)
    );
  `;
  // Safe to run repeatedly — adds these columns if the table predates them.
  await sql`ALTER TABLE cron_status ADD COLUMN IF NOT EXISTS enabled BOOLEAN NOT NULL DEFAULT true;`;
  await sql`ALTER TABLE cron_status ADD COLUMN IF NOT EXISTS duration_ms INTEGER;`;

  // Per-run history, used for "average time to run" and a recent-runs list in
  // the admin console. Deliberately a separate table from the single-row
  // cron_status above: that row is "current state", this is a bounded log.
  await sql`
    CREATE TABLE IF NOT EXISTS cron_run_log (
      id           BIGSERIAL PRIMARY KEY,
      ran_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
      duration_ms  INTEGER,
      catalog_size INTEGER,
      checked      INTEGER,
      candidates   INTEGER,
      failed       INTEGER,
      matched      INTEGER,
      truncated    BOOLEAN NOT NULL DEFAULT false,
      error        TEXT
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_cron_run_log_ran_at ON cron_run_log (ran_at DESC);`;
}

export async function getCronEnabled(): Promise<boolean> {
  await ensureCronStatusSchema();
  const { rows } = await sql`SELECT enabled FROM cron_status WHERE id = 1;`;
  // No row yet means the job has never run and never been toggled — default enabled.
  return rows[0]?.enabled ?? true;
}

export async function setCronEnabled(enabled: boolean) {
  await ensureCronStatusSchema();
  await sql`
    INSERT INTO cron_status (id, enabled)
    VALUES (1, ${enabled})
    ON CONFLICT (id) DO UPDATE SET enabled = ${enabled};
  `;
}

export interface CronRunStats {
  catalogSize: number;
  checked: number;
  candidates?: number;
  failed: number;
  overSerbia: number;
  durationMs: number;
  truncated?: boolean;
  error?: string;
}

/**
 * Writes both the "current state" row (cron_status, id=1) and an append-only
 * history row (cron_run_log). These are two separate statements, not one
 * transaction — if you're investigating "the log shows a run but the status
 * row didn't move", check the caller: lib/cronRunner.ts re-reads
 * getCronStatus() immediately after calling this and reports whether the
 * timestamp it just wrote is actually the one that comes back (see
 * `statusWriteConfirmed` in CronRunResult) specifically to catch this class
 * of bug without needing direct DB access.
 */
export async function recordCronRun(stats: CronRunStats) {
  await ensureCronStatusSchema();
  await sql`
    INSERT INTO cron_status (id, last_run_at, catalog_size, checked, failed, over_serbia, duration_ms)
    VALUES (1, now(), ${stats.catalogSize}, ${stats.checked}, ${stats.failed}, ${stats.overSerbia}, ${stats.durationMs})
    ON CONFLICT (id) DO UPDATE SET
      last_run_at = now(),
      catalog_size = EXCLUDED.catalog_size,
      checked = EXCLUDED.checked,
      failed = EXCLUDED.failed,
      over_serbia = EXCLUDED.over_serbia,
      duration_ms = EXCLUDED.duration_ms;
  `;
  await sql`
    INSERT INTO cron_run_log (duration_ms, catalog_size, checked, candidates, failed, matched, truncated, error)
    VALUES (
      ${stats.durationMs}, ${stats.catalogSize}, ${stats.checked}, ${stats.candidates ?? null},
      ${stats.failed}, ${stats.overSerbia}, ${stats.truncated ?? false}, ${stats.error ?? null}
    );
  `;
  // This is a lightweight diagnostic log, not an analytics warehouse — keep
  // only the most recent 200 runs so it can't grow unbounded.
  await sql`
    DELETE FROM cron_run_log
    WHERE id NOT IN (SELECT id FROM cron_run_log ORDER BY ran_at DESC LIMIT 200);
  `;
}

export interface CronStatus {
  lastRunAt: Date | null;
  catalogSize: number | null;
  checked: number | null;
  failed: number | null;
  overSerbia: number | null;
  durationMs: number | null;
  enabled: boolean;
}

export async function getCronStatus(): Promise<CronStatus> {
  await ensureCronStatusSchema();
  const { rows } = await sql`SELECT * FROM cron_status WHERE id = 1;`;
  const row = rows[0];
  if (!row) {
    return {
      lastRunAt: null,
      catalogSize: null,
      checked: null,
      failed: null,
      overSerbia: null,
      durationMs: null,
      enabled: true,
    };
  }
  return {
    lastRunAt: row.last_run_at ? new Date(row.last_run_at) : null,
    catalogSize: row.catalog_size,
    checked: row.checked,
    failed: row.failed,
    overSerbia: row.over_serbia,
    durationMs: row.duration_ms,
    enabled: row.enabled ?? true,
  };
}

export interface CronRunLogRow {
  ranAt: Date;
  durationMs: number | null;
  catalogSize: number | null;
  checked: number | null;
  candidates: number | null;
  failed: number | null;
  matched: number | null;
  truncated: boolean;
  error: string | null;
}

export interface CronRunHistory {
  runs: CronRunLogRow[];
  /** Mean durationMs across the returned runs (all of them, errors/truncated included). */
  averageDurationMs: number | null;
  /** Mean durationMs across only the runs that completed cleanly — usually the more useful number. */
  averageDurationMsCleanOnly: number | null;
}

/**
 * Recent-run history for the admin console's "average time to run" figure.
 * Backed by cron_run_log (see ensureCronStatusSchema), which every
 * recordCronRun() call appends to — including truncated/errored runs, so the
 * average is honest about outliers rather than only counting clean ones.
 */
export async function getCronRunHistory(limit = 20): Promise<CronRunHistory> {
  await ensureCronStatusSchema();
  const { rows } = await sql`
    SELECT ran_at, duration_ms, catalog_size, checked, candidates, failed, matched, truncated, error
    FROM cron_run_log
    ORDER BY ran_at DESC
    LIMIT ${limit};
  `;
  const runs: CronRunLogRow[] = rows.map((r: any) => ({
    ranAt: new Date(r.ran_at),
    durationMs: r.duration_ms,
    catalogSize: r.catalog_size,
    checked: r.checked,
    candidates: r.candidates,
    failed: r.failed,
    matched: r.matched,
    truncated: r.truncated,
    error: r.error,
  }));

  const withDuration = runs.filter((r): r is CronRunLogRow & { durationMs: number } => r.durationMs !== null);
  const mean = (list: typeof withDuration) =>
    list.length ? Math.round(list.reduce((sum, r) => sum + r.durationMs, 0) / list.length) : null;

  return {
    runs,
    averageDurationMs: mean(withDuration),
    averageDurationMsCleanOnly: mean(withDuration.filter((r) => !r.truncated && !r.error)),
  };
}
