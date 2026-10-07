/**
 * INFORMATION ARCHITECTURE
 * ===========================================================================
 * Ten pages. Every page carries its content as in-page sections with anchors,
 * so a visitor can see the whole of a topic on one screen and jump to any part
 * of it.
 *
 * NAVIGATION, exactly as specified:
 *
 *   About       My Story, Events, Blog, Gallery
 *   Services    Business Consultation, Self-Development Programs,
 *               Leaders & Team Development
 *   Events      the events page
 *   Shop        the shop page
 *   Contact Us  the contact page
 *
 * Note that Events appears twice: once at the top level and once inside the
 * About dropdown. That was the brief, so it is what is built. Both links resolve to
 * the same page, so it is a redundancy rather than a dead end, and it is still an
 * open question for the client rather than a settled decision.
 *
 * ROUTING IS SIMPLE ON PURPOSE
 * Ten static routes plus cart, checkout and account. There is no dynamic route
 * and no content registry indirection: each page is one file whose sections are
 * listed in `page-content.ts`. A page you can read end to end in one file is
 * easier to review than a registry plus a renderer.
 *
 * GROUNDING RULE, unchanged and absolute: no invented testimonials, reviews,
 * ratings, statistics, dates, prices, client names or outcomes. Where the
 * client has not supplied something, the page says so visibly.
 */

/** A top level navigation entry. Three of them open a dropdown. */
export type NavEntry = {
  label: string;
  href: string;
  /** Present only on entries that open a dropdown. */
  children?: { label: string; href: string; hint: string }[];
};

export const NAV: NavEntry[] = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "My Story", href: "/about", hint: "The complete biography" },
      { label: "Events", href: "/events", hint: "Where to meet in person" },
      { label: "Blog", href: "/blog", hint: "Writing and video" },
      { label: "Gallery", href: "/gallery", hint: "Photographs and footage" },
    ],
  },
  {
    label: "Services",
    href: "/services/business-consultation",
    children: [
      {
        label: "Business Consultation",
        href: "/services/business-consultation",
        hint: "Diagnosis before prescription",
      },
      {
        label: "Self-Development Programs",
        href: "/services/self-development",
        hint: "A self development center, founded 2021",
      },
      {
        label: "Leaders & Team Development",
        href: "/services/leaders-teams",
        hint: "For organizations, not individuals",
      },
    ],
  },
  { label: "Events", href: "/events" },
  { label: "Shop", href: "/shop" },
  { label: "Contact Us", href: "/contact" },
];

/**
 * A destination card. Drives the homepage platform grid and the footer, so the
 * homepage stays visually identical while its links stay valid.
 *
 * The nine cards match the nine destinations the brief describes: My Story,
 * three services, Events, Shop, Blog, Gallery, Contact.
 */
export type Destination = {
  slug: string;
  label: string;
  href: string;
  summary: string;
  /** Needs a provider the client has not chosen yet. Stated on the page. */
  state: "live" | "integration";
};

export const DESTINATIONS: Destination[] = [
  {
    slug: "about",
    label: "My Story",
    href: "/about",
    summary: "The story, the journey, the philosophy and the standards held to.",
    state: "live",
  },
  {
    slug: "business-consultation",
    label: "Business Consultation",
    href: "/services/business-consultation",
    summary: "Diagnosis first. Business consulting and transformation.",
    state: "live",
  },
  {
    slug: "self-development",
    label: "Self-Development Programs",
    href: "/services/self-development",
    summary: "A self development center founded in 2021. Learning that changes how you work.",
    state: "live",
  },
  {
    slug: "leaders-teams",
    label: "Leaders & Team Development",
    href: "/services/leaders-teams",
    summary: "Leadership, communication, performance and culture for organizations.",
    state: "live",
  },
  {
    slug: "events",
    label: "Events",
    href: "/events",
    summary: "Masterclasses, workshops, corporate training and live events.",
    state: "integration",
  },
  {
    slug: "shop",
    label: "Shop",
    href: "/shop",
    summary: "Books, workbooks and recorded programs.",
    state: "integration",
  },
  {
    slug: "blog",
    label: "Blog",
    href: "/blog",
    summary: "Writing and video on business, leadership and self development.",
    state: "live",
  },
  {
    slug: "gallery",
    label: "Gallery",
    href: "/gallery",
    summary: "Photography and video from the work, the sessions and the stage.",
    state: "live",
  },
  {
    slug: "contact",
    label: "Contact",
    href: "/contact",
    summary: "Get in touch, book a consultation, or bring Lokesh to your organization.",
    state: "live",
  },
];

export const destinationByHref = (href: string) =>
  DESTINATIONS.find((d) => d.href === href);

/** The five verbs under the homepage hero. */
export const VERBS = [
  { label: "Explore", href: "/services/business-consultation" },
  { label: "Learn", href: "/blog" },
  { label: "Get Help", href: "/contact" },
  { label: "Join", href: "/services/self-development" },
  { label: "Shop", href: "/shop" },
];

/** The three paths in the homepage path selector, which is unchanged. */
export const PATHS = [
  {
    label: "Businesses",
    href: "/services/business-consultation",
    eyebrow: "Business Consultation",
  },
  {
    label: "Individuals",
    href: "/services/self-development",
    eyebrow: "Self-Development Programs",
  },
  {
    label: "Leaders & Teams",
    href: "/services/leaders-teams",
    eyebrow: "Leaders & Team Development",
  },
];

/**
 * ROUTE LIST AND REDIRECTS
 *
 * Re-exported from `routes.json` rather than written here, because three
 * consumers need to agree on them: the application, `next.config.ts`, and the
 * plain node verification scripts. Keeping one copy means a section cannot be
 * renamed without the old anchor being updated in the same place.
 *
 * JSON rather than TypeScript specifically so that a script run with bare
 * `node` can read it without a TypeScript loader.
 */
import routeData from "@/lib/routes.json";

/** Every route the site serves, for the sitemap and the route audit. */
export const ROUTES: string[] = routeData.routes;

/**
 * Every URL that existed under the previous structure, and where its content
 * lives now. All of them redirect with 308.
 */
export const LEGACY_REDIRECTS: { from: string; to: string }[] = routeData.legacyRedirects;