import type { Metadata, Viewport } from "next";
import {
  DM_Sans,
  Fraunces,
  Instrument_Sans,
  Instrument_Serif,
  Inter,
  JetBrains_Mono,
  Outfit,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Space_Grotesk,
} from "next/font/google";

import { CartProvider } from "@/components/commerce/cart-context";
import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";
import { getSiteSettings } from "@/lib/cms";
import { SITE_DESCRIPTION } from "@/lib/content";
import { SITE_ORIGIN } from "@/lib/site";

import "../globals.css";

/**
 * TWO FAMILIES NOW, WHERE THERE WAS ONE.
 *
 * Plus Jakarta Sans carried everything, on the principle that hierarchy should come
 * from weight and colour rather than from mixing typefaces. That principle does not
 * hold once headings are set at weight 400, because at that weight size alone stops
 * carrying enough hierarchy and the page flattens.
 *
 * Instrument Sans replaces Plus Jakarta Sans as the text face. Instrument Serif
 * exists for exactly one job: single letters dropped inside a heading, the way
 * "Coll-a-borate" and "o-n-e" are set. Those are real, visible typographic
 * decisions rather than decoration, and they are the most recognisable thing about
 * the whole direction.
 *
 * SCOPE WARNING, STATED PLAINLY
 *
 * `--font-sans` is a global token, so this changes all fourteen routes and not
 * just the homepage. Building the homepage with one family and the other pages
 * with another would need a per page font override on every heading, which is a
 * hack that breaks the moment a new page is added. A site with two typefaces is a
 * decision; a site where the typeface depends on the route is a bug.
 *
 * Note this reverses an explicit earlier decision, recorded in globals.css, that
 * there is no separate display face. That is intentional and the comment there has
 * been updated to say so.
 */

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

/*
  A THIRD FAMILY, FOR ONE COMPONENT.

  JetBrains Mono exists for the oversized step figures in the process section and
  nothing else. It is a variable font, so the whole family costs one file rather
  than one per weight, and only the four digits of a step number are ever set in it.

  It is not `--font-mono`. Tailwind's `font-mono` is the token for code, and code
  appears in the health checker and in the event listings; repointing that would
  change the face of every figure, timestamp and label on the site as a side effect
  of one decorative decision. This is `--font-figure`, mapped in globals.css, and
  nothing else can reach it.

  One weight is loaded. The numbers are set large and bold enough that the face
  reads on weight alone, and a monospace's character is its proportion rather than
  its range.
*/
const figure = JetBrains_Mono({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const THEME_PALETTES: Record<string, { light: string; dark: string }> = {
  "royal-blue": { light: "#3b5fcc", dark: "#93a9f5" },
  "blanxer-violet": { light: "#6d28d9", dark: "#c4b5fd" },
  emerald: { light: "#047857", dark: "#6ee7b7" },
  crimson: { light: "#b91c1c", dark: "#fca5a5" },
  amber: { light: "#b45309", dark: "#fcd34d" },
  teal: { light: "#0f766e", dark: "#5eead4" },
  indigo: { light: "#4338ca", dark: "#a5b4fc" },
};

const SANS_FONT_VARS: Record<string, string> = {
  "instrument-sans": "--font-instrument-sans",
  inter: "--font-inter",
  "plus-jakarta": "--font-plus-jakarta",
  "dm-sans": "--font-dm-sans",
  "space-grotesk": "--font-space-grotesk",
  outfit: "--font-outfit",
};

const SERIF_FONT_VARS: Record<string, string> = {
  "instrument-serif": "--font-instrument-serif",
  playfair: "--font-playfair",
  fraunces: "--font-fraunces",
};

export const metadata: Metadata = {
  /*
    metadataBase: makes every Open Graph URL and canonical absolute rather than
    relative, which is required for social cards to resolve correctly.

    The origin lives in `SITE_ORIGIN` and is shared with the sitemap and
    robots.txt, so the three cannot drift apart. It is the custom domain, not
    the Vercel deployment subdomain. See the comment there before changing it.
  */
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Lokesh Rohilla | Business Consultant, Mentor, Transformation Leader",
    template: "%s | Lokesh Rohilla",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Lokesh Rohilla",
    title: "Lokesh Rohilla | Business Consultant, Mentor, Transformation Leader",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lokesh Rohilla — Business Consultant, Mentor, Transformation Leader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lokesh Rohilla | Business Consultant, Mentor, Transformation Leader",
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  const customHex = settings.customAccentColor?.trim();
  const isValidHex = Boolean(customHex && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(customHex));
  const preset = THEME_PALETTES[settings.themePreset || "royal-blue"] ?? THEME_PALETTES["royal-blue"];
  const accentLight = isValidHex && customHex ? customHex : preset.light;
  const accentDark = isValidHex && customHex ? customHex : preset.dark;

  const activeSansVar =
    SANS_FONT_VARS[settings.fontFamily || "instrument-sans"] ?? "--font-instrument-sans";
  const activeSerifVar =
    SERIF_FONT_VARS[settings.serifFontFamily || "instrument-serif"] ?? "--font-instrument-serif";

  const fontClasses = [
    sans.variable,
    serif.variable,
    figure.variable,
    inter.variable,
    plusJakarta.variable,
    dmSans.variable,
    spaceGrotesk.variable,
    outfit.variable,
    playfair.variable,
    fraunces.variable,
  ].join(" ");

  const dynamicThemeCss = `:root{--accent:${accentLight};--font-instrument-sans:var(${activeSansVar});--font-instrument-serif:var(${activeSerifVar});}.band-dark,.on-ink{--accent:${accentDark};}body{font-family:var(${activeSansVar}),ui-sans-serif,system-ui,sans-serif;}`;

  return (
    // data-scroll-behavior restores smooth anchor scrolling under Next 16 SPA
    // navigation, which no longer patches scroll-behavior automatically.
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={fontClasses}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: dynamicThemeCss }} />
        {/*
          Motion writes opacity:0 into the server rendered HTML for every
          reveal wrapper. If JavaScript is unavailable, blocked or still
          loading, the page would otherwise render completely blank. This
          forces revealed content back to its resting, readable state.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body suppressHydrationWarning className="min-h-[100dvh] bg-canvas text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--z-skip)] focus:h-auto focus:w-auto focus:bg-ink focus:px-5 focus:py-3 focus:text-sm font-semibold focus:text-canvas"
        >
          Skip to content
        </a>
        {/* CartProvider wraps everything because the nav renders the cart
            badge, and the provider must exist for the whole tree. */}
        <CartProvider>
          <Nav />
          <main id="main" className="scroll-mt-[72px]">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
