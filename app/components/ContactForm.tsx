"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { getDict } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/site";

export default function ContactForm({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`VASIONA contact form — ${name || "anonymous"}`);
    const body = encodeURIComponent(
      `${message}\n\n---\nFrom: ${name || "(no name given)"}\nReply-to: ${email || "(no email given)"}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
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
    <form onSubmit={handleSubmit}>
      <input
        style={inputStyle}
        type="text"
        placeholder={t.contactName}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        style={inputStyle}
        type="email"
        placeholder={t.contactEmail}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
        placeholder={t.contactMessage}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <button
        type="submit"
        style={{
          background: "var(--accent)",
          color: "#fff",
          border: "none",
          borderRadius: 999,
          padding: "10px 20px",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {t.contactSend}
      </button>
    </form>
  );
}
