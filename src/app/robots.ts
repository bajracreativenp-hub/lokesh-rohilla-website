import type { MetadataRoute } from "next";

import { SITE_ORIGIN } from "@/lib/site";

/**
 * ROBOTS
 *
 * Allows all crawlers on all routes (individual pages that should not be
 * indexed carry `robots: { index: false }` in their own metadata — cart,
 * checkout, account). The sitemap URL is declared here so crawlers discover
 * it without needing to be told separately.
 *
 * `host` is omitted deliberately: it was removed from the robots.txt spec
 * and Next.js no longer includes it in the generated output.
 *
 * The origin is shared with the layout's `metadataBase` and the sitemap, so all
 * three always advertise the same address.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout", "/account"],
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
