"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { getDict } from "@/lib/i18n";

export default function PetitionSignForm({ lang, initialCount }: { lang: Lang; initialCount: number }) {
  const t = getDict(lang);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [comment, setComment] = useState("");
  const [count, setCount] = useState(initialCount);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/petition/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, country, comment }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();
      if (typeof data.count === "number") setCount(data.count);
      setSubmitted(true);
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--bg2)",
    color: "var(--text)",
    fontSize: 14,
    marginBottom: 10,
  };

  return (
    <div>
      <div className="num-big" style={{ marginBottom: 4 }}>{count.toLocaleString()}</div>
      <div className="muted" style={{ marginBottom: 16 }}>{t.signCountLabel}</div>

      {submitted ? (
        <div className="banner">{t.signFormThanks}</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            style={inputStyle}
            type="text"
            placeholder={t.signFormName}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            style={inputStyle}
            type="text"
            placeholder={t.signFormCountry}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <textarea
            style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
            placeholder={t.signFormComment}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            disabled={submitting}
            style={{
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              cursor: submitting ? "default" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {t.signFormSubmit}
          </button>
          {error && <div style={{ color: "var(--accent)", fontSize: 12, marginTop: 8 }}>{error}</div>}
          <div className="muted" style={{ fontSize: 11.5, marginTop: 10 }}>{t.signFormPrivacy}</div>
        </form>
      )}
    </div>
  );
}
