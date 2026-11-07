import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { EventCountdown } from "@/components/pages/event-countdown";
import { extractTextFromLexical, getLiveEvents } from "@/lib/cms";
import { UNSPLASH } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Events",
  description:
    "Masterclasses, workshops, corporate training and live events.",
};

export default async function EventsPage() {
  const liveEvents = await getLiveEvents();
  const featured = liveEvents.find((e) => e.featured) ?? liveEvents[0];

  const badge = featured
    ? featured.locationType === "in-person"
      ? "IN-PERSON"
      : featured.locationType === "hybrid"
        ? "HYBRID"
        : "VIRTUAL"
    : "VIRTUAL";

  const headline = featured?.title ?? "Grow your business exponentially";

  const lede =
    (featured
      ? typeof featured.description === "string"
        ? featured.description.trim()
        : extractTextFromLexical(featured.description)
      : "") ||
    "Get the concrete strategies and tools that have transformed thousands of businesses at every stage.";

  const targetDateIso = featured?.date || "2027-01-13T09:00:00+05:30";

  const dateLabel = featured?.date
    ? new Date(featured.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Jan 13 - 17, 2027";

  const placeLabel =
    featured?.venue ||
    (featured?.locationType === "in-person"
      ? "In-Person"
      : featured?.locationType === "hybrid"
        ? "Hybrid"
        : "Virtual");

  const timezoneLabel = "IST";

  const ctaHref = featured?.registrationUrl || "/contact#contact-form";

  const bgImage =
    (featured?.bannerImage &&
      typeof featured.bannerImage === "object" &&
      featured.bannerImage.url) ||
    `${UNSPLASH}1540575467063-178a50c2df87?auto=format&fit=crop&w=2000&q=85`;

  return (
    <div className="bg-canvas px-3 py-4 md:px-6 md:py-6">
      <section
        aria-label="Featured event"
        className="relative isolate mx-auto flex min-h-[540px] max-w-[1520px] flex-col justify-end overflow-hidden rounded-[24px] bg-[#060d18] p-6 sm:p-10 md:min-h-[640px] md:p-14 lg:min-h-[700px] lg:p-16"
      >
        {/* Background photograph */}
        <Image
          src={bgImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className=" -z-20 object-cover object-center"
        />

        {/* Dark readability scrim + signature green stage-light glow */}
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
          className="pointer-events-none absolute -bottom-24 right-1/4 -z-10 h-[360px] w-[620px] rounded-full bg-emerald-500/35 blur-[110px]"
        />

        {/* Foreground content row */}
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          {/* Left column: Eyebrow, Headline, Lede, CTA + Meta */}
          <div className="flex max-w-2xl flex-col gap-5">
            <div className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.14em] text-white/90 uppercase">
              <span aria-hidden="true" className="size-2 rounded-full bg-white" />
              <span>{badge}</span>
            </div>

            <h1 className="text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-[4.25rem] lg:leading-[1.05]">
              {headline}
            </h1>

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
    </div>
  );
}
