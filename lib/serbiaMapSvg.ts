import { SERBIA_POLYGON } from "@/lib/serbia";

/**
 * Equirectangular projection of Serbia's border polygon into a square SVG
 * viewBox, with a longitude correction (cos of the mean latitude) so the
 * shape isn't visibly stretched. Pure function — safe to call from both
 * server components and client components.
 */
export function getSerbiaMapProjection(width = 420, height = 420) {
  const lons = SERBIA_POLYGON.map((p) => p[0]);
  const lats = SERBIA_POLYGON.map((p) => p[1]);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const meanLat = (minLat + maxLat) / 2;
  const lonCorrection = Math.cos((meanLat * Math.PI) / 180);

  const pad = 24;
  const usableW = width - pad * 2;
  const usableH = height - pad * 2;

  const lonSpanCorrected = (maxLon - minLon) * lonCorrection;
  const latSpan = maxLat - minLat;
  const scale = Math.min(usableW / lonSpanCorrected, usableH / latSpan);

  function project(lon: number, lat: number): [number, number] {
    const x = pad + (lon - minLon) * lonCorrection * scale;
    const y = pad + (maxLat - lat) * scale; // invert: north is up
    return [x, y];
  }

  const pathD =
    SERBIA_POLYGON.map(([lon, lat], i) => {
      const [x, y] = project(lon, lat);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ") + " Z";

  return { project, pathD, width, height };
}
