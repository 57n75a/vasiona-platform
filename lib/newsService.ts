export interface NewsEntry {
  title: string;
  body: string;
  date: string;
  url: string;
  author: string;
}

/**
 * Uses the project's own GitHub commit history as "news" — each commit
 * becomes an entry (first line of the commit message as the title, the rest
 * as body). Simple, always in sync with what actually shipped, no separate
 * CMS to maintain.
 *
 * Set GITHUB_REPO in your environment to "owner/repo" (see .env.example).
 * Falls back to a documented default if unset. Unauthenticated GitHub API
 * calls are rate-limited to 60/hour per IP — fine for a page that isn't
 * hit constantly, and Next.js's fetch cache (revalidate below) keeps actual
 * outbound calls to roughly once an hour regardless of visitor traffic.
 */
export async function fetchGithubNews(limit = 20): Promise<{ entries: NewsEntry[]; error: string | null }> {
  const repo = process.env.GITHUB_REPO || "57n75a/vasiona-platform";
  const url = `https://api.github.com/repos/${repo}/commits?per_page=${limit}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 }, // cache for 1 hour — see note above
    });

    if (res.status === 404) {
      return { entries: [], error: `Repo "${repo}" not found or not public. Set GITHUB_REPO in your environment.` };
    }
    if (res.status === 403) {
      return { entries: [], error: "GitHub API rate limit hit — try again shortly." };
    }
    if (!res.ok) {
      return { entries: [], error: `GitHub API error: ${res.status}` };
    }

    const commits = await res.json();
    const entries: NewsEntry[] = commits.map((c: any) => {
      const fullMessage: string = c.commit?.message || "";
      const [title, ...rest] = fullMessage.split("\n");
      return {
        title: title || "(no message)",
        body: rest.join("\n").trim(),
        date: c.commit?.author?.date || c.commit?.committer?.date || "",
        url: c.html_url,
        author: c.commit?.author?.name || c.author?.login || "unknown",
      };
    });

    return { entries, error: null };
  } catch (err: any) {
    return { entries: [], error: `Fetch failed: ${String(err?.message ?? err)}` };
  }
}
