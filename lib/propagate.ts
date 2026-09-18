import * as satellite from "satellite.js";
import type { TleRecord } from "./tle";

export interface SubPoint {
  lat: number;
  lon: number;
  altKm: number | null;
}

/**
 * Computes a satellite's current ground track (sub-satellite point) from a TLE,
 * using real SGP4/SDP4 propagation — the same library used in the browser demo,
 * running server-side here instead.
 */
export function currentSubPoint(tle: TleRecord, date: Date = new Date()): SubPoint | null {
  try {
    const satrec = satellite.twoline2satrec(tle.line1, tle.line2);
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
