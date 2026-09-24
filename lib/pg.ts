import { sql as vercelSql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";

/**
 * Drop-in replacement for `sql` from "@vercel/postgres" that opts every query
 * out of Next.js's Data Cache.
 *
 * Why: @vercel/postgres sends queries over fetch(), and Next.js 14 patches
 * fetch() and can cache identical requests indefinitely — even inside a
 * `force-dynamic` page. Symptom seen on vasiona.org: the cron wrote fresh rows
 * (a route that ran brand-new queries saw them), while the homepage kept
 * re-serving an old result for its repeated, identical SELECTs (old
 * "last updated" time, old flyovers). noStore() marks the current request as
 * uncacheable so every query hits the database. It's a no-op outside a Next
 * request (e.g. in scripts).
 */
export const sql = ((...args: Parameters<typeof vercelSql>) => {
  noStore();
  return vercelSql(...args);
}) as unknown as typeof vercelSql;
