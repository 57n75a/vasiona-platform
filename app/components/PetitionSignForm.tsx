"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { getDict } from "@/lib/i18n";

export default function PetitionSignForm({ lang, initialCount }: { lang: Lang; initialCount: number }) {
  const t = getDict(lang);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
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
        body: JSON.stringify({ name, email, contactConsent: consent, country, comment }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data?.error === "invalid_email"
            ? t.formErrorEmail
            : data?.error === "consent_required"
            ? t.formErrorConsent
            : t.formErrorGeneric
        );
        return;
      }
      if (typeof data.count === "number") setCount(data.count);
      setSubmitted(true);
    } catch {
      setError(t.formErrorGeneric);
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
            type="email"
            autoComplete="email"
            placeholder={t.signFormEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          <label style={{ display: "flex", gap: 8, alignItems: "flex-start", textAlign: "left", fontSize: 12.5, lineHeight: 1.5, marginBottom: 12, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
              style={{ marginTop: 3, flexShrink: 0 }}
            />
            <span>{t.formConsent}</span>
          </label>
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
