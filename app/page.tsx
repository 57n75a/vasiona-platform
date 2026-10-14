import { getDict } from "@/lib/i18n";
import { getOverheadEvents } from "@/lib/overheadService";
import { classifyOperator, classifyObjectType } from "@/lib/operatorLookup";
import { LOGO_SRC } from "@/app/components/logo";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import ContactForm from "@/app/components/ContactForm";
import SerbiaMap, { type MapDot } from "@/app/components/SerbiaMap";
import { getCronStatus } from "@/lib/cronStatusService";
import { cronBelgradeTime } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const lang = searchParams?.lang === "en" ? "en" : "sr";
  const t = getDict(lang);
  const qs = `?lang=${lang}`;

  const [overhead, cronStatus] = await Promise.all([
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

      <section className="home-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="home-hero-image" src="/images/earth.webp" alt="" fetchPriority="high" />
        <div className="home-hero-shade" />
        <div className="home-hero-content">
          <p className="eyebrow">
            <span className="mini-line" />
            {t.navBrandText}
          </p>
          <h1 className="home-hero-title">{t.subtitle}</h1>
          <div className="home-hero-buttons">
            <a className="button primary" href={`/crowdfund${qs}`}>{t.navCrowdfund}</a>
            <a className="text-link" href="#map">{t.mapTitle} ↓</a>
          </div>
        </div>
        <div className="hero-coordinate" aria-hidden="true">
          <span>44°48′ N / 20°28′ E</span>
          <span>{lang === "sr" ? "СРБИЈА" : "SERBIA"}</span>
        </div>
      </section>

      <main className="page-main">
        <section className="card about-card" id="about">
          <div className="label">{t.navAbout}</div>
          <h2 className="about-title">{t.satAboutTitle}</h2>
          <p>{t.satAboutP1}</p>
          <p>{t.satAboutP2}</p>
          <p>{t.satAboutP3}</p>
          <a className="button primary" href={`/crowdfund${qs}`} style={{ marginTop: 8 }}>{t.aboutCta}</a>
        </section>

        <div className="card map-card" id="map">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <div>
              <div className="label">{t.mapTitle}</div>
              <div className="muted" style={{ fontSize: 12 }}>
                <span className="status-dot" />
                {t.lastUpdated}:{" "}
                {cronStatus.lastRunAt
                  ? new Date(cronStatus.lastRunAt).toISOString().replace("T", " ").slice(0, 19) + " UTC"
                  : t.lastUpdatedNever}
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                {t.updateSchedule.replace("{time}", cronBelgradeTime())}
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_SRC}
              alt="VASIONA"
              style={{ width: "22%", minWidth: 84, maxWidth: 120, flexShrink: 0, borderRadius: "50%" }}
            />
          </div>
          <div className="map-meta">
            <span>{lang === "sr" ? "СРБИЈА" : "SERBIA"}</span>
            <span>18°–24° E / 41°–47° N</span>
          </div>
          <SerbiaMap events={mapDots} lang={lang} />
          <p className="muted" style={{ textAlign: "center", marginTop: 8 }}>{t.mapCaption}</p>
        </div>

        <div className="card">
          <div className="label">{t.recentEvents}</div>
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
          <div className="label">
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
