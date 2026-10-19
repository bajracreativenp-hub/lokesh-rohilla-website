"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CaretLeft, CaretRight, Play } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "motion/react";

import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { VideoModal } from "@/components/ui/video-modal";

const SLIDES = [
  {
    copy: "Join over 10,000+ people and organizations around the world who are achieving the extraordinary with Lokesh's tools. Their stories paint the picture of what's possible for you, too. Lasting benefits for leaders, teams, and attendees include:",
    stat1: { value: "300%", label: "increase in operational execution & cognitive clarity" },
    stat2: { value: "139%", label: "increase in team alignment & leadership execution" },
  },
  {
    copy: "Transforming internal friction into momentum. Across hospitality, retail, manufacturing, and executive teams, our structured frameworks eliminate dependency and build self-sustaining leadership.",
    stat1: { value: "85%", label: "reduction in meeting load and founder bottleneck" },
    stat2: { value: "4.6★", label: "Google rating across 318+ verified member reviews" },
  },
  {
    copy: "Grounded in eighteen years of real turnarounds and thousands of stage hours. No motivational theory or borrowed playbooks—only actionable systems calibrated to your exact operational reality.",
    stat1: { value: "100%", label: "diagnostic rigor before prescribing any structural changes" },
    stat2: { value: "18+", label: "years creating breakthroughs for businesses and individuals" },
  },
];

