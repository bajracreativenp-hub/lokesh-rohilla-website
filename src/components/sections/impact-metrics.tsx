import { Star } from "@phosphor-icons/react/dist/ssr";

import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { impactMetrics } from "@/lib/content";

/**
 * RESULTS & IMPACT METRICS STRIP
 *
 * Tony Robbins-inspired proof bar highlighting tangible results,
 * experience, verified reviews, and proven transformation frameworks.
 */
export function ImpactMetrics() {
  return (
    <section aria-label="Results and impact metrics" className="hairline-y bg-surface">
      <Container className="py-10 md:py-14">
        <Reveal>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {impactMetrics.map((item, index) => (
              <div
                key={item.label}
                className={`flex flex-col gap-2 ${
                  index > 0 ? "sm:border-l sm:border-hairline sm:pl-6 lg:pl-8" : ""
                }`}
              >
                <div className="flex items-baseline gap-1.5">
                  <span className="text-display-2 font-extrabold tracking-tight text-ink md:text-display-1">
                    {item.value}
                  </span>
                  {"isRating" in item && item.isRating ? (
                    <span className="flex items-center text-amber-500" aria-label="Rating out of 5 stars">
                      <Star weight="fill" className="size-5 md:size-6" />
                    </span>
                  ) : (
                    <span className="text-sm font-bold uppercase tracking-wider text-accent md:text-base">
                      {item.unit}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-ink leading-snug md:text-base">
                  {item.label}
                </h3>

                <p className="text-xs leading-relaxed text-ink-muted">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
