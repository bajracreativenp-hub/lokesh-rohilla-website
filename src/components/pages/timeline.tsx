"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { ImageSlot } from "@/components/ui/portrait-slot";
import type { TimelinePhase } from "@/lib/page-content";

/**
 * JOURNEY TIMELINE
 *
 * The composition is a horizontal axis with a node, a black pill above it, the
 * phase name as a large heading, a circular image on the far side, sides
 * alternating per phase, and chevrons plus dot pagination underneath.
 */
export function Timeline({ items }: { items: readonly TimelinePhase[] }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const regionRef = useRef<HTMLDivElement>(null);

  const count = items.length;
  const current = items[index];

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  // Left and Right move between phases, but only while the carousel itself has
  // focus, so they do not steal the arrow keys from a visitor scrolling the page.
  useEffect(() => {
    const node = regionRef.current;
    if (!node) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(index - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(index + 1);
      }
    };

    node.addEventListener("keydown", onKeyDown);
    return () => node.removeEventListener("keydown", onKeyDown);
  }, [go, index]);

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      tabIndex={-1}
      className="flex flex-col gap-10 focus:outline-none lg:gap-12"
    >
      {/*
        DESKTOP: one phase at a time with controls.
        Hidden below lg, where the stacked list below takes over.
      */}
      <div data-timeline-carousel className="hidden lg:block">
        <div className="relative flex h-10 items-center">
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-hairline-strong"
          />
          <span
            aria-hidden="true"
            className="relative z-10 grid size-9 shrink-0 place-items-center rounded-full border border-hairline-strong bg-canvas"
          >
            <span className="size-2.5 rounded-full bg-ink" />
          </span>
          <motion.span
            key={current.ordinal}
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
            }
            className="relative z-10 ml-4 inline-flex h-8 shrink-0 items-center rounded-pill bg-ink px-4 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-canvas"
          >
            {current.ordinal}
          </motion.span>
        </div>

        {/*
          Heading and body on one side, the circle on the other. The order flips
          per phase so consecutive phases alternate.
        */}
        <div className="mt-8 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="lg:py-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.ordinal}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -14 }}
                transition={
                  reduce ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                }
                className="flex flex-col gap-4"
              >
                <h3 className="text-display-2 max-w-[14ch] leading-display-2 text-balance">
                  {current.label}
                </h3>
                <p className="measure-tight text-base leading-relaxed text-ink-muted md:text-lg">
                  {current.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={index % 2 === 1 ? "lg:order-first" : ""}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`img-${current.ordinal}`}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 1.02 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
                }
                className="grid place-items-center"
              >
                <div className="aspect-square w-full max-w-[22rem] overflow-hidden rounded-full">
                  <ImageSlot
                    label={current.image.label}
                    spec={current.image.spec}
                    direction={current.image.direction}
                    className="h-full w-full"
                    src={current.image.src}
                    alt={current.image.alt}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="group inline-flex size-12 items-center justify-center rounded-pill border border-hairline-strong text-ink transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:border-accent hover:bg-surface hover:text-accent active:translate-y-0 active:scale-95"
          >
            <span className="sr-only">Previous phase</span>
            <CaretLeft aria-hidden="true" className="size-5 transition-transform duration-200 ease-brand group-hover:-translate-x-0.5" weight="bold" />
          </button>

          <ul className="flex flex-wrap items-center justify-center gap-2">
            {items.map((phase, i) => (
              <li key={phase.ordinal}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === index ? "true" : undefined}
                  aria-label={`Phase ${i + 1} of ${count}: ${phase.label}`}
                  className={`h-2.5 rounded-pill transition-all duration-300 ease-brand ${
                    i === index ? "w-8 bg-ink" : "w-2.5 bg-hairline-strong hover:bg-ink/40"
                  }`}
                />
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => go(index + 1)}
            className="group inline-flex size-12 items-center justify-center rounded-pill border border-hairline-strong text-ink transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:border-accent hover:bg-surface hover:text-accent active:translate-y-0 active:scale-95"
          >
            <span className="sr-only">Next phase</span>
            <CaretRight aria-hidden="true" className="size-5 transition-transform duration-200 ease-brand group-hover:translate-x-0.5" weight="bold" />
          </button>
        </div>

        <p aria-live="polite" className="sr-only">
          {`Phase ${index + 1} of ${count}: ${current.label}`}
        </p>
      </div>

      {/*
        PHONE AND NO-JS: every phase in full, no carousel.
      */}
      <ul data-timeline-fallback className="flex flex-col gap-10 lg:hidden">
        {items.map((phase) => (
          <li key={phase.ordinal} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-8 shrink-0 items-center rounded-pill bg-ink px-4 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-canvas">
                {phase.ordinal}
              </span>
              <h3 className="text-display-4 leading-tight">{phase.label}</h3>
            </div>
            <p className="text-sm leading-relaxed text-ink-muted">{phase.body}</p>
          </li>
        ))}
      </ul>

      <noscript>
        <style>{`
          [data-timeline-carousel] { display: none !important; }
          [data-timeline-fallback] { display: flex !important; }
        `}</style>
      </noscript>
    </div>
  );
}
