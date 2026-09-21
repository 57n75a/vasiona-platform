import { getDict, type Lang } from "@/lib/i18n";
import { LOGO_SRC } from "@/app/components/logo";

const SOCIAL_LINKS = [
  { name: "X", url: "https://x.com/serbvasiona", icon: "𝕏" },
  { name: "Instagram", url: "https://www.instagram.com/serbvasiona", icon: "📷" },
  { name: "YouTube", url: "https://www.youtube.com/@SerbVasiona", icon: "▶" },
];

export default function Footer({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const qs = `?lang=${lang}`;

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        marginTop: 40,
        padding: "28px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center", maxWidth: 380 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_SRC} alt="VASIONA" style={{ width: 40, height: 40, flexShrink: 0, borderRadius: "50%" }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>VASIONA</div>
            <div className="muted" style={{ fontSize: 12 }}>{t.footerTagline}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
              {t.navHome}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
              <a href={`/${qs}#about`} style={{ color: "var(--text)" }}>{t.navAbout}</a>
              <a href={`/petition${qs}`} style={{ color: "var(--text)" }}>{t.navPetition}</a>
              <a href={`/crowdfund${qs}`} style={{ color: "var(--text)" }}>{t.navCrowdfund}</a>
              <a href={`/analytics${qs}`} style={{ color: "var(--text)" }}>{t.navAnalytics}</a>
            </div>
          </div>
          <div>
            <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
              {t.footerContact}
            </div>
            <div style={{ fontSize: 13, marginBottom: 10 }}>
              <a href="mailto:serbvasiona@gmail.com" style={{ color: "var(--text)" }}>serbvasiona@gmail.com</a>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  title={s.name}
                  style={{
                    color: "var(--text)",
                    fontSize: 16,
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    border: "1px solid var(--border)",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="muted" style={{ maxWidth: 900, margin: "18px auto 0", fontSize: 11.5, lineHeight: 1.5 }}>
        <div>© Copyright VASIONA 2020 · v3.0</div>
        <div style={{ marginTop: 4 }}>{t.footerRights}</div>
      </div>
    </footer>
  );
}
