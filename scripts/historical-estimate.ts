// Run with: npm run estimate:historical
// Prints the same modeled 2020-to-now estimate the /api/ledger route computes,
// for Serbia plus a couple of comparison countries, to a plain console table.
// This is what generated the numbers quoted in docs/BUSINESS_PLAN.md.

import { computeHistoricalLedger, computeCompanyHistoricalLedger, COMPANY_SATELLITES_BY_YEAR } from "../lib/historicalModel";

const FEE_PER_PASS_USD = 25;
const SERBIA_LON_SPAN = 4.19;

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

console.log("\n\n=== PER-COMPANY (over Serbia, known operators only) ===");
let grandTotal = 0;
for (const company of Object.keys(COMPANY_SATELLITES_BY_YEAR)) {
  const { years, totalUsd } = computeCompanyHistoricalLedger({
    company,
    countryLonSpanDeg: SERBIA_LON_SPAN,
    feePerPassUsd: FEE_PER_PASS_USD,
  });
  console.log(`\n--- ${company} ---`);
  for (const y of years) {
    console.log(`${y.year}: ${y.activeSatellites.toLocaleString()} sats -> $${Math.round(y.annualRevenueUsd).toLocaleString()}`);
  }
  console.log(`TOTAL: $${Math.round(totalUsd).toLocaleString()}`);
  grandTotal += totalUsd;
}
console.log(`\nCOMBINED KNOWN-COMPANY TOTAL: $${Math.round(grandTotal).toLocaleString()}`);
