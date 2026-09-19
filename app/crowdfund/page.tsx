import { getDict } from "@/lib/i18n";
import { ensureCrowdfundSchema, getInterestSummary } from "@/lib/crowdfundService";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import CrowdfundInterestForm from "@/app/components/CrowdfundInterestForm";

export const dynamic = "force-dynamic";

export default async function CrowdfundPage({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const lang = searchParams?.lang === "sr" ? "sr" : "en";
  const t = getDict(lang);

  await ensureCrowdfundSchema();
  const summary = await getInterestSummary();

  return (
    <>
      <NavBar lang={lang} />

      <main style={{ maxWidth: 780, margin: "0 auto", padding: "0 20px 20px" }}>
        <div className="card">
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
      </main>

      <Footer lang={lang} />
    </>
  );
}
