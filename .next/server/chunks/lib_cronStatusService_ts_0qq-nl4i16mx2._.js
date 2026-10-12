module.exports=[38423,a=>{"use strict";var e=a.i(70967);async function t(){await e.f`
    CREATE TABLE IF NOT EXISTS cron_status (
      id               INTEGER PRIMARY KEY DEFAULT 1,
      last_run_at      TIMESTAMPTZ,
      catalog_size     INTEGER,
      checked          INTEGER,
      failed           INTEGER,
      over_serbia      INTEGER,
      CONSTRAINT single_row CHECK (id = 1)
    );
  `,await e.f`ALTER TABLE cron_status ADD COLUMN IF NOT EXISTS enabled BOOLEAN NOT NULL DEFAULT true;`,await e.f`ALTER TABLE cron_status ADD COLUMN IF NOT EXISTS duration_ms INTEGER;`,await e.f`
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
  `,await e.f`CREATE INDEX IF NOT EXISTS idx_cron_run_log_ran_at ON cron_run_log (ran_at DESC);`}async function n(){await t();let{rows:a}=await e.f`SELECT enabled FROM cron_status WHERE id = 1;`;return a[0]?.enabled??!0}async function r(a){await t(),await e.f`
    INSERT INTO cron_status (id, enabled)
    VALUES (1, ${a})
    ON CONFLICT (id) DO UPDATE SET enabled = ${a};
  `}async function i(a){await t(),await e.f`
    INSERT INTO cron_status (id, last_run_at, catalog_size, checked, failed, over_serbia, duration_ms)
    VALUES (1, now(), ${a.catalogSize}, ${a.checked}, ${a.failed}, ${a.overSerbia}, ${a.durationMs})
    ON CONFLICT (id) DO UPDATE SET
      last_run_at = now(),
      catalog_size = EXCLUDED.catalog_size,
      checked = EXCLUDED.checked,
      failed = EXCLUDED.failed,
      over_serbia = EXCLUDED.over_serbia,
      duration_ms = EXCLUDED.duration_ms;
  `,await e.f`
    INSERT INTO cron_run_log (duration_ms, catalog_size, checked, candidates, failed, matched, truncated, error)
    VALUES (
      ${a.durationMs}, ${a.catalogSize}, ${a.checked}, ${a.candidates??null},
      ${a.failed}, ${a.overSerbia}, ${a.truncated??!1}, ${a.error??null}
    );
  `,await e.f`
    DELETE FROM cron_run_log
    WHERE id NOT IN (SELECT id FROM cron_run_log ORDER BY ran_at DESC LIMIT 200);
  `}async function E(){await t();let{rows:a}=await e.f`SELECT * FROM cron_status WHERE id = 1;`,n=a[0];return n?{lastRunAt:n.last_run_at?new Date(n.last_run_at):null,catalogSize:n.catalog_size,checked:n.checked,failed:n.failed,overSerbia:n.over_serbia,durationMs:n.duration_ms,enabled:n.enabled??!0}:{lastRunAt:null,catalogSize:null,checked:null,failed:null,overSerbia:null,durationMs:null,enabled:!0}}async function d(a=20){await t();let{rows:n}=await e.f`
    SELECT ran_at, duration_ms, catalog_size, checked, candidates, failed, matched, truncated, error
    FROM cron_run_log
    ORDER BY ran_at DESC
    LIMIT ${a};
  `,r=n.map(a=>({ranAt:new Date(a.ran_at),durationMs:a.duration_ms,catalogSize:a.catalog_size,checked:a.checked,candidates:a.candidates,failed:a.failed,matched:a.matched,truncated:a.truncated,error:a.error})),i=r.filter(a=>null!==a.durationMs),E=a=>a.length?Math.round(a.reduce((a,e)=>a+e.durationMs,0)/a.length):null;return{runs:r,averageDurationMs:E(i),averageDurationMsCleanOnly:E(i.filter(a=>!a.truncated&&!a.error))}}a.s(["p",0,t,"G",0,n,"m",0,d,"s",0,E,"V",0,i,"H",0,r])}];

//# sourceMappingURL=lib_cronStatusService_ts_0qq-nl4i16mx2._.js.map