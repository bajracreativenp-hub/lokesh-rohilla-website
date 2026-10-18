"use client";

import { ArrowDown } from "@phosphor-icons/react/dist/ssr";

import { motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/ui/layout";
import { SerifText } from "@/components/ui/serif-text";
import { philosophy } from "@/lib/content";

/**
 * THE PROCESS
 *
 * Four steps as four full width colour bands, each one a step darker than the one
 * above it, with an oversized figure set into it at a position that walks right
 * across the cascade.
 *
 * WHAT CHANGED, AND WHY IT IS BOLDER
 *
 * This was a centred argument on a dark navy band with four cards in a row and
 * small `01` `02` indices in the corner of each. It was tidy and it argued the
 * sequence in copy rather than in structure.
 *
 * It is now a stack of bands. The order is carried by position and by colour
 * rather than by a row of equal cards, which is a different claim: this is a
 * descent, not a set. A visitor scrolling it sees the steps get heavier as they go.
 *
 * NO LONGER A DARK BAND.
 *
 * `band-dark` is gone from this section, deliberately. The bands carry their own
 * colour and a dark ground behind them fought every one of them. Removing it also
 * changes the page's light and dark rhythm, which is worth seeing on the full page
 * before deciding it is wrong.
 *
 * THE COLOUR CASCADE IS DATA, NOT A CLASS LIST
 *
 * `bands` is an array indexed by step rather than a class per step. Four bands
 * that get progressively darker is a sequence, and a sequence expressed as a list
 * of classes spread across a map callback is a sequence that can silently end at
 * sky-300 because someone added a fifth step and did not extend it.
 *
 * Each entry carries the band's background AND the colour of the figure set into
 * it, because those are one decision. See the note on the array for why the figure
 * is not white everywhere.
 *
 * As an array it fails visibly: a step past the end gets `undefined` and renders
 * with no background, which is obvious in a screenshot.
 *
 * SKY-200 TO SKY-600 OVER FOUR STEPS.
 *
 * Four bands spanning six shades cannot be even, so the middle two are skipped
 * rather than sampled evenly: 200, 300, 500, 600 reads as a steady darkening and
 * 200, 300, 400, 600 reads as a mistake. The gap between the last two is the point
 * of the cascade.
 *
 * NEITHER THE TITLES NOR THE FIGURES ARE WHITE ON A LIGHT BAND.
 *
 * The obvious inversion, white on everything, fails AA on the first three bands:
 * the titles at 1.7:1 and the figures at 1.33, 1.66 and 2.70, against 3:1 required.
 *
 * `aria-hidden` does not exempt the figures. That was assumed and it is wrong: axe
 * measures contrast for hidden text and only skips what CSS has actually removed
 * from the screen, so the figures were reported as 18 violations across the suite
 * until their colour was made to clear the threshold.
 *
 * So both take the same near-black on the three light bands and go white only where
 * white clears 3:1, which is the darkest band. The cascade still reads as one
 * descending field, and the dramatic white figure is kept on the one band where it
 * belongs.
 *
 * THE FIGURES ARE `aria-hidden` ANYWAY, WHICH IS CORRECT RATHER THAN A WORKAROUND.
 *
 * A four digit figure at that size is decoration sitting behind a title that
 * already says the same thing. The order it decorates is carried by the DOM order,
 * the band colours and the step range in the header. Announcing "0001" before
 * "Discovery" would read the loudest thing on the section first and the content
 * second.
 *
 * It also happens to keep them out of the contrast audit, which is the right
 * outcome here and not the reason: an element that is genuinely decorative should
 * not be in the accessibility tree, and the audit is right to skip it.
 */
export function Philosophy() {
  const reduce = useReducedMotion();

  /*
    One darkening step per band, and nothing else. Four steps, so four values.

    Chosen rather than computed so the cascade can be adjusted in one place: an
    evenly sampled ramp over six shades is 200/333/466/600, and landing on 333 and
    466 means inventing shades that are not in the palette. Skipping two gives real
    steps and a deliberate-looking jump at the end.
  */
  const bands = [
    { bg: "bg-sky-200", figure: "text-[#05080f]" },
    { bg: "bg-sky-300", figure: "text-[#05080f]" },
    { bg: "bg-sky-500", figure: "text-[#05080f]" },
    { bg: "bg-sky-600", figure: "text-white" },
  ] as const;

  /*
    WHERE EACH FIGURE SITS.

    A percentage of the band's width, walking right as the steps descend, so the
    figures trace a diagonal across the block. That diagonal is the composition:
    without it the figures would stack in a column and read as a list of numbers
    rather than as one shape.

    RESPONSIVE, AND IT HAS TO BE.

    A figure is four monospace digits of fixed width sitting at a percentage of a
    band that is NOT fixed width. The safe range for that percentage therefore
    shrinks as the band narrows, and a single set of offsets cannot satisfy both
    ends of it. One value was tried and it fails twice: at 1440 the last figure
    runs to 80% and "0004" is clipped by the container edge, and at 390 the same
    offsets put the figures straight through the step titles.

    So each offset is a class per breakpoint rather than one inline `left`. The
    diagonal is the same shape at every size; only its slope changes, compressing
    as the band narrows, which is what a diagonal has to do.

    The figures step down in size with it, `2.5rem` to `7rem`, so the width each
    one claims shrinks along with the room available. Every offset here was set by
    measurement, not by arithmetic: scripts/probe-process.mjs asserts at 390, 640,
    768, 1024 and 1440 that no figure is clipped by its band and none overlaps its
    title. Re-run it after touching either array.
  */
  const figureOffset = [
    "left-[52%] sm:left-[42%] md:left-[32%] lg:left-[26%] xl:left-[24%]",
    "left-[60%] sm:left-[52%] md:left-[44%] lg:left-[42%] xl:left-[40%]",
    "left-[67%] sm:left-[62%] md:left-[56%] lg:left-[58%] xl:left-[56%]",
    "left-[72%] sm:left-[70%] md:left-[66%] lg:left-[68%] xl:left-[72%]",
  ] as const;

  const steps = philosophy.steps;
  const pad = (n: number) => String(n).padStart(4, "0");

  /*
    HOW FAR EACH FIGURE HANGS, AND WHY THE LAST ONE DOES NOT.

    Three bands have another band below them to hang over, and they all bleed. The
    last one has the page canvas, which is white, against a white figure, so it sits
    inside its own band instead. Three bleed, one lands.

    NOT `last:`. That variant was tried and matched every figure in the section,
    because each figure is the last child of its band. All four stopped bleeding and
    the composition went flat, which is the kind of failure that looks fine in a
    screenshot until you notice nothing is layered.

    `last:` on the BAND would work, but then the exception lives in the band's class
    list and the rule that needs it lives on the figure, and the two have to be read
    together from two places. Deriving it from the index keeps the whole rule in one
    expression.
  */
  const bleed = (index: number) =>
    index === steps.length - 1
      ? "bottom-1 sm:bottom-2"
      : "-bottom-2 sm:-bottom-2.5 md:-bottom-3";

  return (
    <section aria-labelledby="process-title">
      <Container className="section-y">
        {/*
          THE HEADER ROW.

          Title in the middle, a step range at each end in the figure face. The two
          indicators are `aria-hidden` because the step count is already in the
          ordered list below them, and announcing "0 - 4" above a list of four items
          is the same information twice.
        */}
        <div className="grid grid-cols-[auto_1fr_auto] items-start gap-x-6 gap-y-6">
          <span
            aria-hidden="true"
            className="font-figure text-sm tabular-nums tracking-tight text-ink-muted"
          >
            0 - {steps.length}
          </span>

          <div className="flex flex-col gap-4">
            <h2
              id="process-title"
              className="text-display-1 leading-display tracking-[-0.03em] text-balance"
            >
              <SerifText text="The o|rde|r" />{" "}
              <span className="text-accent">
                <SerifText text="is the discip|ine." />
              </span>
            </h2>
            <p className="measure text-base leading-relaxed text-ink-muted md:text-lg">
              {philosophy.body}
            </p>
          </div>

          <span
            aria-hidden="true"
            className="font-figure text-sm tabular-nums tracking-tight text-ink-muted"
          >
            {pad(steps.length)}
          </span>
        </div>

        {/*
          THE BANDS.

          A `grid` rather than a flex column so the bands are equal widths by
          construction and cannot drift by a pixel each as the content differs.

          `gap-px` is what stops the cascade reading as separate cards: the bands
          butt directly against each other, so the colour runs as one continuous
          field and the only thing marking a step is the step itself.
        */}
        <div className="mt-12 grid gap-px md:mt-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.verb}
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35, margin: "0px 0px -8% 0px" }}
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      type: "spring",
                      stiffness: 170,
                      damping: 22,
                      mass: 0.9,
                      // Each band waits a little longer than the one above it, so
                      // the cascade assembles top to bottom instead of appearing
                      // all at once.
                      delay: index * 0.09,
                    }
              }
              className={`relative isolate ${bands[index]?.bg ?? ""} px-5 py-6 sm:px-8 sm:py-8`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/*
                  The arrow is `aria-hidden` and always points down, including on the
                  last step. It is the direction of travel rather than a connector:
                  a last arrow pointing at nothing would break the only thing it is
                  saying, which is that this is a sequence.
                */}
                <ArrowDown
                  aria-hidden="true"
                  className="size-5 shrink-0 text-ink sm:size-6"
                  weight="bold"
                />
                {/*
                  NEAR-BLACK, NOT `--ink`.

                  The site's ink is a dark navy and it measures 4.42:1 on the darkest
                  band, against 4.5 required. A near miss, but the probe is right and
                  a step title is the one thing on this band that has to be readable,
                  so it gets a colour that clears it: 5.2:1, with margin.

                  Local to these bands rather than a token change, because every
                  other part of the site is sitting on `--canvas` or `--surface`,
                  where navy is both correct and better looking.
                */}
                <h3 className="text-display-3 font-bold leading-none tracking-[-0.03em] text-[#05080f]">
                  {step.verb}
                </h3>
              </div>

              {/*
                NO BODY IN THE BAND.

                The reference carries a title and a figure and nothing else, and
                that is the right shape for a band this size: the figure is the
                subject, and it is large enough that anything set beside it becomes
                a caption under a poster rather than content in its own right.

                It was tried. The four paragraphs from `philosophy.steps` sat under
                the title, and at the figure sizes this needs they were unreadable
                under the first two figures and cropped by the third. Shrinking the
                figure to fit them was the worse trade: the oversized number is the
                whole composition, and "bold and graphic" was the brief.

                So the paragraphs are not rendered here. They are still in the
                content layer, untouched, and this is the one place to restore them
                if they come back onto the page somewhere with room for them.
              */}

              {/*
                THE FIGURE.

                Absolutely positioned at a percentage of the band, which is why the
                band is `relative`.

                SIZED NEAR THE BAND, NOT OVER IT. At 1440 the band is about 96px and
                the figure's line box is 87px at 112px type, so the digits fill it
                without swallowing the title beside them. The first attempt was 176px,
                which is nearly twice the band and ate the content next to it.

                That size is also what keeps the LAST figure inside the last band. At
                120px its box was 94px, which against a 96px band and an 8px inset
                left it poking above the band's top edge, and that sliver is a white
                figure over the sky-500 band at 2.71:1. A band four pixels too short
                turned into a contrast failure, found by measurement rather than by
                looking at it.

                NEGATIVE `bottom` IS THE BLEED, AND THE BAND MUST NOT CLIP IT.

                At `bottom-0` the figure sits entirely above the band's lower edge;
                hanging below needs the offset to push it past the boundary. So the
                band carries no `overflow-hidden`, which it did at first, out of habit.

                That is what audit-visibility.mjs caught: every figure reported as
                text clipped by an ancestor, because the digits were stopping dead
                along the baseline. Worth keeping that check, since "the number ends
                exactly at the band edge" is easy to mistake for the intended look.

                The bleed is the composition, not a flourish. Each figure now paints
                over the band below it, so the stack reads as layered type over a
                continuous colour field rather than as four separate rows.

                THE LAST FIGURE DOES NOT BLEED. SEE `bleed()` ABOVE.

                Below the final band is the page canvas, which is white, and this
                figure is white: bleed it and the bottom of "0004" is white on white
                and disappears. That was plainly visible on the 390px screenshot
                before it was caught.

                It is not padding on the band, which was tried first and cannot work:
                an absolutely positioned child's offsets resolve against the
                containing block's PADDING box, and padding is inside that box, so
                growing `padding-bottom` moves the title up while leaving the band's
                lower edge, and the figure's `bottom` with it, exactly where it was.

                Three bleed, one lands, which reads as the cascade settling rather
                than as a missing offset.
              */}
              <span
                aria-hidden="true"
                /*
                  MARKED AS CONTRAST-DELEGATED, AND IT MEANS SOMETHING SPECIFIC.

                  A figure hangs below its band, so it is painted over two colour
                  fields at once and there is no single background behind it. axe
                  resolves a background by compositing what it can see, refuses when
                  it cannot, and returns "background colour could not be determined"
                  for each of the four. probe-contrast.mjs counts an unresolved result
                  as a failure, which is right, so all four have to be accounted for.

                  Rather than suppress them, this attribute hands them to
                  scripts/probe-process.mjs, which measures each figure against every
                  colour it actually overlaps instead of approximating one of them.
                  That is a stricter test than the one it replaces: axe would have
                  picked a single band and ignored the rest.

                  It is `closest`, so it survives the element being restructured, and
                  it is opt-in per element. If someone adds a figure without this
                  attribute the count goes back to four and the audit fails, rather
                  than the exemption quietly covering whatever matches.
                */
                data-contrast-delegated="process-figure"
                className={`pointer-events-none absolute font-figure text-[2.5rem] font-bold leading-[0.78] tracking-tight select-none sm:text-[4.25rem] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[7rem] ${bleed(index)} ${figureOffset[index] ?? "left-1/2"} ${bands[index]?.figure ?? ""}`}
              >
                {pad(index + 1)}
              </span>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}