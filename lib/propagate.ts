import * as satellite from "satellite.js";
import type { TleRecord } from "./tle";

export interface SubPoint {
  lat: number;
  lon: number;
  altKm: number | null;
}

export type SatRec = ReturnType<typeof satellite.twoline2satrec>;

/**
 * Parses a satellite's orbital inclination (degrees) straight out of TLE line 2
 * — columns 9-16 in the standard fixed-width format — without constructing a
 * satrec or propagating anything. Used as a cheap pre-filter (see
 * `reachesSerbiaLatitude` in cronRunner.ts): a satellite's ground track never
 * reaches a latitude higher than its inclination allows, so this alone lets a
 * single request skip most of a ~10,000+ object catalog (geostationary and
 * other near-equatorial objects, mainly) before paying for any real SGP4 work.
 * Returns null if the field can't be parsed (caller should treat that as "don't
 * risk skipping it").
 */
export function tleInclinationDeg(line2: string): number | null {
  const raw = line2.slice(8, 16).trim();
  const val = parseFloat(raw);
  return Number.isFinite(val) ? val : null;
}

/**
 * Builds the reusable SGP4 record for a TLE once, so a single satellite can be
 * sampled at several points in time (see cronRunner.ts's window scan) without
 * re-parsing the TLE text on every sample.
 */
export function buildSatrec(tle: TleRecord): SatRec | null {
  try {
    return satellite.twoline2satrec(tle.line1, tle.line2);
  } catch {
    return null;
  }
}

/**
 * Computes a satellite's ground track (sub-satellite point) at a given instant
 * from an already-built satrec, using real SGP4/SDP4 propagation.
 */
export function subPointAt(satrec: SatRec, date: Date): SubPoint | null {
  try {
    const pv = satellite.propagate(satrec, date);
    if (!pv.position || typeof pv.position === "boolean") return null;

    const gmst = satellite.gstime(date);
    const geo = satellite.eciToGeodetic(pv.position, gmst);

    return {
      lat: satellite.degreesLat(geo.latitude),
      lon: satellite.degreesLong(geo.longitude),
      altKm: geo.height ?? null,
    };
  } catch {
    // Malformed or decayed-object TLEs occasionally fail to propagate — skip them.
    return null;
  }
}

/**
 * Convenience one-shot version (builds the satrec and samples a single
 * instant). Kept for callers that only need one point; the cron job uses
 * `buildSatrec` + `subPointAt` directly so it can reuse the satrec across
 * several samples per satellite.
 */
export function currentSubPoint(tle: TleRecord, date: Date = new Date()): SubPoint | null {
  const satrec = buildSatrec(tle);
  if (!satrec) return null;
  return subPointAt(satrec, date);
}
