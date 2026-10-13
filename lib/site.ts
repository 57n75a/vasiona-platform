// Single source of truth for the public domain, contact address and the
// downloadable supporter kit. Change them here and every page, form and
// metadata tag follows.
export const SITE_DOMAIN = "vasiona.org";
export const SITE_URL = `https://${SITE_DOMAIN}`;
export const CONTACT_EMAIL = "info@vasiona.org";

// Static asset served from /public — see docs/SUPPORT_KIT.md for how it is built.
export const SUPPORT_KIT_PATH = "/vasiona-support-kit.zip";
export const SUPPORT_KIT_SIZE_MB = 18; // approx. size of the ZIP, shown next to the download button (0 hides it)

// Hour (UTC) of the daily cron in vercel.json ("0 6 * * *"). Vercel cron runs in
// UTC only and can't follow daylight saving, so 06:00 UTC is 08:00 in Belgrade
// during summer time (CEST) and 07:00 in winter (CET). If you change the hour in
// vercel.json, change it here too — the homepage text is computed from this.
export const CRON_UTC_HOUR = 6;

/** Belgrade wall-clock time ("08:00") of today's scheduled run, DST-aware. */
export function cronBelgradeTime(now: Date = new Date()): string {
  const run = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), CRON_UTC_HOUR, 0));
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Belgrade",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(run);
}
