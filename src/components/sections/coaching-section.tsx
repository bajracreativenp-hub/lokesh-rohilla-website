"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Play } from "@phosphor-icons/react/dist/ssr";

import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { VideoModal } from "@/components/ui/video-modal";

export function CoachingSection() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section aria-label="Coaching and expert guidance" className="bg-[#050811] text-white">
      <Container className="section-y">
        <Reveal>
          {/* Interconnected Coaching Bento Grid: 2-row layout with seamless bridge */}
          <div className="relative">
            {/* Row 1: Amber Badge on Left (5/12), Headline on Right (7/12) */}
            <div className="flex flex-col md:flex-row">
              {/* Amber Badge Container (md:w-5/12) */}
              <div className="relative flex w-full items-end overflow-visible md:w-5/12">
                {/* Interlocking organic amber bridge at intersection */}
                <div
                  aria-hidden="true"
                  className="absolute right-0 bottom-0 hidden h-20 w-20 translate-x-1/2 translate-y-1/2 md:block pointer-events-none z-0 bg-[#f59e0b]"
                >
                  <div className="absolute h-20 w-20 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#050811]" />
                  <div className="absolute h-20 w-20 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#050811]" />
                </div>

                {/* Amber Badge Card */}
                <div className="relative z-10 flex w-full min-h-[170px] sm:min-h-[190px] flex-col justify-center rounded-2xl bg-[#f59e0b] p-7 sm:p-8 text-neutral-950 shadow-none border-0">
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-neutral-900/80 mb-1">
                    LOKESH ROHILLA
                  </span>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter uppercase italic leading-[0.9] text-neutral-950">
                    BUSINESS<br className="hidden sm:inline" /> DOCTOR
                  </h3>
                </div>
              </div>

              {/* Top-Right: Headline Container (md:w-7/12) */}
              <div className="relative z-10 order-first w-full pb-6 md:order-last md:w-7/12 md:pl-8 lg:pl-12 md:pb-4 flex flex-col justify-end">
                <h2 className="text-display-2 leading-display-2 font-extrabold tracking-tight text-white text-balance pt-1">
                  Expert guidance for your path
                </h2>
              </div>
            </div>

            {/* Mobile connector bridge */}
            <div
              aria-hidden="true"
              className="grid h-5 grid-cols-5 md:hidden pointer-events-none bg-[#f59e0b]"
            >
              <div className="col-span-2 rounded-r-full bg-[#050811]" />
              <div />
              <div className="col-span-2 rounded-l-full bg-[#050811]" />
            </div>

            {/* Row 2: Stats & Actions on Left (5/12), Video on Right (7/12) */}
            <div className="flex flex-col items-stretch md:flex-row">
              {/* Video container on desktop is on the right (7/12) */}
              <div className="flex h-auto w-full md:w-7/12 relative z-10">
                <div
                  onClick={() => setVideoOpen(true)}
                  className="group relative aspect-[16/10] sm:aspect-[16/9] w-full translate-x-0 cursor-pointer overflow-hidden rounded-2xl bg-neutral-900 shadow-none border-0"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80"
                    alt="Personal breakthrough and mentorship session with Lokesh"
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
                  />
                  {/* Subtle dark vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-colors group-hover:bg-black/30" />

                  {/* Amber gradient flowing seamlessly from top-left into video */}
                  <div
                    className="absolute inset-0 hidden md:block pointer-events-none"
                    style={{
                      background: "radial-gradient(circle at 0% 0%, #f59e0b 0%, #f59e0b 25%, transparent 65%)",
                    }}
                  />
                  <div
                    className="absolute inset-0 block md:hidden pointer-events-none"
                    style={{
                      background: "linear-gradient(to top, transparent 50%, #f59e0b 100%)",
                    }}
                  />

                  {/* Frosted Translucent Pill */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="inline-flex items-center gap-2 rounded-pill bg-black/60 px-6 py-3 text-sm font-bold text-white backdrop-blur-md border border-white/20 shadow-lift transition-transform duration-200 group-hover:scale-110">
                      <Play weight="fill" className="size-4 text-white" />
                      <span>Watch</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats & Description & Actions on Left (5/12) */}
              <div className="relative z-10 order-last flex w-full flex-col justify-start md:order-first md:w-5/12 pt-8 md:pt-8 md:pr-8 lg:pr-12 gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                      81%
                    </span>
                    <span className="text-xs sm:text-sm text-neutral-400 leading-snug">
                      improved time management
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                      70%
                    </span>
                    <span className="text-xs sm:text-sm text-neutral-400 leading-snug">
                      increased work performance
                    </span>
                  </div>
                </div>

                <p className="text-sm sm:text-base leading-relaxed text-neutral-300">
                  Achieve lasting transformation in all areas of your life. Discover the support you need
                  to do more, be more and serve more with one-on-one strategy sessions with our expert
                  results coaches.
                </p>

                {/* Stacked Coaching Action Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                  <Link
                    href="/services/self-development"
                    className="inline-flex h-12 w-full items-center justify-center rounded-pill bg-white/10 border border-white/15 px-6 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 active:translate-y-px"
                  >
                    Results coaching
                  </Link>
                  <Link
                    href="/services/business-consultation"
                    className="inline-flex h-12 w-full items-center justify-center rounded-pill bg-white/10 border border-white/15 px-6 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 active:translate-y-px"
                  >
                    Business coaching
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>

      {/* Video Modal */}
      <VideoModal
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        title="Expert Coaching & Mentorship with Lokesh Rohilla"
      />
    </section>
  );
}
