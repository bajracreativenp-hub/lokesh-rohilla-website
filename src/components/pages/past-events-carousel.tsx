"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { UNSPLASH } from "@/lib/content";

export type PastEventCard = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  alt: string;
};

const DEFAULT_PAST_EVENTS: PastEventCard[] = [
  {
    id: "past-1",
    category: "BUSINESS MASTERY • NEW DELHI",
    title: "How leaders help teams thrive and scale without founder bottlenecks",
    excerpt:
      "The best leaders build teams that are adaptable, emotionally strong, and ready to execute with clear decision rights and accountability.",
    image: `${UNSPLASH}1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=85`,
    alt: "Keynote speaker addressing a packed business mastery audience",
  },
  {
    id: "past-2",
    category: "BUSINESS DOCTOR • MUMBAI",
    title: "Future-proof your company before the next market shift",
    excerpt:
      "Anticipation is the ultimate power. Diagnose operational leaks, fix broken sales handoffs, and build resilient cash flow systems.",
    image: `${UNSPLASH}1515187029135-18ee286d815b?auto=format&fit=crop&w=1000&q=85`,
    alt: "Interactive workshop session with business founders",
  },
  {
    id: "past-3",
    category: "BOOKWISHES CLUB • BENGALURU",
    title: "Executive Presence & Impromptu Speaking Intensive",
    excerpt:
      "Conquering stage fright, structuring high-stakes communication, and commanding any room with clarity and conviction.",
    image: `${UNSPLASH}1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=85`,
    alt: "Stage session on executive communication and leadership",
  },
  {
    id: "past-4",
    category: "LEADERSHIP SUMMIT • HYDERABAD",
    title: "Business Resiliency Strategies for Thriving in Uncertain Times",
    excerpt:
      "Practical frameworks used across 18+ years of enterprise consulting to turn stagnant operations into predictable growth engines.",
    image: `${UNSPLASH}1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=85`,
    alt: "Leadership summit panel and strategy session",
  },
];

export function PastEventsCarousel({ items }: { items?: PastEventCard[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cards = items && items.length > 0 ? items : DEFAULT_PAST_EVENTS;

  const scrollByCard = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 440, behavior: "smooth" });
  };

  return (
    <section
      aria-labelledby="past-events-heading"
      className="bg-[#060911] py-16 text-white md:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Top bar: "Past Events" + "Explore past events >" on left, Prev/Next buttons on right */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <h2
              id="past-events-heading"
              className="text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl"
            >
              Past Events
            </h2>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/75 transition-colors hover:text-white"
            >
              <span>Explore past events</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous past events"
              className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 active:scale-95"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next past events"
              className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 active:scale-95"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal cards strip */}
        <div
          ref={scrollerRef}
          className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth md:mt-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((card) => (
            <article
              key={card.id}
              className="group flex w-[300px] shrink-0 snap-start flex-col sm:w-[370px] md:w-[420px]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-white/5">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(min-width: 1024px) 420px, (min-width: 640px) 370px, 300px"
                  className="object-cover object-center transition-transform duration-500 ease-brand group-hover:scale-[1.03]"
                />
              </div>

              <span className="mt-5 text-[11px] font-semibold tracking-[0.12em] text-white/60 uppercase">
                {card.category}
              </span>

              <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-white md:text-xl">
                {card.title}
              </h3>

              <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-white/65">
                {card.excerpt}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
