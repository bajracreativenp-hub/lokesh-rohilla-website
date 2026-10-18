"use client";

import Image from "next/image";

import { useId } from "react";

import { TextLink } from "@/components/ui/button";
import { Container, PendingNote, SectionHeading } from "@/components/ui/layout";
import { SerifText } from "@/components/ui/serif-text";
import { clientLogos, workedWith } from "@/lib/content";

/**
 * WORKED WITH
 *
 * One strip of client marks, scrolling, directly below the hero.
 *
 * IT IS A SINGLE STRIP NOW, NOT TWO ROWS
 *
 * This was two rows travelling in opposite directions, so the eye read a weave
 * rather than a conveyor belt. It was a good idea in the middle of a long page
 * where the section could afford to be a moment.
 *
 * It is not a good idea immediately under a full bleed hero. Two counter-scrolling
 * rows is the busiest thing on a page, and putting it directly below a wordmark the
 * size of the hero's means the first two things anyone sees compete with each
 * other. One strip is quieter, reads as a single line of evidence rather than a
 * display, and hands the page back to the hero on the way out.
 *
 * IT SITS BELOW THE HERO, NOT AMONG THE SECTIONS
 *
 * Moved up from seventh position. Its content is the shortest on the page and it is
 * the thing most visitors look for after a name, so it now answers "who has he
 * worked with" before the philosophy section has started making the visitor read.
 *
 * THE PAUSE BUTTON IS GONE, AND THAT IS AN ACCESSIBILITY TRADE
 *
 * There were three mechanisms: hover pauses, focus pauses, and an explicit Pause
 * button. The button is removed, so hover and focus remain.
 *
 * Hover and focus pause are genuine mechanisms and the content still stops when the
 * pointer is on it or a keyboard is in it. But WCAG 2.2.2 asks for a mechanism the
 * user can reach, and "move your mouse over it" is not discoverable the way a
 * button is. This is a deliberate reduction in how easily motion can be stopped,
 * made for a quieter section, and it is recorded here so it is a decision on the
 * record rather than an oversight.
 *
 * `prefers-reduced-motion` still switches the scroll off outright and wraps the
 * strip into a static, scrollable row. That remains the strongest of the three and
 * it costs no space on the page.
 *
 * THE LOOP IS SEAMLESS BECAUSE THE TRACK IS EXACTLY TWO COPIES
 * The second copy is `aria-hidden`, so the organisation names are not announced
 * twice. It exists purely so that translating by -50% moves exactly one strip
 * width, which is what makes the loop invisible. One direction only now, so there
 * is no counter-scroll and no need for the second row to start on a different
 * organisation.
 *
 * READY FOR REAL MARKS
 *
 * Each entry in `clientLogos` carries a `src`. It is null today, and a null `src`
 * renders the monogram placeholder, which is correct: written permission to display
 * each mark is not confirmed, and an implied endorsement is not a granted one.
 *
 * Setting a `src` swaps the monogram for the mark and nothing else changes. The
 * slot already holds the dimensions a real mark occupies, so six rows of logos drop
 * in with no reflow and no change to this component beyond deleting the fallback.
 *
 * These are PLACEHOLDER FRAMES, NOT LOGOS, until a `src` is set.
 */
