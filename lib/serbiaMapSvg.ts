import { SERBIA_POLYGON } from "@/lib/serbia";

export interface MapEvent {
  lat: number;
  lon: number;
  label?: string;
  color?: string;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Renders Serbia's border polygon (see lib/serbia.ts) as an inline SVG string,
 * with optional event dots plotted on top. Server-generated — no client JS,
 * no external map tiles, no API calls. Uses a simple equirectangular
 * projection with a longitude correction (cos of the mean latitude) so the
 * shape isn't visibly stretched.
 */
export function buildSerbiaMapSvg(
  events: MapEvent[] = [],
  width = 420,
  height = 420
): string {
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

  const pathPoints = SERBIA_POLYGON.map(([lon, lat]) => project(lon, lat));
  const d =
    pathPoints
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
      .join(" ") + " Z";

  const dots = events
    .map((e) => {
      const [x, y] = project(e.lon, e.lat);
      const label = e.label ? escapeXml(e.label) : "";
      const fill = e.color || "var(--accent2, #3aa0ff)";
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${fill}" stroke="#fff" stroke-width="0.75"><title>${label}</title></circle>`;
    })
    .join("\n");

  return `
<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Map of Serbia with tracked satellite overflight points">
  <path d="${d}" fill="var(--map-fill, rgba(198,54,60,0.18))" stroke="var(--accent, #C6363C)" stroke-width="1.5" stroke-linejoin="round"/>
  ${dots}
</svg>`.trim();
}
