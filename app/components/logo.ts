// Seal-style logo: gold rim text on a cream disc, navy globe with Serbia
// shown as an actual flag-colored (red/blue/white) silhouette clipped to its
// real border polygon, a dashed orbit ellipse, and a gold ray to a satellite
// positioned at the 2 o'clock mark. Verified by rendering to PNG before
// shipping — both at full size and at the ~44px size this actually renders
// at in the nav bar, and against the site's dark navy background.
//
// NOTE: this SVG has internal ids (topArc, bottomArc, serbiaClip) referenced
// via href="#id"/clip-path="url(#id)". This component gets embedded multiple
// times on the same page (nav bar, map card, footer), which duplicates those
// ids in the DOM — technically invalid HTML, but harmless here only because
// every embed is a byte-identical copy at the same internal 600x600
// coordinate space (scaled purely via the wrapping <div>'s width/height in
// CSS). If this logo is ever split into size-specific variants with
// different internal geometry, give each variant's ids a unique suffix or
// this will visually break.
export const LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
<defs>
  <clipPath id="serbiaClip">
    <path d="M 293.0,268.5 L 294.2,270.5 L 296.5,271.8 L 297.9,274.1 L 298.8,273.9 L 298.8,275.5 L 298.5,276.1 L 298.9,278.1 L 301.5,280.5 L 306.2,282.5 L 306.5,283.1 L 305.0,285.1 L 305.6,285.8 L 306.7,286.2 L 306.9,286.9 L 304.9,287.3 L 305.3,288.5 L 307.1,288.7 L 307.9,290.4 L 311.7,290.8 L 312.1,291.9 L 313.2,293.1 L 313.6,293.0 L 315.1,290.4 L 316.4,289.6 L 318.3,290.9 L 319.4,291.2 L 320.0,292.0 L 319.3,292.4 L 318.1,292.0 L 316.7,293.0 L 317.5,295.1 L 319.2,296.1 L 319.1,296.9 L 317.6,299.3 L 316.3,300.1 L 315.7,302.9 L 317.6,308.1 L 320.0,309.5 L 321.5,311.8 L 322.6,312.4 L 322.2,313.7 L 319.7,316.9 L 317.4,317.1 L 316.5,318.0 L 316.6,321.3 L 317.8,323.0 L 317.4,324.2 L 316.7,324.8 L 315.7,325.4 L 315.3,324.9 L 312.6,325.7 L 310.1,325.3 L 308.6,326.8 L 306.1,326.3 L 304.3,328.0 L 303.3,328.0 L 302.2,327.2 L 298.8,329.0 L 298.4,330.5 L 298.6,331.2 L 298.1,332.2 L 296.9,332.3 L 296.5,331.5 L 296.9,330.9 L 295.8,327.1 L 294.3,325.7 L 292.9,325.4 L 291.9,322.6 L 290.9,321.8 L 291.3,320.4 L 289.9,319.5 L 290.9,318.6 L 292.4,318.9 L 293.2,317.9 L 294.0,317.7 L 293.9,316.4 L 290.6,315.3 L 290.9,315.0 L 289.8,313.9 L 288.9,313.9 L 286.1,312.4 L 284.1,309.4 L 281.9,308.0 L 281.9,307.6 L 282.5,307.1 L 283.8,306.5 L 284.6,306.7 L 284.9,305.0 L 284.7,303.9 L 282.1,300.8 L 282.0,300.1 L 285.1,300.9 L 286.1,300.0 L 286.1,299.5 L 283.2,297.1 L 281.1,296.0 L 280.5,294.9 L 280.8,292.4 L 282.8,289.7 L 283.4,286.9 L 281.3,286.4 L 279.8,287.3 L 279.5,286.7 L 280.6,284.8 L 280.5,283.8 L 281.2,282.0 L 283.2,282.7 L 283.9,282.6 L 284.0,282.0 L 280.9,280.9 L 279.2,279.5 L 279.4,277.9 L 280.4,277.5 L 279.5,276.8 L 278.8,277.2 L 278.3,276.7 L 278.4,276.0 L 279.0,275.3 L 278.9,273.5 L 277.4,271.6 L 279.4,270.9 L 280.4,269.9 L 281.0,270.4 L 282.4,270.4 L 284.4,269.1 L 285.5,267.7 L 291.4,267.7 L 293.0,268.5 Z"/>
  </clipPath>