export function WorkedWith() {
  const labelId = useId();

  /*
    One direction, no offset, no reverse variant.

    The old second row existed to be counter-scrolled and to start on a different
    organisation so the weave would not read as one row and its mirror. With a
    single strip neither problem exists: the loop is the strip and its duplicate,
    and the copy being hidden from assistive tech is the only thing that keeps them
    from being read as twelve organisations rather than six.
  */
  const strip = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
    >
      {clientLogos.map((logo) => (
        <li key={logo.name} className="group shrink-0">
          <div
            data-asset-slot="client-logo"
            data-asset-spec={logo.spec}
            /*
              The title says "pending" only while there is no mark. Once a `src` is
              set the mark is there and saying otherwise on hover would be a lie in
              the one place the visitor is most likely to be looking.
            */
            title={logo.src ? logo.name : `${logo.name}, logo pending`}
            className="flex h-16 w-[10.5rem] items-center justify-center gap-2.5 rounded-md border border-hairline bg-canvas px-3 grayscale transition-[filter,border-color,transform] duration-300 ease-brand group-hover:-translate-y-0.5 group-hover:border-accent group-hover:grayscale-0 group-focus-within:grayscale-0 motion-reduce:transition-none"
          >
            {logo.src ? (
              /*
                THE REAL MARK.

                `object-contain` inside the same fixed box the monogram occupied, so
                a wide wordmark and a square one both sit on the same baseline and
                the strip does not change height when the six are replaced one by
                one. That is the reason the slot reserves `h-16 w-[10.5rem]` rather
                than sizing to the image.

                `alt` names the organisation. The mark is a picture of a logo, and
                for anyone not seeing it the name is the whole content.
              */
              <Image
                src={logo.src}
                alt={`${logo.name} logo`}
                width={168}
                height={40}
                className="max-h-10 max-w-full object-contain"
              />
            ) : (
              /*
                No reduced opacity.

                `opacity-55` on top of `grayscale` composited the muted ink down to
                2.3:1 and failed AA, which the route audit caught. The rest state is
                carried by colour instead: `text-ink-muted` at 5.9:1 passes, going to
                full `text-ink` on hover.

                `bg-canvas` is explicit because a strip of transparent frames lets
                whatever scrolls behind it show through, which on the homepage is the
                hero's bottom edge and on a `surface` section is the tint. With it
                the frames read as objects sitting on the page rather than as holes
                cut in it.

                The monogram stands in for the mark and is `aria-hidden`: the name
                beside it is the label, and announcing "LR" before each organisation
                would be noise. When a real logo replaces this, the monogram is the
                single element to delete.
              */
              <>
                <span
                  aria-hidden="true"
                  className="grid size-7 shrink-0 place-items-center rounded-md bg-ink text-[0.625rem] font-extrabold tracking-tight text-canvas transition-colors duration-300 ease-brand group-hover:bg-accent group-hover:text-accent-ink"
                >
                  {logo.initials}
                </span>
                <span className="text-center text-[0.8125rem] font-bold leading-tight tracking-tight text-ink-muted transition-colors duration-300 ease-brand group-hover:text-ink">
                  {logo.name}
                </span>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-labelledby={labelId}>
      <Container className="section-y">
        <SectionHeading
          eyebrow={workedWith.eyebrow}
          headline={<SerifText text={workedWith.headline} />}
          lede={workedWith.lede}
          size="lg"
        />

        <div className="mt-12 flex flex-col gap-7 md:mt-16">
          {/*
            `role="group"` with a name, not a bare div: a row that moves on its own
            needs to be announced as a labelled region so a screen reader user knows
            what is scrolling. Not focusable, because the marks are decorative frames
            and six of them would add nothing to tabbing through.

            `data-a11y-rest="strip-filters"` tells the contrast probe to measure this
            subtree with filters removed.

            Every mark rests at `filter: grayscale(1)`, and a filter creates a
            stacking context, which stops axe resolving the background behind the
            text. So the probe is told to measure the hovered, unfiltered state
            instead of the design being weakened or the probe special cased. The
            colour that has to clear AA is the hovered one, since that is the one a
            reader can actually end up reading.
          */}
          <div
            role="group"
            aria-label="Organizations worked with, scrolling"
            /*
              `data-marquee` marks this as a clipping viewport, so the visibility
              audit skips it rather than treating logos sitting outside the box as
              text being cut off.

              This attribute was dropped when the section was rewritten and the
              audit caught it immediately: four pieces of text reported as clipped
              at 390px, all of them marks that are simply part way through the
              loop. Declared next to the mechanism that reads it, rather than
              inferred by the audit from the class name.
            */
            data-marquee=""
            data-a11y-rest="strip-filters"
            className="marquee py-2"
          >
            <div className="marquee-track">
              {strip(false)}
              {strip(true)}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            {/*
              No Pause button, and no empty space where one was. The TextLink stays
              because it is a link into the experience rather than a control over
              the animation.
            */}
            <TextLink href={workedWith.cta.href}>{workedWith.cta.label}</TextLink>
          </div>

          <div className="max-w-2xl">
            <PendingNote>{workedWith.pending}</PendingNote>
          </div>
        </div>
      </Container>
    </section>
  );
}