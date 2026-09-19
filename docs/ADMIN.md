# Listing petition signatures

Signer names aren't shown publicly on `/petition` by design (see BUILD_LOG.md)
— only a running count. Here's how you, as the site operator, can actually see
who signed. Three ways, easiest first:

## Method 1 — The hidden admin page (easiest)
Go to `https://YOUR_DOMAIN/petition/admin`. This page isn't linked from
anywhere in the site — the URL itself plus the password prompt are the access
control. Enter your `ADMIN_SECRET` (same one from `.env.example` / Vercel
env vars) and it shows a table of all signatures, with a "Download CSV"
button. Bookmark that URL for yourself.

## Method 2 — Neon's SQL Editor (no code, no secrets needed)
1. Go to your Neon project dashboard (linked from Vercel's Storage tab, or
   directly at console.neon.tech).
2. Open the **SQL Editor** for your database.
3. Run:
   ```sql
   SELECT name, country, comment, created_at
   FROM petition_signatures
   ORDER BY created_at DESC;
   ```
4. Neon's editor lets you export the result as CSV directly from that screen.

This is the simplest option and needs nothing set up in the app itself.

## Method 3 — The built-in admin API endpoint (for scripting)
A route is included at `/api/petition/list`, protected by a separate
`ADMIN_SECRET` environment variable (set it in Vercel → Settings →
Environment Variables — see `.env.example`; use a different value than
`CRON_SECRET`, don't reuse it).

**As JSON:**
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  https://YOUR_DOMAIN/api/petition/list
```

**As a downloadable CSV** (open this URL in a browser with the header set via
a tool like `curl -O`, or use an HTTP client that lets you set headers):
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  "https://YOUR_DOMAIN/api/petition/list?format=csv" \
  -o petition_signatures.csv
```

If `ADMIN_SECRET` isn't set at all, this endpoint always returns 401 — there's
no accidental open-by-default state.

## A privacy note
Whichever method you use, treat the exported list as personal data — people
gave their name/country/comment expecting it to be counted, not published.
If you ever do want to publicly display signer names (e.g. a "supporters"
wall), that's a bigger decision than this endpoint's scope — it would need
its own explicit opt-in on the sign form first, not just adding a list to the
page.
