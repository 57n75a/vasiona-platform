import { getDict } from "@/lib/i18n";
import { getLedgerData } from "@/lib/ledgerService";
import { getOverheadEvents } from "@/lib/overheadService";
import { classifyOperator } from "@/lib/operatorLookup";
import { buildSerbiaMapSvg } from "@/lib/serbiaMapSvg";
import { LOGO_SVG } from "@/app/components/logo";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import ContactForm from "@/app/components/ContactForm";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const lang = searchParams?.lang === "sr" ? "sr" : "en";
  const t = getDict(lang);

  const [ledger, overhead] = await Promise.all([
    getLedgerData(lang),
    getOverheadEvents(100),
  ]);

  const events = overhead.events ?? [];

  const mapSvg = buildSerbiaMapSvg(
    events.slice(0, 50).map((e: any) => {
      const info = classifyOperator(e.name);
      return {
        lat: Number(e.lat),
        lon: Number(e.lon),
        label: `${e.name} — ${info.operator} (${info.country})`,
        color: info.color,
      };
    })
  );

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
          {t.punchline}
        </div>

        <div className="banner" style={{ margin: "16px 0" }}>
          {t.banner}
        </div>

        <div className="card" id="about">
          <div className="muted" style={{ marginBottom: 8, textTransform: "uppercase", fontSize: 12, letterSpacing: 1 }}>
            {t.aboutTitle}
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{t.aboutText}</p>
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div className="muted" style={{ marginBottom: 8 }}>{t.mapTitle}</div>
            <div style={{ width: 72, height: 72, flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
          </div>
          <div
            style={{ maxWidth: 420, margin: "0 auto" }}
            dangerouslySetInnerHTML={{ __html: mapSvg }}
          />
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
        </div>

        <div className="card">
          <div className="muted" style={{ marginBottom: 8 }}>{t.yearlyBreakdown}</div>
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

        <div className="card">
          <div className="muted" style={{ marginBottom: 8 }}>{t.recentEvents}</div>
          {events.length ? (
            <table>
              <thead>
                <tr>
                  <th>{t.colTime}</th>
                  <th>{t.colSat}</th>
                  <th>{t.colOperator}</th>
                  <th>{t.colLat}</th>
                  <th>{t.colLon}</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 20).map((e: any, i: number) => {
                  const info = e.operator_country
                    ? { country: e.operator_country, operator: e.operator_name }
                    : classifyOperator(e.name);
                  return (
                    <tr key={i}>
                      <td>{new Date(e.observed_at).toISOString()}</td>
                      <td>{e.name}</td>
                      <td>{info.operator} ({info.country})</td>
                      <td>{Number(e.lat).toFixed(2)}°</td>
                      <td>{Number(e.lon).toFixed(2)}°</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
      </main>

      <Footer lang={lang} />
    </>
  );
}
