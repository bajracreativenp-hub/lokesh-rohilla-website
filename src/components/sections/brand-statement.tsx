import Link from "next/link";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { brandStatement } from "@/lib/content";

/**
 * SECTION 2 - BRAND STATEMENT
 * Layout family: editorial statement over a linked initiative rail, set inside
 * a soft tinted panel rather than a full colour change.
 *
 * Philosophy is established here, biography is not repeated.
 *
 * This was briefly an h1. The hero was removed at one point and the page would
 * otherwise have had no h1 at all, so the heading moved here as a stopgap. The
 * hero is back and the h1 has returned to it, which is where a page heading
 * belongs.
 */
export function BrandStatement() {
  return (
    <section>
      <Container className="section-y">
        <Reveal>
          <div className="rounded-panel bg-surface px-6 py-12 md:px-12 md:py-16">
            <div className="flex flex-col gap-6">
              <h2 className="text-display-2 max-w-[20ch] leading-display-2 text-balance">
                {brandStatement.headline}
              </h2>
              <p className="measure max-w-[62ch] text-base leading-relaxed text-ink-muted md:text-lg">
                {brandStatement.body}
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-5 border-t border-hairline pt-8 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm font-semibold text-ink-muted">
                {brandStatement.railLabel}
              </p>
              <ul className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                {brandStatement.rail.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group inline-flex h-11 items-center gap-2 rounded-pill border border-hairline-strong px-5 text-sm font-bold text-ink transition-colors duration-200 ease-brand hover:border-accent hover:text-accent"
                    >
                      {item.name}
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform duration-200 ease-brand group-hover:translate-x-1"
                        weight="bold"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
