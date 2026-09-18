import { getDict, type Lang } from "@/lib/i18n";
import { LOGO_SVG } from "@/app/components/logo";

export default function NavBar({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const otherLang = lang === "sr" ? "en" : "sr";
  const qs = `?lang=${lang}`;
  const qsOther = `?lang=${otherLang}`;

  const linkStyle: React.CSSProperties = {
    fontSize: 13,
    color: "var(--text)",
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: 999,
    whiteSpace: "nowrap",
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 12,
        zIndex: 20,
        margin: "12px auto 20px",
        maxWidth: 860,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "8px 16px",
        borderRadius: 999,
        border: "1px solid var(--border)",
        background: "rgba(14, 26, 68, 0.72)",
        backdropFilter: "blur(10px)",
      }}
    >
      <a href={`/${qs}`} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{ width: 44, height: 44, flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
        <span style={{ color: "var(--text)", fontWeight: 700, fontSize: 15, letterSpacing: 0.5 }}>VASIONA</span>
      </a>

      <div style={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", justifyContent: "flex-end" }}>
        <a href={`/${qs}#about`} style={linkStyle}>{t.navAbout}</a>
        <a href={`/petition${qs}`} style={linkStyle}>{t.navPetition}</a>
        <a href={`/${qs}#contact`} style={linkStyle}>{t.navContact}</a>
        <a
          href={qsOther}
          style={{
            ...linkStyle,
            border: "1px solid var(--border)",
            marginLeft: 6,
          }}
        >
          {t.langToggle}
        </a>
      </div>
    </nav>
  );
}
