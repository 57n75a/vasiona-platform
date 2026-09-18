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
  color: string; // bucketed by country so a legend stays legible
}

// Small, fixed palette bucketed by country/bloc — keeps the map legend to a
// handful of swatches instead of one color per operator.
export const COUNTRY_COLORS: Record<string, string> = {
  USA: "#3aa0ff",
  Russia: "#e05a5a",
  China: "#f2a93c",
  EU: "#4dc98f",
  Europe: "#4dc98f",
  UK: "#4dc98f",
  Japan: "#c98fe0",
  "South Korea": "#c98fe0",
  India: "#c98fe0",
  International: "#ffd23f",
  Unclassified: "#8892c0",
};

const UNKNOWN: OperatorInfo = { country: "Unclassified", operator: "Unknown", color: COUNTRY_COLORS.Unclassified };

// Ordered: first matching pattern wins. Keep specific patterns before generic ones.
const RULES: { pattern: RegExp; country: string; operator: string }[] = [
  { pattern: /^STARLINK/i, country: "USA", operator: "SpaceX (Starlink)" },
  { pattern: /^ONEWEB/i, country: "UK", operator: "OneWeb" },
  { pattern: /^IRIDIUM/i, country: "USA", operator: "Iridium Communications" },
  { pattern: /^GLOBALSTAR/i, country: "USA", operator: "Globalstar" },
  { pattern: /^(KUIPER|AMZN)/i, country: "USA", operator: "Amazon (Kuiper)" },
  { pattern: /^(FLOCK|DOVE)/i, country: "USA", operator: "Planet Labs" },
  { pattern: /^LEMUR/i, country: "USA", operator: "Spire Global" },
  { pattern: /^(GPS|NAVSTAR)/i, country: "USA", operator: "US Space Force (GPS)" },
  { pattern: /^USA[- ]?\d/i, country: "USA", operator: "US Government / classified" },
  { pattern: /^NOAA/i, country: "USA", operator: "NOAA" },
  { pattern: /^(TERRA|AQUA|LANDSAT)/i, country: "USA", operator: "NASA / USGS" },

  { pattern: /^COSMOS/i, country: "Russia", operator: "Roscosmos / MoD" },
  { pattern: /^GLONASS/i, country: "Russia", operator: "Roscosmos (GLONASS)" },
  { pattern: /^METEOR/i, country: "Russia", operator: "Roscosmos (Meteor)" },
  { pattern: /^RESURS/i, country: "Russia", operator: "Roscosmos (Resurs)" },

  { pattern: /^BEIDOU/i, country: "China", operator: "CNSA (BeiDou)" },
  { pattern: /^YAOGAN/i, country: "China", operator: "PLA / CNSA (Yaogan)" },
  { pattern: /^GAOFEN/i, country: "China", operator: "CNSA (Gaofen)" },
  { pattern: /^(TIANGONG|SHENZHOU|TIANZHOU)/i, country: "China", operator: "CNSA (crewed program)" },
  { pattern: /^CZ[- ]?\d/i, country: "China", operator: "CNSA (Long March rocket body)" },

  { pattern: /^GALILEO/i, country: "EU", operator: "European Union (Galileo)" },
  { pattern: /^SENTINEL/i, country: "EU", operator: "ESA (Copernicus/Sentinel)" },
  { pattern: /^METOP/i, country: "Europe", operator: "EUMETSAT (MetOp)" },
  { pattern: /^(SES|ASTRA|EUTELSAT)/i, country: "Europe", operator: "Commercial (SES/Eutelsat)" },

  { pattern: /^(HIMAWARI|QZS)/i, country: "Japan", operator: "JAXA" },
  { pattern: /^KOMPSAT/i, country: "South Korea", operator: "KARI" },
  { pattern: /^(CARTOSAT|RISAT|IRNSS)/i, country: "India", operator: "ISRO" },

  { pattern: /^ISS/i, country: "International", operator: "NASA / Roscosmos / partners (ISS)" },
  { pattern: /^INTELSAT/i, country: "International", operator: "Intelsat" },
];

export function classifyOperator(satelliteName: string): OperatorInfo {
  for (const rule of RULES) {
    if (rule.pattern.test(satelliteName)) {
      return { country: rule.country, operator: rule.operator, color: COUNTRY_COLORS[rule.country] ?? COUNTRY_COLORS.Unclassified };
    }
  }
  return UNKNOWN;
}

/**
 * Object-type / orbit-class classification: space station, navigation
 * (GNSS constellation), or a rough orbit-regime bucket derived from altitude
 * when the name alone doesn't say. Also heuristic — GNSS/station detection
 * from the name is reliable; the altitude-based LEO/MEO/GEO split is a rough
 * bucketing of otherwise-unclassified objects.
 */
export type ObjectType = "Space Station" | "Navigation (GNSS)" | "LEO" | "MEO" | "GEO" | "Other";

export interface ObjectTypeInfo {
  type: ObjectType;
  shape: "circle" | "diamond" | "square";
}

const STATION_PATTERN = /^(ISS|TIANGONG|MIR|SALYUT)/i;
const GNSS_PATTERN = /^(GPS|NAVSTAR|GLONASS|GALILEO|BEIDOU|QZS|IRNSS|NAVIC)/i;

export function classifyObjectType(satelliteName: string, altKm: number | null): ObjectTypeInfo {
  if (STATION_PATTERN.test(satelliteName)) return { type: "Space Station", shape: "diamond" };
  if (GNSS_PATTERN.test(satelliteName)) return { type: "Navigation (GNSS)", shape: "square" };

  if (altKm == null) return { type: "Other", shape: "circle" };
  if (altKm < 2000) return { type: "LEO", shape: "circle" };
  if (altKm < 35000) return { type: "MEO", shape: "circle" };
  return { type: "GEO", shape: "circle" };
}
