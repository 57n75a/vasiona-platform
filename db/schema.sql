-- VASIONA platform schema.
-- lib/db.ts runs this automatically on first API call (ensureSchema),
-- but you can also run it manually against your Vercel Postgres instance.

CREATE TABLE IF NOT EXISTS satellites (
    norad_id     INTEGER PRIMARY KEY,
    name         TEXT NOT NULL,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS overflight_events (
    id            BIGSERIAL PRIMARY KEY,
    norad_id      INTEGER REFERENCES satellites(norad_id),
    observed_at   TIMESTAMPTZ NOT NULL,
    lat           NUMERIC NOT NULL,
    lon           NUMERIC NOT NULL,
    alt_km        NUMERIC,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_overflight_time ON overflight_events (observed_at);

CREATE TABLE IF NOT EXISTS petition_signatures (
    id          BIGSERIAL PRIMARY KEY,
    name        TEXT,
    country     TEXT,
    comment     TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Crowdfunding interest signals (NOT a payment/pledge table — see docs/CROWDFUNDING_PLAN.md)
CREATE TABLE IF NOT EXISTS crowdfund_interest (
    id             BIGSERIAL PRIMARY KEY,
    email          TEXT,
    name           TEXT,
    indicative_usd NUMERIC,
    comment        TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tracks when the cron job last ran (single row, id always 1) — separate from
-- overflight_events since that table only gets rows when something WAS found.
CREATE TABLE IF NOT EXISTS cron_status (
    id               INTEGER PRIMARY KEY DEFAULT 1,
    last_run_at      TIMESTAMPTZ,
    catalog_size     INTEGER,
    checked          INTEGER,
    failed           INTEGER,
    over_serbia      INTEGER,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Optional, for when you outgrow the simplified bounding-box check in lib/serbia.ts
-- and want to store a real border polygon + do PostGIS point-in-polygon tests instead:
-- CREATE EXTENSION IF NOT EXISTS postgis;
-- CREATE TABLE country_borders (
--     iso_code TEXT PRIMARY KEY,
--     name     TEXT NOT NULL,
--     polygon  GEOMETRY(MultiPolygon, 4326) NOT NULL
-- );
