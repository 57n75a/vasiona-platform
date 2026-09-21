import { getDict } from "@/lib/i18n";
import {
  computeHistoricalLedger,
  computeCompanyHistoricalLedger,
  COMPANY_SATELLITES_BY_YEAR,
} from "@/lib/historicalModel";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import { LOGO_SRC } from "@/app/components/logo";

export const dynamic = "force-dynamic";

const FEE_PER_PASS_USD = 25;
const COUNTRIES = [
  { name: "Serbia", lonSpanDeg: 4.19 },
  { name: "Germany", lonSpanDeg: 9 },
  { name: "United States", lonSpanDeg: 96 },
  { name: "Russia", lonSpanDeg: 171 },
];

function fmt(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const lang = searchParams?.lang === "sr" ? "sr" : "en";
  const t = getDict(lang);

  const countryResults = COUNTRIES.map((c) => {
    const { totalUsd } = computeHistoricalLedger({ countryLonSpanDeg: c.lonSpanDeg, feePerPassUsd: FEE_PER_PASS_USD });
    return { name: c.name, totalUsd };
  }).sort((a, b) => b.totalUsd - a.totalUsd);

  const companyResults = Object.keys(COMPANY_SATELLITES_BY_YEAR)
    .map((company) => {
      const { totalUsd } = computeCompanyHistoricalLedger({
        company,
        countryLonSpanDeg: 4.19,
        feePerPassUsd: FEE_PER_PASS_USD,
      });
      return { name: company, totalUsd };
    })
    .sort((a, b) => b.totalUsd - a.totalUsd);

  const maxCountry = countryResults[0]?.totalUsd || 1;
  const maxCompany = companyResults[0]?.totalUsd || 1;
  const companyGrandTotal = companyResults.reduce((sum, c) => sum + c.totalUsd, 0);

  return (
    <>
      <NavBar lang={lang} />

      <main style={{ maxWidth: 780, margin: "0 auto", padding: "0 20px 20px" }}>
        <div className="card" style={{ textAlign: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_SRC} alt="VASIONA" style={{ width: 140, margin: "0 auto 12px", borderRadius: "50%" }} />
          <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>{t.analyticsTitle}</h1>
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>{t.analyticsSubtitle}</p>
        </div>

        <div className="banner" style={{ margin: "16px 0" }}>{t.analyticsDisclaimer}</div>

        <div className="card">
          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)" }}>
            {t.analyticsByCountryTitle}
          </h2>
          <p className="muted" style={{ fontSize: 12.5, marginBottom: 14 }}>{t.analyticsByCountryNote}</p>
          {countryResults.map((c) => (
            <div key={c.name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span>{c.name}</span>
                <span style={{ fontWeight: 700 }}>{fmt(c.totalUsd)}</span>
              </div>
              <div style={{ background: "var(--track, #1e2a63)", borderRadius: 5, height: 8, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${(c.totalUsd / maxCountry) * 100}%`,
                    height: "100%",
                    background: c.name === "Serbia" ? "var(--accent)" : "var(--accent2, #3aa0ff)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)" }}>
            {t.analyticsByCompanyTitle}
          </h2>
          <p className="muted" style={{ fontSize: 12.5, marginBottom: 14 }}>{t.analyticsByCompanyNote}</p>
          {companyResults.map((c) => (
            <div key={c.name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span>{c.name}</span>
                <span style={{ fontWeight: 700 }}>{fmt(c.totalUsd)}</span>
              </div>
              <div style={{ background: "var(--track, #1e2a63)", borderRadius: 5, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${(c.totalUsd / maxCompany) * 100}%`, height: "100%", background: "#f2a93c" }} />
              </div>
            </div>
          ))}
          <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
            {t.analyticsCompanyCombined}: <strong>{fmt(companyGrandTotal)}</strong>
          </div>
        </div>

        <div className="card">
          <p className="muted" style={{ fontSize: 12, lineHeight: 1.6, margin: 0 }}>
            {t.analyticsMethodNote}
          </p>
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}
