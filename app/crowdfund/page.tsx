import { getDict } from "@/lib/i18n";
import { ensureCrowdfundSchema, getInterestSummary } from "@/lib/crowdfundService";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import CrowdfundInterestForm from "@/app/components/CrowdfundInterestForm";
import { LOGO_SRC } from "@/app/components/logo";
import { CONTACT_EMAIL, SUPPORT_KIT_PATH, SUPPORT_KIT_SIZE_MB } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function CrowdfundPage({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const lang = searchParams?.lang === "en" ? "en" : "sr";
  const t = getDict(lang);

  await ensureCrowdfundSchema();
  const summary = await getInterestSummary();

  return (
    <>
      <NavBar lang={lang} />

      <main style={{ maxWidth: 780, margin: "0 auto", padding: "0 20px 20px" }}>
        <div className="card" style={{ textAlign: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_SRC} alt="VASIONA" style={{ width: 140, margin: "0 auto 12px", borderRadius: "50%" }} />
          <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>{t.cfTitle}</h1>
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>{t.cfSubtitle}</p>
        </div>

        <div className="banner" style={{ margin: "16px 0" }}>{t.cfDisclaimer}</div>

        <div className="card">
          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)" }}>
            {t.cfPurposeTitle}
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>{t.cfPurposeText}</p>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)" }}>
            {t.cfCostTitle}
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{t.cfCostText}</p>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)" }}>
            {t.cfTiersTitle}
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead><tr><th>Tier</th><th>Amount</th><th>Reward</th></tr></thead>
              <tbody>
                {t.cfTiers.map((row, i) => (
                  <tr key={i}>
                    <td>{row.tier}</td>
                    <td>{row.amount}</td>
                    <td>{row.reward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ background: "linear-gradient(135deg, rgba(242,169,60,0.10), rgba(198,54,60,0.08))" }}>
          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)" }}>
            {t.cfSponsorsTitle}
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>{t.cfSponsorsText}</p>
          <ul style={{ paddingLeft: 20, margin: "0 0 12px" }}>
            {t.cfSponsorsBullets.map((item, i) => (
              <li key={i} style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>{item}</li>
            ))}
          </ul>
          <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.6, marginBottom: 14 }}>{t.cfSponsorsNote}</p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Major%20Sponsor%20Inquiry`}
            style={{
              display: "inline-block",
              background: "var(--accent)",
              color: "#fff",
              borderRadius: 999,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {t.cfSponsorsCta}
          </a>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)" }}>
            {t.cfTimelineTitle}
          </h2>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            {t.cfTimeline.map((step, i) => (
              <li key={i} style={{ fontSize: 14, lineHeight: 1.7 }}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)" }}>
            {t.cfFormTitle}
          </h2>
          <CrowdfundInterestForm lang={lang} initialCount={summary.count} initialTotal={summary.indicativeTotalUsd} />
        </div>

        {/* Supporter kit — deliberately the last block on the page */}
        <div
          className="card"
          id="kit"
          style={{ background: "linear-gradient(135deg, rgba(58,160,255,0.10), rgba(198,54,60,0.08))" }}
        >
          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)" }}>
            {t.kitTitle}
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>{t.kitIntro}</p>
          <ul style={{ paddingLeft: 20, margin: "0 0 14px" }}>
            {t.kitContents.map((item, i) => (
              <li key={i} style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 4 }}>{item}</li>
            ))}
          </ul>
          <a
            href={SUPPORT_KIT_PATH}
            download
            style={{
              display: "inline-block",
              background: "var(--accent)",
              color: "#fff",
              borderRadius: 999,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            ⬇ {t.kitButton}
            {SUPPORT_KIT_SIZE_MB > 0 ? ` · ~${SUPPORT_KIT_SIZE_MB} MB` : ""}
          </a>
          <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.6, margin: "14px 0 0" }}>{t.kitNote}</p>
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}
