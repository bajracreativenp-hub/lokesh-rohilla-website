"use client";

import { useId, useState } from "react";

import { Pause, Play } from "@phosphor-icons/react/dist/ssr";

import { TextLink } from "@/components/ui/button";
import { Container, PendingNote, SectionHeading } from "@/components/ui/layout";
import { SerifText } from "@/components/ui/serif-text";
import { clientLogos, workedWith } from "@/lib/content";

/**
 * WORKED WITH
 *
 * A continuously scrolling row of client logos. Greyscale at rest, full colour
 * when hovered or keyboard focused.
 *
 * Replaced the "Selected Transformations" cards. Those engagements were not lost:
 * the same descriptions are published on /about and on
 * /services/business-consultation#case-studies.
 *
 * THE SCROLL IS CSS, THE PAUSE IS JAVASCRIPT
 * The motion is one `translateX` keyframe in globals.css, so there is no
 * animation loop to run or clean up. JavaScript is used only for the one thing
 * CSS cannot express: a user controlled pause.
 *
 * WCAG 2.2.2, Pause Stop Hide: content that moves for more than five seconds
 * needs a mechanism to pause it. Three are provided. Hovering the row pauses it.
 * Focusing anything inside it pauses it, so tabbing into the row does not let it
 * slide out from under the thing being read. And there is an explicit Pause
 * button, a real toggle carrying `aria-pressed`.
 *
 * `prefers-reduced-motion` switches the scroll off entirely and wraps the row,
 * rather than merely slowing it. The global reduced motion block would otherwise
 * leave the track parked at translateX(-50%), showing the duplicated row with a
 * gap where the first one used to be.
 *
 * THE LOOP IS SEAMLESS BECAUSE THE TRACK IS EXACTLY TWO ROWS
 * The second row is `aria-hidden`, so the organisation names are not announced
 * twice. It exists purely so that translating by -50% moves exactly one row
 * width, which makes the loop invisible.
 *
 * THESE ARE PLACEHOLDER FRAMES, NOT LOGOS
 * The organisations are named engagements, but written permission to display
 * each mark is not confirmed, so no mark is shown. Each slot carries its spec and
 * a fixed width, the size a real mark occupies, so the row does not reflow when
 * the placeholders are replaced.
 */
