import { getDict } from "@/lib/i18n";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import { LOGO_SRC } from "@/app/components/logo";

export const dynamic = "force-dynamic";

/** "The story behind VASIONA" — reached from the footer only. */
export default function StoryPage({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const lang = searchParams?.lang === "en" ? "en" : "sr";
  const t = getDict(lang);
  const qs = `?lang=${lang}`;

  return (
    <>
      <NavBar lang={lang} />

      <main style={{ maxWidth: 780, margin: "0 auto", padding: "0 20px 20px" }}>
        <div className="hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_SRC} alt="VASIONA" style={{ width: 84, margin: "0 auto 18px", borderRadius: "50%" }} />
          <span className="eyebrow">{t.aboutTitle}</span>
          <blockquote className="story-quote">
            <p>{t.punchline2}</p>
          </blockquote>
        </div>

        <div className="card">
          <p style={{ fontSize: 15.5, lineHeight: 1.8, margin: 0 }}>{t.aboutText}</p>
          <p style={{ fontSize: 15.5, lineHeight: 1.8, margin: "16px 0 0", color: "#c3cfdb" }}>{t.aboutText2}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px 22px", alignItems: "center", marginTop: 26 }}>
            <a className="button primary" href={`/petition${qs}`}>{t.storyPetitionCta}</a>
            <a className="text-link" href={`/crowdfund${qs}`} style={{ color: "var(--accent)" }}>{t.aboutCta}</a>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}
