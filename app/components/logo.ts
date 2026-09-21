// VASIONA seal — user-provided design (Serbian double-headed eagle, globe,
// satellite, gold beam, circular "VASIONA" / "OCULUS CAELI — SERBIA" rim
// text). Supplied as a finished raster image rather than SVG, so it's served
// as a static asset (public/vasiona-seal.png) instead of embedded inline —
// simpler, and sidesteps the whole earlier saga of trying to get circular
// SVG text to render reliably (see BUILD_LOG.md sessions 13-14 if curious).
// Quantized to a 128-color palette at 600x600 to keep the file small
// (~58KB) without visible quality loss — this design's flat, limited color
// palette compresses very well that way.
export const LOGO_SRC = "/vasiona-seal.png";
