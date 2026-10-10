import type { MetadataRoute } from "next";

import { ROUTES } from "@/lib/ia";
import { SITE_ORIGIN } from "@/lib/site";

/**
 * SITEMAP
 *
 * Generated from the same `ROUTES` array that drives the nav and the route
 * audit scripts, so a route added to that list is automatically in the sitemap
 * and never forgotten. The three utility routes (cart, checkout, account) are
 * excluded because they carry `robots: { index: false }` and should not be
 * offered to crawlers.
 *
 * `changeFrequency` and `priority` are advisory only — Google has publicly
 * stated it largely ignores both — but they are included for completeness and
 * to satisfy any crawler that does read them.
 *
 * The homepage gets `changeFrequency: "weekly"` because it carries the
 * testimonials and insights sections that will update as content arrives.
 * Service pages are `"monthly"` — they change less often.
 */

/** Routes that are utility/transactional and should never be indexed. */
const EXCLUDED = new Set(["/cart", "/checkout", "/account"]);

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.filter((route) => !EXCLUDED.has(route)).map((route) => ({
    /*
      Absolute rather than a bare path. Next.js would resolve a relative `url`
      against the layout's `metadataBase`, which works, but building it from the
      shared origin here means the sitemap advertises the same address the
      canonical tags and robots.txt do, with no second resolution step that
      could quietly disagree.
    */
    url: `${SITE_ORIGIN}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === "/"
        ? "weekly"
        : route.startsWith("/services") || route === "/about"
          ? "monthly"
          : "weekly",
    priority: route === "/" ? 1.0 : route.startsWith("/services") ? 0.9 : 0.7,
  }));
}
