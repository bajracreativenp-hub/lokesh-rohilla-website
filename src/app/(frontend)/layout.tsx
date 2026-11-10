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
import { getSiteSettings, type LiveSiteSettings } from "@/lib/cms";
import { SITE_DESCRIPTION } from "@/lib/content";
import { SITE_ORIGIN } from "@/lib/site";

import "../globals.css";

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
  "royal-violet": { light: "#6d28d9", dark: "#c4b5fd" },
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

function cleanColor(val?: string | null): string | undefined {
  if (!val) return undefined;
  const trimmed = val.trim();
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(trimmed)) {
    return trimmed;
  }
  if (/^(rgb|rgba|hsl|hsla)\([0-9.,%\s/]+\)$/i.test(trimmed)) {
    return trimmed;
  }
  return undefined;
}

function cleanShadow(val?: string | null): string | undefined {
  if (!val) return undefined;
  const trimmed = val.trim();
  const hex = cleanColor(trimmed);
  if (hex) {
    return `0 20px 40px -20px ${hex}`;
  }
  if (/^[0-9a-zA-Z\s.,()#%-]+$/.test(trimmed)) {
    return trimmed;
  }
  return undefined;
}

function cleanFontName(val?: string | null): string | undefined {
  if (!val) return undefined;
  const trimmed = val.trim().replace(/["';<>\\]/g, "");
  return trimmed.length > 0 ? trimmed : undefined;
}

function buildDynamicThemeCss(settings: LiveSiteSettings): string {
  const preset = THEME_PALETTES[settings.themePreset || "royal-blue"] ?? THEME_PALETTES["royal-blue"];
  const masterHex =
    cleanColor(settings.brandPrimary) ||
    cleanColor(settings.brandAccent) ||
    cleanColor(settings.customAccentColor);

  const accentLight = masterHex || preset.light;
  const accentDark = masterHex || preset.dark;

  const activeSansVar =
    SANS_FONT_VARS[settings.fontFamily || "instrument-sans"] ?? "--font-instrument-sans";
  const activeSerifVar =
    SERIF_FONT_VARS[settings.serifFontFamily || "instrument-serif"] ?? "--font-instrument-serif";

  const customSans = cleanFontName(settings.customFontName);
  const customHeading = cleanFontName(settings.customHeadingFontName);

  const sansStack = customSans
    ? `"${customSans}", var(${activeSansVar}), ui-sans-serif, system-ui, sans-serif`
    : `var(${activeSansVar}), ui-sans-serif, system-ui, sans-serif`;

  const serifStack = customHeading
    ? `"${customHeading}", var(${activeSerifVar}), ui-serif, Georgia, serif`
    : `var(${activeSerifVar}), ui-serif, Georgia, serif`;

  const rootVars: string[] = [
    `--accent:${accentLight}`,
    `--font-instrument-sans:${sansStack}`,
    `--font-instrument-serif:${serifStack}`,
    `--brand-primary:${accentLight}`,
  ];

  // 1. Brand Colours
  const brandPrimaryHover = cleanColor(settings.brandPrimaryHover);
  const brandPrimaryActive = cleanColor(settings.brandPrimaryActive);
  const brandPrimaryLight = cleanColor(settings.brandPrimaryLight);
  const brandPrimaryDark = cleanColor(settings.brandPrimaryDark);
  const brandSecondary = cleanColor(settings.brandSecondary);
  const brandAccent = cleanColor(settings.brandAccent);
  const brandTertiary = cleanColor(settings.brandTertiary);

  if (brandPrimaryHover) rootVars.push(`--brand-primary-hover:${brandPrimaryHover}`);
  if (brandPrimaryActive) rootVars.push(`--brand-primary-active:${brandPrimaryActive}`);
  if (brandPrimaryLight) {
    rootVars.push(`--brand-primary-light:${brandPrimaryLight}`);
    rootVars.push(`--surface-sunk:${brandPrimaryLight}`);
  }
  if (brandPrimaryDark) rootVars.push(`--brand-primary-dark:${brandPrimaryDark}`);
  if (brandSecondary) {
    rootVars.push(`--brand-secondary:${brandSecondary}`);
    rootVars.push(`--ink:${brandSecondary}`);
  }
  if (brandAccent) rootVars.push(`--brand-accent:${brandAccent}`);
  if (brandTertiary) rootVars.push(`--brand-tertiary:${brandTertiary}`);

  // 2. Background Colours
  const bgMain = cleanColor(settings.bgMain);
  const bgSecondary = cleanColor(settings.bgSecondary);
  const bgCard = cleanColor(settings.bgCard);
  const bgHeader = cleanColor(settings.bgHeader);
  const bgFooter = cleanColor(settings.bgFooter);
  const bgModal = cleanColor(settings.bgModal);
  const bgInput = cleanColor(settings.bgInput);

  if (bgMain) rootVars.push(`--canvas:${bgMain}`);
  if (bgSecondary) rootVars.push(`--surface:${bgSecondary}`);

  // 3. Typography Colours
  const textHeading = cleanColor(settings.textHeading);
  const textBody = cleanColor(settings.textBody);
  const textSecondary = cleanColor(settings.textSecondary);
  const textMuted = cleanColor(settings.textMuted);
  const textLink = cleanColor(settings.textLink);
  const textLinkHover = cleanColor(settings.textLinkHover);
  const textInverted = cleanColor(settings.textInverted);

  if (textBody) rootVars.push(`--ink:${textBody}`);
  if (textSecondary) rootVars.push(`--ink-muted:${textSecondary}`);
  if (textMuted) rootVars.push(`--ink-faint:${textMuted}`);
  if (textInverted) rootVars.push(`--accent-ink:${textInverted}`);

  // 6. Borders & Effects
  const borderPrimary = cleanColor(settings.borderPrimary);
  const borderSecondary = cleanColor(settings.borderSecondary);
  const borderDivider = cleanColor(settings.borderDivider);
  const borderCard = cleanColor(settings.borderCard);
  const borderInput = cleanColor(settings.borderInput);
  const effectFocusRing = cleanColor(settings.effectFocusRing);
  const effectShadow = cleanShadow(settings.effectShadow);

  if (borderPrimary) rootVars.push(`--hairline:${borderPrimary}`);
  if (borderSecondary) rootVars.push(`--hairline-strong:${borderSecondary}`);
  if (effectShadow) rootVars.push(`--shadow-card:${effectShadow}`);

  // 8. Status & Notification Colours
  const statusMap: [string, string | undefined][] = [
    ["--status-success-text", cleanColor(settings.statusSuccessText)],
    ["--status-success-bg", cleanColor(settings.statusSuccessBg)],
    ["--status-success-border", cleanColor(settings.statusSuccessBorder)],
    ["--status-warning-text", cleanColor(settings.statusWarningText)],
    ["--status-warning-bg", cleanColor(settings.statusWarningBg)],
    ["--status-warning-border", cleanColor(settings.statusWarningBorder)],
    ["--status-error-text", cleanColor(settings.statusErrorText)],
    ["--status-error-bg", cleanColor(settings.statusErrorBg)],
    ["--status-error-border", cleanColor(settings.statusErrorBorder)],
    ["--status-info-text", cleanColor(settings.statusInfoText)],
    ["--status-info-bg", cleanColor(settings.statusInfoBg)],
    ["--status-info-border", cleanColor(settings.statusInfoBorder)],
    ["--status-neutral-text", cleanColor(settings.statusNeutralText)],
    ["--status-neutral-bg", cleanColor(settings.statusNeutralBg)],
    ["--status-neutral-border", cleanColor(settings.statusNeutralBorder)],
  ];
  for (const [k, v] of statusMap) {
    if (v) rootVars.push(`${k}:${v}`);
  }

  const rules: string[] = [
    `:root{${rootVars.join(";")}}`,
    `.band-dark,.on-ink{--accent:${accentDark};}`,
    `body{font-family:${sansStack};}`,
  ];

  if (customHeading) {
    rules.push(`h1,h2,h3,h4,.font-display{font-family:"${customHeading}",${sansStack};}`);
  }

  // Background overrides
  if (bgCard) rules.push(`.rounded-card,.rounded-panel{background-color:${bgCard};}`);
  if (bgHeader) rules.push(`header{background-color:${bgHeader}!important;}`);
  if (bgFooter) rules.push(`footer.band-dark{--canvas:${bgFooter};background-color:${bgFooter};}`);
  if (bgModal) rules.push(`[role="dialog"]{background-color:${bgModal};}`);

  // Typography overrides
  if (textHeading) rules.push(`main h1:not(#hero-wordmark),main h2,main h3,main h4{color:${textHeading};}`);
  if (textLink) rules.push(`main a:not([class*="rounded-pill"]){color:${textLink};}`);
  if (textLinkHover) rules.push(`main a:not([class*="rounded-pill"]):hover{color:${textLinkHover};}`);

  // 4. Button overrides
  const btnPrimaryBg = cleanColor(settings.btnPrimaryBg);
  const btnPrimaryText = cleanColor(settings.btnPrimaryText);
  const btnPrimaryHoverBg = cleanColor(settings.btnPrimaryHoverBg) || brandPrimaryHover;
  const btnPrimaryActiveBg = cleanColor(settings.btnPrimaryActiveBg) || brandPrimaryActive;

  if (btnPrimaryBg || btnPrimaryText) {
    rules.push(
      `.rounded-pill.bg-accent{${btnPrimaryBg ? `background-color:${btnPrimaryBg}!important;` : ""}${
        btnPrimaryText ? `color:${btnPrimaryText}!important;` : ""
      }}`,
    );
  }
  if (btnPrimaryHoverBg) {
    rules.push(`.rounded-pill.bg-accent:hover{background-color:${btnPrimaryHoverBg}!important;}`);
  }
  if (btnPrimaryActiveBg) {
    rules.push(`.rounded-pill.bg-accent:active{background-color:${btnPrimaryActiveBg}!important;}`);
  }

  const btnSecondaryBg = cleanColor(settings.btnSecondaryBg);
  const btnSecondaryText = cleanColor(settings.btnSecondaryText);
  const btnSecondaryHoverBg = cleanColor(settings.btnSecondaryHoverBg);
  const btnSecondaryActiveBg = cleanColor(settings.btnSecondaryActiveBg);

  if (btnSecondaryBg || btnSecondaryText) {
    rules.push(
      `.rounded-pill.bg-ink{${btnSecondaryBg ? `background-color:${btnSecondaryBg}!important;` : ""}${
        btnSecondaryText ? `color:${btnSecondaryText}!important;` : ""
      }}`,
    );
  }
  if (btnSecondaryHoverBg) {
    rules.push(`.rounded-pill.bg-ink:hover{background-color:${btnSecondaryHoverBg}!important;}`);
  }
  if (btnSecondaryActiveBg) {
    rules.push(`.rounded-pill.bg-ink:active{background-color:${btnSecondaryActiveBg}!important;}`);
  }

  const btnOutlineBorder = cleanColor(settings.btnOutlineBorder);
  const btnOutlineText = cleanColor(settings.btnOutlineText);
  const btnOutlineHoverBg = cleanColor(settings.btnOutlineHoverBg);
  const btnOutlineActiveBg = cleanColor(settings.btnOutlineActiveBg);

  if (btnOutlineBorder || btnOutlineText) {
    rules.push(
      `.rounded-pill.border.bg-transparent{${
        btnOutlineBorder ? `border-color:${btnOutlineBorder}!important;` : ""
      }${btnOutlineText ? `color:${btnOutlineText}!important;` : ""}}`,
    );
  }
  if (btnOutlineHoverBg) {
    rules.push(`.rounded-pill.border.bg-transparent:hover{background-color:${btnOutlineHoverBg}!important;}`);
  }
  if (btnOutlineActiveBg) {
    rules.push(`.rounded-pill.border.bg-transparent:active{background-color:${btnOutlineActiveBg}!important;}`);
  }

  const btnGhostText = cleanColor(settings.btnGhostText);
  const btnGhostHoverBg = cleanColor(settings.btnGhostHoverBg);
  const btnGhostActiveBg = cleanColor(settings.btnGhostActiveBg);
  if (btnGhostText) rules.push(`.btn-ghost{color:${btnGhostText}!important;}`);
  if (btnGhostHoverBg) rules.push(`.btn-ghost:hover{background-color:${btnGhostHoverBg}!important;}`);
  if (btnGhostActiveBg) rules.push(`.btn-ghost:active{background-color:${btnGhostActiveBg}!important;}`);

  const btnDangerBg = cleanColor(settings.btnDangerBg);
  const btnDangerText = cleanColor(settings.btnDangerText);
  const btnDangerHoverBg = cleanColor(settings.btnDangerHoverBg);
  const btnDangerActiveBg = cleanColor(settings.btnDangerActiveBg);
  if (btnDangerBg || btnDangerText) {
    rules.push(
      `.btn-danger,[data-variant="danger"]{${
        btnDangerBg ? `background-color:${btnDangerBg}!important;` : ""
      }${btnDangerText ? `color:${btnDangerText}!important;` : ""}}`,
    );
  }
  if (btnDangerHoverBg) {
    rules.push(`.btn-danger:hover,[data-variant="danger"]:hover{background-color:${btnDangerHoverBg}!important;}`);
  }
  if (btnDangerActiveBg) {
    rules.push(`.btn-danger:active,[data-variant="danger"]:active{background-color:${btnDangerActiveBg}!important;}`);
  }

  const btnDisabledBg = cleanColor(settings.btnDisabledBg);
  const btnDisabledText = cleanColor(settings.btnDisabledText);
  if (btnDisabledBg || btnDisabledText) {
    rules.push(
      `button:disabled,[aria-disabled="true"]{${
        btnDisabledBg ? `background-color:${btnDisabledBg}!important;` : ""
      }${btnDisabledText ? `color:${btnDisabledText}!important;` : ""}}`,
    );
  }

  // 5. Navigation overrides
  const navBg = cleanColor(settings.navBg);
  const navText = cleanColor(settings.navText);
  const navLinkHover = cleanColor(settings.navLinkHover);
  const navLinkActive = cleanColor(settings.navLinkActive);
  const navDropdownBg = cleanColor(settings.navDropdownBg);
  const navMobileBg = cleanColor(settings.navMobileBg);

  if (navBg) rules.push(`header{background-color:${navBg}!important;}`);
  if (navText) rules.push(`header nav a,header nav button{color:${navText};}`);
  if (navLinkHover) rules.push(`header nav a:hover,header nav button:hover{color:${navLinkHover}!important;}`);
  if (navLinkActive) {
    rules.push(
      `header nav a[aria-current="page"],header nav button[aria-expanded="true"]{color:${navLinkActive}!important;}`,
    );
  }
  if (navDropdownBg) rules.push(`header nav div.rounded-card{background-color:${navDropdownBg}!important;}`);
  if (navMobileBg) rules.push(`header [data-mobile-panel]{background-color:${navMobileBg}!important;}`);

  // 6. Borders & Effects overrides
  if (borderDivider) rules.push(`hr,.hairline-y{border-color:${borderDivider};}`);
  if (borderCard) rules.push(`.rounded-card,.rounded-panel{border-color:${borderCard};}`);
  if (effectFocusRing) rules.push(`*:focus-visible{outline-color:${effectFocusRing}!important;}`);

  // 7. Forms & Inputs overrides
  const finalInputBg = cleanColor(settings.inputBg) || bgInput;
  const inputText = cleanColor(settings.inputText);
  const inputPlaceholder = cleanColor(settings.inputPlaceholder);
  const inputFocusBorder = cleanColor(settings.inputFocusBorder);
  const inputDisabledBg = cleanColor(settings.inputDisabledBg);
  const inputCheckboxAccent = cleanColor(settings.inputCheckboxAccent);
  const inputRadioAccent = cleanColor(settings.inputRadioAccent);
  const inputErrorBorder = cleanColor(settings.inputErrorBorder);
  const inputSuccessBorder = cleanColor(settings.inputSuccessBorder);

  if (finalInputBg || inputText || borderInput) {
    rules.push(
      `input:not([type="checkbox"]):not([type="radio"]),textarea,select{${
        finalInputBg ? `background-color:${finalInputBg};` : ""
      }${inputText ? `color:${inputText};` : ""}${borderInput ? `border-color:${borderInput};` : ""}}`,
    );
  }
  if (inputPlaceholder) {
    rules.push(`input::placeholder,textarea::placeholder{color:${inputPlaceholder}!important;}`);
  }
  if (inputFocusBorder) {
    rules.push(`input:focus,textarea:focus,select:focus{border-color:${inputFocusBorder}!important;}`);
  }
  if (inputDisabledBg) {
    rules.push(`input:disabled,textarea:disabled,select:disabled{background-color:${inputDisabledBg}!important;}`);
  }
  if (inputCheckboxAccent) {
    rules.push(`input[type="checkbox"]{accent-color:${inputCheckboxAccent};}`);
  }
  if (inputRadioAccent) {
    rules.push(`input[type="radio"]{accent-color:${inputRadioAccent};}`);
  }
  if (inputErrorBorder) {
    rules.push(`input[aria-invalid="true"],.input-error{border-color:${inputErrorBorder}!important;}`);
  }
  if (inputSuccessBorder) {
    rules.push(`.input-success{border-color:${inputSuccessBorder}!important;}`);
  }

  // 8. Status utility classes
  rules.push(
    `.status-success{color:var(--status-success-text,#15803d);background-color:var(--status-success-bg,#dcfce7);border-color:var(--status-success-border,#86efac);}`,
    `.status-warning{color:var(--status-warning-text,#b45309);background-color:var(--status-warning-bg,#fef3c7);border-color:var(--status-warning-border,#fde68a);}`,
    `.status-error{color:var(--status-error-text,#b91c1c);background-color:var(--status-error-bg,#fee2e2);border-color:var(--status-error-border,#fca5a5);}`,
    `.status-info{color:var(--status-info-text,#1d4ed8);background-color:var(--status-info-bg,#dbeafe);border-color:var(--status-info-border,#93c5fd);}`,
    `.status-neutral{color:var(--status-neutral-text,#334155);background-color:var(--status-neutral-bg,#f1f5f9);border-color:var(--status-neutral-border,#cbd5e1);}`,
  );

  return rules.join("");
}

export const metadata: Metadata = {
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

  const dynamicThemeCss = buildDynamicThemeCss(settings);
  const customFontUrl = settings.customFontUrl?.trim();
  const customHeadingFontUrl = settings.customHeadingFontUrl?.trim();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={fontClasses}
    >
      <head>
        {customFontUrl && customFontUrl.startsWith("https://") ? (
          <link rel="stylesheet" href={customFontUrl} />
        ) : null}
        {customHeadingFontUrl && customHeadingFontUrl.startsWith("https://") ? (
          <link rel="stylesheet" href={customHeadingFontUrl} />
        ) : null}
        <style dangerouslySetInnerHTML={{ __html: dynamicThemeCss }} />
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
