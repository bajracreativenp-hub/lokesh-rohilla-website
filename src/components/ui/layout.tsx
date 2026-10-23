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
 */
export function SectionHeading({
  id,
  eyebrow,
  headline,
  lede,
  size = "md",
  className = "",
  align = "left",
  rule = true,
}: {
  id?: string;
  eyebrow?: string;
  headline: ReactNode;
  lede?: string;
  size?: "md" | "lg" | "xl";
  className?: string;
  align?: "left" | "center";
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
      <h2 id={id} className={`${sizes[size]} max-w-[22ch] text-balance`}>{headline}</h2>
      {lede ? <p className="measure text-base leading-relaxed text-ink-muted md:text-lg">{lede}</p> : null}
    </div>
  );
}

/**
 * Editorial callout note.
 */
export function PendingNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-card bg-sunk px-4 py-3 text-sm leading-relaxed text-ink-muted">
      <span className="eyebrow mr-2 align-middle">Note</span>
      {children}
    </p>
  );
}
