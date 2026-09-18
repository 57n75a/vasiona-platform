# Deploying VASIONA to Vercel

*(Српски: [DEPLOY.sr.md](./DEPLOY.sr.md))*

## 1. Push this project to a Git repo
```bash
cd vasiona-platform
git init
git add .
git commit -m "Initial VASIONA platform"
# create a repo on GitHub/GitLab, then:
git remote add origin <your-repo-url>
git push -u origin main
```

## 2. Import into Vercel
- Go to vercel.com → **Add New… → Project** → import the repo.
- Framework preset: Next.js (auto-detected).

## 3. Add Postgres storage
- In the Vercel project → **Storage** tab → **Create Database** → Postgres
  (Vercel Postgres, or connect Neon/Supabase — either works with
  `@vercel/postgres` as long as the standard `POSTGRES_URL*` env vars are set).
- This automatically injects `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`, etc.
  into your project's environment variables — you don't need to set them
  manually.

## 4. Set environment variables
Project Settings → Environment Variables → add (see `.env.example`):
- `CRON_SECRET` — any long random string. **Important:** Vercel automatically
  attaches this as a Bearer token when it invokes your cron job, which is
  what `app/api/cron/fetch-tles/route.ts` checks against.
- `HYPOTHETICAL_FEE_USD_PER_PASS` (default 25)
- `INCLINATION_COVERAGE_FACTOR` (default 0.75)
- `ORBITS_PER_DAY_ASSUMED` (default 15)
- `CELESTRAK_GROUP` (default `active`) — see note below on plan limits.

## 5. Cron schedule
`vercel.json` is already set to run daily at 03:00 UTC:
```json
{ "crons": [{ "path": "/api/cron/fetch-tles", "schedule": "0 3 * * *" }] }
```
- **Hobby plan:** Vercel restricts cron frequency on the free tier — check
  your current plan's limits before setting anything more frequent than
  daily; the deploy will otherwise be rejected or silently throttled.
- **Pro plan or higher:** you can safely go more frequent, e.g. every 2 hours:
  `"0 */2 * * *"`. Satellites move fast (~90 min orbits), so more frequent
  polling catches more real passes — daily polling will visibly undercount.

## 6. Function duration / catalog size
The `active` CelesTrak group is the full ~16,500-satellite catalog. Propagating
all of them in one serverless invocation may approach Vercel's function time
limit on lower plans. Options if the cron run times out:
- Set `CELESTRAK_GROUP` to a smaller group (e.g. `stations`, `starlink`,
  `oneweb` — see https://celestrak.org/NORAD/elements/ for the full list of
  group names) to test with fewer objects first.
- On Pro/Enterprise, raise `maxDuration` in
  `app/api/cron/fetch-tles/route.ts` (already set to 60s; Pro allows more).

## 7. First deploy & manual test
After deploying:
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://<your-app>.vercel.app/api/cron/fetch-tles
```
This runs the same logic Vercel Cron will run on schedule — use it to verify
the pipeline (CelesTrak fetch → propagate → geofence → Postgres insert) before
waiting for the schedule.

Then open `https://<your-app>.vercel.app/` for the dashboard.

## 8. Swapping in a real Serbia border polygon (recommended before relying on this)
`lib/serbia.ts` currently uses a simplified bounding box. For production
accuracy, replace it with a real polygon (e.g. from Natural Earth or GADM)
and a point-in-polygon check — the `db/schema.sql` file has a commented-out
PostGIS table (`country_borders`) as a starting point if you want to store
the polygon in Postgres instead of hardcoding it in `lib/serbia.ts`.
