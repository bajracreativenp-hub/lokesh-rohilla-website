import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

/* ==========================================================================
   RADIUS SCALE, applied without exception:
     buttons, badges, chips  -> pill
     inputs                  -> radius-input  (12px)
     cards, slots            -> radius-card   (18px)
     feature panels          -> radius-panel  (24px)
   ========================================================================== */

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-[background-color,color,border-color,transform,box-shadow,filter] duration-200 ease-brand select-none";

const variants = {
  /* Accent blue pill. The primary action colour. */
  primary:
    "rounded-pill bg-accent text-accent-ink hover:-translate-y-0.5 hover:brightness-110 hover:shadow-card active:translate-y-0 active:scale-[0.98]",
  /* Solid navy pill. Used for the second action in a pair. */
  navy: "rounded-pill bg-ink text-canvas hover:-translate-y-0.5 hover:brightness-125 hover:shadow-card active:translate-y-0 active:scale-[0.98]",
  /* Outline pill over light backgrounds. */
  outline:
    "rounded-pill border border-hairline-strong bg-transparent text-ink hover:-translate-y-0.5 hover:border-ink hover:bg-sunk hover:shadow-xs active:translate-y-0 active:scale-[0.98]",
  /* Outline pill that survives on photography or a dark band. */
  "on-media":
    "rounded-pill border border-white/45 bg-white/10 text-white backdrop-blur-sm hover:-translate-y-0.5 hover:bg-white hover:text-ink hover:shadow-card active:translate-y-0 active:scale-[0.98]",
  /*
    Solid white pill with a navy label.

    For a call to action standing on a dark photograph, which is the hero's case.
    It is a variant rather than a `className` override on `primary` because the
    radius scale and the transition set are already right and only the two colours
    are wrong, and because a one off override in a section is how a control ends up
    looking subtly different from every other control on the site.
  */
  light:
    "rounded-pill bg-white text-ink hover:-translate-y-0.5 hover:brightness-95 hover:shadow-card active:translate-y-0 active:scale-[0.98]",
} as const;

const sizes = {
  sm: "h-10 px-5 text-[0.8125rem]",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-[0.9375rem]",
} as const;

type ButtonProps = {
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};

export function ButtonLink({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
}: ButtonProps & { href: string }) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (external) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ButtonProps & ComponentProps<"button">) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------
   Pill badge. A small accent chip plus a label above the hero headline.
   ------------------------------------------------------------------------- */

export function Pill({
  children,
  tone = "accent",
  className = "",
}: {
  children: ReactNode;
  tone?: "accent" | "quiet";
  className?: string;
}) {
  const tones = {
    accent: "bg-accent text-accent-ink",
    quiet: "bg-sunk text-ink-muted",
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded-pill px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.12em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------
   TEXT LINK
   Used wherever a repeat of an existing CTA intent appears, so the one label
   per intent rule holds without introducing a second button.
   ------------------------------------------------------------------------- */

export function TextLink({
  children,
  href,
  className = "",
  showArrow = true,
}: {
  children: ReactNode;
  href: string;
  className?: string;
  showArrow?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1.5 font-bold text-accent transition-opacity duration-200 ease-brand hover:opacity-75 ${className}`}
    >
      <span>{children}</span>
      {showArrow ? (
        <ArrowRight
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform duration-200 ease-brand group-hover:translate-x-1"
          weight="bold"
        />
      ) : null}
    </Link>
  );
}
