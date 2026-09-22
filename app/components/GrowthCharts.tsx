import type { Lang } from "@/lib/i18n";

/**
 * Dependency-free SVG charts for the home page. They are plain server
 * components (no client JS, no chart library) so they render instantly, print
 * cleanly and stay crisp at any width — the SVG scales with its container.
 */

const BLUE = "#3aa0ff";
const RED = "var(--accent)";

function niceScale(max: number, ticks = 4): { step: number; top: number } {
  const raw = Math.max(max, 1) / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  return { step, top: Math.ceil(max / step) * step };
}

function fmtInt(n: number, lang: Lang): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, lang === "sr" ? "." : ",");
}

function fmtUsd(n: number, lang: Lang): string {
  const dec = (v: number, d: number) => (lang === "sr" ? v.toFixed(d).replace(".", ",") : v.toFixed(d));
  if (n >= 1e9) return lang === "sr" ? `${dec(n / 1e9, 2)} млрд $` : `$${dec(n / 1e9, 2)}B`;
  if (n >= 1e6) return lang === "sr" ? `${dec(n / 1e6, 1)} млн $` : `$${dec(n / 1e6, 1)}M`;
  if (n >= 1e3) return lang === "sr" ? `${dec(n / 1e3, 0)} хиљ. $` : `$${dec(n / 1e3, 0)}K`;
  return lang === "sr" ? `${dec(n, 0)} $` : `$${dec(n, 0)}`;
}

/* ------------------------------------------------------------------ */
/* 1. Cumulative hypothetical total (annual bars + cumulative line)     */
/* ------------------------------------------------------------------ */

