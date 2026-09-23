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

**2026-09-18, session 7** — Added site navigation and community features, plus a
real petition page built from a user-provided policy document:
- `app/components/NavBar.tsx` — floating sticky nav bar (logo, About, Petition,
  Contact, language toggle), shared across the dashboard and petition page.
- `app/components/Footer.tsx` — site-wide footer with contact email, nav links,
  and a one-line disclaimer that this is an advocacy/concept platform, not a
  government agency.
- `app/components/ContactForm.tsx` — client-side contact form. Deliberately
  built as a `mailto:` link generator rather than a server-side email sender,
  to avoid adding a new third-party email service dependency/API key just for
  this; it opens the visitor's own email client addressed to
  serbvasiona@gmail.com with their message pre-filled.
- `app/petition/page.tsx` + `app/components/PetitionSignForm.tsx` +
  `lib/petitionService.ts` + `app/api/petition/sign/route.ts` — a real petition
  page (linked only from the nav, not the homepage body, per request), content
  sourced from a user-supplied petition document proposing an Outer Space
  Treaty amendment to permit orbital overflight fees. Visitors can add
  optional name/country/comment; only a running **count** is shown publicly —
  names are stored but deliberately not displayed on the page, to avoid
  publishing personal data without a more explicit consent flow than a simple
  form checkbox would provide.
- Homepage logo enlarged in the nav bar; a second, larger logo added to the
  live-map card specifically, per request.
