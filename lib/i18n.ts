export type Lang = "en" | "sr";

export const dict = {
  en: {
    title: "🛰️ VASIONA — Satellite Orbiting",
    subtitle: "Live cron-fed satellite tracking over Serbia, plus a hypothetical toll-fee ledger.",
    banner:
      "⚠️ The dollar figures below are a hypothetical scenario model — there is no current legal basis for collecting satellite overflight fees (Outer Space Treaty, Art. II). See docs/BUSINESS_PLAN.md for the real vs. hypothetical split.",
    punchline:
      "✈️ Nations already charge airlines to fly through their sovereign sky. 🛰️ So why not charge satellites to orbit through the space above it?",
    aboutTitle: "The story behind VASIONA",
    aboutText:
      "It started with a short 2020 concept note asking a simple question: if a country's airspace is worth charging for, why does that logic quietly stop at the edge of the atmosphere? VASIONA — Serbian for \"cosmos\" — is what that question grew into: a real, working satellite tracker built to make the idea concrete rather than rhetorical. The logo pairs Serbia's territory, highlighted in red, with a dashed sovereignty column rising from it into orbit, ringed by satellite nodes — the same vertical claim aviation has made routine for eighty years, just extended a little further up. The tracker below is real. The fee ledger next to it is a thought experiment, clearly labeled as one, showing what that extension could be worth if the world ever decided the sky's limit wasn't the limit.",
    mapTitle: "SERBIA — LIVE OVERFLIGHT MAP",
    mapCaption: "Real border polygon, real logged passes plotted as dots — hover a dot for the satellite name.",
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
    colOperator: "Operator / Country",
    colLat: "Lat",
    colLon: "Lon",
    noEvents:
      "No events logged yet — the cron job hasn't run, or nothing has crossed Serbia since it last ran. Trigger it manually while testing: GET /api/cron/fetch-tles.",
    langToggle: "Српски",
  },
  sr: {
    title: "🛰️ ВАСИОНА — Орбитирање сателита",
    subtitle: "Праћење сателита изнад Србије уживо, путем cron задатка, уз хипотетички обрачун накнада.",
    banner:
      "⚠️ Износи у доларима приказани испод представљају хипотетички сценарио — тренутно не постоји правни основ за наплату накнада за прелет сателита (Уговор о космосу, члан II). Погледати docs/BUSINESS_PLAN.md за јасну поделу стварног и хипотетичког дела.",
    punchline:
      "✈️ Државе већ наплаћују авио-компанијама прелет кроз свој суверени ваздушни простор. 🛰️ Зашто онда не наплатити сателитима орбитирање кроз простор изнад њега?",
    aboutTitle: "Прича иза ВАСИОНЕ",
    aboutText:
      "Све је почело кратком концептуалном белешком из 2020. која поставља једноставно питање: ако се ваздушни простор државе наплаћује, зашто та логика тихо престаје на ивици атмосфере? ВАСИОНА — реч која значи космос/универзум — израсла је из тог питања: стваран, функционалан систем праћења сателита направљен да идеју учини конкретном, а не само реториком. Логотип спаја територију Србије, истакнуту црвеном бојом, са испрекиданом „колоном суверенитета” која се пружа од ње ка орбити, окружену чворовима сателита — иста та вертикална тврдња коју је ваздухопловство учинило уобичајеном последњих осамдесет година, само мало продужена навише. Систем праћења испод је стваран. Табела накнада поред њега је мисаони експеримент, јасно означен као такав, који показује колико би то продужење могло вредети када би свет икада одлучио да небо ипак није граница.",
    mapTitle: "СРБИЈА — КАРТА ПРЕЛЕТА УЖИВО",
    mapCaption: "Стваран полигон границе, стварно забележени прелети приказани као тачке — задржите показивач на тачки за назив сателита.",
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
    colOperator: "Оператор / Држава",
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
