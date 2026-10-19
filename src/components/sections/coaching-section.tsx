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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              {/* Vibrant Amber/Orange Coaching Card */}
              <div className="flex min-h-[170px] sm:min-h-[190px] flex-col justify-center rounded-3xl bg-[#f59e0b] p-7 sm:p-8 text-neutral-950 shadow-lift">
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-neutral-900/80 mb-1">
                  LOKESH ROHILLA
                </span>
                <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter uppercase italic leading-none text-neutral-950">
                  COACHING
                </h3>
              </div>

              {/* Stats & Description */}
              <div className="flex flex-col gap-6">
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

            {/* Right Column (lg:col-span-7) */}
            <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">
              {/* Massive Bold Headline */}
              <h2 className="text-display-2 leading-display-2 font-extrabold tracking-tight text-white text-balance pt-1">
                Expert guidance for your path
              </h2>

              {/* Cinematic Landscape Video/Photo Card */}
              <div
                onClick={() => setVideoOpen(true)}
                className="group relative aspect-[16/10] sm:aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-2xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80"
                  alt="Personal breakthrough and mentorship session with Lokesh"
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-colors group-hover:bg-black/30" />

                {/* Frosted Translucent Pill */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="inline-flex items-center gap-2 rounded-pill bg-black/60 px-6 py-3 text-sm font-bold text-white backdrop-blur-md border border-white/20 shadow-lift transition-transform duration-200 group-hover:scale-110">
                    <Play weight="fill" className="size-4 text-white" />
                    <span>Watch</span>
                  </div>
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