export function CumulativeTotalChart({
  years,
  lang,
  labels,
  partialLast,
}: {
  years: { year: number; annualRevenueUsd: number }[];
  lang: Lang;
  labels: { annual: string; cumulative: string };
  partialLast: boolean;
}) {
  if (!years.length) return null;

  const W = 720, H = 320;
  const m = { l: 74, r: 20, t: 34, b: 40 };
  const pw = W - m.l - m.r, ph = H - m.t - m.b;
  const n = years.length;
  const slot = pw / n;

  let run = 0;
  const cum = years.map((y) => (run += y.annualRevenueUsd));
  const { step, top } = niceScale(cum[cum.length - 1], 4);
  const yAt = (v: number) => m.t + ph - (v / top) * ph;
  const xAt = (i: number) => m.l + slot * (i + 0.5);

  const tickVals: number[] = [];
  for (let v = 0; v <= top + 1e-6; v += step) tickVals.push(v);

  const line = cum.map((v, i) => `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(" ");
  const area = `${line} L${xAt(n - 1).toFixed(1)},${yAt(0).toFixed(1)} L${xAt(0).toFixed(1)},${yAt(0).toFixed(1)} Z`;

  const first = years[0].year, last = years[n - 1].year;
  const aria =
    lang === "sr"
      ? `Кумулативни хипотетички збир расте са ${fmtUsd(cum[0], lang)} у ${first}. на ${fmtUsd(cum[n - 1], lang)} у ${last}. години.`
      : `The cumulative hypothetical total grows from ${fmtUsd(cum[0], lang)} in ${first} to ${fmtUsd(cum[n - 1], lang)} in ${last}.`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={aria} style={{ display: "block", maxWidth: "100%", height: "auto" }}>
      <title>{aria}</title>
      <defs>
        <linearGradient id="cumFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c6363c" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#c6363c" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* legend */}
      <rect x={m.l} y={8} width={12} height={12} fill={BLUE} fillOpacity={0.55} rx={2} />
      <text x={m.l + 18} y={18} fontSize={11.5} fill="var(--muted)">{labels.annual}</text>
      <line x1={m.l + 150} y1={14} x2={m.l + 172} y2={14} stroke={RED} strokeWidth={3} strokeLinecap="round" />
      <text x={m.l + 178} y={18} fontSize={11.5} fill="var(--muted)">{labels.cumulative}</text>

      {/* grid + y axis */}
      {tickVals.map((v) => (
        <g key={v}>
          <line x1={m.l} x2={W - m.r} y1={yAt(v)} y2={yAt(v)} stroke="var(--border)" strokeOpacity={0.7} />
          <text x={m.l - 8} y={yAt(v) + 4} textAnchor="end" fontSize={10.5} fill="var(--muted)">{fmtUsd(v, lang)}</text>
        </g>
      ))}

      {/* annual bars */}
      {years.map((y, i) => {
        const bw = slot * 0.46;
        const h = (y.annualRevenueUsd / top) * ph;
        return <rect key={y.year} x={xAt(i) - bw / 2} y={yAt(0) - h} width={bw} height={h} fill={BLUE} fillOpacity={0.55} rx={2} />;
      })}

      {/* cumulative area + line + points */}
      <path d={area} fill="url(#cumFill)" />
      <path d={line} fill="none" stroke={RED} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
      {cum.map((v, i) => (
        <g key={i}>
          <circle cx={xAt(i)} cy={yAt(v)} r={i === n - 1 ? 5.5 : 4} fill={RED} stroke="var(--panel)" strokeWidth={2} />
          <text x={xAt(i)} y={yAt(v) - 11} textAnchor={i === n - 1 ? "end" : "middle"} fontSize={i === n - 1 ? 12.5 : 10.5} fontWeight={i === n - 1 ? 700 : 500} fill="var(--text)">
            {fmtUsd(v, lang)}
          </text>
        </g>
      ))}

      {/* x axis */}
      {years.map((y, i) => (
        <text key={y.year} x={xAt(i)} y={H - 14} textAnchor="middle" fontSize={11.5} fill="var(--muted)">
          {y.year}
          {partialLast && i === n - 1 ? "*" : ""}
        </text>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Active satellites per year + growth since the first year         */
/* ------------------------------------------------------------------ */

export function SatellitesChart({
  years,
  lang,
  labels,
}: {
  years: { year: number; activeSatellites: number }[];
  lang: Lang;
  labels: { growth: string; cagr: string; yoy: string };
}) {
  if (years.length < 2) return null;

  const W = 720, H = 320;
  const m = { l: 56, r: 20, t: 30, b: 58 };
  const pw = W - m.l - m.r, ph = H - m.t - m.b;
  const n = years.length;
  const slot = pw / n;
  const vals = years.map((y) => y.activeSatellites);
  const { step, top } = niceScale(Math.max(...vals), 4);
  const yAt = (v: number) => m.t + ph - (v / top) * ph;
  const xAt = (i: number) => m.l + slot * (i + 0.5);

  const tickVals: number[] = [];
  for (let v = 0; v <= top + 1e-6; v += step) tickVals.push(v);

  const ratio = vals[n - 1] / vals[0];
  const cagr = Math.pow(ratio, 1 / (n - 1)) - 1;
  const ratioTxt = `×${(lang === "sr" ? ratio.toFixed(1).replace(".", ",") : ratio.toFixed(1))}`;
  const cagrTxt = `${Math.round(cagr * 100)}%`;

  const line = vals.map((v, i) => `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(" ");

  const aria =
    lang === "sr"
      ? `Број активних сателита расте са ${fmtInt(vals[0], lang)} у ${years[0].year}. на ${fmtInt(vals[n - 1], lang)} у ${years[n - 1].year}. (${ratioTxt}).`
      : `Active satellites grow from ${fmtInt(vals[0], lang)} in ${years[0].year} to ${fmtInt(vals[n - 1], lang)} in ${years[n - 1].year} (${ratioTxt}).`;

  return (
    <div>
      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 10 }}>
        <div>
          <div className="num-big">{ratioTxt}</div>
          <div className="muted">{labels.growth}</div>
        </div>
        <div>
          <div className="num-big">≈ {cagrTxt}</div>
          <div className="muted">{labels.cagr}</div>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={aria} style={{ display: "block", maxWidth: "100%", height: "auto" }}>
        <title>{aria}</title>

        {tickVals.map((v) => (
          <g key={v}>
            <line x1={m.l} x2={W - m.r} y1={yAt(v)} y2={yAt(v)} stroke="var(--border)" strokeOpacity={0.7} />
            <text x={m.l - 8} y={yAt(v) + 4} textAnchor="end" fontSize={10.5} fill="var(--muted)">{fmtInt(v, lang)}</text>
          </g>
        ))}

        {years.map((y, i) => {
          const bw = slot * 0.56;
          const h = (y.activeSatellites / top) * ph;
          const isLast = i === n - 1;
          return (
            <g key={y.year}>
              <rect x={xAt(i) - bw / 2} y={yAt(0) - h} width={bw} height={h} fill={isLast ? RED : BLUE} fillOpacity={isLast ? 0.95 : 0.7} rx={3} />
              <text x={xAt(i)} y={yAt(y.activeSatellites) - 8} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--text)">
                {fmtInt(y.activeSatellites, lang)}
              </text>
            </g>
          );
        })}

        {/* growth line through the bar tops */}
        <path d={line} fill="none" stroke="#f2a93c" strokeWidth={2} strokeDasharray="5 4" />

        {years.map((y, i) => {
          const g = i === 0 ? null : y.activeSatellites / years[i - 1].activeSatellites - 1;
          return (
            <g key={`x${y.year}`}>
              <text x={xAt(i)} y={H - 32} textAnchor="middle" fontSize={11.5} fill="var(--muted)">{y.year}</text>
              {g !== null && (
                <text x={xAt(i)} y={H - 15} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--good)">+{Math.round(g * 100)}%</text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>
        {lang === "sr" ? "Зелено:" : "Green:"} {labels.yoy}
      </div>
    </div>
  );
}
