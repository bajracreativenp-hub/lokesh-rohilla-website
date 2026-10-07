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

  images: {
    /*
      DEMO PHOTOGRAPHY, FROM UNSPLASH.

      Every `ImageSlot` currently reserves its box and renders a visible
      "Photography pending" label, because no photography of Lokesh has been
      supplied and none may be invented. That is the correct state for a live
      site and it stays the fallback: a slot with no `src` renders exactly as
      before.

      For the demo, real images are served from Unsplash so the layout can be
      judged with pictures in it. The CDN is allowlisted here rather than
      wildcarded, because `next/image` refuses any remote host that is not
      declared and an open pattern would let any URL through.

      `photo-*` is Unsplash's own filename prefix on its CDN. `w` and `q` are
      already supplied per-image by the loader, so they are not restated here.

      TO GO LIVE: delete every `src` in the content layer, then remove this
      block. Unsplash images are placeholders for other people's photographs and
      must not survive into a real personal brand site. `ImageSlot` will render
      its pending state again with no other change.
    */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-**",
      },
    ],
  },
};

export default nextConfig;