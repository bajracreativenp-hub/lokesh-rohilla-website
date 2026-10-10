import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";

import { CartProvider } from "@/components/commerce/cart-context";
import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";
import { SITE_DESCRIPTION } from "@/lib/content";
import { SITE_ORIGIN } from "@/lib/site";

import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-scroll-behavior restores smooth anchor scrolling under Next 16 SPA
    // navigation, which no longer patches scroll-behavior automatically.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${serif.variable}`}
    >
      <head>
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
      <body className="min-h-[100dvh] bg-canvas text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--z-skip)] focus:h-auto focus:w-auto focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-canvas"
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
