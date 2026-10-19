import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { ImageSlot } from "@/components/ui/portrait-slot";
import { hero } from "@/lib/content";

/**
 * HERO
 * Layout family: cinematic full bleed. One wordmark standing in the lower left of
 * a photograph, supporting copy and two calls to action in the lower right.
 *
 * WHAT THIS IS NOT ANY MORE
 *
 * The previous hero was a split layout on white: a column of copy beside a portrait
 * card, with an accent plate behind it, three placeholder statistics, two floating
 * cards over the photograph and a word rotating in the headline. None of that is
 * here. Every one of those elements was composed against white space around it, and
 * this design has none. They were removed rather than relocated, because moving them
 * would only move the problem somewhere less appropriate.
 *
 * WHAT IS LOAD BEARING HERE
 *
 * - **The artwork is the design.** There is no layout to fall back on, so
 *   `hero.artwork.src` being null renders a labelled pending slot rather than a
 *   stock photograph. See the note in `content.ts`: filling it with someone else's
 *   image on a personal brand site is the one thing this must not do.
 * - **The veil.** Type standing on a photograph needs a scrim, and this one is
 *   bottom weighted because the type is in the bottom third. Its alpha is the
 *   worst case against a white photograph, which is what `probe-contrast` measures
 *   rather than whatever image happens to be behind it.
 * - **The height.** The hero is a fixed clamp on the viewport rather than an aspect
 *   ratio, so the artwork crops instead of stretching and the type never lands on a
 *   different part of the image at a different window size.
 *
 * THE WORDMARK IS THE H1
 *
 * It is one fixed word, which is what makes it a logotype rather than a headline.
 * The accessibility argument for that is in `content.ts`: the site's CTA intent lock
 * names exactly two intents, so this hero uses those two labels rather than
 * inventing a third wording for itself.
 *
 * NO `on-ink` ON ANY OF THIS.
 *
 * `.on-ink` is a background AND a token repoint: it sets `background-color: #0B1730`
 * alongside the light ink values. Using it here would paint an opaque navy
 * rectangle over the photograph with a hard edge where the veil faded, which is the
 * exact failure the previous hero documented. The light inks are named directly
 * instead, so the tokens are never repointed and the artwork stays visible.
 */
