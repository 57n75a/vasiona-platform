// Shared input checks for the public write endpoints (petition + crowdfund).

/**
 * Returns a normalised (trimmed, lower-cased) email address, or null when the
 * input is not a plausible email. Deliberately pragmatic rather than RFC-perfect:
 * one "@", a non-empty local part, a dotted domain, no whitespace, max 200 chars.
 */
export function normalizeEmail(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const e = input.trim().toLowerCase();
  if (e.length < 5 || e.length > 200) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return null;
  return e;
}

export type FormError = "invalid_email" | "consent_required";
