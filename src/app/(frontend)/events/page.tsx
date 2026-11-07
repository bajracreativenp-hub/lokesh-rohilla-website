import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EventCountdown } from "@/components/pages/event-countdown";
import { EventTestimonialsCarousel } from "@/components/pages/event-testimonials-carousel";
import {
  CompetitionAwardIcon,
  CompetitiveMedalIcon,
  FinancePiggyBankIcon,
  FutureMapPinIcon,
  GrowthTrendIcon,
  SellingBriefcaseIcon,
} from "@/components/pages/growth-trend-icon";
import { PastEventsCarousel, type PastEventCard } from "@/components/pages/past-events-carousel";
import { extractTextFromLexical, getLiveEvents, type LiveEvent } from "@/lib/cms";
import { UNSPLASH } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Events",
  description:
    "Masterclasses, workshops, corporate training and live events.",
};

const DEFAULT_EVENT: LiveEvent = {
  id: "default-event",
  title: "Grow your business exponentially",
  slug: "grow-your-business-exponentially",
  date: "2027-01-13T09:00:00+05:30",
  locationType: "virtual",
  venue: "Virtual",
  timezone: "IST",
  status: "upcoming",
  featured: true,
  description:
    "Get the concrete strategies and tools that have transformed thousands of businesses at every stage.",
  registrationUrl: "/contact#contact-form",
};

const KEY_BENEFITS = [
  {
    icon: null,
    animated: "growth" as const,
    title: "Turbocharge your growth",
    body: "Optimize key processes to realize exponential growth, faster.",
  },
  {
    icon: null,
    animated: "selling" as const,
    title: "Master the art of selling",
    body: "Close any deal by uncovering the secret behind customer decision-making.",
  },
  {
    icon: null,
    animated: "edge" as const,
    title: "Gain a competitive edge",
    body: "Create a comprehensive marketing strategy to target your ideal audience and build leads.",
  },
  {
    icon: null,
    animated: "finance" as const,
    title: "Take charge of your finances",
    body: "Leverage Harvard-level insights to steer your business through any economic climate.",
  },
  {
    icon: null,
    animated: "competition" as const,
    title: "Stay ahead of the competition",
    body: "Build a brand that is differentiated and adaptable no matter the market trends.",
  },
  {
    icon: null,
    animated: "future" as const,
    title: "Create a map for the future",
    body: "Create a flexible, results-driven plan to achieve your goals faster.",
  },
] as const;

