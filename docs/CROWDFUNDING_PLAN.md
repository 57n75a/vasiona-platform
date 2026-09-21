# VASIONA — Crowdfunding Plan: Serbia's First National Satellite
Draft v0.1 · September 2026

## 0. What kind of project this actually is
This is envisioned as a **privately funded project**, run by an international
team (including Serbian expats), not something requiring Serbian government
involvement or registration. The entity behind it does not need to be
registered in Serbia — the US or another jurisdiction convenient for an
international team is equally workable, and in practice more common for
crowdfunding-platform compatibility (Kickstarter/Indiegogo have specific
country requirements for campaign creators). If the Serbian government ever
chooses to formally partake — co-sponsoring, providing regulatory support,
or partnering directly — that's a welcome bonus that would strengthen the
"benefit of the Serbian people" framing, not a prerequisite.

What's still true regardless of structure:
- Actually collecting real money from the public needs an established
  crowdfunding platform (Kickstarter, Indiegogo, GoFundMe) or a registered
  entity to receive funds — whichever jurisdiction that ends up in, get
  actual legal counsel there before taking a single real payment.
- What's built here is a **campaign plan and a public interest-signal page**
  — visitors can register interest and an indicative pledge amount, useful
  for proving demand before committing to a platform or entity structure,
  but explicitly **not** a live payment system. The site says this plainly,
  not just this doc.

## 1. What should the satellite actually be used for?
**Recommendation: Earth observation, focused on agriculture, flood, and
forestry/wildfire monitoring.**

Reasoning:
- **Real, ongoing value to "the Serbian people" specifically** — not just a
  symbolic flag-planting exercise. Serbia has real exposure to river
  flooding (Sava/Danube basins), agricultural land that benefits from
  vegetation-health/drought monitoring, and forest areas at wildfire risk.
  An Earth-observation CubeSat feeding data to Serbian agricultural and
  emergency-management agencies has a concrete constituency that isn't
  VASIONA itself.
- **This is the standard "first national satellite" pattern globally** —
  most countries' first CubeSats (many African, Southeast Asian, and Baltic
  nations' first satellites) are exactly this category, so there's a well-
  worn technical and programmatic path to follow rather than inventing one.
- **Crowdfunding narrative strength**: "help Serbia see its own floods and
  crops from space" is a concrete, fundable pitch. Compare to the
  alternatives:

| Option | Public value | Funding narrative | Verdict |
|---|---|---|---|
| **Earth observation (ag/flood/forestry)** | High — real agencies would use the data | Strong, concrete | 🟢 Recommended |
| Educational/STEM CubeSat | Medium — inspirational, not operationally useful | Strong for schools/youth angle | 🟡 Good secondary/phase-2 option |
| Amateur radio relay | Low — niche hobbyist value | Weak for general public | 🔴 Not recommended as primary |
| VASIONA tech demonstration | Low direct public value — serves the platform, not citizens | Weak ("fund our own project") | 🔴 Not recommended as primary |

A reasonable phased approach: **Phase 1 = Earth-observation CubeSat** (the
public-value core), with an **educational/STEM component folded in**
(student-built ground station, university partnership, curriculum
materials) — this gets you the operational value AND the inspirational
funding narrative without running two separate campaigns.

## 2. What this actually costs (rough, real-world CubeSat economics)
| Item | Approx. range (USD) | Notes |
|---|---|---|
| 3U CubeSat bus + Earth-observation payload | $250,000 – $600,000 | Wide range depending on imaging resolution/spectral bands wanted |
| Rideshare launch (e.g. SpaceX Transporter-class mission) | $100,000 – $300,000 | Cost scales with mass; 3U CubeSats are usually at the low end |
| Ground station / data downlink setup | $30,000 – $80,000 | Can partner with an existing university ground station to reduce this |
| Licensing (spectrum/ITU filing, launch/export licensing) | $20,000 – $50,000 | Often underestimated — budget real legal/regulatory time here |
| Integration, testing, insurance, contingency (~20%) | Add ~20% of the above | Standard aerospace-budgeting practice |
| **Total ballpark** | **≈ $500,000 – $1,200,000** | Wide range is normal at this planning stage — narrows once a technical partner is chosen |

