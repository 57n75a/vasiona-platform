"use client";

import { useState } from "react";

interface Signature {
  id: number;
  name: string | null;
  country: string | null;
  comment: string | null;
  created_at: string;
}

interface InterestRow {
  id: number;
  name: string | null;
  email: string | null;
  indicative_usd: number | null;
  comment: string | null;
  created_at: string;
}

type Tab = "cron" | "petition" | "crowdfund";

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("cron");

  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [interest, setInterest] = useState<InterestRow[]>([]);
  const [cronResult, setCronResult] = useState<any>(null);
  const [cronRunning, setCronRunning] = useState(false);
  const [cronEnabled, setCronEnabledState] = useState<boolean | null>(null);
  const [configuredSchedule, setConfiguredSchedule] = useState<string>("");
  const [toggling, setToggling] = useState(false);

  async function authedFetch(path: string, opts: RequestInit = {}) {
    return fetch(path, {
      ...opts,
      headers: { ...(opts.headers || {}), Authorization: `Bearer ${secret}` },
    });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const [petRes, cfRes] = await Promise.all([
        fetch("/api/petition/list", { headers: { Authorization: `Bearer ${secret}` } }),
        fetch("/api/crowdfund/list", { headers: { Authorization: `Bearer ${secret}` } }),
      ]);
      if (petRes.status === 401 || cfRes.status === 401) {
        setError("Incorrect admin secret.");
        setLoading(false);
        return;
      }
      const petData = await petRes.json();
      const cfData = await cfRes.json();
      setSignatures(petData.signatures ?? []);
      setInterest(cfData.interest ?? []);
      setLoggedIn(true);

      // Fetch cron settings too, now that we have a confirmed-good secret
      const csRes = await fetch("/api/admin/cron-settings", { headers: { Authorization: `Bearer ${secret}` } });
      if (csRes.ok) {
        const csData = await csRes.json();
        setCronEnabledState(csData.enabled);
        setConfiguredSchedule(csData.configuredSchedule);
      }
    } catch {
      setError("Something went wrong. Check ADMIN_SECRET is set on the server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRunCron() {
    setCronRunning(true);
    setCronResult(null);
    try {
      const res = await authedFetch("/api/admin/run-cron", { method: "POST" });
      const data = await res.json();
      setCronResult(data);
    } catch {
      setCronResult({ error: "request_failed" });
    } finally {
      setCronRunning(false);
    }
  }

  async function handleToggleCron() {
    if (cronEnabled === null) return;
    setToggling(true);
    try {
      const res = await authedFetch("/api/admin/cron-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !cronEnabled }),
      });
      const data = await res.json();
      setCronEnabledState(data.enabled);
    } finally {
      setToggling(false);
    }
  }

  async function downloadCsv(path: string, filename: string) {
    const res = await authedFetch(path);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
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

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 16px",
    borderRadius: 999,
    border: "1px solid var(--border)",
    background: active ? "var(--accent)" : "transparent",
    color: active ? "#fff" : "var(--text)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  });

  const buttonStyle: React.CSSProperties = {
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: 999,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  };

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 18, marginBottom: 4 }}>VASIONA Admin</h1>
      <p className="muted" style={{ fontSize: 12.5, marginBottom: 20 }}>
        Not linked from anywhere in the site — this URL plus the secret below are the access control.
      </p>

      {!loggedIn ? (
        <form onSubmit={handleLogin} className="card" style={{ maxWidth: 360 }}>
          <label className="muted" style={{ fontSize: 12, display: "block", marginBottom: 6 }}>
            Admin secret (ADMIN_SECRET)
          </label>
          <input style={inputStyle} type="password" value={secret} onChange={(e) => setSecret(e.target.value)} autoFocus />
          <button type="submit" disabled={loading} style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Checking…" : "Log in"}
          </button>
          {error && <div style={{ color: "var(--accent)", fontSize: 12, marginTop: 8 }}>{error}</div>}
        </form>
      ) : (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <button style={tabStyle(tab === "cron")} onClick={() => setTab("cron")}>Cron</button>
            <button style={tabStyle(tab === "petition")} onClick={() => setTab("petition")}>
              Petition ({signatures.length})
            </button>
            <button style={tabStyle(tab === "crowdfund")} onClick={() => setTab("crowdfund")}>
              Crowdfund ({interest.length})
            </button>
          </div>

          {tab === "cron" && (
            <div className="card">
              <div className="muted" style={{ marginBottom: 10, textTransform: "uppercase", fontSize: 12, letterSpacing: 1 }}>
                Daily Schedule
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <button
                  onClick={handleToggleCron}
                  disabled={toggling || cronEnabled === null}
                  style={{
                    ...buttonStyle,
                    background: cronEnabled ? "#3ddc84" : "var(--border)",
                    color: cronEnabled ? "#06301a" : "var(--text)",
                    opacity: toggling ? 0.7 : 1,
                    minWidth: 90,
                  }}
                >
                  {cronEnabled === null ? "…" : cronEnabled ? "ON" : "OFF"}
                </button>
                <span style={{ fontSize: 13 }}>
                  Scheduled daily cron is currently <strong>{cronEnabled ? "enabled" : "disabled"}</strong>
                </span>
              </div>
              <p className="muted" style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 0 }}>
                Configured time: <code>{configuredSchedule || "loading…"}</code>. This toggle is real and enforced
                server-side (the scheduled job checks it and skips its work when off) — but changing the actual{" "}
                <em>time of day</em> isn't something this panel can do: Vercel Cron's schedule comes from{" "}
                <code>vercel.json</code> and can only be changed by editing that file and redeploying (Vercel doesn't
                offer runtime schedule changes via API, and Hobby-tier accounts are limited to once-per-day
                schedules regardless of how they're set). See DEPLOY.md for how to change it.
              </p>

              <div className="muted" style={{ margin: "18px 0 10px", textTransform: "uppercase", fontSize: 12, letterSpacing: 1 }}>
                Manual Trigger
              </div>
              <p style={{ fontSize: 13, marginBottom: 14 }}>
                Runs the job right now regardless of the toggle above. Full "active" catalog can take a while —
                this waits for it to finish.
              </p>
              <button onClick={handleRunCron} disabled={cronRunning} style={{ ...buttonStyle, opacity: cronRunning ? 0.7 : 1 }}>
                {cronRunning ? "Running… (this can take a minute)" : "Run cron now"}
              </button>
              {cronResult && (
                <pre
                  style={{
                    marginTop: 14,
                    padding: 12,
                    background: "var(--bg2)",
                    borderRadius: 8,
                    fontSize: 12,
                    overflowX: "auto",
                  }}
                >
                  {JSON.stringify(cronResult, null, 2)}
                </pre>
              )}
            </div>
          )}

          {tab === "petition" && (
            <div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                <button
                  onClick={() => downloadCsv("/api/petition/list?format=csv", "petition_signatures.csv")}
                  style={{ ...buttonStyle, background: "transparent", color: "var(--text)", border: "1px solid var(--border)" }}
                >
                  Download CSV
                </button>
              </div>
              <div className="card" style={{ overflowX: "auto" }}>
                <table>
                  <thead><tr><th>When</th><th>Name</th><th>Country</th><th>Comment</th></tr></thead>
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

          {tab === "crowdfund" && (
            <div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                <button
                  onClick={() => downloadCsv("/api/crowdfund/list?format=csv", "crowdfund_interest.csv")}
                  style={{ ...buttonStyle, background: "transparent", color: "var(--text)", border: "1px solid var(--border)" }}
                >
                  Download CSV
                </button>
              </div>
              <div className="card" style={{ overflowX: "auto" }}>
                <table>
                  <thead><tr><th>When</th><th>Name</th><th>Email</th><th>Indicative $</th><th>Comment</th></tr></thead>
                  <tbody>
                    {interest.map((r) => (
                      <tr key={r.id}>
                        <td>{new Date(r.created_at).toISOString()}</td>
                        <td>{r.name || <span className="muted">—</span>}</td>
                        <td>{r.email || <span className="muted">—</span>}</td>
                        <td>{r.indicative_usd != null ? `$${Number(r.indicative_usd).toLocaleString()}` : <span className="muted">—</span>}</td>
                        <td>{r.comment || <span className="muted">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
