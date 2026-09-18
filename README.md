# VASIONA — Satellite Orbiting

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
| Serbia geofence | 🟢 Real border polygon — ~130-point ray-casting point-in-polygon test |
| Operator/country per satellite | 🟡 Heuristic — pattern-matched from catalog name (e.g. "STARLINK-1007" → SpaceX/USA), bucketed into a fixed color palette per country/bloc |
| Object type (LEO/MEO/GEO, Space Station, GNSS) | 🟡 Heuristic — name pattern for stations/GNSS, altitude-bucketed for everything else |
| Live map | 🟢 Real — interactive client-rendered map from the actual border polygon, real logged events as hover-able, color+shape-coded dots, with a legend |
| Petition signatures | 🟢 Real — stored in Postgres; public page shows a count only (see docs/ADMIN.md for how to actually list signers) |
| "Real logged" ledger numbers | 🟢 Real — actual passes this deployment has observed since it went live |
| "Modeled 2020→now" ledger numbers | 🟡 Statistical estimate — see `lib/historicalModel.ts` |
| Fee-per-pass, coverage factor | 🟡 Illustrative, adjustable via env vars |

## Site structure
- **/** — main dashboard (map, ledger, recent events, About and Contact sections)
- **/petition** — reachable only via the nav bar, not linked from the dashboard body — a real petition (content from `docs/`-adjacent source material) proposing an Outer Space Treaty amendment, with a live signature counter (count only; names aren't published — see `docs/ADMIN.md` for how to actually list signers)

## Repo layout
```
app/
  page.tsx                     dashboard — bilingual via ?lang=en / ?lang=sr
  petition/page.tsx            petition page (nav-only)
  components/
    NavBar.tsx                 floating sticky nav (logo, About, Petition, Contact, lang toggle)
    Footer.tsx                 site-wide footer
    ContactForm.tsx            client component — builds a mailto: link, no email service needed
    PetitionSignForm.tsx       client component — real POST to /api/petition/sign
    SerbiaMap.tsx               interactive client map — hover tooltips, color + shape legends
    logo.ts                    shared inline seal-style logo SVG markup
  api/cron/fetch-tles/route.ts the cron job Vercel calls on schedule
  api/overhead/route.ts        recent real logged events
  api/ledger/route.ts          combined real + modeled hypothetical ledger (bilingual via ?lang=)
  api/petition/sign/route.ts   accepts petition sign submissions
  api/petition/list/route.ts   admin-only: lists/exports signatures (separate ADMIN_SECRET)
lib/
  tle.ts                       CelesTrak fetch + TLE parsing
  propagate.ts                 SGP4 wrapper (satellite.js)
  serbia.ts                    real Serbia border polygon + point-in-polygon geofence
  serbiaMapSvg.ts              shared pure projection math (used by the map component)
  operatorLookup.ts            operator/country classifier (bucketed colors) + object-type classifier (LEO/MEO/GEO, station, GNSS)
  db.ts                        Postgres access layer
  historicalModel.ts           2020->now statistical estimate
  ledgerService.ts             shared ledger logic (used by page + API, no self-fetch)
  overheadService.ts           shared overhead-events logic (used by page + API)
  petitionService.ts           petition signature storage, count, and admin listing
  i18n.ts                      EN/SR UI dictionary
db/schema.sql                  reference schema (also auto-created by lib/db.ts)
docs/
  BRAND_PACKAGE.md / .sr.md
  BUSINESS_PLAN.md / .sr.md
  BUILD_LOG.md / .sr.md
  ADMIN.md                     how to list petition signers
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
