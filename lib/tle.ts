export interface TleRecord {
  noradId: number;
  name: string;
  line1: string;
  line2: string;
}

/**
 * Pulls a live TLE catalog from CelesTrak (free, public, no API key).
 * Docs: https://celestrak.org/NORAD/documentation/gp-data-formats.php
 *
 * NOTE: this only works server-side (API routes / cron). It will NOT work
 * from a browser-published static page — CelesTrak isn't on the allowed
 * script/style host list for that sandbox, which is exactly why the earlier
 * artifact demo used a baked-in snapshot TLE instead of a live fetch.
 */
export async function fetchTleText(group = "active", signal?: AbortSignal): Promise<string> {
  const url = `https://celestrak.org/NORAD/elements/gp.php?GROUP=${encodeURIComponent(
    group
  )}&FORMAT=tle`;

  let res: Response;
  try {
    res = await fetch(url, {
      // Cron runs are infrequent; no need to cache aggressively at the fetch layer.
      cache: "no-store",
      signal,
    });
  } catch (err) {
    // A hung/slow CelesTrak response should fail fast and clearly (the caller
    // sets a timeout on `signal`) rather than silently eating the cron job's
    // whole time budget — see lib/cronRunner.ts.
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("CelesTrak fetch timed out");
    }
    throw err;
  }

  if (!res.ok) {
    // CelesTrak answers 403 (with a plain-text explanation) when the same group
    // is downloaded again before its 2-hourly refresh, or when an IP is blocked
    // for over-fetching. Surface that text instead of just "403 Forbidden".
    let detail = "";
    try {
      detail = (await res.text()).replace(/\s+/g, " ").trim().slice(0, 160);
    } catch {
      // body unreadable — status line alone is fine
    }
    throw new Error(`CelesTrak fetch failed: ${res.status} ${res.statusText}${detail ? ` — ${detail}` : ""}`);
  }

  return res.text();
}

export async function fetchTleGroup(group = "active", signal?: AbortSignal): Promise<TleRecord[]> {
  return parseTleText(await fetchTleText(group, signal));
}

export function parseTleText(text: string): TleRecord[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const records: TleRecord[] = [];

  for (let i = 0; i + 2 < lines.length + 1; i += 3) {
    const name = lines[i]?.trim();
    const line1 = lines[i + 1];
    const line2 = lines[i + 2];
    if (!name || !line1 || !line2) continue;
    if (!line1.startsWith("1 ") || !line2.startsWith("2 ")) continue;

    const noradId = parseInt(line1.substring(2, 7).trim(), 10);
    if (Number.isNaN(noradId)) continue;

    records.push({ noradId, name, line1, line2 });
  }

  return records;
}
