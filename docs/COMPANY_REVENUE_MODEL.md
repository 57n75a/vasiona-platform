# Hypothetical Revenue by Company (Over Serbia), 2020–Present
Generated with `npm run estimate:historical` · same 🟡 scenario caveat as `BUSINESS_PLAN.md`

## What this is
A version of the "since 2020" hypothetical toll model (see `BUSINESS_PLAN.md`
§3) broken down by **named companies** instead of total country satellite
population. Restricted to operators whose historical satellite counts are
well-documented enough to put a real number against — everything else
("Unclassified" in the live dashboard) is deliberately left out here rather
than estimated, per the brief to "ignore unknown."

**Same disclaimer as everywhere else in this repo applies:** no legal basis
exists today for actually collecting this. This is a scenario exercise, not
an invoice, a projection, or something to show a subscriber/investor without
the caveat attached.

## Assumptions
- Toll: $25/pass (same default as the rest of the platform)
- Coverage factor: 75%, orbits/day: 15 (same simplified formula as the
  country-level model — see `lib/historicalModel.ts`)
- Serbia longitude span: ~4.19°
- Year-end active-satellite counts per company are approximate, rounded, and
  sourced from public tracking/reporting (CelesTrak/KeepTrack tracking data,
  eoPortal's Starlink constellation history, industry coverage of OneWeb's
  constellation completion). Not official operator disclosures.

## Starlink (SpaceX)
| Year | Active satellites (approx.) | Modeled annual revenue over Serbia |
|---|---|---|
| 2020 | 900 | $1,077,756 |
| 2021 | 1,900 | $2,269,045 |
| 2022 | 3,000 | $3,582,703 |
| 2023 | 5,000 | $5,971,172 |
| 2024 | 6,800 | $8,143,042 |
| 2025 | 9,100 | $10,867,533 |
| 2026 (partial, through Sept 19) | 10,800 | $9,222,761 |
| **Total, 2020–present** | | **≈ $41.1M** |

## OneWeb
| Year | Active satellites (approx.) | Modeled annual revenue over Serbia |
|---|---|---|
| 2020 | 74 | $88,615 |
| 2021 | 358 | $427,536 |
| 2022 | 542 | $647,275 |
| 2023 | 648 | $773,864 |
| 2024 | 648 | $775,984 |
| 2025 | 648 | $773,864 |
| 2026 (partial) | 648 | $553,366 |
| **Total, 2020–present** | | **≈ $4.0M** |

## Iridium NEXT
A fixed 66-satellite constellation, completed in 2019 — effectively flat
across this whole window.

| Year | Active satellites | Modeled annual revenue over Serbia |
|---|---|---|
| 2020 | 66 | $79,035 |
| 2021 | 66 | $78,819 |
| 2022 | 66 | $78,819 |
| 2023 | 66 | $78,819 |
| 2024 | 66 | $79,035 |
| 2025 | 66 | $78,819 |
| 2026 (partial) | 66 | $56,361 |
| **Total, 2020–present** | | **≈ $0.53M** |

## Combined (known companies only)
| Company | Total, 2020–present |
|---|---|
| Starlink (SpaceX) | ≈ $41.1M |
| OneWeb | ≈ $4.0M |
| Iridium NEXT | ≈ $0.53M |
| **Combined** | **≈ $45.7M** |

For comparison, the country-level model's all-satellite-population figure for
Serbia over the same period was ≈$75.6M (see `BUSINESS_PLAN.md`) — meaning
these three named companies alone would account for roughly 60% of that
total, with the rest spread across everything else currently bucketed as
"Unclassified" in the live dashboard (other constellations, government/
military satellites, smaller commercial operators, debris-tracked objects,
etc.) that isn't broken out by name here.

## Regenerating this
```bash
npm run estimate:historical
```
Prints both the country-level table and this per-company breakdown to the
console — update `COMPANY_SATELLITES_BY_YEAR` in `lib/historicalModel.ts` as
better/fresher figures become available, then rerun.
