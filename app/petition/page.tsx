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
        <div className="hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_SRC} alt="VASIONA" style={{ width: 84, margin: "0 auto 18px", borderRadius: "50%" }} />
          <span className="eyebrow">{lang === "sr" ? "ПЕТИЦИЈА" : "PETITION"}</span>
          <h1 className="hero-title">{t.petitionTitle}</h1>
          <p className="hero-sub">{t.petitionTo}</p>
        </div>

        <div className="card" style={{ fontSize: 15.5, lineHeight: 1.6, fontWeight: 600, textAlign: "center" }}>
          {t.petitionIntro}
        </div>

        <div className="numbered-sections">
          <div className="card section-num">
            <span className="eyebrow">{t.petitionBackgroundTitle}</span>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>{t.petitionBackground1}</p>
            <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 0 }}>{t.petitionBackground2}</p>
          </div>

          <div className="card section-num">
            <span className="eyebrow">{t.petitionWhyTitle}</span>
            <div className="feature-grid">
              {t.petitionWhy.map((item, i) => (
                <div key={i} className="feature-card">
                  <div className="desc">{item}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card section-num">
            <span className="eyebrow">{t.petitionAskTitle}</span>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>{t.petitionAskIntro}</p>
            <ol className="step-list">
              {t.petitionAsk.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          </div>

          <div className="card section-num stat-card" style={{ textAlign: "center" }}>
            <span className="eyebrow">{lang === "sr" ? "ПОТПИШИ" : "SIGN"}</span>
            <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.6 }}>{t.petitionSignPrompt}</p>
            <PetitionSignForm lang={lang} initialCount={count} />
          </div>

          <div className="card section-num">
            <span className="eyebrow">{t.petitionFaqTitle}</span>
            {t.petitionFaq.map((item, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "var(--gold)" }}>{item.q}</div>
                <div className="muted" style={{ fontSize: 13.5, lineHeight: 1.6 }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}
