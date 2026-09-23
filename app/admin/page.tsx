"use client";

import { useState, useEffect } from "react";

interface Signature {
  id: number;
  name: string | null;
  email: string | null;
  country: string | null;
  comment: string | null;
  contact_consent: boolean | null;
  created_at: string;
}

interface InterestRow {
  id: number;
  name: string | null;
  email: string | null;
  indicative_usd: number | null;
  comment: string | null;
  contact_consent: boolean | null;
  created_at: string;
}

type Tab = "cron" | "petition" | "crowdfund";

// A manual run can genuinely take up to ~45s (see CRON_TIME_BUDGET_MS in
// lib/cronRunner.ts) and hits both CelesTrak and the DB fairly hard —
// disabling the button for a few minutes afterward stops someone (or an
// impatient double-click) from firing off several overlapping runs in a row.
// Purely a UI courtesy: the underlying endpoint isn't rate-limited server-side,
// so a direct curl still works any time.
const RUN_COOLDOWN_MS = 4 * 60 * 1000; // 4 minutes

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

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
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());
  const [cronHistory, setCronHistory] = useState<any>(null);

  // Ticks once a second only while a cooldown is actually active, so the
  // "Available in m:ss" label counts down live instead of needing a refresh.
  useEffect(() => {
    if (!cooldownUntil) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [cooldownUntil]);

  const cooldownRemainingMs = cooldownUntil ? cooldownUntil - now : 0;
  const cooldownActive = cooldownRemainingMs > 0;
  useEffect(() => {
    if (cooldownUntil && !cooldownActive) setCooldownUntil(null);
  }, [cooldownActive, cooldownUntil]);

  async function authedFetch(path: string, opts: RequestInit = {}) {
    return fetch(path, {
      ...opts,
      headers: { ...(opts.headers || {}), Authorization: `Bearer ${secret}` },
    });
  }

  async function fetchCronStatus() {
    const res = await fetch("/api/admin/cron-status", { headers: { Authorization: `Bearer ${secret}` } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.lastRunAt) {
      const until = new Date(data.lastRunAt).getTime() + RUN_COOLDOWN_MS;
      if (until > Date.now()) setCooldownUntil(until);
    }
    setCronHistory(data.history ?? null);
    return data;
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

      // Fetch cron settings + last-run status/history too, now that we have a
      // confirmed-good secret — status seeds the cooldown so a page reload
      // shortly after a run still shows the countdown instead of resetting it.
      const csRes = await fetch("/api/admin/cron-settings", { headers: { Authorization: `Bearer ${secret}` } });
      if (csRes.ok) {
        const csData = await csRes.json();
        setCronEnabledState(csData.enabled);
        setConfiguredSchedule(csData.configuredSchedule);
      }
      await fetchCronStatus();
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
      // Start the cooldown from when the run actually finished, not from
      // when it was kicked off — a run can take up to ~45s on its own.
      setCooldownUntil(Date.now() + RUN_COOLDOWN_MS);
      setNow(Date.now());
      fetchCronStatus(); // pulls the just-finished run into cronHistory
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
              <p style={{ fontSize: 13, marginBottom: 6 }}>
                Runs the job right now regardless of the toggle above. Samples a short window per candidate satellite
                (see docs/BUILD_LOG.md) and always finishes within ~45s — it won't hang.
              </p>
              <p className="muted" style={{ fontSize: 12, marginBottom: 14 }}>
                To avoid firing off overlapping runs, this button re-enables{" "}
                {Math.round(RUN_COOLDOWN_MS / 60000)} minutes after each one finishes. The underlying endpoint itself
                has no such limit — a direct <code>curl</code> with <code>CRON_SECRET</code> works any time.
              </p>
              <button
                onClick={handleRunCron}
                disabled={cronRunning || cooldownActive}
                style={{
                  ...buttonStyle,
                  opacity: cronRunning || cooldownActive ? 0.55 : 1,
                  cursor: cronRunning || cooldownActive ? "not-allowed" : "pointer",
                  background: cooldownActive && !cronRunning ? "var(--border)" : buttonStyle.background,
                  color: cooldownActive && !cronRunning ? "var(--text)" : buttonStyle.color,
                }}
              >
                {cronRunning
                  ? "Running… (usually under a minute)"
                  : cooldownActive
                  ? `Available in ${formatCountdown(cooldownRemainingMs)}`
                  : "Run cron now"}
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

              {cronHistory && cronHistory.runs?.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div className="muted" style={{ textTransform: "uppercase", fontSize: 12, letterSpacing: 1, marginBottom: 8 }}>
                    Run History (last {cronHistory.runs.length})
                  </div>
                  <div style={{ display: "flex", gap: 24, marginBottom: 10, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>
                        {cronHistory.averageDurationMsCleanOnly !== null
                          ? `${(cronHistory.averageDurationMsCleanOnly / 1000).toFixed(1)}s`
                          : "—"}
                      </div>
                      <div className="muted" style={{ fontSize: 11.5 }}>average duration (clean runs)</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>
                        {cronHistory.averageDurationMs !== null ? `${(cronHistory.averageDurationMs / 1000).toFixed(1)}s` : "—"}
                      </div>
                      <div className="muted" style={{ fontSize: 11.5 }}>average duration (all runs, incl. truncated/errored)</div>
                    </div>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: "left", padding: "4px 8px" }}>When</th>
                          <th style={{ textAlign: "right", padding: "4px 8px" }}>Duration</th>
                          <th style={{ textAlign: "right", padding: "4px 8px" }}>Checked</th>
                          <th style={{ textAlign: "right", padding: "4px 8px" }}>Matched</th>
                          <th style={{ textAlign: "left", padding: "4px 8px" }}>Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cronHistory.runs.map((r: any, i: number) => (
                          <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                            <td style={{ padding: "4px 8px" }}>{new Date(r.ranAt).toISOString().replace("T", " ").slice(0, 19)} UTC</td>
                            <td style={{ padding: "4px 8px", textAlign: "right" }}>
                              {r.durationMs !== null ? `${(r.durationMs / 1000).toFixed(1)}s` : "—"}
                            </td>
                            <td style={{ padding: "4px 8px", textAlign: "right" }}>{r.checked ?? "—"}</td>
                            <td style={{ padding: "4px 8px", textAlign: "right" }}>{r.matched ?? "—"}</td>
                            <td style={{ padding: "4px 8px" }}>
                              {r.error ? (
                                <span style={{ color: "var(--accent)" }}>error: {r.error}</span>
                              ) : r.truncated ? (
                                <span className="muted">truncated (time budget)</span>
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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
                  <thead><tr><th>When</th><th>Name</th><th>Email</th><th>Country</th><th>Comment</th><th>May contact</th></tr></thead>
                  <tbody>
                    {signatures.map((s) => (
                      <tr key={s.id}>
                        <td>{new Date(s.created_at).toISOString()}</td>
                        <td>{s.name || <span className="muted">—</span>}</td>
                        <td>{s.email || <span className="muted">—</span>}</td>
                        <td>{s.country || <span className="muted">—</span>}</td>
                        <td>{s.comment || <span className="muted">—</span>}</td>
                        <td>{s.contact_consent ? "yes" : <span className="muted">no</span>}</td>
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
                  <thead><tr><th>When</th><th>Name</th><th>Email</th><th>Indicative $</th><th>Comment</th><th>May contact</th></tr></thead>
                  <tbody>
                    {interest.map((r) => (
                      <tr key={r.id}>
                        <td>{new Date(r.created_at).toISOString()}</td>
                        <td>{r.name || <span className="muted">—</span>}</td>
                        <td>{r.email || <span className="muted">—</span>}</td>
                        <td>{r.indicative_usd != null ? `$${Number(r.indicative_usd).toLocaleString()}` : <span className="muted">—</span>}</td>
                        <td>{r.comment || <span className="muted">—</span>}</td>
                        <td>{r.contact_consent ? "yes" : <span className="muted">no</span>}</td>
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
