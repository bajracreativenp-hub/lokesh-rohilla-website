import { ArrowUpRight, Star } from "@phosphor-icons/react/dist/ssr";

import { Container, SectionHeading } from "@/components/ui/layout";
import { VideoSlot } from "@/components/ui/portrait-slot";
import { Reveal } from "@/components/ui/reveal";
import { SerifText } from "@/components/ui/serif-text";
import { testimonials } from "@/lib/content";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

/**
 * SECTION 7 - TESTIMONIALS & GOOGLE REVIEWS
 * Real Google business reviews and video testimonials.
 */
export function Testimonials() {
  const { googleReviews } = testimonials;

  return (
    <section>
      <Container className="section-y">
        <SectionHeading
          eyebrow={testimonials.eyebrow}
          headline={<SerifText text={testimonials.headline} />}
          lede={testimonials.lede}
          size="lg"
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-12">
          {testimonials.videoSlots.map((slot, index) => (
            <Reveal
              key={`${slot.label}-${index}`}
              delay={index * 0.08}
              distance={20}
              className="lg:col-span-4"
            >
              <VideoSlot
                spec={slot.spec}
                label={slot.label}
                index={index + 1}
                src={slot.src}
                alt={slot.alt}
              />
            </Reveal>
          ))}
        </div>

        {/* Google Reviews Rating Banner */}
        <div className="mt-10 flex flex-col gap-6">
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-6 rounded-panel bg-surface p-7 md:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-card bg-canvas shadow-card">
                    <GoogleIcon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-display-4 font-bold leading-tight">Google Reviews</h3>
                    <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
                      {googleReviews.businessName} • {googleReviews.note}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
                    {googleReviews.rating}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500" aria-label={`${googleReviews.rating} out of 5 stars`}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} weight="fill" className="size-4 md:size-5" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-ink-muted">
                    Based on <strong className="text-ink">{googleReviews.reviewCount}</strong> Google reviews
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                <a
                  href={googleReviews.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-12 items-center gap-2 rounded-pill bg-ink px-6 text-sm font-bold text-canvas transition-[background-color,transform,box-shadow] duration-200 ease-brand hover:bg-accent hover:shadow-card active:translate-y-px"
                >
                  <span>View All on Google</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    weight="bold"
                    className="size-4 transition-transform duration-200 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </div>
          </Reveal>

          {/* Featured Verified Google Reviews Grid */}
          <div className="grid gap-5 md:grid-cols-2">
            {googleReviews.reviews.map((review, i) => (
              <Reveal key={review.author} delay={0.12 + i * 0.05} distance={15}>
                <article className="flex h-full flex-col justify-between gap-5 rounded-panel border border-hairline bg-canvas p-6 transition-all duration-200 ease-brand hover:border-hairline-strong hover:shadow-card md:p-7">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500" aria-label={`${review.rating} out of 5 stars`}>
                        {[...Array(review.rating)].map((_, s) => (
                          <Star key={s} weight="fill" className="size-3.5" />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
                        <GoogleIcon className="size-3.5" />
                        <span>Google Review</span>
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed text-ink/90 md:text-[0.9375rem]">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 border-t border-hairline pt-4">
                    <div className="grid size-9 shrink-0 place-items-center rounded-pill bg-surface-sunk font-bold text-xs text-accent">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink leading-none">{review.author}</p>
                      <p className="text-xs text-ink-muted mt-1">{review.time}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
