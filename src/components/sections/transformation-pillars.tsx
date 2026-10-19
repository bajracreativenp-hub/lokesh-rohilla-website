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
          <RevealGroup className="grid gap-5 sm:gap-6 lg:grid-cols-3" stagger={0.08} distance={20}>
            {transformationPillars.items.map((pillar) => (
              <article
                key={pillar.number}
                className="group flex h-full flex-col justify-between rounded-panel border border-hairline bg-surface p-5 transition-all duration-300 ease-brand hover:border-hairline-strong hover:shadow-card sm:p-7 md:p-8"
              >
                <div className="flex flex-col gap-5 sm:gap-6">
                  {/* Top indicator row */}
                  <div className="flex items-center justify-between border-b border-hairline pb-3.5 sm:pb-4">
                    <span className="font-mono text-xl font-black tracking-tight text-accent sm:text-2xl md:text-3xl">
                      {pillar.number}
                    </span>
                    <span className="rounded-pill bg-canvas px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink-muted sm:text-xs">
                      {pillar.subtitle}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="flex flex-col gap-2 sm:gap-2.5">
                    <h3 className="text-xl font-bold leading-tight text-ink sm:text-display-3">
                      {pillar.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-muted">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Highlights checklist */}
                  <ul className="flex flex-col gap-2 sm:gap-2.5 pt-1 sm:pt-2">
                    {pillar.highlights.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-xs text-ink-muted md:text-sm">
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
                <div className="border-t border-hairline pt-5 mt-5 sm:pt-6 sm:mt-6">
                  <Link
                    href={pillar.href}
                    className="group/btn inline-flex h-11 min-h-[44px] w-full items-center justify-center gap-2 rounded-pill bg-ink px-5 text-sm font-bold text-canvas transition-[background-color,transform] duration-200 ease-brand hover:bg-accent hover:text-accent-ink active:translate-y-px"
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
