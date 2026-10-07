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
 *
 * WHY THERE ARE NO YEARS ANYWHERE IN THIS
 *
 * The obvious version of this layout is built on dates: a black pill reading
 * "2021", a large heading reading "May/2021", and the year as a watermark several
 * hundred pixels tall. Exactly one year in this career has been confirmed, 2021,
 * for the founding of The Bookwishes Club. Every other year and month would have to
 * be invented to fill the layout, and inventing a founding date is not a design
 * detail.
 *
 * So the ordinal carries the position, the phase name carries the label, and the
 * one confirmed year stays in the body copy where it belongs. The composition is
 * unchanged. The numbers are only the ones that are true.
 *
 * NO AUTOPLAY
 * The timeline advances only when the reader clicks. That is also what keeps
 * this out of WCAG 2.2.2 territory entirely: nothing moves unless the reader
 * moves it. A timeline that scrolls itself is a carousel nobody asked for.
 *
 * KEYBOARD AND SCREEN READER
 * The region is a labelled carousel. Chevron buttons carry the target phase in
 * their accessible name rather than a generic "next". Dot pagination is real
 * buttons with `aria-current`. A polite live region announces the phase on every
 * change. Left and Right arrows move between phases when the carousel has
 * focus, and the buttons are reachable in document order.
 *
 * ON A PHONE EVERY PHASE IS RENDERED
 * Below `lg` the phases stack in full and the controls are not rendered. A
 * carousel whose contents only exist in client state shows one item to anyone
 * without JavaScript, so the mobile and no-JS path is a plain list instead.
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
        {/*
          THE AXIS
          A full width rule with a node on it and the ordinal pill beside the
          node. Both sit at the left on every phase. The
          line is behind everything and spans the whole measure, so it reads as
          a track running through the whole career rather than a divider sized to
          the content beside it.
        */}
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
          <span className="relative z-10 ml-4 inline-flex h-8 shrink-0 items-center rounded-pill bg-ink px-4 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-canvas">
            {current.ordinal}
          </span>
        </div>

        {/*
          Heading and body on one side, the circle on the other. The order flips
          per phase so consecutive phases alternate.
        */}
        <div className="mt-8 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="lg:py-10">
            {/*
              NO GHOSTED NUMERAL, AND THAT IS A DELIBERATE OMISSION

              A year several hundred pixels tall behind everything as a watermark
              is the obvious thing here. Two attempts were made to keep it and both
              produced something worse than leaving it out.

              A four digit year that large is a fact the reader can use. A two
              digit ordinal blown up to fill the column is decoration pretending
              to be data. At full size it clipped against the edge of the measure.
              Scaled down and moved behind the phase name it sat across the
              heading and the body copy, and at 7% ink on a light band it read as
              a clipped glyph and a rendering fault rather than a choice, which
              is a worse impression than no watermark at all.

              So position is carried by the axis node and the ordinal pill, which
              are legible, and the space does the work that a watermark was
              standing in for. If confirmed years exist, a real year watermark
              belongs here and the layout has room for it.
            */}
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
                    {/*
                      The circle is a fixed size and the slot fills it, rather
                      than the slot owning the aspect ratio. A 1:1 ratio inside a
                      round clip is what makes the mask work; letting the slot size
                      itself left a square with rounded photograph corners
                      showing through the circle.
                    */}
                    <div
                      className="aspect-square w-full max-w-[22rem] overflow-hidden rounded-full"
                    >
                      <ImageSlot
                        label={current.image.label}
                        spec={current.image.spec}
                        direction={current.image.direction}
                        className="h-full w-full"
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
            className="inline-flex size-12 items-center justify-center rounded-pill border border-hairline-strong text-ink transition-colors duration-200 ease-brand hover:border-accent hover:text-accent"
          >
            <span className="sr-only">Previous phase</span>
            <CaretLeft aria-hidden="true" className="size-5" weight="bold" />
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
            className="inline-flex size-12 items-center justify-center rounded-pill border border-hairline-strong text-ink transition-colors duration-200 ease-brand hover:border-accent hover:text-accent"
          >
            <span className="sr-only">Next phase</span>
            <CaretRight aria-hidden="true" className="size-5" weight="bold" />
          </button>
        </div>

        {/*
          Announces the change. Polite rather than assertive: a reader who
          clicked Next does not need the announcement interrupting them.
        */}
        <p aria-live="polite" className="sr-only">
          {`Phase ${index + 1} of ${count}: ${current.label}`}
        </p>
      </div>

      {/*
        PHONE AND NO-JS: every phase in full, no carousel.

        Below `lg` the carousel is display:none and this list takes over, so a
        touch visitor gets all five phases rather than one and a pair of arrows
        they may never find.

        It is also what a visitor WITHOUT JavaScript gets at desktop width, where
        the carousel would otherwise render its server default of phase one and
        leave four phases unreachable. The <noscript> block below swaps the two.
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

      {/*
        Without JavaScript the carousel can only ever show its first phase, so it
        is swapped for the full list. This is what <noscript> is for, and it
        avoids the alternative of shipping a duplicated timeline in the markup
        and hiding one of the copies with CSS at every breakpoint.
      */}
      <noscript>
        <style>{`
          [data-timeline-carousel] { display: none !important; }
          [data-timeline-fallback] { display: flex !important; }
        `}</style>
      </noscript>
    </div>
  );
}