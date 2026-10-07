import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { pageMaxWidth } from "@/lib/site";

/** Single page width for the entire site. */
export function Container({
  children,
  className = "",
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
/*
  PROPS ARE FORWARDED, WHICH IS NOT COSMETIC.

  `data-*` attributes are how this project marks things for the probes:
  `data-reveal`, `data-asset-slot`, `data-a11y-rest`, `data-marquee`. `Container`
  accepted none of them, so passing one was silently dropped by React with no type
  error, because a component's prop type simply did not include it.

  That cost an afternoon of a probe reporting 40 unresolved contrast nodes against
  a hero that was measurably fine: the attribute it was looking for was never in
  the document. The forwarding is on `Container` rather than worked around in the
  hero because any wrapper with the same shape would lose them the same way.
*/
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">) {
  return (
    <Tag
      className={`${pageMaxWidth} mx-auto w-full px-5 md:px-8 lg:px-12 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Section shell. */
export function Section({
  children,
  id,
  className = "",
  bordered = false,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      className={`section-y ${bordered ? "hairline-t" : ""} ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}

/**
 * Section heading.
 *
 * Optional accent eyebrow. Headline and lede always
 * stack vertically; the "big headline left, small paragraph right" pattern is
 * not used because it produces a templated rhythm across a long page.
 */
export function SectionHeading({
  eyebrow,
  headline,
  lede,
  size = "md",
  className = "",
  align = "left",
  rule = true,
}: {
  eyebrow?: string;
  /**
   * `ReactNode`, not `string`, because headlines now carry the serif-letter
   * treatment and so are composed rather than passed through whole.
   *
   * It renders inside an `h2` either way, so the heading level and the accessible
   * name are unchanged: `SerifText` marks letters with `|`, splits the string, and
   * wraps only the marked letters, so the text a screen reader reads is exactly
   * the text on screen with the delimiters stripped.
   */
  headline: ReactNode;
  lede?: string;
  size?: "md" | "lg" | "xl";
  className?: string;
  align?: "left" | "center";
  /**
   * Draws the accent rule above the eyebrow.
   *
   * This is the smallest change that stops every section on the site reading as
   * the same shape. Nine pages of "small blue caps, then a big heading, then a
   * grey paragraph" is the visual signature of a template, and the rule gives each
   * section a top edge to anchor on. Off for centred headings, where a left aligned
   * rule above centred type looks like a mistake.
   */
  rule?: boolean;
}) {
  const sizes = {
    xl: "text-display-1 leading-display",
    lg: "text-display-2 leading-display-2",
    md: "text-display-3 leading-[1.15]",
  } as const;

  return (
    <div
      className={`flex flex-col gap-4 ${align === "center" ? "items-center text-center" : ""} ${className}`}
    >
      {eyebrow ? (
        <p className="flex items-center gap-3">
          {rule && align !== "center" ? (
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
          ) : null}
          <span className="eyebrow">{eyebrow}</span>
        </p>
      ) : null}
      <h2 className={`${sizes[size]} max-w-[22ch] text-balance`}>{headline}</h2>
      {lede ? <p className="measure text-base leading-relaxed text-ink-muted md:text-lg">{lede}</p> : null}
    </div>
  );
}

/**
 * Explicitly marked placeholder for copy the client has not supplied.
 * Rendered visibly on purpose so unconfirmed content can never be mistaken for
 * approved copy, and is removed the moment real content lands.
 */
export function PendingNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-card bg-sunk px-4 py-3 text-sm leading-relaxed text-ink-muted">
      <span className="eyebrow mr-2 align-middle">Pending</span>
      {children}
    </p>
  );
}
