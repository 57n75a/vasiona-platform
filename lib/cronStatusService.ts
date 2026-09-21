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
  // Safe to run repeatedly — adds this column if the table predates the toggle.
  await sql`ALTER TABLE cron_status ADD COLUMN IF NOT EXISTS enabled BOOLEAN NOT NULL DEFAULT true;`;
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
  failed: number;
  overSerbia: number;
}

export async function recordCronRun(stats: CronRunStats) {
  await ensureCronStatusSchema();
  await sql`
    INSERT INTO cron_status (id, last_run_at, catalog_size, checked, failed, over_serbia)
    VALUES (1, now(), ${stats.catalogSize}, ${stats.checked}, ${stats.failed}, ${stats.overSerbia})
    ON CONFLICT (id) DO UPDATE SET
      last_run_at = now(),
      catalog_size = EXCLUDED.catalog_size,
      checked = EXCLUDED.checked,
      failed = EXCLUDED.failed,
      over_serbia = EXCLUDED.over_serbia;
  `;
}

export interface CronStatus {
  lastRunAt: Date | null;
  catalogSize: number | null;
  checked: number | null;
  failed: number | null;
  overSerbia: number | null;
  enabled: boolean;
}

export async function getCronStatus(): Promise<CronStatus> {
  await ensureCronStatusSchema();
  const { rows } = await sql`SELECT * FROM cron_status WHERE id = 1;`;
  const row = rows[0];
  if (!row) {
    return { lastRunAt: null, catalogSize: null, checked: null, failed: null, overSerbia: null, enabled: true };
  }
  return {
    lastRunAt: row.last_run_at ? new Date(row.last_run_at) : null,
    catalogSize: row.catalog_size,
    checked: row.checked,
    failed: row.failed,
    overSerbia: row.over_serbia,
    enabled: row.enabled ?? true,
  };
}
