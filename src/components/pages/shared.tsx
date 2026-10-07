import type { ReactNode } from "react";

import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";

/**
 * Shared hero for every secondary page.
 *
 * Accent eyebrow, large tight headline, muted lede, matching the hero
 * rhythm without the newsletter field, which has no confirmed provider.
 */
export function PageHero({
  eyebrow,
  headline,
  lede,
  children,
}: {
  eyebrow: string;
  headline: string;
  lede: string;
  children?: ReactNode;
}) {
  return (
    <section className="overflow-hidden">
      <Container className="pb-12 pt-14 md:pb-16 md:pt-20 lg:pb-20 lg:pt-24">
        <div className="flex max-w-[52rem] flex-col gap-5">
          <Reveal trigger="mount" distance={14}>
            <p className="eyebrow">{eyebrow}</p>
          </Reveal>
          <Reveal trigger="mount" delay={0.06} distance={20}>
            <h1 className="text-display-1 max-w-[18ch] leading-display text-balance">
              {headline}
            </h1>
          </Reveal>
          <Reveal trigger="mount" delay={0.12} distance={18}>
            <p className="measure text-base leading-relaxed text-ink-muted md:text-lg">
              {lede}
            </p>
          </Reveal>
          {children ? (
            <Reveal trigger="mount" delay={0.18} distance={14}>
              {children}
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

/** Standard section wrapper. `tone` switches the surface. */
export function PageSection({
  children,
  tone = "canvas",
  bordered = false,
  id,
  className = "",
}: {
  children: ReactNode;
  tone?: "canvas" | "surface" | "dark";
  bordered?: boolean;
  id?: string;
  className?: string;
}) {
  const tones = {
    canvas: "bg-canvas",
    surface: "bg-surface",
    dark: "band-dark",
  } as const;

  return (
    <section
      id={id}
      className={`section-y ${tones[tone]} ${
        bordered ? "hairline-t" : ""
      } ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** Body prose block. Constrained measure, muted ink, comfortable leading. */
export function Prose({ paragraphs }: { paragraphs: readonly string[] }) {
  return (
    <div className="measure flex flex-col gap-4">
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph.slice(0, 32)}
          className="text-base leading-relaxed text-ink-muted md:text-lg"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

/** Large display line used as a pull quote or framing statement. */
export function PullQuote({ children }: { children: string }) {
  return (
    <p className="max-w-[24ch] text-display-3 leading-[1.12] text-balance">
      {children}
    </p>
  );
}

/** Rounded card used for capability lists across the secondary pages. */
export function ItemCard({
  title,
  body,
  meta,
}: {
  title: string;
  body: string;
  meta?: string;
}) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-card bg-surface p-6">
      {meta ? <p className="eyebrow">{meta}</p> : null}
      <h3 className="text-display-4 leading-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-muted">{body}</p>
    </article>
  );
}

/**
 * Process row. The verb is the label, so there is deliberately no step
 * numbering: "Listen" says more than "Step 01".
 */
export function VerbRow({
  steps,
}: {
  steps: readonly { verb: string; body: string }[];
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step) => (
        <div key={step.verb} className="flex flex-col gap-3 rounded-card bg-surface p-6">
          <p className="text-display-4 leading-tight">{step.verb}</p>
          <p className="text-sm leading-relaxed text-ink-muted">{step.body}</p>
        </div>
      ))}
    </div>
  );
}
