export type Lang = "en" | "sr";

export const dict = {
  en: {
    title: "🛰️ VASIONA — Overflight Monitor",
    subtitle: "Live cron-fed satellite tracking over Serbia, plus a hypothetical toll-fee ledger.",
    banner:
      "⚠️ The dollar figures below are a hypothetical scenario model — there is no current legal basis for collecting satellite overflight fees (Outer Space Treaty, Art. II). See docs/BUSINESS_PLAN.md for the real vs. hypothetical split.",
    totalLabel: "HYPOTHETICAL TOTAL, 2020 → NOW",
    modeledPrefix: "Modeled estimate (2020 → deployment):",
    realPrefix: "Real logged passes since deployment:",
    yearlyBreakdown: "MODELED YEARLY BREAKDOWN",
    colYear: "Year",
    colSats: "Active satellites (est.)",
    colRevenue: "Modeled annual revenue",
    recentEvents: "RECENT REAL OVERFLIGHT EVENTS (from the cron job)",
    colTime: "Time (UTC)",
    colSat: "Satellite",
    colLat: "Lat",
    colLon: "Lon",
    noEvents:
      "No events logged yet — the cron job hasn't run, or nothing has crossed Serbia since it last ran. Trigger it manually while testing: GET /api/cron/fetch-tles.",
    langToggle: "Српски",
  },
  sr: {
    title: "🛰️ ВАСИОНА — Монитор прелета",
    subtitle: "Праћење сателита изнад Србије уживо, путем cron задатка, уз хипотетички обрачун накнада.",
    banner:
      "⚠️ Износи у доларима приказани испод представљају хипотетички сценарио — тренутно не постоји правни основ за наплату накнада за прелет сателита (Уговор о космосу, члан II). Погледати docs/BUSINESS_PLAN.md за јасну поделу стварног и хипотетичког дела.",
    totalLabel: "ХИПОТЕТИЧКИ УКУПНО, 2020 → САДА",
    modeledPrefix: "Моделована процена (2020 → покретање платформе):",
    realPrefix: "Стварно забележени прелети од покретања платформе:",
    yearlyBreakdown: "МОДЕЛОВАН ПРЕГЛЕД ПО ГОДИНАМА",
    colYear: "Година",
    colSats: "Активни сателити (процена)",
    colRevenue: "Моделован годишњи приход",
    recentEvents: "СКОРАШЊИ СТВАРНИ ПРЕЛЕТИ (из cron задатка)",
    colTime: "Време (UTC)",
    colSat: "Сателит",
    colLat: "Гео. ширина",
    colLon: "Гео. дужина",
    noEvents:
      "Још нема забележених догађаја — cron задатак се још није извршио, или ништа није прешло преко Србије од последњег извршавања. Покрените ручно ради тестирања: GET /api/cron/fetch-tles.",
    langToggle: "English",
  },
} as const;

export function getDict(lang: string | undefined) {
  return lang === "sr" ? dict.sr : dict.en;
}
