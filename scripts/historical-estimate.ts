// Run with: npm run estimate:historical
// Prints the same modeled 2020-to-now estimate the /api/ledger route computes,
// for Serbia plus a couple of comparison countries, to a plain console table.
// This is what generated the numbers quoted in docs/BUSINESS_PLAN.md.

import { computeHistoricalLedger } from "../lib/historicalModel";

const FEE_PER_PASS_USD = 25;

const countries = [
  { name: "Serbia", lonSpanDeg: 4.3 },
  { name: "Germany", lonSpanDeg: 9 },
  { name: "United States", lonSpanDeg: 96 },
  { name: "Russia", lonSpanDeg: 171 },
];

for (const c of countries) {
  const { years, totalUsd } = computeHistoricalLedger({
    countryLonSpanDeg: c.lonSpanDeg,
    feePerPassUsd: FEE_PER_PASS_USD,
  });

  console.log(`\n=== ${c.name} (lon span ${c.lonSpanDeg}°) ===`);
  for (const y of years) {
    console.log(
      `${y.year}: ${y.activeSatellites.toLocaleString()} sats -> $${Math.round(
        y.annualRevenueUsd
      ).toLocaleString()}`
    );
  }
  console.log(`TOTAL 2020-present: $${Math.round(totalUsd).toLocaleString()}`);
}
