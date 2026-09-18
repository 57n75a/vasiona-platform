import { getDict } from "@/lib/i18n";
import { getLedgerData } from "@/lib/ledgerService";
import { getOverheadEvents } from "@/lib/overheadService";

export const dynamic = "force-dynamic";

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

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 20, letterSpacing: 1 }}>{t.title}</h1>
        <a
          href={`?lang=${otherLang}`}
          style={{
            fontSize: 12,
            color: "var(--muted)",
            border: "1px solid var(--border)",
            borderRadius: 999,
            padding: "4px 12px",
            textDecoration: "none",
          }}
        >
          {t.langToggle}
        </a>
      </div>
      <p className="muted">{t.subtitle}</p>

      <div className="banner" style={{ margin: "16px 0" }}>
        {t.banner}
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
        {overhead.events?.length ? (
          <table>
            <thead><tr><th>{t.colTime}</th><th>{t.colSat}</th><th>{t.colLat}</th><th>{t.colLon}</th></tr></thead>
            <tbody>
              {overhead.events.slice(0, 20).map((e: any, i: number) => (
                <tr key={i}>
                  <td>{new Date(e.observed_at).toISOString()}</td>
                  <td>{e.name}</td>
                  <td>{Number(e.lat).toFixed(2)}°</td>
                  <td>{Number(e.lon).toFixed(2)}°</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">{t.noEvents}</p>
        )}
      </div>
    </main>
  );
}
