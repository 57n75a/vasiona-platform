import { getDict } from "@/lib/i18n";
import { getLedgerData } from "@/lib/ledgerService";
import { getOverheadEvents } from "@/lib/overheadService";
import { classifyOperator } from "@/lib/operatorLookup";
import { buildSerbiaMapSvg } from "@/lib/serbiaMapSvg";

export const dynamic = "force-dynamic";

const LOGO_SVG = `
<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <circle cx="300" cy="300" r="290" fill="#152252"/>
  <ellipse cx="300" cy="300" rx="260" ry="100" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="4"/>
  <circle cx="300" cy="300" r="150" fill="#0d2b52" stroke="#0a1a33" stroke-width="6"/>
  <path d="M 300 300 L 300 150 A 150 150 0 0 1 388 175 Z" fill="#c6363c"/>
  <path d="M 300 150 L 300 30 M 344 162 L 372 55" stroke="#ffffff" stroke-width="4" stroke-dasharray="8 10" stroke-linecap="round" opacity="0.85"/>
  <circle cx="300" cy="30" r="7" fill="#ffffff"/>
  <circle cx="372" cy="55" r="6" fill="#ffffff"/>
</svg>`.trim();

export default async function Home({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const lang = searchParams?.lang === "sr" ? "sr" : "en";
  const t = getDict(lang);
  const otherLang = lang === "sr" ? "en" : "sr";

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
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{ width: 40, height: 40, flexShrink: 0 }}
            dangerouslySetInnerHTML={{ __html: LOGO_SVG }}
          />
          <h1 style={{ fontSize: 20, letterSpacing: 1, margin: 0 }}>{t.title}</h1>
        </div>
        <a
          href={`?lang=${otherLang}`}
          style={{
            fontSize: 12,
            color: "var(--muted)",
            border: "1px solid var(--border)",
            borderRadius: 999,
            padding: "4px 12px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {t.langToggle}
        </a>
      </div>
      <p className="muted">{t.subtitle}</p>

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

      <div className="card">
        <div className="muted" style={{ marginBottom: 8, textTransform: "uppercase", fontSize: 12, letterSpacing: 1 }}>
          {t.aboutTitle}
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{t.aboutText}</p>
      </div>

      <div className="card">
        <div className="muted" style={{ marginBottom: 8 }}>{t.mapTitle}</div>
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
                  ? { country: e.operator_country, operator: e.operator_name, color: "" }
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
    </main>
  );
}
