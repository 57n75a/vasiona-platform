import { getDict } from "@/lib/i18n";
import { getLedgerData } from "@/lib/ledgerService";
import { getOverheadEvents } from "@/lib/overheadService";
import { classifyOperator, classifyObjectType } from "@/lib/operatorLookup";
import { LOGO_SVG } from "@/app/components/logo";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import ContactForm from "@/app/components/ContactForm";
import SerbiaMap, { type MapDot } from "@/app/components/SerbiaMap";

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
          <div>{t.punchline}</div>
          <div style={{ marginTop: 8, fontSize: 13, fontWeight: 500, color: "var(--muted)", fontStyle: "italic" }}>
            {t.punchline2}
          </div>
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
        </div>

        <div className="card">
          <div className="muted" style={{ marginBottom: 8 }}>{t.yearlyBreakdown}</div>
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
      </main>

      <Footer lang={lang} />
    </>
  );
}
