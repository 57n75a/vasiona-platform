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
