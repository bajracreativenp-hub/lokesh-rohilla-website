import { getPayload } from "payload";
import configPromise from "@payload-config";

export type LiveProduct = {
  id: string | number;
  title: string;
  slug: string;
  type: "book" | "course" | "consultation" | "workshop";
  price: number;
  currency: "USD" | "INR" | "EUR" | "GBP";
  active: boolean;
  featured?: boolean;
  image?: {
    url?: string;
    alt?: string;
  } | null;
  description?: string;
  externalBuyUrl?: string | null;
};

export type LiveEvent = {
  id: string | number;
  title: string;
  slug: string;
  date: string;
  locationType: "in-person" | "virtual" | "hybrid";
  venue: string;
  timezone?: string | null;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  featured?: boolean;
  bannerImage?: {
    url?: string;
    alt?: string;
  } | null;
  description?: unknown;
  registrationUrl?: string | null;
};

export type LivePost = {
  id: string | number;
  title: string;
  slug: string;
  category: "business-strategy" | "leadership" | "mindset" | "case-studies" | "press";
  status: "draft" | "published";
  publishedAt?: string;
  readingTime?: number;
  excerpt: string;
  featuredImage?: {
    url?: string;
    alt?: string;
  } | null;
  content?: unknown;
};

export type LiveGalleryItem = {
  id: string | number;
  title: string;
  image: {
    url?: string;
    alt?: string;
  } | null;
  caption?: string;
  category: "speaking" | "workshops" | "client-transformations" | "media-press" | "behind-the-scenes";
  featured?: boolean;
  order?: number;
  date?: string;
};

/**
 * Safely extracts human-readable text from Payload Lexical RichText AST.
 */
export function extractTextFromLexical(lexical: unknown): string {
  if (!lexical) return "";
  if (typeof lexical === "string") return lexical;

  try {
    const texts: string[] = [];
    const traverse = (node: unknown) => {
      if (!node || typeof node !== "object") return;
      const n = node as { text?: unknown; children?: unknown[] };
      if (typeof n.text === "string" && n.text.trim()) {
        texts.push(n.text.trim());
      }
      if (Array.isArray(n.children)) {
        n.children.forEach(traverse);
      }
    };
    const root = (lexical as { root?: unknown }).root ?? lexical;
    traverse(root);
    return texts.join(" ").trim();
  } catch {
    return "";
  }
}

/**
 * Get active products from Payload CMS.
 */
export async function getLiveProducts(): Promise<LiveProduct[]> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "products",
      where: {
        active: {
          equals: true,
        },
      },
      sort: "-createdAt",
      limit: 50,
      depth: 1,
    });
    return (result.docs as unknown as LiveProduct[]) ?? [];
  } catch (error) {
    console.warn("Could not query live products from Payload CMS:", error);
    return [];
  }
}

/**
 * Get upcoming & ongoing events from Payload CMS.
 */
export async function getLiveEvents(): Promise<LiveEvent[]> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "events",
      where: {
        status: {
          not_equals: "cancelled",
        },
      },
      sort: "date",
      limit: 50,
      depth: 1,
    });
    return (result.docs as unknown as LiveEvent[]) ?? [];
  } catch (error) {
    console.warn("Could not query live events from Payload CMS:", error);
    return [];
  }
}

/**
 * Get published blog posts from Payload CMS.
 */
export async function getLivePosts(): Promise<LivePost[]> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "posts",
      where: {
        status: {
          equals: "published",
        },
      },
      sort: "-publishedAt",
      limit: 50,
      depth: 1,
    });
    return (result.docs as unknown as LivePost[]) ?? [];
  } catch (error) {
    console.warn("Could not query live posts from Payload CMS:", error);
    return [];
  }
}

export type MediaRelation =
  | {
      url?: string;
      alt?: string;
    }
  | number
  | string
  | null
  | undefined;

export type LiveSiteSettings = {
  siteTitle?: string;
  tagline?: string;
  themePreset?:
    | "royal-blue"
    | "blanxer-violet"
    | "emerald"
    | "crimson"
    | "amber"
    | "teal"
    | "indigo"
    | "custom";
  customAccentColor?: string | null;
  fontFamily?:
    | "instrument-sans"
    | "inter"
    | "plus-jakarta"
    | "dm-sans"
    | "space-grotesk"
    | "outfit";
  serifFontFamily?: "instrument-serif" | "playfair" | "fraunces";
  heroPortrait?: MediaRelation;
  heroArtworkUrl?: string | null;
  heroWordmark?: string | null;
  heroLede?: string | null;
  hungerPortrait?: MediaRelation;
  hungerPortraitUrl?: string | null;
  hungerVideoThumb?: MediaRelation;
  hungerVideoUrl?: string | null;
  coachingVideoThumb?: MediaRelation;
  coachingVideoUrl?: string | null;
  pathOneImage?: MediaRelation;
  pathTwoImage?: MediaRelation;
  pathThreeImage?: MediaRelation;
  testimonialOneThumb?: MediaRelation;
  testimonialOneTitle?: string | null;
  testimonialOneUrl?: string | null;
  testimonialTwoThumb?: MediaRelation;
  testimonialTwoTitle?: string | null;
  testimonialTwoUrl?: string | null;
  testimonialThreeThumb?: MediaRelation;
  testimonialThreeTitle?: string | null;
  testimonialThreeUrl?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  socialLinks?: {
    linkedin?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    youtube?: string | null;
  };
  diagnosticQuizActive?: boolean;
};

/**
 * Resolves a Payload Media upload object or optional URL string, falling back to defaultSrc.
 */
export function resolveMediaUrl(
  upload: MediaRelation,
  urlFallback: string | null | undefined,
  defaultSrc: string,
): string {
  if (upload && typeof upload === "object" && typeof upload.url === "string" && upload.url.trim()) {
    return upload.url.trim();
  }
  if (typeof urlFallback === "string" && urlFallback.trim()) {
    return urlFallback.trim();
  }
  return defaultSrc;
}

/**
 * Get global SiteSettings (theme color, fonts, landing page photos & videos).
 */
export async function getSiteSettings(): Promise<LiveSiteSettings> {
  try {
    const payload = await getPayload({ config: configPromise });
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 1,
    });
    return (settings as unknown as LiveSiteSettings) ?? {};
  } catch (error) {
    console.warn("Could not query site-settings from Payload CMS:", error);
    return {};
  }
}

/**
 * Get gallery items from Payload CMS.
 */
export async function getLiveGallery(): Promise<LiveGalleryItem[]> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "gallery",
      sort: "order",
      limit: 50,
      depth: 1,
    });
    return (result.docs as unknown as LiveGalleryItem[]) ?? [];
  } catch (error) {
    console.warn("Could not query live gallery from Payload CMS:", error);
    return [];
  }
}