- Caught and fixed a real bug before shipping: a stray straight `"` character
  inside Serbian FAQ/story text broke out of its enclosing string literal
  (same class of bug as session 5's story text) — found via `npx tsc --noEmit`
  and `next build`, not just visual inspection. Worth noting as a pattern:
  Serbian typographic quotes should always be „ ... ” (or escaped \" if a
  straight quote is truly needed), never a bare " inside a double-quoted TS
  string.

**2026-09-18, session 8** — Major upgrade covering object classification, map
interactivity, a redesigned seal-style logo, admin tooling, and mobile layout:
- `lib/operatorLookup.ts` — refactored to a small fixed color palette bucketed
  by country/bloc (`COUNTRY_COLORS`), so a legend stays legible instead of
  having one color per operator. Added `classifyObjectType()`: detects space
  stations (ISS, Tiangong, etc.) and GNSS/navigation constellations (GPS,
  GLONASS, Galileo, BeiDou, etc.) by name, and falls back to an altitude-based
  LEO/MEO/GEO bucket using the real SGP4-computed altitude for anything else.
- `lib/db.ts` — `satellites` table gained an `object_type` column (migrated
  safely via `ADD COLUMN IF NOT EXISTS`); `upsertSatellite` now accepts
  altitude so the classifier has what it needs.
- `app/components/SerbiaMap.tsx` — replaced the old static server-rendered
  map with an interactive client component: real hover tooltips (satellite
  name, operator/country, object type) that follow the cursor, plus two
  legends — a color legend for country/operator and a shape legend for
  object type (circle = orbit class, diamond = space station, square = GNSS).
  `lib/serbiaMapSvg.ts` was refactored into a pure, shareable projection
  function (`getSerbiaMapProjection`) so the map math isn't duplicated.
- **Logo redesign**: rebuilt as a seal-style emblem — circular "VASIONA" /
  "SERBIA 2020" rim text (verified correct orientation by actually rendering
  to PNG with cairosvg before shipping, since SVG circular-text arc direction
  is easy to get backwards — see the empirical derivation notes below), a
  small globe with Serbia's real border polygon on it at a *correctly small*
  scale (an earlier draft had Serbia filling the whole globe — caught by
  rendering and looking at it, not by inspection), a dashed ray from Serbia to
  a satellite icon, and an "OCULUS CAELI" motto banner. Verified legible at
  the small (44px) size it actually renders at in the nav bar.
- `app/petition/page.tsx` unchanged in content, but signatures are no longer
  a dead end: `app/api/petition/list/route.ts` (admin-only, separate
  `ADMIN_SECRET`) plus `docs/ADMIN.md` documents two ways to actually see who
  signed (the admin endpoint, or Neon's own SQL editor) without publishing
  names on the public page.
- `app/components/NavBar.tsx`, `Footer.tsx` — logo enlarged (44px in nav);
  footer now reads "© Copyright VASIONA 2020".
- Punchline gained a second line: "It no longer benefits humanity as a whole
  — only a select few." Not attributed to anyone by name on the site itself,
  since the requested inspiration ("MJ") couldn't be verified as a specific
  real, quotable source — treated as house copy rather than a sourced quote.
- Mobile: added a `viewport` export to `app/layout.tsx` and breakpoint CSS in
  `globals.css` (tighter padding, smaller type under 600px/420px, tables wrap
  in a horizontal-scroll container instead of breaking layout). This is one
  responsive site that adapts to both, not two separate builds — that's the
  standard modern equivalent of "a mobile and a web version."
**2026-09-19, session 9** — Redesigned the logo again after the user provided
a reference image with a stronger direction: gold-on-cream seal palette
instead of navy-on-navy, Serbia rendered as an actual flag-colored
(red/blue/white) silhouette rather than solid red, and a dashed orbit
ellipse. Merged that direction with elements from the previous version
(the "SERBIA 2020" founding year in the rim text, a marker dot at the ray's
origin point). Verified at each step by rendering to PNG with cairosvg — not
just visually inspecting the SVG source — including a specific check of how
it looks composited against the site's dark navy nav-bar background at the
actual ~44px size it renders at there, since a cream-background seal on a
dark UI could easily have turned out looking like a mismatched sticker
instead of the intended medallion effect. `docs/BRAND_PACKAGE.md` and
`.sr.md` updated to describe the new palette and explicitly note that the
seal's gold/cream tone is intentionally distinct from the site's red UI
accent color, not a mismatch to fix.

**2026-09-19, session 10** — Repositioned the satellite in the logo to the
2 o'clock mark per request (was previously around 4:20), recalculating both
the orbit-distance placement and the icon's rotation so it still points along
the ray direction correctly rather than just moving the dot and leaving the
icon facing the old way. Founding year ("2020") in the rim text kept as-is
for now — ties to the brand's 2020 origin story used elsewhere (petition,
footer) — but flagged as easy to remove later if it ends up feeling redundant.

**2026-09-19, session 11** — Layout/content changes plus new admin and
company-revenue tooling:
- Moved the hypothetical-scenario disclaimer banner from just under the
  subtitle to immediately above the footer.
- Punchline card now shows only the "no longer benefits humanity as a whole"
  line — the airlines/satellites framing sentence removed from display
  (still in `lib/i18n.ts` as `punchline`, just unused in `page.tsx`, in case
  it's wanted back later).
- Nav bar: removed the logo icon entirely, replaced with text-only brand
  treatment "VASIONA — OCULUS CAELI — SERBIA" (Cyrillic "ВАСИОНА —
  OCULUS CAELI — СРБИЈА" for the Serbian nav, keeping the Latin motto as-is
  in both — common heraldic practice, mottos don't usually get translated).
  Footer's logo was left untouched since it wasn't mentioned — flagged as a
  minor inconsistency worth a decision later.
- Map card: swapped the full seal logo for a new trimmed `LOGO_MARK_SVG`
  (globe + flag-colored Serbia + ray + satellite only — no outer rings, no
  cream background, no rim text), sized to at least 28% of the card width
  (comfortably over the requested 1/4 minimum) via CSS `aspect-ratio: 1/1`
  rather than a fixed pixel size, so it scales with the responsive map.
- New hidden page `/petition/admin` — password-gated (checks `ADMIN_SECRET`
  against the existing `/api/petition/list` endpoint), shows a signatures
  table and a CSV download button. Not linked from any nav/footer — the URL
  itself is the "hidden link" half of the request, the password prompt is
  the "admin login" half.
- `lib/historicalModel.ts` gained `computeCompanyHistoricalLedger()` and a
  `COMPANY_SATELLITES_BY_YEAR` table (Starlink, OneWeb, Iridium NEXT — the
  three constellations with well-documented public historical satellite
  counts; deliberately excludes everything else rather than guessing, per
  "ignore unknown"). New report: `docs/COMPANY_REVENUE_MODEL.md`. CLI script
  (`npm run estimate:historical`) updated to print both the country-level and
  new company-level tables.
- Footer copyright line now includes a version marker: "© Copyright VASIONA
  2020 · v3.0".
- `docs/BACKLOG.md` — logged two explicitly-pending, not-yet-built items
  (crowdfunding campaign for a first Serbian satellite; a news page), with an
  honest note that Claude can't send a proactive reminder in two weeks —
  there's no persistent scheduling across separate conversations — so this
  file is what makes picking it back up fast, not a promise of a spontaneous
  follow-up.

**2026-09-19, session 12** — Built the two previously-pending backlog items,
now that they were explicitly requested (not just logged):
- **Crowdfunding campaign** (`docs/CROWDFUNDING_PLAN.md` + `/crowdfund`):
  gave a real recommendation on satellite purpose (Earth observation for
  agriculture/flood/forestry monitoring, reasoned against three alternatives
  in a comparison table) rather than just listing options. Included honest
  scope-setting up front: real CubeSat cost ranges (~$500K–$1.2M), a realistic
  3–4 year timeline, and — importantly — that actually collecting money needs
  a registered fundraising structure and Serbian legal review, which this
  build does not attempt to replace. The live page collects an **interest
  signal only** (email, optional name/indicative amount/comment stored via
  `lib/crowdfundService.ts` + `/api/crowdfund/pledge`) — explicitly not a
  payment system, stated plainly on the page itself, not just in the docs.
- **News page** (`/news` + `lib/newsService.ts`): uses the project's own
  GitHub commit history as its news feed via the public GitHub REST API
  (`GET /repos/{owner}/repo}/commits`), cached via Next.js's fetch
  `revalidate` to roughly one call/hour regardless of visitor traffic (matters
  since unauthenticated GitHub API calls are rate-limited to 60/hour/IP).
  Repo is configurable via `GITHUB_REPO` env var, defaulting to the repo
  this project has actually been pushed to this session. Handles repo-not-found
  and rate-limit errors with a visible message rather than failing silently.
- Nav bar gained two more links (Fund a Satellite, News) — now six items plus
  the language toggle; flagged as worth watching on narrow screens even
  though the existing flex-wrap should handle it reasonably.
- Caught and fixed the same recurring bug pattern again while writing the new
  Serbian dictionary strings for the crowdfund page: a straight `"` inside a
  „...” quoted phrase broke its enclosing TS string literal. Same fix as
  sessions 5, 7, and 11 — this is clearly a pattern worth remembering:
  Serbian text needing quotation marks inside a double-quoted TS string must
  use „...” (typographic), never a bare " for the close, or escape it (\").
  Verified clean with a scripted scan plus `npx tsc --noEmit` before moving on.

Also completed from the earlier request in this same session (moving the
disclaimer banner, trimming the punchline, removing the nav logo, the map
card's trimmed mark logo, the petition admin page, and the per-company
revenue report) — see the session 11 entry above for those specifics.

**2026-09-19, session 13** — Replaced the logo site-wide with a user-provided
design, added cron-run visibility, and consolidated admin tooling:
- **New logo** (`app/components/logo.ts`): a user-uploaded seal — light-blue
  globe with the actual Serbian state flag (coat of arms included) placed on
  it, dashed orbit ellipse, beam to a satellite, circular "VASIONA" /
  "OCULUS CAELI · SERBIA" rim text. The uploaded SVG's embedded flag image
  had genuinely corrupted base64 data (invalid length, not a padding issue);
  fixed by extracting the flag pixels directly from the user's own approved
  PNG preview of the same design via color-boundary detection, and
  re-embedding as valid PNG data. Verified by rendering to PNG before use.
  One rendering artifact (rim text showing as a rainbow outline) was
  investigated and confirmed to be a local sandbox font-fallback quirk in
  the verification tool, not a real defect — ruled out by comparing against
  the user's own approved preview, which shows the same text rendering
  correctly. Two variants kept, same pattern as before: `LOGO_SVG` (full
  seal, used in the footer and as a page-header mark on `/petition`,
  `/crowdfund`, `/news`) and a re-derived `LOGO_MARK_SVG` (globe/flag/beam/
  satellite only, no rim text — used in the map card). The base64 flag image
  is embedded once and shared between both variants via a template-literal
  interpolation rather than duplicated, to keep the file size reasonable.
- **Cron status tracking** (`lib/cronStatusService.ts`): a single-row
  `cron_status` table recording when the cron job last ran and its stats,
  updated on every run regardless of whether anything was found over
  Serbia (unlike the overflight-events table, which only has rows when
  something WAS found — needed a separate record to answer "did the job
  run at all"). Displayed on the dashboard next to the map title.
- **`lib/cronRunner.ts`** — extracted the actual cron logic out of the
  scheduled route into a shared function, so the new admin "run cron now"
  button calls it directly rather than making the scheduled endpoint call
  itself over HTTP — deliberately avoiding the self-fetch pattern that
  caused a real bug earlier in this project.
- **Consolidated admin console** (`/admin`, replacing the earlier
  `/petition/admin`): tabs for Cron (manual trigger + result), Petition
  (signatures + CSV), Crowdfund (interest signups + CSV) — one hidden,
  password-gated page instead of scattered ones.

**2026-09-20, session 14** — Logo finalized (this time for real), cron
scheduling controls, analytics dashboard, crowdfunding framing fix, and news
removal:
- **Logo saga concluded.** After an extensive debugging session chasing what
  looked like "missing text" in the SVG seal (see below for what that
  actually was), the user provided a much stronger finished design — a
  raster PNG with the Serbian double-headed eagle, globe, satellite, and
  bold circular rim text, generated externally rather than hand-built in
  SVG. Adopted wholesale: saved as a static asset
  (`public/vasiona-seal.png`), palette-quantized from 1.6MB down to ~58KB
  with no visible quality loss (this design's flat, limited color palette
  compresses very well that way), and `app/components/logo.ts` now just
  exports the path (`LOGO_SRC`) instead of a giant inline SVG string. Every
  previous placement (footer, map card, petition/crowdfund/analytics page
  headers) switched from `dangerouslySetInnerHTML` to a plain `<img>` tag —
  simpler, smaller bundle, no more SVG-rendering edge cases to chase.
- **What the "missing text" investigation actually found**, for the record:
  extensive bisection (isolating arc geometry, sweep direction, large-arc
  flags, font properties, and stroke/paint-order combinations one at a time)
  eventually traced every "missing" observation back to two mundane causes,
  not a real SVG or renderer bug: (1) several of the debugging test files
  accidentally used a pure white background against pure white text —
  simple color-matching invisibility, not a rendering failure; and (2) the
  original design genuinely had no background shape behind pure-white rim
  text, so on any real light background (not test-only) it would have had
  the same problem for a real reason. A dark ring-band background (verified
  working) was the fix in progress when the replacement design arrived and
  made the whole SVG moot. Keeping this in the log because the debugging
  method — bisect by removing pieces until the failing case is minimal,
  don't trust a single rendering tool's output as ground truth, and
  double-check your own test setup before concluding the target is broken —
  is worth remembering even though the specific SVG it was applied to is
  gone.
- **Cron scheduling**: added a real, server-enforced on/off toggle
  (`lib/cronStatusService.ts` gained `enabled`, checked at the start of
  `runCronJob()`) exposed in the admin console's Cron tab, alongside the
  manual trigger (which now takes a `force` option to bypass the toggle —
  an explicit manual run should work regardless of the schedule being
  paused). Documented plainly, in the UI itself and in `docs/ADMIN.md`, that
  changing the actual *time of day* isn't something a runtime toggle can do
  — Vercel Cron's schedule is fixed in `vercel.json` at deploy time, with no
  runtime API for changing it, and Hobby-tier accounts are limited to
  once-per-day regardless.
- **`/analytics`** — new public page presenting the hypothetical-revenue
  model broken down both by country and by named company (reusing
  `lib/historicalModel.ts`), with simple inline bar visualizations. Replaces
  the nav slot freed up by removing News.
- **Crowdfunding framing corrected**: this is a privately funded effort run
  by an international team (including Serbian expats), not contingent on
  Serbian government registration or involvement — the entity can register
  in the US or elsewhere. Serbian government participation is a welcome
  bonus if it happens, not a prerequisite. Updated in
  `docs/CROWDFUNDING_PLAN.md` and the live page's disclaimer text (both
  languages).
- **News removed entirely** per request: `/news` route, `lib/newsService.ts`,
  the nav link, and the `GITHUB_REPO` env var all deleted.
- **Social links added to the footer**: X, Instagram, YouTube.

**2026-09-21, session 15** — Fixed a real production bug reported after
deploy: the dashboard crashed with a server-side exception because
`getCronStatus()` (called directly from `app/page.tsx`) queried the
`cron_status` table without ever ensuring it existed first — on a fresh
deployment where the cron job hadn't run yet and nobody had visited `/admin`
(both of which do call `ensureCronStatusSchema()`), that table genuinely
didn't exist, and the `SELECT` threw. This was an inconsistency with the
rest of the codebase's established pattern (every other service function
that reads from a table it owns calls its own `ensureXSchema()` first,
rather than relying on callers to remember to). Fixed by making
`getCronStatus()`, `getCronEnabled()`, `setCronEnabled()`, and
`recordCronRun()` all self-sufficient. Also audited the two other
similarly-shaped newer services (`crowdfundService.ts`, `petitionService.ts`)
for the same gap and applied the same defensive fix there too, even though
their current call sites happened to already call `ensureXSchema()`
correctly — better that it can't regress later if a new call site forgets to.
The two oldest, most-used services (`ledgerService.ts`, `overheadService.ts`)
already followed this pattern correctly and needed no change.

Also worth noting from this session: a zip-based file delivery only adds/
overwrites files, it never deletes ones that are no longer present — so
"file X was removed" instructions require the person to manually delete
that file locally too. This caused two failed deploys in a row (a stale
`app/news/page.tsx` referencing removed i18n keys, then the same file still
importing an already-deleted `lib/newsService.ts`) before it was fully
cleared. Flagging this pattern explicitly for future removal instructions.

**2026-09-21, session 16** — Five small, distinct changes:
1. Footer version bumped to v0.5.
2. Serbian is now the default language site-wide — every page's language
   resolution flipped from "sr only if explicitly requested" to "en only if
   explicitly requested" (`searchParams?.lang === "en" ? "en" : "sr"`), and
   `getDict()`'s own fallback flipped to match, so the default holds even if
   a future call site forgets to resolve `lang` first.
3. LinkedIn and TikTok added to the footer's social links (now 5 total; the
   icon row got `flexWrap` added so it doesn't overflow on narrow screens).
4. Nav brand text shortened from "VASIONA — OCULUS CAELI — SERBIA" to
   "VASIONA — SERBIA" in both languages (motto dropped from the nav; still
   present on the logo image itself).
5. New "Major Local Sponsors" section on `/crowdfund`, distinct from the
   individual crowdfunding tiers table — a direct-inquiry (mailto) sponsorship
   path for Serbian businesses offering satellite naming rights, a custom
   mission description, and physical labels/stickers on the spacecraft
   itself before launch. Documented in `docs/CROWDFUNDING_PLAN.md` with the
   same honest framing as the rest of that document (limited slots, pricing
   negotiated per sponsor rather than fixed, coordination needed with the
   technical build timeline).

## 2026-09-21 — v0.6
1. **Domain** is now `vasiona.org`; contact address is `info@vasiona.org` (was
   serbvasiona@gmail.com). Both live in `lib/site.ts` and are used by the footer,
   contact form, sponsor button, i18n copy and page metadata (`metadataBase`,
   Open Graph). See `DEPLOY.md` section 9-10 for the Vercel/DNS/mailbox steps.
2. **Footer** shows `vasiona.org` and `info@vasiona.org`.
3. **Email capture** on `/petition` (new) and `/crowdfund` (already had one): email is
   required, plus an explicit consent checkbox ("VASIONA may contact me"). Stored in
   `email` + `contact_consent` (columns added idempotently), one entry per email,
   never published. Admin tables and CSV exports include both columns.
4. **Home page charts** (dependency-free SVG, `app/components/GrowthCharts.tsx`):
   cumulative modeled total by year (annual bars + cumulative line) under
   "HYPOTHETICAL TOTAL, 2020 → NOW", and active satellites per year with
   year-over-year growth, total multiple and CAGR under "MODELED YEARLY BREAKDOWN".
5. **Supporter kit**: `public/vasiona-support-kit.zip`, linked from the very bottom of
   `/crowdfund` (logo, brochure, posters/flyers, stickers, QR codes, social images).
   See `docs/SUPPORT_KIT.md`.

## 2026-09-22 — v0.7
1. **"The story behind VASIONA" / "Прича иза ВАСИОНЕ"** (home page `#about`) now has a
   second paragraph bridging to the first-satellite idea: an early-stage plan to help
   finance, design and build Serbia's first satellite (CubeSat), explicitly labeled as
   not-yet-funded. Ends with a link to `/crowdfund` (`t.aboutText2` + `t.aboutCta` in
   `lib/i18n.ts`, rendered in `app/page.tsx`).
2. Supporter-kit brochure (`public/vasiona-support-kit.zip` → `02-brosura/`) got the same
   bridging sentence on its story page, so it flows into the existing "Serbia's first
   satellite" page that follows it. Kit re-zipped; size unchanged (~18 MB).

## 2026-09-22 — v0.8: "the live map doesn't update" (СРБИЈА — КАРТА ПРЕЛЕТА УЖИВО)

**Root cause.** `lib/cronRunner.ts` checked a *single instant* (`new Date()` at
the moment the job runs) against the full "active" CelesTrak catalog
(10,000+ objects today), strictly sequentially, with no time budget, and only
wrote `cron_status.last_run_at` **after the entire loop finished**. Two ways
that fails silently:
- Serbia is small; a LEO satellite's ground track crosses it in well under a
  minute. Checking one instant makes "did this run find anything?" mostly
  luck — a run can legitimately complete and correctly find zero satellites
  overhead at that exact millisecond.
- Scanning 10,000+ objects one at a time, with no time budget, risks
  exceeding the platform's function-timeout ceiling (`maxDuration = 60` in
  the route files — but confirm your actual Vercel plan allows that; see
  DEPLOY.md). If the platform kills the function mid-loop, `recordCronRun()`
  — the line that updates `lastRunAt` — never runs. That is indistinguishable
  from "nothing happened" on the homepage: no error, no new dots, no new
  timestamp, and a `curl` to the endpoint just hangs until you give up.

**Fix, in `lib/cronRunner.ts` / `lib/propagate.ts` / `lib/tle.ts`:**
1. **Inclination pre-filter.** `tleInclinationDeg()` reads a satellite's
   inclination straight out of TLE line 2 text — no propagation needed. A
   satellite's ground track never reaches a latitude above
   `min(inclination, 180 - inclination)`, so anything under ~40° (Serbia sits
   at 41.8-46.2°N) is skipped before ever building a satrec. This alone
   removes most of the geostationary belt and other low-inclination traffic
   from the work the request has to do.
2. **Time-window sampling.** Instead of one instant, each surviving candidate
   is sampled at `CRON_STEP_SECONDS` intervals (default 15s) across
   `CRON_WINDOW_SECONDS` (default 240s = 4 minutes) — 17 chances instead of 1.
   Matters even more given Vercel Hobby-tier accounts can only schedule this
   job once a day (`app/api/admin/cron-settings/route.ts` already noted this).
3. **Hard time budget, always-write status.** The whole fetch+scan is wrapped
   so it bails out at `CRON_TIME_BUDGET_MS` (default 45s, comfortably under
   the 60s `maxDuration`) and marks the result `truncated: true` rather than
   letting the platform kill it. `recordCronRun()` now runs unconditionally
   after that block (success, error, or truncation) — `lastRunAt` always
   moves on every invocation, full stop.
4. **Richer, honest response JSON.** `checked`, `candidatesAfterInclinationFilter`,
   `matchedThisRun`, `matchedSatellites` (names), `windowSeconds`, `stepSeconds`,
   `durationMs`, and `truncated`/`error` when relevant — so a manual `curl` or
   the admin console's "Run now" immediately shows what happened instead of
   an ambiguous empty result.
5. `fetchTleGroup()` now takes an `AbortSignal` and fails fast (clear error
   message) on a stalled CelesTrak response instead of hanging toward the
   platform's own timeout.

**If the map still looks stale after this, check (roughly in order):**
- You're hitting the **same production deployment** the site itself reads
  from. `vasiona-platform.vercel.app` should still be an alias for the same
  project as `vasiona.org`, but confirm in the Vercel dashboard — a project
  rename or a second project would silently write to a different database.
  Prefer testing against `https://vasiona.org/api/cron/fetch-tles` directly.
- Cron might be toggled off in the admin console (`cron_status.enabled =
  false`). A plain `curl` to `/api/cron/fetch-tles` will then return almost
  instantly with `skipped: true` — the admin console's "Run now" bypasses
  this (`force: true`), a raw `curl` does not.
- `CRON_SECRET` (for the scheduled/curl endpoint) and `ADMIN_SECRET` (for the
  admin console) must match what's set in Vercel's Project Settings →
  Environment Variables for the environment you're hitting.
- Check your actual Vercel plan's serverless function timeout — `maxDuration
  = 60` in the route files is a request, not a guarantee; some plans cap
  lower. If so, lower `CRON_TIME_BUDGET_MS` (env var) to match.

## 2026-09-22 — v0.9: cooldown on the admin "Run cron now" button
Manual runs now gray the button out for 4 minutes after each one finishes
(`RUN_COOLDOWN_MS` in `app/admin/page.tsx`), with a live "Available in m:ss"
countdown, so an impatient click (or several) can't fire off overlapping
runs. Seeded from the server's real `cron_status.last_run_at` via a new
read-only endpoint (`app/api/admin/cron-status/route.ts`), so reloading the
admin page mid-cooldown still shows the correct remaining time instead of
resetting to "available". This is a UI courtesy only — the underlying
`/api/admin/run-cron` and `/api/cron/fetch-tles` endpoints are not
rate-limited server-side; a direct `curl` with the right secret still works
any time. Adjust `RUN_COOLDOWN_MS` if 4 minutes isn't the right number for
your CelesTrak/DB load.

## 2026-09-22 — v0.10: tracked run duration + average, in the admin console
Answering "what's the average time to run a cron job?" required actually
recording it — `durationMs` was previously only in a single run's response
JSON, never persisted. Now:
- New `cron_run_log` table (see `ensureCronStatusSchema` in
  `lib/cronStatusService.ts`) — one row per run, keeping the most recent 200
  (duration, catalog size, checked/candidates/failed/matched, truncated,
  error). `cron_status` (the single "current state" row) also gained a
  `duration_ms` column for the last run alone.
- `lib/cronRunner.ts` now passes `durationMs`, `candidates`, `truncated` and
  `error` into `recordCronRun()`, so every run — including truncated or
  failed ones — gets logged, not just clean successes.
- `getCronRunHistory(limit)` computes two averages over the returned runs:
  `averageDurationMsCleanOnly` (excludes truncated/errored runs — the more
  meaningful number) and `averageDurationMs` (all runs, outliers included).
- `/api/admin/cron-status` (GET, ADMIN_SECRET-protected) now returns both the
  current status and this history in one response.
- Admin console: a "Run History" panel under the manual-trigger button shows
  both averages plus a table of the last 20 runs (when, duration, checked,
  matched, and a truncated/error note). Refreshes automatically after every
  manual run and on page load.

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
