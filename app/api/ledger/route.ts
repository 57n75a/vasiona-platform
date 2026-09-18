import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, countLoggedEvents, firstLoggedEventDate } from "@/lib/db";
import { computeHistoricalLedger } from "@/lib/historicalModel";
import { SERBIA_LON_SPAN_DEG } from "@/lib/serbia";

export const dynamic = "force-dynamic";

const TEXT = {
  en: {
    disclaimer:
      "Hypothetical scenario model, not a real or collectible invoice. See docs/BUSINESS_PLAN.md.",
    modeled:
      "Statistical estimate, 2020 through first real cron run — see lib/historicalModel.ts",
    real: "Actual passes this deployment has observed and logged via the cron job",
  },
  sr: {
    disclaimer:
      "Хипотетички сценарио модел, није стварна нити наплатива фактура. Погледати docs/BUSINESS_PLAN.md.",
    modeled:
      "Статистичка процена, од 2020. до првог стварног покретања cron задатка — видети lib/historicalModel.ts",
    real: "Стварни прелети које је ова инстанца платформе забележила путем cron задатка",
  },
};

export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get("lang") === "sr" ? "sr" : "en";
  const t = TEXT[lang];

  await ensureSchema();

  const feePerPassUsd = Number(process.env.HYPOTHETICAL_FEE_USD_PER_PASS ?? 25);
  const coverageFactor = Number(process.env.INCLINATION_COVERAGE_FACTOR ?? 0.75);
  const orbitsPerDay = Number(process.env.ORBITS_PER_DAY_ASSUMED ?? 15);

  const cutoff = (await firstLoggedEventDate()) ?? new Date();

  // Modeled estimate: 2020 up to the point this deployment started actually logging real events.
  const modeled = computeHistoricalLedger({
    countryLonSpanDeg: SERBIA_LON_SPAN_DEG,
    feePerPassUsd,
    coverageFactor,
    orbitsPerDay,
    throughDate: cutoff,
  });

  // Real: every pass this deployment has actually observed and logged via cron.
  const realLoggedEvents = await countLoggedEvents();
  const realLoggedUsd = realLoggedEvents * feePerPassUsd;

  return NextResponse.json({
    lang,
    disclaimer: t.disclaimer,
    assumptions: { feePerPassUsd, coverageFactor, orbitsPerDay },
    modeledEstimate: {
      description: t.modeled,
      years: modeled.years,
      totalUsd: modeled.totalUsd,
    },
    realLogged: {
      description: t.real,
      sinceDate: cutoff.toISOString(),
      events: realLoggedEvents,
      totalUsd: realLoggedUsd,
    },
    grandTotalUsd: modeled.totalUsd + realLoggedUsd,
  });
}
