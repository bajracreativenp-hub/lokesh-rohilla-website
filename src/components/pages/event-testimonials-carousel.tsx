"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { VideoModal } from "@/components/ui/video-modal";
import { UNSPLASH } from "@/lib/content";

type VideoTestimonial = {
  id: string;
  name: string;
  role: string;
  image: string;
  alt: string;
};

const TESTIMONIAL_VIDEOS: VideoTestimonial[] = [
  {
    id: "testimonial-1",
    name: "Priya Sharma — Founder & CEO",
    role: "Scaled retail operations 3x after Business Mastery",
    image: `${UNSPLASH}1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85`,
    alt: "Business founder sharing her transformation story",
  },
  {
    id: "testimonial-2",
    name: "Ananya Verma — Managing Director",
    role: "Restructured sales handoffs and doubled closing rate",
    image: `${UNSPLASH}1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=85`,
    alt: "Executive speaking about sales mastery",
  },
  {
    id: "testimonial-3",
    name: "Marcus Vance — Co-Founder",
    role: "Built self-running operational systems in 90 days",
    image: `${UNSPLASH}1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85`,
    alt: "Entrepreneur describing business turnaround",
  },
  {
    id: "testimonial-4",
    name: "Rohan & Meera Kapoor — Partners",
    role: "Aligned leadership vision and expanded to 4 new cities",
    image: `${UNSPLASH}1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=85`,
    alt: "Co-founders sharing their event experience",
  },
  {
    id: "testimonial-5",
    name: "Vikram Malhotra — Enterprise Leader",
    role: "Eliminated founder bottlenecks and improved cash flow",
    image: `${UNSPLASH}1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85`,
    alt: "Enterprise leader speaking on leadership growth",
  },
];

export function EventTestimonialsCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);

  const scrollByCard = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 370, behavior: "smooth" });
  };

  return (
    <section
      aria-labelledby="event-testimonials-heading"
      className="bg-canvas py-16 text-ink md:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Header row: Title left, Prev/Next buttons right */}
        <div className="flex items-end justify-between gap-6">
          <h2
            id="event-testimonials-heading"
            className="text-4xl font-bold tracking-[-0.035em] text-ink sm:text-5xl md:text-[3.5rem] leading-[1.05]"
          >
            See what others
            <br />
            are saying
          </h2>

          <div className="flex items-center gap-2.5 pb-1">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous testimonials"
              className="inline-flex size-10 items-center justify-center rounded-full bg-surface text-ink transition-colors duration-200 hover:bg-sunk active:scale-95"
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
              aria-label="Next testimonials"
              className="inline-flex size-10 items-center justify-center rounded-full bg-surface text-ink transition-colors duration-200 hover:bg-sunk active:scale-95"
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
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth md:mt-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TESTIMONIAL_VIDEOS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveVideo(item)}
              aria-label={`Watch testimonial from ${item.name}`}
              className="group relative aspect-[3/4] w-[270px] shrink-0 snap-start overflow-hidden rounded-[18px] bg-surface text-left sm:w-[310px] md:w-[345px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 345px, (min-width: 640px) 310px, 270px"
                className="object-cover object-center transition-transform duration-500 ease-brand group-hover:scale-[1.03]"
              />

              {/* Hover tint */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20"
              />

              {/* Top-left Watch badge on hover */}
              <div className="pointer-events-none absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/25 px-4 py-2 text-xs font-semibold text-white opacity-0 backdrop-blur-md transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-3.5"
                >
                  <path d="M6 4l15 8-15 8V4z" />
                </svg>
                <span>Watch</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <VideoModal
        isOpen={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        title={activeVideo ? `${activeVideo.name} — ${activeVideo.role}` : ""}
      />
    </section>
  );
}
