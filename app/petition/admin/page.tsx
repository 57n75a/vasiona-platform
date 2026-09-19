"use client";

import { useState } from "react";

interface Signature {
  id: number;
  name: string | null;
  country: string | null;
  comment: string | null;
  created_at: string;
}

export default function PetitionAdminPage() {
  const [secret, setSecret] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signatures, setSignatures] = useState<Signature[]>([]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/petition/list", {
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (res.status === 401) {
        setError("Incorrect admin secret.");
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();
      setSignatures(data.signatures ?? []);
      setLoggedIn(true);
    } catch {
      setError("Something went wrong. Check the server logs / ADMIN_SECRET is set.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadCsv() {
    const res = await fetch("/api/petition/list?format=csv", {
      headers: { Authorization: `Bearer ${secret}` },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "petition_signatures.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 18, marginBottom: 4 }}>Petition Admin</h1>
      <p className="muted" style={{ fontSize: 12.5, marginBottom: 20 }}>
        Not linked from anywhere in the site — this URL is the access control, plus the secret below.
        Signer data is private; see docs/ADMIN.md for what this is meant for.
      </p>

      {!loggedIn ? (
        <form onSubmit={handleLogin} className="card" style={{ maxWidth: 360 }}>
          <label className="muted" style={{ fontSize: 12, display: "block", marginBottom: 6 }}>
            Admin secret (ADMIN_SECRET)
          </label>
          <input
            style={inputStyle}
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Checking…" : "View signatures"}
          </button>
          {error && <div style={{ color: "var(--accent)", fontSize: 12, marginTop: 8 }}>{error}</div>}
        </form>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="muted">{signatures.length} signature{signatures.length === 1 ? "" : "s"}</div>
            <button
              onClick={handleDownloadCsv}
              style={{
                background: "transparent",
                color: "var(--text)",
                border: "1px solid var(--border)",
                borderRadius: 999,
                padding: "6px 14px",
                fontSize: 12.5,
                cursor: "pointer",
              }}
            >
              Download CSV
            </button>
          </div>
          <div className="card" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>When</th>
                  <th>Name</th>
                  <th>Country</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {signatures.map((s) => (
                  <tr key={s.id}>
                    <td>{new Date(s.created_at).toISOString()}</td>
                    <td>{s.name || <span className="muted">—</span>}</td>
                    <td>{s.country || <span className="muted">—</span>}</td>
                    <td>{s.comment || <span className="muted">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