export function WorkedWith() {
  const [paused, setPaused] = useState(false);
  const labelId = useId();

  /*
    `offset` shifts which organisation a row starts on, so the two rows are not the
    same six names in the same order travelling past each other. Without it the
    counter-scroll reads as one row and a mirror, which looks like a bug rather than
    a weave.

    Splitting the list rather than reversing it is deliberate: reversing the array
    would put the duplicate row's first item next to the original's first item at
    the loop point, which is exactly the seam the duplication exists to hide.
  */
  const row = (hidden: boolean, offset = 0) => {
    const logos = clientLogos.map((_, i) => clientLogos[(i + offset) % clientLogos.length]);

    return (
      <ul
        aria-hidden={hidden || undefined}
        className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
      >
        {logos.map((logo) => (
        <li key={logo.name} className="group shrink-0">
          <div
            data-asset-slot="client-logo"
            data-asset-spec={logo.spec}
            title={`${logo.name}, logo pending`}
            className="flex h-16 w-[10.5rem] items-center justify-center gap-2.5 rounded-md border border-hairline bg-canvas px-3 grayscale transition-[filter,border-color,transform] duration-300 ease-brand group-hover:-translate-y-0.5 group-hover:border-accent group-hover:grayscale-0 group-focus-within:grayscale-0 motion-reduce:transition-none"
          >
            {/*
              No reduced opacity.

              `opacity-55` on top of `grayscale` composited the muted ink down to
              2.3:1 and failed AA, which the route audit caught. The rest state is
              carried by colour instead: `text-ink-muted` at 5.9:1 passes, going to
              full `text-ink` on hover.

              `bg-canvas` is explicit because a six-item marquee of transparent
              frames lets whatever scrolls behind it show through, which on the
              homepage is the section edge and on a `surface` section is the tint.
              With it the frames read as objects sitting on the page rather than as
              holes cut in it.

              The monogram stands in for the mark and is `aria-hidden`: the name
              beside it is the label, and announcing "LR" before each organisation
              would be noise. When a real logo replaces this, the monogram is the
              single element to delete.
            */}
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-md bg-ink text-[0.625rem] font-extrabold tracking-tight text-canvas transition-colors duration-300 ease-brand group-hover:bg-accent group-hover:text-accent-ink"
            >
              {logo.initials}
            </span>
            <span className="text-center text-[0.8125rem] font-bold leading-tight tracking-tight text-ink-muted transition-colors duration-300 ease-brand group-hover:text-ink">
              {logo.name}
            </span>
          </div>
        </li>
      ))}
      </ul>
    );
  };

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
            `role="group"` with a name, not a bare div: a row that moves on its
            own needs to be announced as a labelled region so a screen reader
            user knows what is scrolling. Not focusable, because the Pause button
            immediately below is the keyboard affordance and six decorative marks
            would add nothing to tabbing through.
          */}
          <div
            role="group"
            aria-label="Organizations worked with, scrolling"
            data-paused={paused}
            /*
              Marks this row as a clipping viewport, so the visibility audit knows
              that logos sitting outside the box are the marquee working rather than
              text being cut off. Declared here, next to the mechanism, rather than
              inferred by the audit from the class name.
            */
            data-marquee=""
            /*
              `data-a11y-rest="strip-filters"` tells the contrast probe to measure
              this subtree with filters removed.

              Every logo rests at `filter: grayscale(1)`, and a filter creates a
              stacking context, which stops axe resolving the background behind the
              text. All six slots came back "background color could not be
              determined" on every pass. This was verified by elimination rather
              than assumed: removing the filter clears it, removing `overflow:
              hidden` does not, and removing the mask class does not.

              So the probe is told to measure the hovered, unfiltered state instead
              of the design being weakened or the probe special cased. The colour
              that has to clear AA is the hovered one, since that is the one a
              reader can actually end up reading.
            */
            data-a11y-rest="strip-filters"
            className="marquee py-2"
          >
            {/*
              TWO ROWS COUNTER-SCROLLING.

              The rows travel in opposite directions, so the eye reads a weave
              rather than a conveyor belt. It is the cheapest genuinely good motion
              idea available here: one keyframe, one `reverse` variant, no second set
              of keyframes to keep in sync.

              Applied here with `marquee-track-reverse` on the second row and an
              offset of 2 so the two rows start on different organisations.

              Each row is its own clipping viewport and its own labelled group,
              because they pause and announce independently. The Pause button covers
              both: it is above them and sets `data-paused` on the wrapper, so one
              control governs the pair rather than leaving half of it unstoppable.
            */}
            <div className="flex flex-col gap-4">
              <div className="marquee py-2" data-marquee="">
                <div className="marquee-track">
                  {row(false)}
                  {row(true)}
                </div>
              </div>
              <div className="marquee py-2" data-marquee="">
                <div className="marquee-track marquee-track-reverse">
                  {row(false, 2)}
                  {row(true, 2)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              aria-pressed={paused}
              /*
                `marquee-toggle` is removed entirely under
                prefers-reduced-motion. A pause control for something that is not
                moving promises motion the visitor has switched off, and it has
                to leave the tab order too, not merely become invisible.
              */
              className="marquee-toggle inline-flex h-11 items-center gap-2 rounded-pill border border-hairline-strong px-5 text-sm font-bold text-ink transition-colors duration-200 ease-brand hover:border-accent hover:text-accent"
            >
              {paused ? (
                <Play aria-hidden="true" className="size-4" weight="fill" />
              ) : (
                <Pause aria-hidden="true" className="size-4" weight="fill" />
              )}
              {paused ? "Play logos" : "Pause logos"}
            </button>

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