</defs>

<circle cx="300" cy="300" r="298" fill="#FEFCF7"/>
<circle cx="300" cy="300" r="292" fill="none" stroke="#B8952F" stroke-width="4"/>
<circle cx="300" cy="300" r="282" fill="none" stroke="#B8952F" stroke-width="1.2"/>

<circle cx="164.4" cy="571.0" r="2.5" fill="#C9A227" opacity="0.6"/>
<circle cx="579.1" cy="436.6" r="2.0" fill="#C9A227" opacity="0.6"/>
<circle cx="589.8" cy="410.5" r="1.6" fill="#C9A227" opacity="0.6"/>
<circle cx="24.4" cy="422.0" r="1.6" fill="#C9A227" opacity="0.6"/>
<circle cx="18.4" cy="444.6" r="1.7" fill="#C9A227" opacity="0.6"/>
<circle cx="352.3" cy="608.1" r="2.9" fill="#C9A227" opacity="0.6"/>
<circle cx="27.5" cy="156.6" r="3.0" fill="#C9A227" opacity="0.6"/>
<circle cx="603.7" cy="391.5" r="1.9" fill="#C9A227" opacity="0.6"/>

<path id="topArc" d="M 32.0,300.0 A 268,268 0 1 1 568.0,300.0" fill="none"/>
<path id="bottomArc" d="M 32.0,300.0 A 268,268 0 1 0 568.0,300.0" fill="none"/>

<ellipse cx="300" cy="300" rx="230" ry="90" fill="none" stroke="#B8952F" stroke-width="1.5" stroke-dasharray="5 6" opacity="0.85"/>

<circle cx="300" cy="300" r="148" fill="#0d2b52" stroke="#03101f" stroke-width="2"/>
<g stroke="#1c4d85" stroke-width="1" fill="none" opacity="0.7">
  <ellipse cx="300" cy="300" rx="148" ry="47.36"/>
  <ellipse cx="300" cy="300" rx="91.76" ry="148"/>
  <ellipse cx="300" cy="300" rx="148" ry="96.2"/>
  <line x1="300" y1="152" x2="300" y2="448"/>
  <line x1="152" y1="300" x2="448" y2="300"/>
</g>
<circle cx="300" cy="300" r="148" fill="none" stroke="#B8952F" stroke-width="1" opacity="0.4"/>

<g clip-path="url(#serbiaClip)">
  <rect x="275.41206889874536" y="265.66524999999996" width="49.17586220250928" height="23.556500000000028" fill="#C6363C"/>
  <rect x="275.41206889874536" y="289.22175" width="49.17586220250928" height="22.556500000000028" fill="#1a4c8a"/>
  <rect x="275.41206889874536" y="310.77825" width="49.17586220250928" height="23.556500000000028" fill="#ffffff"/>
