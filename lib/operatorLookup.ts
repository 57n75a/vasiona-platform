/**
 * Best-effort classification of a tracked object's operator/country, based on
 * its CelesTrak catalog name. This is a heuristic, not authoritative registry
 * data (that would require cross-referencing the UN Register of Objects
 * Launched into Outer Space or Space-Track's owner/operator fields) — good
 * enough to make the dashboard readable, not something to cite as fact.
 */
export interface OperatorInfo {
  country: string;
  operator: string;
  color: string; // used for map dots / table badges
}

const UNKNOWN: OperatorInfo = { country: "Unclassified", operator: "Unknown", color: "#8892c0" };

// Ordered: first matching pattern wins. Keep specific patterns before generic ones.
const RULES: { pattern: RegExp; info: OperatorInfo }[] = [
  { pattern: /^STARLINK/i, info: { country: "USA", operator: "SpaceX (Starlink)", color: "#3aa0ff" } },
  { pattern: /^ONEWEB/i, info: { country: "UK", operator: "OneWeb", color: "#5ec8e0" } },
  { pattern: /^IRIDIUM/i, info: { country: "USA", operator: "Iridium Communications", color: "#3aa0ff" } },
  { pattern: /^GLOBALSTAR/i, info: { country: "USA", operator: "Globalstar", color: "#3aa0ff" } },
  { pattern: /^(KUIPER|AMZN)/i, info: { country: "USA", operator: "Amazon (Kuiper)", color: "#ffb84d" } },
  { pattern: /^(FLOCK|DOVE)/i, info: { country: "USA", operator: "Planet Labs", color: "#3aa0ff" } },
  { pattern: /^LEMUR/i, info: { country: "USA", operator: "Spire Global", color: "#3aa0ff" } },
  { pattern: /^(GPS|NAVSTAR)/i, info: { country: "USA", operator: "US Space Force (GPS)", color: "#4d6fff" } },
  { pattern: /^USA[- ]?\d/i, info: { country: "USA", operator: "US Government / classified", color: "#4d6fff" } },
  { pattern: /^NOAA/i, info: { country: "USA", operator: "NOAA", color: "#3aa0ff" } },
  { pattern: /^(TERRA|AQUA|LANDSAT)/i, info: { country: "USA", operator: "NASA / USGS", color: "#3aa0ff" } },

  { pattern: /^COSMOS/i, info: { country: "Russia", operator: "Roscosmos / MoD", color: "#e05a5a" } },
  { pattern: /^GLONASS/i, info: { country: "Russia", operator: "Roscosmos (GLONASS)", color: "#e05a5a" } },
  { pattern: /^METEOR/i, info: { country: "Russia", operator: "Roscosmos (Meteor)", color: "#e05a5a" } },
  { pattern: /^RESURS/i, info: { country: "Russia", operator: "Roscosmos (Resurs)", color: "#e05a5a" } },

  { pattern: /^BEIDOU/i, info: { country: "China", operator: "CNSA (BeiDou)", color: "#f2a93c" } },
  { pattern: /^YAOGAN/i, info: { country: "China", operator: "PLA / CNSA (Yaogan)", color: "#f2a93c" } },
  { pattern: /^GAOFEN/i, info: { country: "China", operator: "CNSA (Gaofen)", color: "#f2a93c" } },
  { pattern: /^(TIANGONG|SHENZHOU|TIANZHOU)/i, info: { country: "China", operator: "CNSA (crewed program)", color: "#f2a93c" } },
  { pattern: /^CZ[- ]?\d/i, info: { country: "China", operator: "CNSA (Long March rocket body)", color: "#f2a93c" } },

  { pattern: /^GALILEO/i, info: { country: "EU", operator: "European Union (Galileo)", color: "#4dc98f" } },
  { pattern: /^SENTINEL/i, info: { country: "EU", operator: "ESA (Copernicus/Sentinel)", color: "#4dc98f" } },
  { pattern: /^METOP/i, info: { country: "Europe", operator: "EUMETSAT (MetOp)", color: "#4dc98f" } },
  { pattern: /^(SES|ASTRA|EUTELSAT)/i, info: { country: "Europe", operator: "Commercial (SES/Eutelsat)", color: "#4dc98f" } },

  { pattern: /^(HIMAWARI|QZS)/i, info: { country: "Japan", operator: "JAXA", color: "#c98fe0" } },
  { pattern: /^KOMPSAT/i, info: { country: "South Korea", operator: "KARI", color: "#c98fe0" } },
  { pattern: /^(CARTOSAT|RISAT|IRNSS)/i, info: { country: "India", operator: "ISRO", color: "#c98fe0" } },

  { pattern: /^ISS/i, info: { country: "International", operator: "NASA / Roscosmos / partners (ISS)", color: "#ffd23f" } },
  { pattern: /^INTELSAT/i, info: { country: "International", operator: "Intelsat", color: "#e0c05e" } },
];

export function classifyOperator(satelliteName: string): OperatorInfo {
  for (const rule of RULES) {
    if (rule.pattern.test(satelliteName)) return rule.info;
  }
  return UNKNOWN;
}
