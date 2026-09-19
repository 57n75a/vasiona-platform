/**
 * HYPOTHETICAL MODEL — NOT A REAL LEDGER.
 *
 * This estimates what a per-pass "sovereignty toll" might have added up to for a
 * given country between 2020 and today, IF the Outer Space Treaty's
 * non-appropriation rule didn't apply and every pass were billable.
 *
 * Why this is a statistical estimate rather than a literal reconstruction:
 * re-running SGP4 propagation for every satellite that has ever existed since
 * 2020 would require (a) archived historical TLE sets for every object at every
 * point in time — a paid/complex dataset (Space-Track.org keeps this but access
 * and volume are non-trivial) — and (b) accounting for satellites that were
 * launched, moved, and deorbited throughout the period. Instead, this model
 * uses publicly reported YEARLY active-satellite population figures and applies
 * the same simplified pass-rate formula used in the interactive simulator:
 *
 *   dailyPasses(year) = activeSatellites(year) × coverageFactor × orbitsPerDay
 *                        × (countryLonSpanDeg / 360)
 *   annualRevenue(year) = dailyPasses(year) × feePerPass × 365
 *
 * Treat every number this produces as illustrative and adjustable, not audited.
 */

export interface YearlyEstimate {
  year: number;
  activeSatellites: number;
  dailyPasses: number;
  annualRevenueUsd: number;
}

// Approximate, publicly reported year-end active-satellite counts.
// Sources: UCS Satellite Database / ESA / industry trackers (rounded).
// Update these as better figures become available — they are the single
// biggest driver of how large the "historical" total looks.
export const ACTIVE_SATELLITES_BY_YEAR: Record<number, number> = {
  2020: 3300,
  2021: 4800,
  2022: 6700,
  2023: 9300,
  2024: 11800,
  2025: 14000,
  2026: 16500, // partial year — see partialYearFraction in computeHistoricalLedger
};

export interface HistoricalModelParams {
  countryLonSpanDeg: number;
  feePerPassUsd: number;
  coverageFactor?: number; // default 0.75
  orbitsPerDay?: number; // default 15
  throughDate?: Date; // defaults to "now" — used to pro-rate the current year
}

export function computeHistoricalLedger(params: HistoricalModelParams): {
  years: YearlyEstimate[];
  totalUsd: number;
} {
  const {
    countryLonSpanDeg,
    feePerPassUsd,
    coverageFactor = 0.75,
    orbitsPerDay = 15,
    throughDate = new Date(),
  } = params;

  const currentYear = throughDate.getUTCFullYear();
  const years: YearlyEstimate[] = [];
  let totalUsd = 0;

  for (const [yearStr, activeSatellites] of Object.entries(ACTIVE_SATELLITES_BY_YEAR)) {
    const year = parseInt(yearStr, 10);
    if (year > currentYear) continue;

    const dailyPasses =
      activeSatellites * coverageFactor * orbitsPerDay * (countryLonSpanDeg / 360);

    let daysInYear = isLeap(year) ? 366 : 365;
    if (year === currentYear) {
      const startOfYear = Date.UTC(year, 0, 1);
      const msPerDay = 86400000;
      daysInYear = Math.max(
        1,
        Math.round((throughDate.getTime() - startOfYear) / msPerDay)
      );
    }

    const annualRevenueUsd = dailyPasses * feePerPassUsd * daysInYear;
    years.push({ year, activeSatellites, dailyPasses, annualRevenueUsd });
    totalUsd += annualRevenueUsd;
  }

  return { years: years.sort((a, b) => a.year - b.year), totalUsd };
}

function isLeap(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * COMPANY-LEVEL MODEL — same hypothetical-scenario caveat as above, restricted
 * to companies whose satellite counts are publicly well-documented enough to
 * put a real number against (unlike the country-level model, which uses
 * total active-satellite population, this only covers named operators —
 * "ignore unknown" per the brief, rather than lumping everything else into
 * an estimate).
 *
 * Sources (approximate, rounded, year-end active counts): public reporting
 * via CelesTrak/KeepTrack tracking data, eoPortal's Starlink constellation
 * history, and industry coverage of OneWeb's ~648-satellite constellation
 * completion. Iridium NEXT is a fixed 66-satellite constellation completed
 * in 2019, effectively flat across this whole window.
 */
export const COMPANY_SATELLITES_BY_YEAR: Record<string, Record<number, number>> = {
  "Starlink (SpaceX)": { 2020: 900, 2021: 1900, 2022: 3000, 2023: 5000, 2024: 6800, 2025: 9100, 2026: 10800 },
  "OneWeb": { 2020: 74, 2021: 358, 2022: 542, 2023: 648, 2024: 648, 2025: 648, 2026: 648 },
  "Iridium NEXT": { 2020: 66, 2021: 66, 2022: 66, 2023: 66, 2024: 66, 2025: 66, 2026: 66 },
};

export interface CompanyHistoricalParams {
  company: string;
  countryLonSpanDeg: number;
  feePerPassUsd: number;
  coverageFactor?: number;
  orbitsPerDay?: number;
  throughDate?: Date;
}

export function computeCompanyHistoricalLedger(params: CompanyHistoricalParams): {
  years: YearlyEstimate[];
  totalUsd: number;
} {
  const {
    company,
    countryLonSpanDeg,
    feePerPassUsd,
    coverageFactor = 0.75,
    orbitsPerDay = 15,
    throughDate = new Date(),
  } = params;

  const counts = COMPANY_SATELLITES_BY_YEAR[company];
  if (!counts) throw new Error(`Unknown company: ${company}`);

  const currentYear = throughDate.getUTCFullYear();
  const years: YearlyEstimate[] = [];
  let totalUsd = 0;

  for (const [yearStr, activeSatellites] of Object.entries(counts)) {
    const year = parseInt(yearStr, 10);
    if (year > currentYear) continue;

    const dailyPasses = activeSatellites * coverageFactor * orbitsPerDay * (countryLonSpanDeg / 360);

    let daysInYear = isLeap(year) ? 366 : 365;
    if (year === currentYear) {
      const startOfYear = Date.UTC(year, 0, 1);
      daysInYear = Math.max(1, Math.round((throughDate.getTime() - startOfYear) / 86400000));
    }

    const annualRevenueUsd = dailyPasses * feePerPassUsd * daysInYear;
    years.push({ year, activeSatellites, dailyPasses, annualRevenueUsd });
    totalUsd += annualRevenueUsd;
  }

  return { years: years.sort((a, b) => a.year - b.year), totalUsd };
}