</g>
<path d="M 293.0,268.5 L 294.2,270.5 L 296.5,271.8 L 297.9,274.1 L 298.8,273.9 L 298.8,275.5 L 298.5,276.1 L 298.9,278.1 L 301.5,280.5 L 306.2,282.5 L 306.5,283.1 L 305.0,285.1 L 305.6,285.8 L 306.7,286.2 L 306.9,286.9 L 304.9,287.3 L 305.3,288.5 L 307.1,288.7 L 307.9,290.4 L 311.7,290.8 L 312.1,291.9 L 313.2,293.1 L 313.6,293.0 L 315.1,290.4 L 316.4,289.6 L 318.3,290.9 L 319.4,291.2 L 320.0,292.0 L 319.3,292.4 L 318.1,292.0 L 316.7,293.0 L 317.5,295.1 L 319.2,296.1 L 319.1,296.9 L 317.6,299.3 L 316.3,300.1 L 315.7,302.9 L 317.6,308.1 L 320.0,309.5 L 321.5,311.8 L 322.6,312.4 L 322.2,313.7 L 319.7,316.9 L 317.4,317.1 L 316.5,318.0 L 316.6,321.3 L 317.8,323.0 L 317.4,324.2 L 316.7,324.8 L 315.7,325.4 L 315.3,324.9 L 312.6,325.7 L 310.1,325.3 L 308.6,326.8 L 306.1,326.3 L 304.3,328.0 L 303.3,328.0 L 302.2,327.2 L 298.8,329.0 L 298.4,330.5 L 298.6,331.2 L 298.1,332.2 L 296.9,332.3 L 296.5,331.5 L 296.9,330.9 L 295.8,327.1 L 294.3,325.7 L 292.9,325.4 L 291.9,322.6 L 290.9,321.8 L 291.3,320.4 L 289.9,319.5 L 290.9,318.6 L 292.4,318.9 L 293.2,317.9 L 294.0,317.7 L 293.9,316.4 L 290.6,315.3 L 290.9,315.0 L 289.8,313.9 L 288.9,313.9 L 286.1,312.4 L 284.1,309.4 L 281.9,308.0 L 281.9,307.6 L 282.5,307.1 L 283.8,306.5 L 284.6,306.7 L 284.9,305.0 L 284.7,303.9 L 282.1,300.8 L 282.0,300.1 L 285.1,300.9 L 286.1,300.0 L 286.1,299.5 L 283.2,297.1 L 281.1,296.0 L 280.5,294.9 L 280.8,292.4 L 282.8,289.7 L 283.4,286.9 L 281.3,286.4 L 279.8,287.3 L 279.5,286.7 L 280.6,284.8 L 280.5,283.8 L 281.2,282.0 L 283.2,282.7 L 283.9,282.6 L 284.0,282.0 L 280.9,280.9 L 279.2,279.5 L 279.4,277.9 L 280.4,277.5 L 279.5,276.8 L 278.8,277.2 L 278.3,276.7 L 278.4,276.0 L 279.0,275.3 L 278.9,273.5 L 277.4,271.6 L 279.4,270.9 L 280.4,269.9 L 281.0,270.4 L 282.4,270.4 L 284.4,269.1 L 285.5,267.7 L 291.4,267.7 L 293.0,268.5 Z" fill="none" stroke="#C9A227" stroke-width="2"/>

<line x1="310.7" y1="282.3" x2="503.5" y2="182.5" stroke="#B8952F" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="310.7" cy="282.3" r="4.5" fill="#C9A227" stroke="#0d2b52" stroke-width="1"/>

<g transform="translate(503.5,182.5) rotate(-27.4)">
  <rect x="-16" y="-3" width="12" height="6" fill="#B8952F" stroke="#5c4813" stroke-width="0.8"/>
  <rect x="4" y="-3" width="12" height="6" fill="#B8952F" stroke="#5c4813" stroke-width="0.8"/>
  <rect x="-4" y="-5" width="8" height="10" rx="1.5" fill="#C9A227" stroke="#5c4813" stroke-width="1"/>
</g>

<circle cx="32.0" cy="300.0" r="4.5" fill="#B8952F"/>
<circle cx="568.0" cy="300.0" r="4.5" fill="#B8952F"/>

<text font-family="Georgia, 'Times New Roman', serif" font-size="42" font-weight="700" fill="#B8952F" letter-spacing="7">
  <textPath href="#topArc" startOffset="50%" text-anchor="middle">VASIONA</textPath>
</text>
<text font-family="Georgia, 'Times New Roman', serif" font-size="21" font-weight="600" fill="#B8952F" letter-spacing="2.5">
  <textPath href="#bottomArc" startOffset="50%" text-anchor="middle">OCULUS CAELI · SERBIA · 2020</textPath>
</text>
</svg>`.trim();
