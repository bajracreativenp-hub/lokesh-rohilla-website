import { BusinessHealthChecker } from "@/components/pages/health-checker";
import { Container, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { SerifText } from "@/components/ui/serif-text";
import { diagnosticSection } from "@/lib/content";

/**
 * HOMEPAGE DIAGNOSTIC SECTION
 *
 * Tony Robbins-inspired interactive assessment.
 * Directly embeds the 10-question self-assessment diagnostic to provide
 * immediate value and clarity to business owners and founders.
 */
export function DiagnosticSection() {
  return (
    <section id="diagnostic" className="hairline-y bg-surface">
      <div id="health-check" className="sr-only" aria-hidden="true" />
      <div id="health-checker" className="sr-only" aria-hidden="true" />
      <Container className="section-y">
        <SectionHeading
          eyebrow={diagnosticSection.eyebrow}
          headline={<SerifText text={diagnosticSection.headline} />}
          lede={diagnosticSection.lede}
          size="lg"
        />

        <div className="mt-8 sm:mt-12 md:mt-16">
          <Reveal>
            <div className="rounded-panel border border-hairline bg-canvas p-4 sm:p-6 md:p-10 shadow-card">
              <BusinessHealthChecker />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