This is why the recommended approach is a **CubeSat** (3U or similar), not a
full-size satellite — full-size Earth-observation satellites run into tens
to hundreds of millions of dollars and aren't a realistic crowdfunding
target.

## 3. Campaign structure (once a platform/legal structure is chosen)
### Funding tiers (illustrative)
| Tier | Amount | What backers get |
|---|---|---|
| Supporter | $10+ | Name (or pseudonym) on a public digital "crew list," mission updates |
| Contributor | $50+ | Above + a printed/digital certificate, VASIONA sticker/patch |
| Mission Partner | $250+ | Above + your name etched on a plaque flown to orbit (a real, common CubeSat crowdfunding reward) |
| Founding Partner | $1,000+ | Above + invitation to a launch-viewing event (in person if feasible, streamed otherwise) |
| Institutional/Corporate | $10,000+ | Logo placement on mission materials, data-access discussion for agricultural/enterprise partners |

### Major Local Sponsors (separate from the tiers above)
A small number of major sponsorship slots, aimed at Serbian businesses and
organizations, offering something the standard tiers don't: physical
presence on the actual spacecraft. This is a direct conversation (email
inquiry), not a self-serve checkout — naming rights and physical placement
need coordination with the technical build timeline.

What's on offer:
- **Satellite naming rights** — the mission's official designation
- **Custom mission description/dedication** in official materials and press communications
- **Physical label/tag/sticker** applied to the satellite structure itself, before integration and launch
- **Priority recognition** across VASIONA's public channels tied to the mission specifically

Realistic constraints: a small CubeSat has limited physical surface area and
a single mission narrative can only reasonably carry so many distinct
sponsor identities — this is a handful of major partners (think low single
digits), not an open marketplace. Pricing for this tier isn't fixed here
deliberately; it should be negotiated per sponsor based on what they want
(naming alone vs. naming + physical placement + press involvement).

### Timeline (realistic, not optimistic)
| Phase | Duration | Milestone |
|---|---|---|
| Interest validation (this page) | 0–3 months | Gauge real demand via interest signups before committing to a platform |
| Legal/platform setup | 3–6 months | Choose fundraising platform or register an entity (US or elsewhere, per the team's convenience); legal review in whichever jurisdiction that ends up in |
| Campaign live | 2–3 months | Actual fundraising push |
| Technical partner selection + design | 6–12 months | RFP to CubeSat integrators, payload finalization |
| Build, test, launch manifest | 12–24 months | Standard CubeSat development cycle |
| **Total, interest page to orbit** | **~3–4 years** | Consistent with other nations' first-CubeSat timelines |

## 4. Risks
| Risk | Notes |
|---|---|
| Funding shortfall | CubeSat crowdfunding campaigns commonly raise a fraction of full mission cost — plan for a hybrid model (crowdfunding + government/university/corporate co-sponsorship) rather than 100% public funding |
| Regulatory | Public-fundraising law, ITU frequency coordination, launch-provider export controls, all in whichever jurisdiction(s) the entity and campaign actually operate in — real, needs actual legal counsel there, not assumptions from this document. If Serbia partakes formally, Serbian regulatory questions (satellite data use by Serbian agencies, any government co-sponsorship terms) would apply on top of that. |
| Technical | First-satellite failure rates are non-trivial industry-wide — set expectations accordingly in campaign messaging (be honest that space is hard) |
| Platform dependency | If VASIONA's own tracking data ever factors into this (e.g. positioning it as related to VASIONA's mission), keep the two initiatives clearly separated in messaging — funders are backing a public-service satellite, not a policy-advocacy platform |

## 5. Next steps
- [ ] Decide: pursue this via an established crowdfunding platform vs. a
      registered foundation (affects everything downstream)
- [ ] Get actual legal counsel in whichever jurisdiction the entity ends up
      registered in, on public fundraising rules there, before collecting
      any real payments
- [ ] Use the site's interest-signup page (see below) to gauge real demand
      for a few months before committing further
- [ ] Reach out to CubeSat integrators (there are several established firms
      that build turnkey Earth-observation CubeSats) for real quotes once
      interest is validated
