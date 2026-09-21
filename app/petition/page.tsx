import { getDict } from "@/lib/i18n";
import { ensurePetitionSchema, getSignatureCount } from "@/lib/petitionService";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import PetitionSignForm from "@/app/components/PetitionSignForm";
import { LOGO_SRC } from "@/app/components/logo";

export const dynamic = "force-dynamic";

export default async function PetitionPage({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const lang = searchParams?.lang === "en" ? "en" : "sr";
  const t = getDict(lang);

  await ensurePetitionSchema();
  const count = await getSignatureCount();

  return (
    <>
      <NavBar lang={lang} />

      <main style={{ maxWidth: 780, margin: "0 auto", padding: "0 20px 20px" }}>
        <div className="card" style={{ textAlign: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_SRC} alt="VASIONA" style={{ width: 140, margin: "0 auto 12px", borderRadius: "50%" }} />
          <h1 style={{ fontSize: 20, lineHeight: 1.4, margin: "0 0 8px" }}>{t.petitionTitle}</h1>
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>{t.petitionTo}</p>
        </div>

        <div className="card" style={{ fontSize: 15, lineHeight: 1.6, fontWeight: 600 }}>
          {t.petitionIntro}
        </div>

        <div className="card">
          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)" }}>
            {t.petitionBackgroundTitle}
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>{t.petitionBackground1}</p>
          <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 0 }}>{t.petitionBackground2}</p>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)" }}>
            {t.petitionWhyTitle}
          </h2>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            {t.petitionWhy.map((item, i) => (
              <li key={i} style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 10 }}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)" }}>
            {t.petitionAskTitle}
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>{t.petitionAskIntro}</p>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            {t.petitionAsk.map((item, i) => (
              <li key={i} style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 10 }}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.6 }}>{t.petitionSignPrompt}</p>
          <PetitionSignForm lang={lang} initialCount={count} />
        </div>

        <div className="card">
          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)" }}>
            {t.petitionFaqTitle}
          </h2>
          {t.petitionFaq.map((item, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{item.q}</div>
              <div className="muted" style={{ fontSize: 13.5, lineHeight: 1.6 }}>{item.a}</div>
            </div>
          ))}
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}
