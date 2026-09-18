# VASIONA — Business Plan
Draft v0.1 · September 2026

## 0. How to read this document
This plan intentionally keeps two things separate on every page: what's a real,
launchable business today, and what's a hypothetical scenario that depends on
something that hasn't happened (states abandoning the Outer Space Treaty's
non-appropriation rule). Mixing those together is how a legitimate long-term
policy idea turns into a misleading pitch. So:

- 🟢 **Track A — Real** — legal today, sellable today
- 🟡 **Track B — Hypothetical** — a "what if" model, useful for internal scenario
  planning and policy advocacy, not for representing to subscribers or investors
  as expected income

---

## 1. Executive Summary
VASIONA is a proposed Serbian national capability for tracking man-made satellites
over Serbian territory, packaged as (A) a real data/analytics product and (B) a
long-term policy platform advocating for a future international framework on
space-traffic fees, analogous to aviation overflight charges.

## 2. 🟢 Track A — The Real Business

### Products
| Product | Buyer | Pricing idea |
|---|---|---|
| Public overhead dashboard | General public, media | Free tier (rate-limited) |
| Researcher API | Academics, journalists | $0–50/mo, higher rate limits + history |
| Commercial API | Insurers, aerospace analysts | $200–2,000/mo, SLA + alerting |
| Government contract | Serbian ministries / agencies | Custom — national space-domain-awareness capability is a real, funded category internationally |
| White-label platform | Other small/mid-size states | License the codebase + brand-free version |

### Why this is real
National space-situational-awareness systems are an active investment area for
many mid-size states, independent of any fee-collection theory — knowing what's
overhead, when, and operated by whom is useful for spectrum coordination, debris
risk awareness, and general sovereignty monitoring.

### Go-to-market, Phase 1 (0–3 months)
1. Deploy the platform (this repo) on Vercel — cron-fed live tracking, public dashboard.
2. Publish brand + the policy paper (Track B rationale) to establish the position.
3. Open a free public tier to build a user base and credibility.

### Go-to-market, Phase 2 (3–12 months)
1. Paid API tiers.
2. Pitch a government space-domain-awareness contract.
3. Academic/research partnerships (data licensing).

## 3. 🟡 Track B — The Hypothetical Scenario Model

### The core question this section answers
"If satellite overflight tolls existed the way aviation overflight fees do, how
much would that have been worth to Serbia since 2020?" This is explicitly framed
as a scenario, not a plan to bill anyone, because **no legal basis for collecting
such fees exists today** (Outer Space Treaty, Article II, non-appropriation of
outer space).

### Method
Two components, kept separate:
1. **Real logged data** — once deployed, the platform's cron job genuinely observes
   and timestamps every satellite whose ground track crosses Serbia's simplified
   bounding box. This is real, verifiable data about real overflights (just not
   billable ones).
2. **Modeled historical estimate, 2020 → deployment** — since re-propagating every
   satellite that has ever existed back to 2020 isn't feasible (most weren't
   launched yet; historical TLE archives for that scale are a specialist,
   largely paid dataset), this uses publicly reported *yearly active-satellite
   population* figures and the same simplified pass-rate formula as the live
   simulator: `passes/day = satellites × coverage factor × orbits/day × (country
   longitude span ÷ 360°)`.

### Illustrative result (Serbia, $25/pass, 75% coverage factor, 15 orbits/day)

| Year | Active satellites (est.) | Modeled annual "revenue" |
|---|---|---|
| 2020 | 3,300 | $4.1M |
| 2021 | 4,800 | $5.9M |
| 2022 | 6,700 | $8.2M |
| 2023 | 9,300 | $11.4M |
| 2024 | 11,800 | $14.5M |
| 2025 | 14,000 | $17.2M |
| 2026 (partial, through Sept 17) | 16,500 | $14.4M |
| **Total, 2020 → Sept 2026** | | **≈ $75.6M** |

For comparison, the same model run for other countries (illustrating why
geography dominates this scenario far more than economic size):

| Country | Longitude span | Modeled total, 2020–present |
|---|---|---|
| Serbia | 4.3° | ≈ $76M |
| Germany | 9° | ≈ $158M |
| United States | 96° | ≈ $1.69B |
| Russia | 171° | ≈ $3.01B |

*(Regenerate these anytime with `npm run estimate:historical`, or by adjusting
the sliders in the standalone revenue simulator artifact.)*

### What this table is and isn't for
- **Is:** a way to talk concretely, in a government or advocacy meeting, about
  the scale of value currently going uncaptured under the status quo — a
  legitimate rhetorical tool for a long-term policy position.
- **Isn't:** a receivable, a projection, or something to put in front of a paying
  subscriber or investor without the disclaimer attached. If this table is ever
  reused outside this document, keep the 🟡 framing and the treaty caveat with it.

## 4. Roadmap
| Phase | Timeline | Milestone |
|---|---|---|
| 1 | 0–3 mo | Deploy platform, public dashboard, brand + policy paper live |
| 2 | 3–12 mo | Paid API tiers, government pitch, first research partnerships |
| 3 | 12+ mo | Use logged data as evidence in international forums (UN COPUOS, bilateral talks) advancing the Track B policy position — Track B only becomes a live commercial conversation if that succeeds, and only then |

## 5. Key Risks
| Risk | Notes |
|---|---|
| Legal/regulatory | Track B has no current legal basis; treat as multi-year-to-never policy horizon |
| Data accuracy | Simplified bounding box + illustrative coverage factor — not survey-grade |
| Reputational | Presenting Track B numbers without the disclaimer risks being seen as misleading |
| Vendor dependency | CelesTrak is free/public but not SLA-backed; consider Space-Track.org for redundancy |

## 6. Next Steps
- [ ] Register domain (see BRAND_PACKAGE.md)
- [ ] Deploy to Vercel (see ../DEPLOY.md)
- [ ] Replace the Serbia bounding box with a real border polygon
- [ ] Decide who, if anyone, this gets shown to outside this conversation — and
      make sure the 🟡/🟢 split travels with it
