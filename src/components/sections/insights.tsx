import {
  ChartLineUp,
  Compass,
  Lightbulb,
  Path,
  Quotes,
  Users,
} from "@phosphor-icons/react/dist/ssr";

import { TextLink } from "@/components/ui/button";
import { Container, PendingNote, SectionHeading } from "@/components/ui/layout";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { SerifText } from "@/components/ui/serif-text";
import { insights } from "@/lib/content";

/**
 * SECTION 9 - INSIGHTS
 * Layout family: category chip row over a tinted empty state.
 *
 * The six categories are real and are the only content asserted here. No
 * article titles, read times or bylines are invented to fill the grid.
 *
 * ICONS ARE PAIRED BY POSITION
 *
 * One icon per category, matched by index, and `aria-hidden`. Each category is
 * already a word in a chip; announcing "lightbulb, Business" before it would be
 * noise. A missing entry shows up as a visible gap in a row of six, which is the
 * right way for that mistake to fail.
 */
const ICONS = [ChartLineUp, Compass, Lightbulb, Path, Quotes, Users] as const;
export function Insights() {
  return (
    <section>
      <Container className="section-y">
        <SectionHeading
          eyebrow={insights.eyebrow}
          headline={<SerifText text={insights.headline} />}
          lede={insights.lede}
          size="lg"
        />

        <RevealGroup
          className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.05}
          distance={12}
        >
          {insights.categories.map((category, index) => {
            const Icon = ICONS[index] ?? Lightbulb;

            return (
              <div
                key={category}
                className="group flex items-center gap-3.5 rounded-card border border-hairline bg-surface px-5 py-4 transition-[border-color,transform] duration-300 ease-brand hover:-translate-y-0.5 hover:border-accent motion-reduce:transition-none"
              >
                <span className="icon-plate !size-9">
                  <Icon aria-hidden="true" className="size-4.5" weight="duotone" />
                </span>
                <span className="text-sm font-bold text-ink">{category}</span>
              </div>
            );
          })}
        </RevealGroup>

        <Reveal delay={0.1} className="mt-10">
          <div className="flex flex-col gap-6 rounded-panel bg-surface p-7 md:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="flex flex-col gap-2">
              <h3 className="text-display-4">The first pieces are being written.</h3>
              <p className="measure-tight text-sm leading-relaxed text-ink-muted">
                Nothing is published here yet. Rather than fill this space with
                invented headlines, the section stays empty until there is real
                writing and real video to publish.
              </p>
            </div>
            <div className="w-full max-w-sm shrink-0">
              <PendingNote>{insights.pending}</PendingNote>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.14} className="mt-10">
          <TextLink href={insights.cta.href}>{insights.cta.label}</TextLink>
        </Reveal>
      </Container>
    </section>
  );
}