export default async function EventsPage() {
  const liveEvents = await getLiveEvents();

  const activeEvents = liveEvents.filter((e) => e.status !== "completed");
  const completedEvents = liveEvents.filter((e) => e.status === "completed");

  // Sort featured events first while preserving date order from CMS
  const sortedEvents =
    activeEvents.length > 0
      ? [...activeEvents].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
      : [DEFAULT_EVENT];

  const pastEventCards: PastEventCard[] = completedEvents.map((event) => ({
    id: String(event.id),
    category: [
      event.locationType === "in-person"
        ? "IN-PERSON"
        : event.locationType === "hybrid"
          ? "HYBRID"
          : "VIRTUAL",
      event.venue,
    ]
      .filter(Boolean)
      .join(" • "),
    title: event.title,
    excerpt:
      (typeof event.description === "string"
        ? event.description.trim()
        : extractTextFromLexical(event.description)) ||
      "Keynote and workshop highlights from this completed session.",
    image:
      (event.bannerImage &&
        typeof event.bannerImage === "object" &&
        event.bannerImage.url) ||
      `${UNSPLASH}1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=85`,
    alt:
      (event.bannerImage &&
        typeof event.bannerImage === "object" &&
        event.bannerImage.alt) ||
      event.title,
  }));

  return (
    <div className="flex flex-col bg-canvas">
      <div className="flex flex-col gap-6 px-3 py-4 md:px-6 md:py-6">
        {sortedEvents.map((event, index) => {
          const badge =
            event.locationType === "in-person"
              ? "IN-PERSON"
              : event.locationType === "hybrid"
                ? "HYBRID"
                : "VIRTUAL";

          const lede =
            (typeof event.description === "string"
              ? event.description.trim()
              : extractTextFromLexical(event.description)) ||
            "Get the concrete strategies and tools that have transformed thousands of businesses at every stage.";

          const targetDateIso = event.date || "2027-01-13T09:00:00+05:30";

          const dateLabel = event.date
            ? new Date(event.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Jan 13 - 17, 2027";

          const placeLabel =
            event.venue ||
            (event.locationType === "in-person"
              ? "In-Person"
              : event.locationType === "hybrid"
                ? "Hybrid"
                : "Virtual");

          const timezoneLabel = event.timezone?.trim() || "IST";

          const ctaHref = event.registrationUrl?.trim() || "/contact#contact-form";

          const bgImage =
            (event.bannerImage &&
              typeof event.bannerImage === "object" &&
              event.bannerImage.url) ||
            `${UNSPLASH}1540575467063-178a50c2df87?auto=format&fit=crop&w=2000&q=85`;

          const bgAlt =
            (event.bannerImage &&
              typeof event.bannerImage === "object" &&
              event.bannerImage.alt) ||
            event.title;

          const HeadingTag = index === 0 ? "h1" : "h2";

          return (
            <section
              key={event.id}
              aria-label={event.title}
              className="relative isolate mx-auto flex min-h-[540px] w-full max-w-[1520px] flex-col justify-end overflow-hidden rounded-[24px] bg-[#060d18] p-6 sm:p-10 md:min-h-[640px] md:p-14 lg:min-h-[700px] lg:p-16"
            >
              {/* Background photograph */}
              <Image
                src={bgImage}
                alt={bgAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="-z-20 object-cover object-center"
              />

              {/* Dark readability scrim + signature royal-blue stage-light glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/45 to-black/25"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/35 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 right-1/4 -z-10 h-[360px] w-[620px] rounded-full bg-accent/45 blur-[110px]"
              />

              {/* Foreground content row */}
              <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
                {/* Left column: Event Type, Event Name, Details/Description, CTA + Date / Place / Timezone */}
                <div className="flex max-w-2xl flex-col gap-5">
                  <div className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.14em] text-white/90 uppercase">
                    <span aria-hidden="true" className="size-2 rounded-full bg-white" />
                    <span>{badge}</span>
                  </div>

                  <HeadingTag className="text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-[4.25rem] lg:leading-[1.05]">
                    {event.title}
                  </HeadingTag>

                  <p className="max-w-[46ch] text-base leading-relaxed text-white/85 md:text-lg">
                    {lede}
                  </p>

                  {/* Bottom bar: Apply now pill + Date / Place / Timezone */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-10 gap-y-5 pt-2">
                    <Link
                      href={ctaHref}
                      className="inline-flex h-12 items-center justify-center rounded-pill bg-white px-7 text-sm font-bold text-neutral-950 transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:bg-white/90 active:translate-y-0 active:scale-[0.98]"
                    >
                      Apply now
                    </Link>

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 sm:gap-x-10">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-semibold tracking-[0.12em] text-white/60 uppercase">
                          Date
                        </span>
                        <span className="text-base font-bold text-white md:text-lg">
                          {dateLabel}
                        </span>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-semibold tracking-[0.12em] text-white/60 uppercase">
                          Place
                        </span>
                        <span className="text-base font-bold text-white md:text-lg">
                          {placeLabel}
                        </span>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-semibold tracking-[0.12em] text-white/60 uppercase">
                          Timezone
                        </span>
                        <span className="text-base font-bold text-white md:text-lg">
                          {timezoneLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column: Live Event Countdown */}
                <div className="self-start lg:self-end">
                  <EventCountdown targetDate={targetDateIso} />
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Section 2: Key Benefits */}
      <section
        aria-labelledby="key-benefits-heading"
        className="hairline-y bg-surface px-6 py-16 text-ink md:px-12 md:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-accent uppercase">
              <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
              <span>Key Benefits</span>
            </div>

            <h2
              id="key-benefits-heading"
              className="mt-4 text-3xl font-bold tracking-[-0.03em] text-ink sm:text-4xl md:text-5xl lg:text-[3.5rem] lg:leading-[1.08]"
            >
              The system for sustainable success
            </h2>
          </div>

          <div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-14">
            {KEY_BENEFITS.map((item) => {
              return (
                <div key={item.title} className="flex flex-col items-start">
                  {item.animated === "growth" ? (
                    <GrowthTrendIcon />
                  ) : item.animated === "selling" ? (
                    <SellingBriefcaseIcon />
                  ) : item.animated === "edge" ? (
                    <CompetitiveMedalIcon />
                  ) : item.animated === "finance" ? (
                    <FinancePiggyBankIcon />
                  ) : item.animated === "competition" ? (
                    <CompetitionAwardIcon />
                  ) : (
                    <FutureMapPinIcon />
                  )}
                  <h3 className="mt-5 text-xl font-bold tracking-[-0.015em] text-ink md:text-[1.35rem]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 max-w-[34ch] text-base leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Video Testimonials ("See what others are saying") */}
      <EventTestimonialsCarousel />

      {/* Section 4: Past Events */}
      <PastEventsCarousel items={pastEventCards} />
    </div>
  );
}
