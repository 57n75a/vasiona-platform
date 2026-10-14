import { getDict } from "@/lib/i18n";
import {
  computeHistoricalLedger,
  computeCompanyHistoricalLedger,
  COMPANY_SATELLITES_BY_YEAR,
} from "@/lib/historicalModel";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import { LOGO_SRC } from "@/app/components/logo";
import { getLedgerData } from "@/lib/ledgerService";
import { CumulativeTotalChart, SatellitesChart } from "@/app/components/GrowthCharts";

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
  const lang = searchParams?.lang === "en" ? "en" : "sr";
  const t = getDict(lang);
  const ledger = await getLedgerData(lang);

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

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 20px" }}>
        <div className="hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_SRC} alt="VASIONA" style={{ width: 84, margin: "0 auto 18px", borderRadius: "50%" }} />
          <span className="eyebrow">{t.navAnalytics}</span>
          <h1 className="hero-title">{t.analyticsTitle}</h1>
          <p className="hero-sub">{t.analyticsSubtitle}</p>
        </div>

        <div className="banner" style={{ margin: "16px 0" }}>{t.analyticsDisclaimer}</div>

        <div className="card stat-card">
          <div className="label">{t.totalLabel}</div>
          <div className="num-big" style={{ fontSize: "clamp(34px, 5vw, 52px)", margin: "4px 0 6px" }}>
            ${Math.round(ledger.grandTotalUsd).toLocaleString()}
          </div>
          <div className="muted">
            {t.modeledPrefix} $
            {Math.round(ledger.modeledEstimate.totalUsd).toLocaleString()} · {t.realPrefix}{" "}
            {ledger.realLogged.events} ($
            {Math.round(ledger.realLogged.totalUsd).toLocaleString()})
          </div>

          <div style={{ marginTop: 22, borderTop: "1px solid var(--border)", paddingTop: 18 }}>
            <div className="label" style={{ color: "var(--muted)" }}>
              {t.chartCumTitle}
            </div>
            <CumulativeTotalChart
              years={ledger.modeledEstimate.years}
              lang={lang}
              labels={{ annual: t.chartCumLegendAnnual, cumulative: t.chartCumLegendCum }}
              partialLast={
                ledger.modeledEstimate.years.length > 0 &&
                ledger.modeledEstimate.years[ledger.modeledEstimate.years.length - 1].year >= new Date().getUTCFullYear()
              }
            />
            <div className="muted" style={{ fontSize: 11.5, marginTop: 6 }}>* {t.chartCumNote}</div>
          </div>
        </div>

        <div className="card">
          <div className="label">{t.yearlyBreakdown}</div>
          <div className="muted" style={{ marginBottom: 8, fontSize: 11.5, letterSpacing: 0.5 }}>{t.chartSatsTitle}</div>
          <SatellitesChart
            years={ledger.modeledEstimate.years}
            lang={lang}
            labels={{ growth: t.chartSatsGrowth, cagr: t.chartSatsCagr, yoy: t.chartYoY }}
          />
          <div className="muted" style={{ fontSize: 11.5, margin: "4px 0 14px" }}>{t.chartSatsNote}</div>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr><th>{t.colYear}</th><th>{t.colSats}</th><th>{t.colRevenue}</th></tr>
              </thead>
              <tbody>
                {ledger.modeledEstimate.years.map((y: any) => (
                  <tr key={y.year}>
                    <td>{y.year}</td>
                    <td>{y.activeSatellites.toLocaleString()}</td>
                    <td>${Math.round(y.annualRevenueUsd).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        <div className="card">
          <h2 className="label" style={{ margin: "0 0 10px" }}>
            {t.analyticsByCountryTitle}
          </h2>
          <p className="muted" style={{ fontSize: 12.5, marginBottom: 14 }}>{t.analyticsByCountryNote}</p>
          {countryResults.map((c) => (
            <div key={c.name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span>{c.name}</span>
                <span style={{ fontWeight: 700 }}>{fmt(c.totalUsd)}</span>
              </div>
              <div style={{ background: "var(--track)", borderRadius: 5, height: 8, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${(c.totalUsd / maxCountry) * 100}%`,
                    height: "100%",
                    background: c.name === "Serbia" ? "var(--accent)" : "var(--accent2)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="label" style={{ margin: "0 0 10px" }}>
            {t.analyticsByCompanyTitle}
          </h2>
          <p className="muted" style={{ fontSize: 12.5, marginBottom: 14 }}>{t.analyticsByCompanyNote}</p>
          {companyResults.map((c) => (
            <div key={c.name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span>{c.name}</span>
                <span style={{ fontWeight: 700 }}>{fmt(c.totalUsd)}</span>
              </div>
              <div style={{ background: "var(--track)", borderRadius: 5, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${(c.totalUsd / maxCompany) * 100}%`, height: "100%", background: "var(--gold)" }} />
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
