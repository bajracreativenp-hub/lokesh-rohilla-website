import type { NextConfig } from "next";

import routeData from "./src/lib/routes.json";

/**
 * Permanent moves.
 *
 * The architecture is now ten pages with in-page sections, where before it was
 * seventy routes. Every URL that existed under the old structure may already be
 * shared or indexed, so each one redirects with 308 to the page, or the anchor
 * within that page, which now holds the same content.
 *
 * The list is read from `src/lib/routes.json` rather than from `src/lib/ia.ts`.
 * That is deliberate: `next.config.ts` is compiled to CommonJS before it runs,
 * where the `@/` path alias does not resolve, so importing app code from here
 * fails to load the config at all. The JSON is plain data, so it can be read by
 * this file, by the application, and by the plain node verification scripts
 * without any of them needing a TypeScript loader.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...routeData.legacyRedirects.map(({ from, to }: { from: string; to: string }) => ({
        source: from,
        destination: to,
        permanent: true,
      })),
      // Anything deeper under a retired initiative lands on its new parent page.
      {
        source: "/business-doctor/:slug",
        destination: "/services/business-consultation",
        permanent: true,
      },
      {
        source: "/bookwishes-club/:slug",
        destination: "/services/self-development",
        permanent: true,
      },
      {
        source: "/leaders-and-teams/:slug",
        destination: "/services/leaders-teams",
        permanent: true,
      },
      { source: "/insights/:slug", destination: "/blog", permanent: true },
    ];
  },

  trailingSlash: false,
};

export default nextConfig;