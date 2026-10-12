// Cross-origin support for the two write endpoints new.vasiona.org's
// /petition and /crowdfund pages submit to directly (see docs/BUILD_LOG.md,
// "native petition/crowdfund pages on new.vasiona.org"). Deliberately an
// allow-list, not a wildcard: these are POST endpoints that write to the
// real database, so reflecting an arbitrary Origin would let any site
// submit signatures/interest on a visitor's behalf via their browser.
const ALLOWED_ORIGINS = [
  "https://new.vasiona.org",
  "https://www.new.vasiona.org",
  // Local development against the new site.
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

export function corsHeaders(origin: string | null): HeadersInit {
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

/** Handles a CORS preflight request. Call from each route's OPTIONS export. */
export function handleOptions(req: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}
