import Link from "next/link";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";

import { Container, SectionHeading } from "@/components/ui/layout";
import { RevealGroup } from "@/components/ui/reveal";
import { SerifText } from "@/components/ui/serif-text";
import { transformationPillars } from "@/lib/content";

/**
 * TRANSFORMATION PILLARS
 *
 * Tony Robbins-inspired core pillars:
 * 01. Business Systems & Growth (Business Doctor)
 * 02. Leadership & Team Execution (Executive Mentoring)
 * 03. Public Speaking & Mindset (The Bookwishes Club)
 */
export function TransformationPillars() {
  return (
    <section>
      <Container className="section-y">
        <SectionHeading
          eyebrow={transformationPillars.eyebrow}
          headline={<SerifText text={transformationPillars.headline} />}
          lede={transformationPillars.lede}
          size="lg"
        />

        <div className="mt-8 sm:mt-12 md:mt-16">
          <RevealGroup className="grid gap-6 sm:gap-8 lg:grid-cols-2" stagger={0.08} distance={20}>
            {transformationPillars.items.map((pillar) => (
              <article
                key={pillar.number}
                className="group flex h-full flex-col justify-between rounded-panel border border-hairline bg-surface p-6 transition-all duration-300 ease-brand hover:-translate-y-1 hover:border-hairline-strong hover:shadow-lift sm:p-8 md:p-9"
              >
                <div className="flex flex-col gap-5 sm:gap-6">
                  {/* Top indicator row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-2xl font-black tracking-tight text-accent sm:text-3xl">
                        {pillar.number}
                      </span>
                      {"audience" in pillar ? (
                        <span className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                          {pillar.audience}
                        </span>
                      ) : null}
                    </div>
                    <span className="rounded-pill bg-canvas px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink border border-hairline shadow-xs">
                      {pillar.subtitle}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="flex flex-col gap-2.5 sm:gap-3">
                    <h3 className="text-xl sm:text-2xl font-bold leading-tight text-ink transition-colors duration-200 ease-brand group-hover:text-accent lg:text-display-3">
                      {pillar.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-muted sm:text-base">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Highlights checklist */}
                  <ul className="flex flex-col gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                    {pillar.highlights.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-xs text-ink-muted sm:text-sm">
                        <CheckCircle
                          weight="fill"
                          className="size-4 shrink-0 mt-0.5 text-accent"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA */}
                <div className="border-t border-hairline pt-6 mt-6 sm:mt-8">
                  <Link
                    href={pillar.href}
                    className="group/btn inline-flex h-12 min-h-[48px] w-full items-center justify-center gap-2 rounded-pill bg-ink px-6 text-sm font-bold text-canvas transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:bg-accent hover:text-accent-ink hover:shadow-card active:translate-y-0 active:scale-[0.98]"
                  >
                    <span>{pillar.cta}</span>
                    <ArrowRight
                      weight="bold"
                      className="size-4 transition-transform duration-200 ease-brand group-hover/btn:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
