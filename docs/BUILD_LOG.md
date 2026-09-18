# VASIONA — Build Log

**2020-05-03** — Original concept note authored (source PDF): Serbian air/space
sovereignty extending beyond the atmosphere, satellite tracking + toll idea.

**2026-09-17, session 1** — Reviewed concept. Flagged the core legal issue up
front: Outer Space Treaty Art. II bars national appropriation of space above
~100 km, so satellite overflight tolls have no current legal basis (unlike
aviation overflight fees, which rest on recognized sovereign airspace).
Produced: brand name (VASIONA), logo (SVG), domain candidates, territorial
framework (Layer 1 sovereign airspace / Layer 2 monitoring zone), software
architecture + SQL schema sketch, two-track monetization model (real SaaS vs.
hypothetical fee ledger), phased roadmap. Delivered as a Markdown package +
logo file.

**2026-09-17, session 2** — Built a working interactive demo
(`vasiona_tracker.html`, published as an artifact): real SGP4 propagation of
the ISS from a public NORAD element set (epoch 2026-05-13), running live in
the browser, plus a simulated multi-satellite constellation for visual
density. Serbia geofence implemented as a simplified lat/lon bounding box.
Noted limitation: published artifact pages can't fetch external TLE feeds
live (CSP restricts script/style hosts), so the demo uses a baked-in snapshot.

**2026-09-17, session 3** — Built a second interactive artifact,
`vasiona_revenue_simulator.html`: an adjustable hypothetical-scenario
calculator estimating per-country satellite-toll revenue if the Outer Space
Treaty's non-appropriation rule were abandoned. Pulled a real current active-
satellite count (~16,500, Sept 2026) to anchor the default. Explicitly
labeled as a scenario tool throughout, not a forecast. Key finding surfaced:
the model ranks countries by east-west longitude span, so large-landmass
states (Russia, Canada, US, China) dominate regardless of economic size —
the opposite of the original concept note's assumption that "space
superpowers" would be disadvantaged by their size.

**2026-09-17, session 4 (this deployment)** — Scaffolded a real, deployable
Next.js/Vercel platform:
- `app/api/cron/fetch-tles` — Vercel Cron endpoint, pulls a **live** TLE
  catalog from CelesTrak (public, free, no API key), runs real SGP4
  propagation server-side (via `satellite.js`, Node-compatible, same library
  as the browser demo), and logs any satellite whose ground track crosses
  the Serbia bounding box into Postgres.
- `app/api/ledger` — combines (a) real logged events from the cron job with
  (b) a modeled statistical estimate covering 2020 → first deployment,
  since literal historical orbital reconstruction back to 2020 isn't
  feasible without a specialist historical-TLE archive.
- `docs/BUSINESS_PLAN.md` — explicitly separates the real product (Track A:
  subscription API, government contract, data licensing) from the
  hypothetical scenario model (Track B: the 2020-to-now toll estimate),
  with the treaty caveat attached to every occurrence of the Track B numbers.

**2026-09-18, session 6** — Renamed the dashboard/site title from "Overflight
Monitor" to "Satellite Orbiting" across the UI (`lib/i18n.ts`), page metadata
(`app/layout.tsx`), and documentation (README.md / README.sr.md). Added:
- `lib/operatorLookup.ts` — heuristic classification of each tracked object's
  operator/country from its CelesTrak catalog name (e.g. "STARLINK-1007" →
  SpaceX/USA, "COSMOS 2251" → Russia/Roscosmos). Explicitly heuristic, not
  authoritative registry data — flagged as such in the code and docs.
- `lib/serbiaMapSvg.ts` — renders Serbia's real border polygon (added last
  session) as an inline SVG map, server-side, with real logged overflight
  events plotted as color-coded dots by operator/country.
- Dashboard now shows: the VASIONA logo inline, a bilingual "story behind
  VASIONA" section, the live map, a fun comparison punchline ("nations
  already charge airlines to fly through sovereign sky — why not satellites
  orbiting through the space above it?"), and an Operator/Country column in
  the recent-events table.
- `lib/db.ts` — satellites table gained `operator_name` / `operator_country`
  columns (added via `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, safe to run
  against the already-deployed table without data loss).

## Known simplifications carried through every version
1. ~~**Serbia geofence** is a lat/lon bounding box~~ — **Updated:** now uses a real
   ~130-point national border polygon (ray-casting point-in-polygon test) instead
   of a bounding box. Note: the sourced boundary dataset includes the Kosovo
   region as part of Serbia's territory — a status not universally recognized
   internationally. See the comment in `lib/serbia.ts` for how to swap datasets
   if you want the alternate boundary.
2. **Historical ledger (2020→now)** is a statistical estimate from yearly
   satellite-population figures, not a literal per-satellite historical
   orbital reconstruction.
3. **Coverage factor (75%)** and **orbits/day (15)** are round-number
   illustrative assumptions, not measured constants — both are exposed as
   adjustable parameters (env vars in the platform, sliders in the standalone
   simulator) rather than hardcoded.
4. **Fee per pass ($25 default)** is illustrative, loosely anchored to a
   fraction of typical civil-aviation overflight fee ranges.

## Open TODOs
- [x] ~~Swap bounding box for a real border polygon~~ — done, see above
- [ ] Consider Space-Track.org as a redundant/higher-fidelity TLE source
- [ ] Load-test the cron route against the full "active" group (~16,500 sats)
      within Vercel's function time limit; fall back to a smaller GROUP if needed
- [ ] Decide on Vercel Postgres vs. an alternative (Neon, Supabase) for storage
      — resolved for this deployment: using Neon via Vercel Marketplace
- [ ] Fixed a bug where the dashboard's server component fetched its own API
      routes over HTTP (fragile — broke behind Vercel's deployment-protection
      login wall). Both now share logic directly via lib/ledgerService.ts and
      lib/overheadService.ts instead of round-tripping through HTTP.
