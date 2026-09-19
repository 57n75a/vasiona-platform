import { getDict } from "@/lib/i18n";
import { fetchGithubNews } from "@/lib/newsService";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";

export const dynamic = "force-dynamic";

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const lang = searchParams?.lang === "sr" ? "sr" : "en";
  const t = getDict(lang);

  const { entries, error } = await fetchGithubNews(25);

  return (
    <>
      <NavBar lang={lang} />

      <main style={{ maxWidth: 780, margin: "0 auto", padding: "0 20px 20px" }}>
        <div className="card">
          <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>{t.newsTitle}</h1>
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>{t.newsSubtitle}</p>
        </div>

        {error && (
          <div className="banner" style={{ margin: "16px 0" }}>
            {t.newsError} <code>{error}</code>
          </div>
        )}

        {entries.length === 0 && !error && (
          <p className="muted" style={{ marginTop: 16 }}>{t.newsEmpty}</p>
        )}

        {entries.map((entry, i) => (
          <div className="card" key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>{entry.title}</div>
              <div className="muted" style={{ fontSize: 11.5, whiteSpace: "nowrap" }}>
                {entry.date ? new Date(entry.date).toLocaleDateString(lang === "sr" ? "sr-RS" : "en-US") : ""}
              </div>
            </div>
            {entry.body && (
              <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--muted)", marginTop: 6, whiteSpace: "pre-wrap" }}>
                {entry.body}
              </p>
            )}
            <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", fontSize: 11.5 }} className="muted">
              <span>{entry.author}</span>
              <a href={entry.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent2, #3aa0ff)" }}>
                {t.newsViewCommit}
              </a>
            </div>
          </div>
        ))}
      </main>

      <Footer lang={lang} />
    </>
  );
}
