/**
 * FOOTER NAVIGATION
 *
 * Mirrors the top level navigation so the two agree, and groups the nine
 * destinations under three headings. The footer is the one place a visitor can
 * see the whole architecture at once without opening a dropdown, so it carries
 * the two that have no home in the top row: Cart and My Account.
 *
 * CTA INTENT LOCK (design rule, enforced here):
 * Every distinct action gets exactly one label across the whole site, so the
 * visitor never faces two competing wordings for the same intent.
 *
 *   about intent    -> "Discover Lokesh"
 *   contact intent  -> "Work With Lokesh"
 *   offer intent    -> "Business Health Check"   (a specific diagnostic offer)
 *
 * Repeats elsewhere on the page are demoted to text links, never buttons.
 */

import { NAV } from "@/lib/ia";

export type NavItem = {
  label: string;
  href: string;
};

/** Every destination, for the flat lists. Mirrors `DESTINATIONS` in ia.ts. */
export const allDestinations: NavItem[] = [
  { label: "My Story", href: "/about" },
  { label: "Business Consultation", href: "/services/business-consultation" },
  { label: "Self-Development Programs", href: "/services/self-development" },
  { label: "Leaders & Team Development", href: "/services/leaders-teams" },
  { label: "Events", href: "/events" },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export const navCta: NavItem = {
  label: "Business Health Check",
  href: "/services/business-consultation#health-checker",
};

/**
 * Footer groups. Grouped by what a visitor is trying to do, not by org chart.
 */
export const footerGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "About",
    items: [
      { label: "My Story", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Gallery", href: "/gallery" },
      { label: "Events", href: "/events" },
    ],
  },
  {
    label: "Services",
    items: [
      { label: "Business Consultation", href: "/services/business-consultation" },
      { label: "Self-Development Programs", href: "/services/self-development" },
      { label: "Leaders & Team Development", href: "/services/leaders-teams" },
    ],
  },
  {
    label: "Connect",
    items: [
      { label: "Contact", href: "/contact" },
      { label: "Shop", href: "/shop" },
      { label: "Cart", href: "/cart" },
      { label: "My Account", href: "/account" },
    ],
  },
];

/**
 * The top level entries, re-exported so the footer does not import two modules
 * to describe the same navigation.
 */
export const primaryNav = NAV;

/**
 * SITE ORIGIN, DEFINED ONCE.
 *
 * Three places need an absolute origin: the root layout's `metadataBase`, which
 * builds every Open Graph and canonical URL, the sitemap, and robots.txt. They
 * were each assembling the same ternary independently, which is exactly how
 * they came to disagree. They now read this one constant.
 *
 * The live origin is the custom domain, NOT `VERCEL_PROJECT_PRODUCTION_URL`.
 * That variable is the per-project deployment URL and resolves to the
 * lokesh-rohilla-website.vercel.app subdomain. A canonical tag pointing there
 * tells search engines the custom domain is a duplicate of the subdomain. The
 * subdomain still serves the site; it is simply not the address to advertise.
 *
 * `NEXT_PUBLIC_SITE_URL` overrides it, and is meant for local development only,
 * so `npm run dev` emits localhost Open Graph URLs instead of claiming to be
 * production. It is not set on Vercel, so the constant below is what ships.
 *
 * The value is a bare origin: no trailing slash, no path.
 */
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lokeshrohilla.com";

/** Shared page width. Used by the container primitive and every section. */
export const pageMaxWidth = "max-w-[1400px]";