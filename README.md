# VASIONA — Air & Space Overflight Monitor

*(Српски: [README.sr.md](./README.sr.md))*

A deployable Next.js/Vercel platform that:
1. Runs a scheduled cron job pulling **live** satellite element sets (TLEs)
   from CelesTrak,
2. Propagates each satellite's real position with SGP4 (`satellite.js`),
3. Logs any satellite whose ground track crosses Serbia to Postgres,
4. Serves a dashboard showing those real logged passes alongside a
   **hypothetical** fee ledger — what those passes might be "worth" if
   satellite overflight tolls existed (they don't, currently — see below).

## ⚠️ Read this before deploying anything publicly
The dollar figures this platform computes are a **scenario model**, not a
real product or invoice. The 1967 Outer Space Treaty (Article II) bars
national appropriation of outer space, so there is no current legal basis
for charging satellites a fee for passing overhead — unlike aircraft
overflight fees, which rest on recognized sovereign airspace. Full context
in `docs/BUSINESS_PLAN.md`. Don't present the hypothetical numbers to
subscribers or investors without that caveat attached.

## What's real vs. simulated
| Piece | Status |
|---|---|
| TLE data (cron job) | 🟢 Real — live pull from CelesTrak |
| SGP4 propagation | 🟢 Real — same library as the earlier browser demo, run server-side |
| Serbia geofence | 🟡 Simplified — lat/lon bounding box, not the real border polygon |
| "Real logged" ledger numbers | 🟢 Real — actual passes this deployment has observed since it went live |
| "Modeled 2020→now" ledger numbers | 🟡 Statistical estimate — see `lib/historicalModel.ts` |
| Fee-per-pass, coverage factor | 🟡 Illustrative, adjustable via env vars |

## Repo layout
```
app/
  page.tsx                     dashboard — bilingual via ?lang=en / ?lang=sr
  api/cron/fetch-tles/route.ts the cron job Vercel calls on schedule
  api/overhead/route.ts        recent real logged events
  api/ledger/route.ts          combined real + modeled hypothetical ledger (bilingual via ?lang=)
lib/
  tle.ts                       CelesTrak fetch + TLE parsing
  propagate.ts                 SGP4 wrapper (satellite.js)
  serbia.ts                    geofence (bounding box)
  db.ts                        Postgres access layer
  historicalModel.ts           2020->now statistical estimate
  i18n.ts                      EN/SR UI dictionary
db/schema.sql                  reference schema (also auto-created by lib/db.ts)
docs/
  BRAND_PACKAGE.md / .sr.md
  BUSINESS_PLAN.md / .sr.md
  BUILD_LOG.md / .sr.md
  vasiona_logo.svg
scripts/historical-estimate.ts CLI: prints the modeled ledger for several countries
README.sr.md, DEPLOY.sr.md     Serbian versions of this file and the deploy guide
```

## Language
The dashboard defaults to English at `/`. Switch with the toggle link in the
top-right corner, or go directly to `/?lang=sr`. The `/api/ledger` endpoint
accepts the same `?lang=en|sr` parameter and returns localized description
text. All documentation exists in parallel `.md` (English) / `.sr.md`
(Serbian) pairs in `docs/`.

See `DEPLOY.md` for Vercel setup steps.
