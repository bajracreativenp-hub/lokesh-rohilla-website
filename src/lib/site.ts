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

/** Shared page width. Used by the container primitive and every section. */
export const pageMaxWidth = "max-w-[1400px]";