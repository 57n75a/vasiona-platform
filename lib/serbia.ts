// Simplified Serbia bounding box (matches the earlier demo artifacts).
// TODO: replace with a real national border polygon (e.g. Natural Earth / GADM data)
// and a proper point-in-polygon test for production accuracy — a bounding box
// over-counts anything that clips the corners without actually crossing Serbia.
export const SERBIA_BBOX = {
  latMin: 41.8,
  latMax: 46.2,
  lonMin: 18.75,
  lonMax: 23.05,
};

export function isOverSerbia(lat: number, lon: number): boolean {
  return (
    lat >= SERBIA_BBOX.latMin &&
    lat <= SERBIA_BBOX.latMax &&
    lon >= SERBIA_BBOX.lonMin &&
    lon <= SERBIA_BBOX.lonMax
  );
}

// East-west span in degrees — used by the historical/hypothetical fee model.
export const SERBIA_LON_SPAN_DEG = SERBIA_BBOX.lonMax - SERBIA_BBOX.lonMin; // ~4.3°
