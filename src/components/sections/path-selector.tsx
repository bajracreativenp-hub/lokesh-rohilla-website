"use client";

import Link from "next/link";
import { useState } from "react";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { ImageSlot } from "@/components/ui/portrait-slot";

export type TransformPath = {
  who: string;
  items: readonly string[];
  /** The photograph shown when this path is hovered or focused. */
  image: {
    label: string;
    spec: string;
    ratio: string;
    direction: string;
    /** DEMO ONLY, same contract as `Photo.src`. */
    src?: string;
    /** Alt text for the demo photograph. */
    alt?: string;
  };
  cta: { label: string; href: string };
};

/**
 * PATH SELECTOR
 *
 * Interaction modelled on a stacked word list that expands to reveal one line of
 * detail at a time. Values below were measured rather than guessed:
 *
 *   word         53.2px, weight 500, letter-spacing -0.05em, line-height 0.9
 *   row          flex, align-items center, gap 24px, padding 4px 0
 *   explore pill radius full, padding 12px 24px, opacity 0 -> 1, transition 0.5s
 *
 * Behaviour:
 *   - the hovered or focused row goes full ink, its siblings dim
 *   - an Explore pill fades in beside the active row only
 *   - the detail panel cross-fades to the active path
 *
 * Accessibility notes:
 *   - every row is a real link, so the section is navigable by keyboard and
 *     screen reader without any extra wiring
 *   - focus produces the same state change as hover
 *   - `engaged` resets only when focus or the pointer leaves the list, so
 *     tabbing between rows does not flicker the panel
 *   - on touch and small screens there is no hover, so every path's items are
 *     rendered in the flow and the pills are always visible
 *   - the panel is decorative duplication of that list on mobile, so it is
 *     hidden from assistive tech rather than read twice
 */
export function PathSelector({ paths }: { paths: readonly TransformPath[] }) {
  const [active, setActive] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const reduce = useReducedMotion();

  const select = (index: number) => {
    setActive(index);
    setEngaged(true);
  };

  const release = (event: React.FocusEvent<HTMLUListElement>) => {
    const list = event.currentTarget;
    if (!list.contains(event.relatedTarget as Node | null)) setEngaged(false);
  };

  const current = paths[active];

  return (
    <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
      <ul
        className="flex flex-col gap-1 lg:gap-0"
        onMouseLeave={() => setEngaged(false)}
        onBlur={release}
      >
        {paths.map((path, index) => {
          const isActive = engaged && index === active;

          return (
            <li key={path.who}>
              <Link
                href={path.cta.href}
                onMouseEnter={() => select(index)}
                onFocus={() => select(index)}
                className="group flex items-center gap-4 py-1 lg:py-0.5"
              >
                <span
                  className={`text-[clamp(2.25rem,6vw,4.25rem)] font-semibold leading-[0.95] tracking-[-0.04em] transition-colors duration-300 ease-brand ${
                    // 50% ink composites to #858B98 on white, which is 3.42:1.
                    // These words are 36px or larger so the large text threshold
                    // of 3:1 applies. 30% was tried and measured 1.9:1, which is
                    // unreadable, so 50% is the floor rather than a preference.
                    engaged && !isActive ? "text-ink/50" : "text-ink"
                  }`}
                >
                  {path.who}
                </span>

                {/*
                  Desktop only. The pill is a hover affordance, so on touch it
                  is replaced by the destination named under the item list
                  rather than competing with the word for horizontal space.
                */}
                <span
                  className={`hidden shrink-0 items-center gap-1 rounded-pill bg-sunk px-5 py-2.5 text-[0.8125rem] font-bold text-ink-muted transition-all duration-300 ease-brand lg:inline-flex ${
                    isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                  }`}
                >
                  Explore
                  <ArrowRight aria-hidden="true" className="size-3.5" weight="bold" />
                </span>
              </Link>

              {/*
                The service areas sit under the word at EVERY width.

                They used to live only in the detail panel. With the panel now
                carrying a photograph rather than a list, the word plus its own
                list is the only thing distinguishing one path from another.

                Below `lg` the photograph is rendered inline here instead, because
                there is no right column to reveal it into and no hover on touch.
                Three inline frames read as a set of examples, which is the honest
                equivalent of the desktop hover reveal.
              */}
              <div className="pb-6 pl-1 lg:pb-2">
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {path.items.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-ink-muted">
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 lg:hidden">
                  <ImageSlot
                    label={path.image.label}
                    ratio={path.image.ratio}
                    spec={path.image.spec}
                    direction={path.image.direction}
                    src={path.image.src}
                    alt={path.image.alt}
                  />
                </div>
                <p className="mt-3 text-sm font-bold text-accent lg:hidden">
                  {path.cta.label}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {/*
        THE PHOTOGRAPH.

        The right column used to be a padded panel holding the client logo strip.
        Both are gone: no card, no padding, no logos. What is left is a bare
        photograph that cross-fades to whichever path is hovered or focused.

        `sticky` is kept deliberately. The three words stack down the left column
        and span roughly 400px, so a photograph pinned to the top of the right
        column would be a long way from the third word when that is the one being
        hovered. Sticky is what keeps the image next to the word it belongs to.
        What was removed is the panel, not the positioning.
      */}
      <div className="sticky top-28 hidden min-w-0 self-start lg:block">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.who}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }
            }
          >
            <p className="eyebrow mb-3">{current.cta.label.replace("Explore ", "")}</p>
            <ImageSlot
              label={current.image.label}
              ratio={current.image.ratio}
              spec={current.image.spec}
              direction={current.image.direction}
              src={current.image.src}
              alt={current.image.alt}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
