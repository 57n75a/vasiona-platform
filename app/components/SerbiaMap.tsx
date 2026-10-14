"use client";

import { useState } from "react";
import { getSerbiaMapProjection } from "@/lib/serbiaMapSvg";
import { COUNTRY_COLORS } from "@/lib/operatorLookup";
import { getDict, type Lang } from "@/lib/i18n";

export interface MapDot {
  lat: number;
  lon: number;
  name: string;
  operator: string;
  country: string;
  objectType: string;
  shape: "circle" | "diamond" | "square";
  color: string;
}

const SHAPE_LEGEND: { shape: MapDot["shape"]; labelKey: "shapeLeo" | "shapeStation" | "shapeGnss" }[] = [
  { shape: "circle", labelKey: "shapeLeo" },
  { shape: "diamond", labelKey: "shapeStation" },
  { shape: "square", labelKey: "shapeGnss" },
];

function DotShape({ shape, x, y, color, size = 5 }: { shape: MapDot["shape"]; x: number; y: number; color: string; size?: number }) {
  if (shape === "diamond") {
    return (
      <rect
        x={x - size}
        y={y - size}
        width={size * 2}
        height={size * 2}
        fill={color}
        stroke="#0a111b"
        strokeWidth={1}
        transform={`rotate(45 ${x} ${y})`}
      />
    );
  }
  if (shape === "square") {
    return (
      <rect
        x={x - size}
        y={y - size}
        width={size * 2}
        height={size * 2}
        fill={color}
        stroke="#0a111b"
        strokeWidth={1}
      />
    );
  }
  return <circle cx={x} cy={y} r={size} fill={color} stroke="#0a111b" strokeWidth={1} />;
}

export default function SerbiaMap({ events, lang }: { events: MapDot[]; lang: Lang }) {
  const t = getDict(lang);
  const { pathD, width, height } = getSerbiaMapProjection(420, 420);
  const { project } = getSerbiaMapProjection(420, 420);
  const [hover, setHover] = useState<{ x: number; y: number; dot: MapDot } | null>(null);

  const presentCountries = Array.from(new Set(events.map((e) => e.country)));
  const legendCountries = presentCountries.length
    ? presentCountries
    : ["USA", "Russia", "China", "EU", "International", "Unclassified"];

  return (
    <div>
      <div style={{ position: "relative", maxWidth: 420, margin: "0 auto" }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
          <defs>
            <pattern id="vasiona-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M30 0H0V30" fill="none" stroke="#26303d" strokeWidth={0.65} />
            </pattern>
            <linearGradient id="vasiona-land" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#172b3c" />
              <stop offset="1" stopColor="#0d1a26" />
            </linearGradient>
          </defs>
          <rect width={width} height={height} fill="url(#vasiona-grid)" />
          <path d={pathD} fill="url(#vasiona-land)" stroke="#658293" strokeWidth={1.4} strokeLinejoin="round" />
          {events.map((e, i) => {
            const [x, y] = project(e.lon, e.lat);
            return (
              <g
                key={i}
                onMouseEnter={(ev) => setHover({ x: ev.clientX, y: ev.clientY, dot: e })}
                onMouseMove={(ev) => setHover({ x: ev.clientX, y: ev.clientY, dot: e })}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}
              >
                <DotShape shape={e.shape} x={x} y={y} color={e.color} />
              </g>
            );
          })}
        </svg>

        {hover && (
          <div
            style={{
              position: "fixed",
              left: hover.x + 14,
              top: hover.y + 14,
              zIndex: 50,
              background: "var(--panel)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: "10px 13px",
              fontSize: 12,
              maxWidth: 220,
              pointerEvents: "none",
              boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 2 }}>{hover.dot.name}</div>
            <div className="muted">{hover.dot.operator} ({hover.dot.country})</div>
            <div className="muted">{hover.dot.objectType}</div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 16px", justifyContent: "center", marginTop: 14 }}>
        {legendCountries.map((c) => (
          <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5 }} className="muted">
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: COUNTRY_COLORS[c] ?? COUNTRY_COLORS.Unclassified,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            {c}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 16px", justifyContent: "center", marginTop: 8 }}>
        {SHAPE_LEGEND.map(({ shape, labelKey }) => (
          <span key={shape} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5 }} className="muted">
            <svg width={14} height={14} viewBox="0 0 14 14">
              <DotShape shape={shape} x={7} y={7} color="#89cbd8" size={5} />
            </svg>
            {t[labelKey]}
          </span>
        ))}
      </div>
    </div>
  );
}
