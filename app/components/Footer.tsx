import { getDict, type Lang } from "@/lib/i18n";
import { LOGO_SRC } from "@/app/components/logo";
import { CONTACT_EMAIL, SITE_DOMAIN, SITE_URL } from "@/lib/site";

const SOCIAL_LINKS = [
  { name: "X", url: "https://x.com/serbvasiona", icon: "𝕏" },
  { name: "Instagram", url: "https://www.instagram.com/serbvasiona", icon: "📷" },
  { name: "YouTube", url: "https://www.youtube.com/@SerbVasiona", icon: "▶" },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/vasiona-serbia/", icon: "in" },
  { name: "TikTok", url: "https://www.tiktok.com/@serbvasiona", icon: "♪" },
];

export default function Footer({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const qs = `?lang=${lang}`;

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_SRC} alt="VASIONA" />
          <div>
            <div className="footer-brand-name">
              VASIONA<span className="brand-dot">.</span>
            </div>
            <div className="footer-tagline">{t.footerTagline}</div>
          </div>
        </div>

        <div>
          <h4 className="footer-heading">VASIONA</h4>
          <div className="footer-links">
            <a href={`/${qs}#about`}>{t.navAbout}</a>
            <a href={`/crowdfund${qs}`}>{t.navCrowdfund}</a>
            <a href={`/${qs}#contact`}>{t.navContact}</a>
          </div>
        </div>

        <div>
          <h4 className="footer-heading">{t.footerContact}</h4>
          <div className="footer-links">
            <a href={SITE_URL}>{SITE_DOMAIN}</a>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </div>
          <div className="footer-socials">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name} title={s.name}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <div>© Copyright VASIONA 2020 · {SITE_DOMAIN} · v0.7.1</div>
        <div style={{ marginTop: 4 }}>{t.footerRights}</div>
      </div>
    </footer>
  );
}
