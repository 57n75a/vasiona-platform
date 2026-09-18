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

    // Nav
    navAbout: "About",
    navPetition: "Petition",
    navContact: "Contact",
    navHome: "Dashboard",

    // Contact form
    contactTitle: "Get in touch",
    contactSubtitle: "Questions, feedback, or interested in this as a policy platform? This opens your email client addressed to serbvasiona@gmail.com.",
    contactName: "Your name",
    contactEmail: "Your email",
    contactMessage: "Message",
    contactSend: "Send email",

    // Footer
    footerTagline: "Guarding the sky above. Charting the space beyond.",
    footerRights: "A concept platform for space-sovereignty policy advocacy — not a government agency.",
    footerContact: "Contact",

    // Petition page
    petitionTitle: "Petition: Amend the Outer Space Treaty to Permit Orbital Overflight Fees",
    petitionTo: "To: The United Nations Office for Outer Space Affairs (UNOOSA) and Member States Party to the Outer Space Treaty",
    petitionIntro:
      "We, the undersigned, petition for an amendment to the 1967 Outer Space Treaty to allow sovereign nations to levy fees on satellites and space objects orbiting through the space above their territory.",
    petitionBackgroundTitle: "Background",
    petitionBackground1:
      "The Outer Space Treaty of 1967 is the foundational legal framework for activity beyond Earth's atmosphere. Under its current terms, space is designated as free for exploration and use by all countries, and no nation may claim sovereignty over any part of outer space, including the orbital paths that pass above its land and waters. This \"non-appropriation\" principle has governed satellite traffic for nearly six decades.",
    petitionBackground2:
      "Just as nations charge for the use of territorial waters, airspace, and ground infrastructure, we believe countries should have the right to charge for the commercial use of orbital paths passing above their sovereign territory. The volume of satellite traffic has grown enormously since 1967, driven by commercial constellations, and the treaty's original framework did not anticipate this scale of use.",
    petitionWhyTitle: "Why We Support This Change",
    petitionWhy: [
      "Fair compensation for use of national space. Nations already regulate and charge for the use of airspace above their territory; extending a similar principle to orbital space is a natural evolution of existing sovereignty norms.",
      "Revenue for developing nations. Many countries with limited space programs of their own nonetheless have satellites from other nations orbiting continuously above them. An overflight fee system could generate revenue for infrastructure, environmental monitoring, or space-debris mitigation programs in those countries.",
      "Incentive for responsible orbital use. A fee structure tied to orbital paths could discourage overcrowding of popular orbits and encourage more efficient satellite design and deorbiting practices.",
      "Modernizing outdated law. The treaty was written for a Cold War-era environment with two spacefaring nations. Today, dozens of countries and private companies operate satellites, and the legal framework should reflect this new reality.",
    ],
    petitionAskTitle: "What We Ask",
    petitionAskIntro: "We call on UNOOSA and treaty member states to open formal negotiations toward an amendment or supplementary protocol that would:",
    petitionAsk: [
      "Establish a legal mechanism allowing states to levy fees on satellites operating in orbital paths above their territory",
      "Define clear, internationally agreed methods for calculating \"territory\" in the context of orbital mechanics (given that orbital paths shift relative to the rotating Earth)",
      "Ensure any such fees do not obstruct scientific research, humanitarian use, or emergency communications",
      "Create a dispute resolution process for disagreements over fee assessments",
    ],
    petitionSignPrompt: "Sign this petition if you believe space law should evolve to reflect the realities of a crowded, commercially active orbital environment.",
    petitionFaqTitle: "Frequently Asked Questions",
    petitionFaq: [
      {
        q: "Doesn't this conflict with the Outer Space Treaty itself?",
        a: "Yes — directly. Article II of the current treaty states that outer space, including orbits, \"is not subject to national appropriation by claim of sovereignty, by means of use or occupation, or by any other means.\" This petition calls for changing that rule, not working around it. Any path forward requires a formal amendment or supplementary protocol agreed to by treaty member states, not a unilateral reinterpretation.",
      },
      {
        q: "How would a country define \"its\" orbital territory, given that orbits move relative to a rotating Earth?",
        a: "This is one of the hardest technical questions the proposal raises. A satellite in low Earth orbit passes over many countries within a single day, and its ground track shifts with each revolution. Any workable fee system would need internationally agreed rules for calculating which nation a satellite is \"over\" at a given moment, likely based on orbital mechanics data already submitted under the 1975 Registration Convention. This petition asks UNOOSA and member states to develop that framework — it does not propose one itself.",
      },
      {
        q: "Wouldn't this just create a patchwork of fees that raises costs for everyone, including scientific and humanitarian missions?",
        a: "That is a real risk, which is why the petition explicitly asks for safeguards: fees should not obstruct scientific research, humanitarian use, or emergency communications. Any amendment would need clear exemptions and caps to prevent the system from becoming a barrier to beneficial or non-commercial space activity.",
      },
      {
        q: "Who would collect these fees, and where would the money go?",
        a: "This petition does not prescribe a specific collection mechanism or revenue formula. It asks treaty member states to negotiate one. Models could range from direct bilateral fees between the satellite operator's home nation and the overflown nation, to a centralized UN-administered fund that distributes revenue to affected countries, particularly those without their own space programs.",
      },
      {
        q: "Would this fee apply to all satellites, including government and military ones?",
        a: "That would be a negotiating question for member states. Most proposals of this kind focus on commercial satellite operators rather than government, scientific, or defense assets, but the exact scope would need to be defined in the amendment text itself.",
      },
      {
        q: "Why would spacefaring nations and companies agree to this if it raises their costs?",
        a: "They may not agree easily. Major spacefaring nations and satellite operators have strong incentives to preserve the free-use principle that has governed orbit since 1967. This petition is a starting point for public pressure and formal negotiation, not a guarantee of adoption. Amending the treaty would require broad international consensus.",
      },
      {
        q: "Has anything like this been proposed before?",
        a: "Various experts and policymakers have discussed orbital congestion, space traffic management, and debris mitigation fees in different forums, particularly as satellite constellations have grown. However, a formal proposal to allow national governments to charge fees for orbital overflight, tied to territorial sovereignty, would be a significant departure from existing space law and has not been adopted in any binding international agreement.",
      },
      {
        q: "What happens after I sign?",
        a: "Signatures on this page demonstrate public interest in opening formal negotiations and are tallied here by VASIONA as a community-interest count. They are not automatically transmitted to UNOOSA or any government body — organizers can use the count to inform outreach to national space agencies, foreign ministries, and UNOOSA directly.",
      },
    ],
    signFormName: "Name (optional)",
    signFormCountry: "Country (optional)",
    signFormComment: "Comment (optional)",
    signFormSubmit: "Add my support",
    signFormThanks: "Thank you — your support has been counted.",
    signFormPrivacy: "Only a running total is shown publicly. Names are not published on this page.",
    signCountLabel: "people have shown support so far",
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

    // Nav
    navAbout: "О нама",
    navPetition: "Петиција",
    navContact: "Контакт",
    navHome: "Контролна табла",

    // Contact form
    contactTitle: "Ступите у контакт",
    contactSubtitle: "Питања, повратне информације, или интересовање за ово као политичку платформу? Ово отвара ваш имејл клијент упућен на serbvasiona@gmail.com.",
    contactName: "Ваше име",
    contactEmail: "Ваш имејл",
    contactMessage: "Порука",
    contactSend: "Пошаљи имејл",

    // Footer
    footerTagline: "Изнад Србије, за Србију.",
    footerRights: "Концептуална платформа за заговарање политике свемирског суверенитета — није државна агенција.",
    footerContact: "Контакт",

    // Petition page
    petitionTitle: "Петиција: Изменити Уговор о космосу да дозволи накнаде за орбитално прелетање",
    petitionTo: "За: Канцеларију Уједињених нација за послове свемира (UNOOSA) и државе чланице Уговора о космосу",
    petitionIntro:
      "Ми, потписници, тражимо измену Уговора о космосу из 1967. како би се суверене државе овластиле да наплаћују накнаде сателитима и другим свемирским објектима који орбитирају кроз простор изнад њихове територије.",
    petitionBackgroundTitle: "Позадина",
    petitionBackground1:
      "Уговор о космосу из 1967. представља темељни правни оквир за активности изван Земљине атмосфере. Према његовим тренутним одредбама, свемир је одређен као слободан за истраживање и коришћење свих држава, и ниједна држава не може полагати право суверенитета над било којим делом свемира, укључујући орбиталне путање које пролазе изнад њене копнене и водене територије. Овај принцип „непризнавања својине” уређује сателитски саобраћај скоро шест деценија.",
    petitionBackground2:
      "Као што државе наплаћују коришћење територијалних вода, ваздушног простора и наземне инфраструктуре, сматрамо да државе треба да имају право да наплате комерцијално коришћење орбиталних путања које пролазе изнад њихове суверене територије. Обим сателитског саобраћаја невероватно је порастао од 1967. године, вођен комерцијалним констелацијама, а изворни оквир Уговора није предвидео овакав обим употребе.",
    petitionWhyTitle: "Зашто подржавамо ову промену",
    petitionWhy: [
      "Правична накнада за коришћење националног простора. Државе већ регулишу и наплаћују коришћење ваздушног простора изнад своје територије; проширење сличног принципа на орбитални простор природна је еволуција постојећих норми суверенитета.",
      "Приход за државе у развоју. Многе државе са ограниченим сопственим свемирским програмима ипак имају сателите других држава који непрекидно орбитирају изнад њих. Систем накнада за прелет могао би генерисати приход за инфраструктуру, праћење животне средине или програме ублажавања свемирског отпада у тим државама.",
      "Подстицај за одговорно коришћење орбите. Структура накнада везана за орбиталне путање могла би обесхрабрити преоптерећење популарних орбита и подстаћи ефикаснији дизајн сателита и праксе деорбитирања.",
      "Модернизација застарелог права. Уговор је написан за услове ере Хладног рата са само две свемирске силе. Данас десетине држава и приватних компанија управљају сателитима, и правни оквир треба да одражава ову нову стварност.",
    ],
    petitionAskTitle: "Шта тражимо",
    petitionAskIntro: "Позивамо UNOOSA и државе чланице Уговора да отпочну формалне преговоре ка измени или допунском протоколу који би:",
    petitionAsk: [
      "Успоставио правни механизам који омогућава државама да наплаћују накнаде сателитима који делују на орбиталним путањама изнад њихове територије",
      "Дефинисао јасне, међународно договорене методе за израчунавање „територије” у контексту орбиталне механике (с обзиром да се орбиталне путање померају у односу на ротирајућу Земљу)",
      "Обезбедио да такве накнаде не ометају научна истраживања, хуманитарну употребу или хитне комуникације",
      "Створио процес решавања спорова за неслагања око процене накнада",
    ],
    petitionSignPrompt: "Потпишите ову петицију ако верујете да право свемира треба да еволуира како би одразило стварност пренасељеног, комерцијално активног орбиталног окружења.",
    petitionFaqTitle: "Често постављана питања",
    petitionFaq: [
      {
        q: "Зар ово није у супротности са самим Уговором о космосу?",
        a: "Да — директно. Члан II тренутног Уговора наводи да свемир, укључујући орбите, „није предмет националног присвајања путем захтева за суверенитет, коришћења или заузимања, нити било којим другим средством.” Ова петиција позива на промену тог правила, а не на заобилажење. Сваки пут напред захтева формалну измену или допунски протокол о којем се сложе државе чланице Уговора, а не једнострано поновно тумачење.",
      },
      {
        q: "Како би држава дефинисала „своју” орбиталну територију, с обзиром да се орбите крећу у односу на ротирајућу Земљу?",
        a: "Ово је једно од најтежих техничких питања које овај предлог поставља. Сателит у ниској Земљиној орбити прелази преко многих држава у току једног дана, а његова путања по тлу помера се са сваком ревуолуцијом. Сваки изводљив систем накнада захтевао би међународно договорена правила за израчунавање изнад које се државе сателит тренутно налази, вероватно на основу података орбиталне механике већ поднетих према Конвенцији о регистрацији из 1975. Ова петиција тражи од UNOOSA и држава чланица да развију тај оквир — она сама не предлаже конкретно решење.",
      },
      {
        q: "Зар ово не би само створило мозаик накнада који повећава трошкове за све, укључујући научне и хуманитарне мисије?",
        a: "То је стваран ризик, због чега петиција изричито тражи заштитне механизме: накнаде не би требало да ометају научна истраживања, хуманитарну употребу или хитне комуникације. Свака измена захтевала би јасне изузетке и ограничења како би се спречило да систем постане препрека корисним или некомерцијалним свемирским активностима.",
      },
      {
        q: "Ко би наплаћивао ове накнаде, и где би новац одлазио?",
        a: "Ова петиција не прописује конкретан механизам наплате или формулу прихода. Она тражи од држава чланица Уговора да га преговарају. Модели би могли да се крећу од директних билатералних накнада између матичне државе оператора сателита и прелетане државе, до централизованог фонда под управом УН који расподељује приход погођеним државама, посебно онима без сопствених свемирских програма.",
      },
      {
        q: "Да ли би се ова накнада примењивала на све сателите, укључујући државне и војне?",
        a: "То би било питање за преговоре међу државама чланицама. Већина предлога овог типа фокусира се на комерцијалне операторе сателита, а не на државну, научну или одбрамбену имовину, али тачан обим морао би бити дефинисан у самом тексту измене.",
      },
      {
        q: "Зашто би свемирске силе и компаније пристале на ово ако им повећава трошкове?",
        a: "Можда неће лако пристати. Велике свемирске силе и оператори сателита имају снажне подстицаје да очувају принцип слободне употребе који уређује орбиту од 1967. Ова петиција је полазна тачка за јавни притисак и формалне преговоре, не гаранција усвајања. Измена Уговора захтевала би широк међународни консензус.",
      },
      {
        q: "Да ли је нешто слично предлагано раније?",
        a: "Различити стручњаци и креатори политика расправљали су о орбиталној пренасељености, управљању свемирским саобраћајем и накнадама за ублажавање отпада на разним форумима, посебно како су сателитске констелације расле. Међутим, формалан предлог који би државама омогућио наплату накнада за орбитално прелетање, везан за територијални суверенитет, представљао би значајно одступање од постојећег свемирског права и до сада није усвојен ниједним обавезујућим међународним споразумом.",
      },
      {
        q: "Шта се дешава након што потпишем?",
        a: "Потписи на овој страници показују јавно интересовање за отварање формалних преговора и ВАСИОНА их овде броји као показатељ интересовања заједнице. Нису аутоматски прослеђени UNOOSA или било којем државном телу — организатори могу користити овај број да усмере обраћање националним свемирским агенцијама, министарствима спољних послова и директно UNOOSA.",
      },
    ],
    signFormName: "Име (опционо)",
    signFormCountry: "Држава (опционо)",
    signFormComment: "Коментар (опционо)",
    signFormSubmit: "Додај моју подршку",
    signFormThanks: "Хвала — ваша подршка је забележена.",
    signFormPrivacy: "Јавно се приказује само укупан број. Имена се не објављују на овој страници.",
    signCountLabel: "људи је до сада показало подршку",
  },
} as const;

export function getDict(lang: string | undefined) {
  return lang === "sr" ? dict.sr : dict.en;
}
