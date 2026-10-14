/** @type {import('next').NextConfig} */
// The overflight-fee campaign (petition, story, analytics) moved to its own
// site. Old links are sent there so nobody lands on a missing page.
const PETITION_SITE = "https://petition.vasiona.org";

const nextConfig = {
  async redirects() {
    return [
      { source: "/petition", destination: `${PETITION_SITE}/petition`, permanent: false },
      { source: "/petition/:path*", destination: `${PETITION_SITE}/petition/:path*`, permanent: false },
      { source: "/analytics", destination: `${PETITION_SITE}/analytics`, permanent: false },
      { source: "/story", destination: `${PETITION_SITE}/story`, permanent: false },
    ];
  },
  async headers() {
    return [
      {
        // The live map + "Последње ажурирање" timestamp live here and must
        // never be served from a cache. `app/page.tsx` already sets
        // `export const dynamic = "force-dynamic"`, which should already
        // imply no caching — these headers make it explicit and
        // unconditional so a leftover CDN/edge cache entry (e.g. from
        // before force-dynamic was added) or a browser cache can never be
        // the explanation again. See docs/BUILD_LOG.md, "the live map still
        // isn't updating (round 2)".
        source: "/",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
          { key: "Pragma", value: "no-cache" },
        ],
      },
    ];
  },
};

export default nextConfig;
