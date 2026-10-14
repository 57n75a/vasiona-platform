import { getDict, type Lang } from "@/lib/i18n";
import { LOGO_SRC } from "@/app/components/logo";

export default function NavBar({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const otherLang = lang === "sr" ? "en" : "sr";
  const qs = `?lang=${lang}`;
  const qsOther = `?lang=${otherLang}`;

  const links = [
    { href: `/${qs}#about`, label: t.navAbout },
    { href: `/petition${qs}`, label: t.navPetition },
    { href: `/crowdfund${qs}`, label: t.navCrowdfund },
    { href: `/analytics${qs}`, label: t.navAnalytics },
    { href: `/${qs}#contact`, label: t.navContact },
  ];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href={`/${qs}`} className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_SRC} alt="" />
          <span className="brand-text">
            {t.navBrandText}
            <span className="brand-dot">.</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Main">
          {links.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
          <a href={qsOther} className="lang-toggle">{t.langToggle}</a>
        </nav>

        <details className="mobile-nav">
          <summary aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </summary>
          <div className="mobile-nav-panel">
            {links.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
            <a href={qsOther} className="lang-toggle">{t.langToggle}</a>
          </div>
        </details>
      </div>
    </header>
  );
}
