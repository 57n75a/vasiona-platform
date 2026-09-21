# Admin console

`https://YOUR_DOMAIN/admin` — not linked from anywhere in the site; the URL
itself plus the password prompt are the access control. Log in with your
`ADMIN_SECRET` (same value as in `.env.example` / Vercel env vars).

Three tabs:
- **Cron** — a real on/off toggle for the daily job (enforced server-side —
  the scheduled run checks it and skips its work when off), the actual
  configured schedule for reference, and a "Run cron now" button that
  triggers the job immediately regardless of the toggle. See the note below
  on why the toggle can't change the *time* the job runs.
- **Petition** — table of everyone who's registered support on `/petition`,
  plus a CSV download button.
- **Crowdfund** — table of everyone who's registered interest on
  `/crowdfund`, plus a CSV download button.

## A real limitation, stated plainly
The on/off toggle is genuinely enforced — flip it off and the scheduled job
will skip its work. But **changing what time of day it runs isn't something
this panel can do**: Vercel Cron's schedule is fixed in `vercel.json` at
deploy time, and Vercel doesn't offer a way to change a cron schedule at
runtime via API on any plan. To change the time, edit the `schedule` string
in `vercel.json` and redeploy (see DEPLOY.md). Hobby-tier accounts are also
limited to once-per-day schedules regardless of what time is chosen.

## Why this design
- The public pages (`/petition`, `/crowdfund`) show a running **count**
  only — names/emails aren't published. This console is how you, the site
  operator, actually see who signed up.
- The "Run cron now" button uses a separate endpoint
  (`/api/admin/run-cron`, checked against `ADMIN_SECRET`) rather than
  reusing the scheduled cron's own endpoint — keeps the two secrets
  (`CRON_SECRET` for Vercel's scheduler, `ADMIN_SECRET` for you) independent.
- If you'd rather script this than click through a UI, the underlying
  endpoints (`/api/petition/list`, `/api/crowdfund/list`, both accepting
  `?format=csv`, and `POST /api/admin/run-cron`) all take the same
  `Authorization: Bearer YOUR_ADMIN_SECRET` header directly — see
  DEPLOY.md for a `curl` example of the cron one.

## Alternative: Neon's SQL Editor
No code needed — go to your Neon project dashboard → SQL Editor, and query
`petition_signatures` or `crowdfund_interest` directly. Neon's editor also
lets you export results as CSV from that screen.

## A privacy note
Treat exported data as personal data — people gave their name/email/comment
expecting it to be counted, not published. If you ever want a public
"supporters" wall, that needs its own explicit opt-in on the forms first,
not just adding a list to a page.