export function HungerSection() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  const prevSlide = () => {
    setSlideIndex((i) => (i === 0 ? SLIDES.length - 1 : i - 1));
  };

  const nextSlide = () => {
    setSlideIndex((i) => (i === SLIDES.length - 1 ? 0 : i + 1));
  };

  const activeSlide = SLIDES[slideIndex];

  return (
    <section aria-label="Personal and business hunger" className="hairline-y bg-canvas">
      <Container className="section-y">
        <Reveal>
          {/* Main Top Headline */}
          <h2 className="text-display-2 max-w-[22ch] leading-display-2 text-balance text-ink mb-10 sm:mb-14">
            Do you have a hunger to increase the quality of your life?
          </h2>

          {/* Interconnected Bento Grid */}
          <div className="relative isolate grid grid-cols-1 lg:grid-cols-12 items-stretch gap-8 lg:gap-0">
            {/* Top-Left: Royal Blue Photo Card */}
            <div className="lg:col-span-7 relative z-10 overflow-hidden rounded-3xl lg:rounded-br-none bg-[#1e5ae6] min-h-[400px] lg:min-h-[460px] flex items-end justify-center shadow-card">
              <Image
                src="/hero-artwork.jpg"
                alt="Lokesh Rohilla"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover object-top mix-blend-luminosity brightness-105 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e5ae6]/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Top-Right: Text & Meet Button Area */}
            <div className="lg:col-span-5 relative z-10 p-6 sm:p-8 lg:p-12 flex flex-col justify-between gap-6">
              {/* The Blue Interlocking Bridge centered exactly at (bottom: 0, left: 0) */}
              <div
                aria-hidden="true"
                className="hidden lg:block absolute -bottom-10 -left-10 size-20 bg-[#1e5ae6] -z-10 pointer-events-none"
              />

              {/* Concave Corner Cutout at Bottom-Left of this quadrant */}
              <div
                aria-hidden="true"
                className="hidden lg:block absolute bottom-0 left-0 w-10 h-10 pointer-events-none z-20"
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="w-full h-full block">
                  <path d="M 0 0 H 40 V 40 C 17.91 40 0 22.09 0 0 Z" fill="var(--canvas, #ffffff)" />
                </svg>
              </div>

              <div className="flex flex-col gap-5 pt-2">
                <p className="text-base sm:text-lg leading-relaxed text-ink-muted">
                  We believe progress equals happiness. And no matter where you&apos;re looking to excel,
                  we&apos;re here to help you forge your pathway to power. Meet the man who&apos;s spent 18+
                  years creating breakthroughs and transforming lives.
                </p>
                <div>
                  <Link
                    href="/about"
                    className="inline-flex h-11 items-center rounded-pill border border-hairline-strong bg-surface px-6 text-sm font-bold text-ink transition-all duration-200 hover:border-ink hover:bg-surface-sunk active:translate-y-px"
                  >
                    Meet Lokesh Rohilla
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom-Left: Featured In Strip Area */}
            <div className="lg:col-span-7 relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-center gap-4">
              {/* Concave Corner Cutout at Top-Right of this quadrant */}
              <div
                aria-hidden="true"
                className="hidden lg:block absolute top-0 right-0 w-10 h-10 pointer-events-none z-20"
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="w-full h-full block">
                  <path d="M 0 0 C 22.09 0 40 17.91 40 40 H 0 Z" fill="var(--canvas, #ffffff)" />
                </svg>
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Featured in:
              </p>
              <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-ink/70">
                <span className="font-serif text-xl sm:text-2xl font-black tracking-tight text-ink/80 hover:text-ink transition-colors">
                  Forbes
                </span>
                <span className="font-sans text-lg sm:text-xl font-black uppercase tracking-widest text-ink/80 hover:text-ink transition-colors">
                  FORTUNE
                </span>
                <span className="font-serif text-xl sm:text-2xl font-extrabold italic text-ink/80 hover:text-ink transition-colors">
                  Inc.
                </span>
                <span className="font-sans text-lg sm:text-xl font-black uppercase tracking-wider text-ink/80 hover:text-ink transition-colors">
                  SUCCESS
                </span>
              </div>
            </div>

            {/* Bottom-Right: Video Preview Card */}
            <div
              onClick={() => setVideoOpen(true)}
              className="lg:col-span-5 group relative aspect-video lg:aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-3xl lg:rounded-tl-none border border-hairline bg-neutral-900 shadow-lift min-h-[260px] z-10"
            >
              <Image
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80"
                alt="Keynote speech and live session with Lokesh"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover transition-transform duration-500 ease-brand group-hover:scale-105 opacity-80"
              />
              {/* Blue gradient flowing from the top-left intersection into the video */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1e5ae6] via-[#1e5ae6]/40 to-black/40 pointer-events-none z-10" />

              {/* Translucent pill in center */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="inline-flex items-center gap-2 rounded-pill bg-black/60 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-md border border-white/20 shadow-lift transition-transform duration-200 group-hover:scale-110">
                  <Play weight="fill" className="size-3.5 text-white" />
                  <span>Watch video</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Results & Carousel Block ("Rohilla equals results") */}
          <div className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-hairline">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Heading and Carousel Controls */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                <h3 className="text-display-2 leading-display-2 text-ink tracking-tight font-extrabold text-balance">
                  Rohilla <br />
                  equals results
                </h3>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous result slide"
                    className="inline-flex size-10 items-center justify-center rounded-full border border-hairline-strong bg-canvas text-ink transition-colors hover:border-ink hover:bg-surface active:scale-95"
                  >
                    <CaretLeft weight="bold" className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next result slide"
                    className="inline-flex size-10 items-center justify-center rounded-full border border-hairline-strong bg-canvas text-ink transition-colors hover:border-ink hover:bg-surface active:scale-95"
                  >
                    <CaretRight weight="bold" className="size-4" />
                  </button>
                  <span className="ml-2 text-xs font-bold text-ink-muted">
                    {slideIndex + 1} / {SLIDES.length}
                  </span>
                </div>
              </div>

              {/* Right Column: Carousel Content */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slideIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-6"
                  >
                    <p className="text-base sm:text-lg leading-relaxed text-ink-muted">
                      {activeSlide.copy}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-6 sm:gap-10 pt-2">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-display-2 font-extrabold text-ink tracking-tight">
                          {activeSlide.stat1.value}
                        </span>
                        <span className="text-xs sm:text-sm text-ink-muted leading-snug">
                          {activeSlide.stat1.label}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-display-2 font-extrabold text-ink tracking-tight">
                          {activeSlide.stat2.value}
                        </span>
                        <span className="text-xs sm:text-sm text-ink-muted leading-snug">
                          {activeSlide.stat2.label}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="pt-2">
                  <Link
                    href="/services/business-consultation"
                    className="inline-flex h-11 items-center rounded-pill border border-hairline-strong bg-surface px-6 text-sm font-bold text-ink transition-all duration-200 hover:border-ink hover:bg-surface-sunk active:translate-y-px"
                  >
                    Learn more
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
        title="Lokesh Rohilla Live Keynote & Executive Masterclass"
      />
    </section>
  );
}
