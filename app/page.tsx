import { getDict } from "@/lib/i18n";
import { getLedgerData } from "@/lib/ledgerService";
import { getOverheadEvents } from "@/lib/overheadService";
import { classifyOperator, classifyObjectType } from "@/lib/operatorLookup";
import { LOGO_SRC } from "@/app/components/logo";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import ContactForm from "@/app/components/ContactForm";
import SerbiaMap, { type MapDot } from "@/app/components/SerbiaMap";
import { CumulativeTotalChart, SatellitesChart } from "@/app/components/GrowthCharts";
import { getCronStatus } from "@/lib/cronStatusService";
import { cronBelgradeTime } from "@/lib/site";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const lang = searchParams?.lang === "en" ? "en" : "sr";
  const t = getDict(lang);
  const qs = `?lang=${lang}`;

  const [ledger, overhead, cronStatus] = await Promise.all([
    getLedgerData(lang),
    getOverheadEvents(100),
    getCronStatus(),
  ]);

  const events = overhead.events ?? [];

  const mapDots: MapDot[] = events.slice(0, 50).map((e: any) => {
    const opInfo = e.operator_country
      ? { country: e.operator_country, operator: e.operator_name }
      : classifyOperator(e.name);
    const color = classifyOperator(e.name).color; // always derive color from the fixed country palette
    const typeInfo = e.object_type
      ? { type: e.object_type, shape: e.object_type === "Space Station" ? "diamond" : e.object_type === "Navigation (GNSS)" ? "square" : "circle" }
      : classifyObjectType(e.name, Number(e.alt_km ?? null));
    return {
      lat: Number(e.lat),
      lon: Number(e.lon),
      name: e.name,
      operator: opInfo.operator,
      country: opInfo.country,
      objectType: typeInfo.type,
      shape: typeInfo.shape as MapDot["shape"],
      color,
    };
  });

  return (
    <>
      <NavBar lang={lang} />

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 20px" }}>
        <p className="muted" style={{ textAlign: "center" }}>{t.subtitle}</p>

        <div
          className="card"
          style={{
            margin: "16px 0",
            fontSize: 15,
            fontWeight: 600,
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(198,54,60,0.12), rgba(58,160,255,0.10))",
          }}
        >
          <div>{t.punchline2}</div>
        </div>

        <div className="card" id="about">
          <div className="muted" style={{ marginBottom: 8, textTransform: "uppercase", fontSize: 12, letterSpacing: 1 }}>
            {t.aboutTitle}
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{t.aboutText}</p>
          <p style={{ fontSize: 14, lineHeight: 1.6, margin: "12px 0 0" }}>
            {t.aboutText2}{" "}
            <a href={`/crowdfund${qs}`} style={{ color: "var(--accent)", fontWeight: 600, whiteSpace: "nowrap" }}>
              {t.aboutCta}
            </a>
          </p>
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <div className="muted" style={{ marginBottom: 4 }}>{t.mapTitle}</div>
              <div className="muted" style={{ fontSize: 11 }}>
                {t.lastUpdated}:{" "}
                {cronStatus.lastRunAt
                  ? new Date(cronStatus.lastRunAt).toISOString().replace("T", " ").slice(0, 19) + " UTC"
                  : t.lastUpdatedNever}
              </div>
              <div className="muted" style={{ fontSize: 11 }}>
                {t.updateSchedule.replace("{time}", cronBelgradeTime())}
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_SRC}
              alt="VASIONA"
              style={{ width: "32%", minWidth: 120, maxWidth: 160, flexShrink: 0, borderRadius: "50%" }}
            />
          </div>
          <SerbiaMap events={mapDots} lang={lang} />
          <p className="muted" style={{ textAlign: "center", marginTop: 8 }}>{t.mapCaption}</p>
        </div>

        <div className="card">
          <div className="muted">{t.totalLabel}</div>
          <div className="num-big">
            ${Math.round(ledger.grandTotalUsd).toLocaleString()}
          </div>
          <div className="muted">
            {t.modeledPrefix} $
            {Math.round(ledger.modeledEstimate.totalUsd).toLocaleString()} · {t.realPrefix}{" "}
            {ledger.realLogged.events} ($
            {Math.round(ledger.realLogged.totalUsd).toLocaleString()})
          </div>

          <div style={{ marginTop: 18, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
            <div className="muted" style={{ marginBottom: 8, textTransform: "uppercase", fontSize: 11.5, letterSpacing: 1 }}>
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
          <div className="muted" style={{ marginBottom: 8 }}>{t.yearlyBreakdown}</div>
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
          <div className="muted" style={{ marginBottom: 8 }}>{t.recentEvents}</div>
          {events.length ? (
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>{t.colTime}</th>
                    <th>{t.colSat}</th>
                    <th>{t.colOperator}</th>
                    <th>{t.colType}</th>
                    <th>{t.colLat}</th>
                    <th>{t.colLon}</th>
                  </tr>
                </thead>
                <tbody>
                  {events.slice(0, 20).map((e: any, i: number) => {
                    const info = e.operator_country
                      ? { country: e.operator_country, operator: e.operator_name }
                      : classifyOperator(e.name);
                    const typeInfo = e.object_type
                      ? { type: e.object_type }
                      : classifyObjectType(e.name, Number(e.alt_km ?? null));
                    return (
                      <tr key={i}>
                        <td>{new Date(e.observed_at).toISOString()}</td>
                        <td>{e.name}</td>
                        <td>{info.operator} ({info.country})</td>
                        <td>{typeInfo.type}</td>
                        <td>{Number(e.lat).toFixed(2)}°</td>
                        <td>{Number(e.lon).toFixed(2)}°</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted">{t.noEvents}</p>
          )}
        </div>

        <div className="card" id="contact">
          <div className="muted" style={{ marginBottom: 4, textTransform: "uppercase", fontSize: 12, letterSpacing: 1 }}>
            {t.contactTitle}
          </div>
          <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>{t.contactSubtitle}</p>
          <ContactForm lang={lang} />
        </div>

        <div className="banner" style={{ margin: "20px 0 0" }}>
          {t.banner}
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}
