import { Star } from "@phosphor-icons/react/dist/ssr";

import { CountUp } from "@/components/ui/count-up";
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
      <Container className="py-8 sm:py-10 md:py-14">
        <Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-8 lg:grid-cols-4 lg:gap-10">
            {impactMetrics.map((item, index) => (
              <div
                key={item.label}
                className={`flex flex-col gap-1.5 sm:gap-2 ${
                  index % 2 === 1
                    ? "border-l border-hairline pl-3 sm:pl-6 lg:pl-8"
                    : index > 0
                    ? "lg:border-l lg:border-hairline lg:pl-8"
                    : ""
                }`}
              >
                <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                  <span className="tabular-nums text-2xl font-extrabold tracking-tight text-ink sm:text-display-2 md:text-display-1">
                    {item.value === "18+" ? (
                      <CountUp from={1} to={18} suffix="+" duration={1.5} delay={0.15} />
                    ) : (
                      item.value
                    )}
                  </span>
                  {"isRating" in item && item.isRating ? (
                    <span className="flex items-center text-amber-500" aria-label="Rating out of 5 stars">
                      <Star weight="fill" className="size-4 sm:size-5 md:size-6" />
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent sm:text-xs md:text-sm">
                      {item.unit}
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-ink leading-snug sm:text-sm md:text-base">
                  {item.label}
                </h3>

                <p className="text-[11px] leading-relaxed text-ink-muted sm:text-xs">
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