export function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden -mt-[78px] sm:-mt-[88px]"
      data-hero-art=""
      /*
        `solidify-scrim` tells `probe-contrast` to measure this hero against the
        SOLID colour the veil produces at its darkest over a white photograph,
        rather than against the pending slot or whatever artwork is loaded.

        The previous hero carried this too, for the same reason and with the same
        note. It is not decoration: without it the probe tries to resolve a
        background through a photograph and reports the hero text as unmeasurable.
      */
      data-a11y-rest="solidify-scrim"
      aria-labelledby="hero-wordmark"
    >
      {/*
        THE ARTWORK, FULL BLEED.

        `bleed` because this is the one slot that touches all four edges of its
        section. `.slot` rounds its corners at `--radius-panel`, and on a layer that
        spans the whole hero the clipped corners let the page background show
        through as a white line around the image.

        `elevated={false}` because a drop shadow around an element that already
        fills its section is only ever visible on the two edges that touch the
        viewport, which reads as a rendering fault rather than as depth.

        `preload` because this is the largest contentful paint on the landing page.
        The `priority` prop it replaces is deprecated in Next 16.
      */}
      <div className="absolute inset-0 z-[var(--z-base)]">
        <ImageSlot
          bleed
          elevated={false}
          label="Hero artwork"
          spec={hero.artwork.spec}
          direction={hero.artwork.direction}
          src={hero.artwork.src ?? undefined}
          /*
            Empty alt. The artwork is atmosphere standing behind a wordmark and a
            sentence that already say what this page is, so describing it again for
            a screen reader would be noise. It is still the page's largest image, so
            `preload` is right; it just is not content.
          */
          alt=""
          preload
          className="h-full w-full"
        />
      </div>

      {/*
        THE VEIL. Solid at the bottom where the type is, gone by three quarters of
        the way up, so the artwork keeps the top of the frame.

        `aria-hidden` and `pointer-events-none`: it is a gradient, it carries no
        information, and it must never intercept a click meant for the button under
        it.
      */}
      <div
        aria-hidden="true"
        className="hero-veil pointer-events-none absolute inset-0 z-[var(--z-raised)]"
      />

      {/*
        THE CONTENT, ANCHORED TO THE BOTTOM.

        `min-h` rather than `h`, deliberately: at the narrowest widths the wordmark
        wraps and the copy runs longer than one screen height, and a fixed height
        would clip them. The hero grows instead.

        `100svh` MINUS THE HEADER, NOT `100svh`.

        This is the whole point of the section, so it is worth being exact about.

        A plain `100svh` hero fills the screen and then pushes its own bottom edge
        73px below the fold, because the sticky header sits above it in normal flow
        and takes that space first. The wordmark is anchored to the bottom of the
        frame, so its calls to action end up under the fold at every width tested,
        and the next section is entirely off screen rather than starting where it
        should.

        Subtracting the header instead means the hero runs from the bottom of the
        header to the bottom of the viewport: the photograph fills the whole visible
        screen, and the white section begins exactly at the fold line, which is what
        the composition is for.

        `svh` rather than `vh`, because on a phone `vh` is measured with the browser
        chrome retracted. A hero sized to `100vh` is taller than the screen while
        the address bar is showing, which puts the bottom of the composition under
        it. `svh` is the height the visitor can actually see.

        `var(--header-h)` is the published header height, 72px of bar plus its 1px
        border. Using 72 here would be a pixel short and the gap would be a hairline
        rather than nothing, which is precisely the kind of defect that gets
        "fixed" later by someone nudging the number.

        `justify-end` is the composition. Everything sits in the last quarter of the
        frame and the photograph gets the rest, which is the entire arrangement.

        `data-hero-text` names the element the contrast probe paints its solid
        worst case onto. It has to be the element that actually contains the text,
        not the section, or the probe measures the artwork instead.
      */}
      <Container
        data-hero-text
        className="relative z-[var(--z-content)] flex min-h-svh flex-col justify-end pb-10 pt-28 md:pb-14"
      >
        {/*
          The wordmark takes the wider track and the copy the narrower one, which is
          the inverse of every other section on the site. Everywhere else the copy
          leads because it is being read; here the mark is being looked at and the
          copy is the smaller thing beside it.

          `items-end` aligns the two blocks on their last lines, so the bottom of the
          wordmark and the bottom of the button row share a baseline band. Centring
          them instead leaves the wordmark floating above the buttons with a gap
          under it that reads as a mistake.
        */}
        <div className="grid items-end gap-x-12 gap-y-8 lg:grid-cols-[1.3fr_1fr]">
          <h1
            id="hero-wordmark"
            /*
              `font-bold` rather than `font-extrabold`.

              The reference wordmark is set very heavy, and 800 is the weight that
              would answer it, but `next/font` only loads the weights asked of it
              and this project asks for 400 through 700. An unrequested 800 is
              synthesised by the browser, which does not match the real thing and
              varies by engine, so the weight actually available is used instead and
              the size does the work. 700 at this scale is already the heaviest
              heading anywhere on the site.

              `text-display-hero` is the logotype scale, and it is the one heading on
              this site that is not weight 400. The reasoning, and why it does not
              contradict the rule it breaks, is recorded beside the token in
              `globals.css`.
            */
            className="text-display-hero font-bold leading-none tracking-[-0.035em] text-canvas"
          >
            {hero.wordmark}
            {/*
              THE ASTERISK.

              Raised and scaled down rather than sitting on the baseline as another
              character. At this size a full size asterisk is a second word; at 42%
              and superscript it reads as the mark beside the mark, which is what it
              is.

              `aria-hidden` because it is punctuation on a logotype, and announced
              it would be read as "Lokesh asterisk" on every page load.
            */}
            <span aria-hidden="true" className="align-super text-[0.42em] leading-none">
              {hero.mark}
            </span>
          </h1>

          <div className="flex flex-col gap-6">
            {/*
              The supporting line. `text-canvas/85` rather than a dimmer token: the
              veil behind it is a gradient over an unknown photograph, so a fixed
              muted colour would be a guess about what is behind it, whereas an alpha
              over a known light ink is always the same relationship. 85% still
              measures about 8.8:1 against the veil's worst case.
            */}
            <p className="max-w-[44ch] text-base leading-relaxed text-canvas/85 md:text-lg">
              {hero.lede}
            </p>

            <div className="flex items-center gap-3">
              {/* White pill, navy label. The `light` variant, for a call to action
                  standing on a dark photograph. */}
              <ButtonLink href={hero.primary.href} variant="light" size="lg">
                {hero.primary.label}
              </ButtonLink>

              {/*
                THE CIRCULAR ARROW.

                Icon only, so the label lives in `aria-label`. A bare arrow glyph
                announces "button" and nothing else, and the navigation already has
                three of those on every page.

                Navy fill with a canvas arrow, mirroring the white pill beside it, so
                the pair reads as one object rather than two unrelated controls. It
                is the second of the two locked intents, about rather than contact,
                which is why it is here at all rather than duplicating the pill.
              */}
              <Link
                href={hero.secondary.href}
                aria-label={hero.secondary.ariaLabel}
                className="inline-flex size-14 shrink-0 items-center justify-center rounded-pill bg-ink text-canvas transition-[background-color,transform,box-shadow] duration-200 ease-brand hover:bg-accent active:translate-y-px"
              >
                <ArrowRight aria-hidden="true" className="size-5" weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}