import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { finalCta } from "@/lib/content";

/**
 * SECTION 11 - FINAL PERSONAL CTA
 * Layout family: centred navy closing panel.
 *
 * The path selector now lives at section 5, so this closing section no longer
 * repeats it. It carries a single invitation and a single action.
 *
 * Framed as an invitation, not a pitch.
 */
export function FinalCta() {
  return (
    <section>
      <Container className="pb-20 pt-8 md:pb-24 md:pt-10">
        <Reveal delay={0.06}>
          {/*
            `.on-ink`, NOT `bg-ink` alone.

            Setting the background to navy does not change what `--ink` resolves
            to, so every child that inherits or reads `text-ink` stayed navy and
            the headline and lede rendered at a 1:1 contrast ratio against the
            panel behind them. The text was there in the DOM and invisible on the
            page. `.on-ink` re-scopes the semantic tokens for the subtree, which
            is the only thing that makes inherited ink come out light.

            This slipped past `verify:contrast` for a long time because axe files
            a 1:1 ratio under `incomplete`, not `violations`, and the probe read
            only `violations`. The probe now fails on unresolved results too.
          */}
          <div className="on-ink flex flex-col items-center gap-6 rounded-panel px-7 py-16 text-center md:px-12 md:py-24">
            <h2 className="text-display-3 max-w-[20ch] leading-[1.12] text-balance">
              {finalCta.headline}
            </h2>
            <p className="measure-tight text-base leading-relaxed  md:text-lg">
              {finalCta.lede}
            </p>
            <ButtonLink href={finalCta.cta.href} size="lg" className="mt-2">
              {finalCta.cta.label}
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
