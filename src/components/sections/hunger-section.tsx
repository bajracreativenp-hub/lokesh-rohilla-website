"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CaretLeft, CaretRight, Play, Star } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "motion/react";

import { CountUp } from "@/components/ui/count-up";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { VideoModal } from "@/components/ui/video-modal";
import { impactMetrics } from "@/lib/content";

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

          {/* Interconnected Bento Section: Two-row responsive layout with seamless organic neck */}
          <div className="relative">
            {/* Row 1: Photo on Left (2/3), Text on Right (1/3) */}
            <div className="flex flex-col md:flex-row">
              {/* Photo Card container */}
              <div className="relative flex w-full items-end overflow-visible md:w-2/3">
                {/* Interlocking organic bridge at intersection */}
                <div
                  aria-hidden="true"
                  className="absolute right-0 bottom-0 hidden h-20 w-20 translate-x-1/2 translate-y-1/2 md:block pointer-events-none z-0 bg-[#1e5ae6]"
                >
                  <div className="absolute h-20 w-20 translate-x-1/2 -translate-y-1/2 rounded-full bg-canvas" />
                  <div className="absolute h-20 w-20 -translate-x-1/2 translate-y-1/2 rounded-full bg-canvas" />
                </div>

                {/* Photo Card */}
                <div className="relative z-10 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl md:aspect-video bg-[#1e5ae6] shadow-none border-0">
                  <Image
                    src="/lokesh-hunger.png"
                    alt="Lokesh Rohilla"
                    fill
                    sizes="(min-width: 768px) 66vw, 100vw"
                    className="object-cover object-left-top sm:object-center"
                    priority
                  />
                </div>
              </div>

              {/* Top-Right: Text container */}
              <div className="relative z-10 w-full py-6 md:w-1/3 md:p-8 lg:p-12 flex flex-col justify-center gap-6">
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

            {/* Mobile connector bridge */}
            <div
              aria-hidden="true"
              className="grid h-5 grid-cols-5 md:hidden pointer-events-none bg-[#1e5ae6]"
            >
              <div className="col-span-2 rounded-r-full bg-canvas" />
              <div />
              <div className="col-span-2 rounded-l-full bg-canvas" />
            </div>

            {/* Row 2: Impact Metrics on Left (2/3), Video on Right (1/3) */}
            <div className="flex flex-col items-stretch md:flex-row">
              {/* Video container on desktop is on the right (1/3) */}
              <div className="flex h-auto w-full md:w-1/3 relative z-10">
                <div
                  onClick={() => setVideoOpen(true)}
                  className="group relative flex aspect-video w-full translate-x-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-neutral-900 shadow-none border-0 px-6 py-10"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80"
                    alt="Keynote speech and live session with Lokesh"
                    fill
                    sizes="(min-width: 768px) 34vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-brand group-hover:scale-105 opacity-80"
                  />
                  {/* Blue gradient flowing seamlessly from top-left into video */}
                  <div
                    className="absolute inset-0 hidden md:block pointer-events-none"
                    style={{
                      background: "radial-gradient(circle at 0% 0%, #1e5ae6 0%, #1e5ae6 25%, transparent 65%)",
                    }}
                  />
                  <div
                    className="absolute inset-0 block md:hidden pointer-events-none"
                    style={{
                      background: "linear-gradient(to top, transparent 50%, #1e5ae6 100%)",
                    }}
                  />

                  {/* Play button pill */}
                  <div className="relative z-10 inline-flex items-center gap-2 rounded-pill bg-white/10 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-md border border-white/20 shadow-lift transition-transform duration-200 group-hover:scale-105 group-hover:bg-white/20">
                    <Play weight="fill" className="size-4 text-white" />
                    <span>Watch video</span>
                  </div>
                </div>
              </div>

              {/* Impact Metrics on desktop is on the left (2/3) */}
              <div className="relative z-10 order-last flex w-full flex-col justify-center md:order-first md:w-2/3 py-6 pr-4 sm:pr-8 md:pr-10 lg:pr-12">
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-6 lg:grid-cols-4 lg:gap-6">
                  {impactMetrics.map((item, index) => (
                    <div
                      key={item.label}
                      className={`flex flex-col gap-1.5 ${
                        index % 2 === 1
                          ? "border-l border-hairline pl-3 sm:pl-4 lg:pl-5"
                          : index > 0
                          ? "lg:border-l lg:border-hairline lg:pl-5"
                          : ""
                      }`}
                    >
                      <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                        <span className="tabular-nums text-2xl sm:text-3xl lg:text-3xl font-extrabold tracking-tight text-ink">
                          {item.value === "18+" ? (
                            <CountUp from={1} to={18} suffix="+" duration={1.5} delay={0.15} />
                          ) : (
                            item.value
                          )}
                        </span>
                        {"isRating" in item && item.isRating ? (
                          <span className="flex items-center text-amber-500" aria-label="Rating out of 5 stars">
                            <Star weight="fill" className="size-4 sm:size-5 text-amber-500" />
                          </span>
                        ) : (
                          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-accent">
                            {item.unit}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs font-bold text-ink leading-snug sm:text-sm">
                        {item.label}
                      </h3>

                      <p className="text-[11px] leading-relaxed text-ink-muted">
                        {item.sub}
                      </p>
                    </div>
                  ))}
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
