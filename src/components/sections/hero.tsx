import { ButtonLink, Pill } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { ImageSlot } from "@/components/ui/portrait-slot";
import { Reveal } from "@/components/ui/reveal";
import { SerifText } from "@/components/ui/serif-text";
import { hero } from "@/lib/content";

/**
 * HERO
 * Layout family: full bleed image, text over the left of it on a split scrim.
 *
 * Composition: pill badge, headline with the closing phrase in accent, supporting
 * line, two pill buttons. The photograph is the hero rather than a card inside it,
 * so it fills the section edge to edge and the text sits over it on a split scrim.
 * The scrim alpha is derived from the contrast maths recorded in `globals.css`
 * under `hero-scrim`, and it is the one number here that the incoming photograph
 * may force up or down.
 *
 * Lokesh Rohilla is the subject. The two initiatives are deliberately absent
 * from this section so the first impression is a person, not a service list.
 *
 * Exactly four text elements, per the hero stack rule:
 *   1. brand lockup
 *   2. headline
 *   3. subtext
 *   4. CTAs
 *
 * RESTORED, at the client's instruction, after being removed. Two things came
 * back with it and are load bearing rather than incidental:
 *
 * - **The page's h1.** The brand statement held it while the hero was gone. A
 *   page with no h1 is a real defect, so that handoff was a stopgap. The h1 is
 *   here again and the brand statement is an h2 once more.
 * - **The portrait slot.** The 4:5 editorial portrait had nowhere to live while
 *   the hero was missing. It has its frame back.
 *
 * The verb rail and the platform grid were also removed at the same time and are
 * deliberately NOT restored. They were separate sections that happened to share a
 * file, and only the hero was asked for.
 */
/*
  `hero-wash` is a three stop linear gradient built from `--canvas`, `--surface`
  and `--surface-sunk`.

  `data-a11y-rest="solidify-scrim"` tells the contrast probe how to measure this
  hero, and NOT to strip the scrim.

  Stripping it was the first attempt and it was exactly backwards. Removing the
  scrim measures light hero text against a white page, which reports 30 violations,
  and every one of them is an artefact: the scrim is the thing making the text
  legible. Deleting it to take a measurement destroys the thing being measured.

  `solidify-scrim` replaces the gradient with the SOLID colour the scrim produces
  in its worst case, `#374155`, which is navy at 0.82 over a pure white photograph.
  That is the lightest composite a navy scrim can make, so it is the worst case for
  light text, and against it:

    light --ink         9.38:1
    light --ink-muted   4.70:1   the tightest pair on this hero
    light --accent      4.51:1

  All clear AA. The value is derived from the scrim's own alpha, so it has to be
  recomputed if `hero-scrim` ever changes.
*/
export function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden"
      data-a11y-rest="solidify-scrim"
      data-hero-fullbleed=""
    >
      {/*
        THE IMAGE IS NOW THE HERO, NOT A CARD IN IT.

        This replaces the split layout: the photograph fills the section edge to
        edge and the text sits over it on the left. The text block itself is
        unchanged, which is what was asked for.

        `absolute inset-0` rather than a grid cell, because a full bleed image has
        to escape the container while the text stays inside it. `z-index: 0` is
        required and not decoration: this is a positioned layer over a positioned
        section, so without an explicit index it competes with the content beside
        it and wins or loses on source order rather than intent.

        `hero-wash` is NOT used any more. A gradient behind an image is invisible,
        so it was carrying nothing.
      */}
      <div className="absolute inset-0 z-[var(--z-base)]">
        <ImageSlot
          label="Editorial portrait of Lokesh Rohilla, full bleed"
          spec={hero.portrait.spec}
          direction={`${hero.portrait.direction} Full bleed: the subject must sit in the RIGHT half of the frame with clear space on the left, because the headline sits there. Landscape or square crop, not 4:5, and it needs to hold up at 1920 wide.`}
          className="h-full w-full"
          elevated={false}
          /*
            DEMO ONLY, AND THE ONE PLACE IT MATTERS MOST.

            `hero.portrait.src` is a photograph of a man who is not Lokesh. On a
            live site this line must be deleted: a face in the hero of a personal
            brand site asserts that the person is the subject.

            The scrim's 0.82 alpha was derived against a pure white photograph,
            which is the worst case. This image is darker than that, so the scrim
            is doing more work than it needs to and the picture reads dimmer than
            it should. Recompute when the real portrait arrives rather than
            trusting the number to carry across.

            `preload` because this is the largest contentful paint on every page.
            The `priority` prop it replaces is deprecated in Next 16.
          */
          src={hero.portrait.src}
          alt={hero.portrait.alt}
          preload
        />
      </div>

      {/* The split scrim. Solid behind the text, transparent by 72% across. */}
      <div
        aria-hidden="true"
        className="hero-scrim pointer-events-none absolute inset-0 z-[var(--z-raised)]"
      />

      <Container data-hero-text className="section-y relative z-[var(--z-content)]">
        {/*
            `on-ink` FOR ITS COLOUR TOKENS ONLY, AND IT IS IMMEDIATELY OVERRIDDEN.

            `.on-ink` is a background AND a token repoint: it sets
            `background-color: #0B1730` alongside the light ink values. Using it
            here painted an opaque navy rectangle over the photograph with a hard
            right edge where the scrim had faded, which looked like a pasted panel
            rather than a full bleed image.

            `bg-transparent` puts the background back while keeping the tokens, so
            the hero text is light and the photograph still shows through.
          */}
          <div className="on-ink relative z-[var(--z-raised)] flex flex-col items-start gap-6 bg-transparent lg:max-w-[46%]">
            <Reveal trigger="mount" distance={14}>
              {/*
                `bg-ink`, OPAQUE, not a translucent tint.

                This was `bg-ink/25` with a backdrop blur, which is the usual
                glassy treatment over a photograph. It composites to about
                `#666e7e` behind the role text, and `--ink-muted` on that measures
                2.35:1. A translucent panel over an image produces a background that
                depends entirely on what is behind it, so the contrast of the text
                on it cannot be stated in advance and will drift with every
                photograph that replaces the placeholder.

                Opaque navy is the same colour the whole brand already uses for
                this, it measures 9.38:1 for the role text against the scrim, and it
                will still be correct whatever image lands underneath.

                `on-ink` rather than `bg-ink`, because the badge sits inside the
                hero's light ink scope and its role text is `text-ink-muted`, which
                resolves to the LIGHT muted ink there. On its own navy background
                that measured 1.99:1. `on-ink` repoints the tokens to their dark band
                values inside the badge, which is exactly what a navy chip sitting on
                a navy hero needs, and it is the same mechanism `.band-dark` uses.
              */}
              <p className="on-ink inline-flex items-center gap-2 rounded-pill border border-hairline-strong py-1 pl-1 pr-4">
                <Pill>Lokesh Rohilla</Pill>
                <span className="text-[0.8125rem] font-semibold text-ink-muted">
                  {hero.role}
                </span>
              </p>
            </Reveal>

            <Reveal trigger="mount" delay={0.08} distance={20}>
              {/*
                Serif letters on the two "r"s: swapping a letter that already
                carries shape, so the wordform disagreement is somewhere the eye
                already is. The `|` markers are
                stripped before render, so the visible string is unchanged and the
                accessible name stays "Turning Chaos Into Clarity."
              */}
              {/*
                `max-w-[12ch]`, down from 15.

                At 15ch the headline fitted on a single 670px line once the display
                scale changed, which is a regression in composition rather than in
                legibility: a 60px line running the full column is a wall. 12ch puts
                "Turning Chaos" on the first and "Into Clarity." on the second, which
                is where the line break belongs in this headline.

                It also keeps the line count stable across the scale, because `ch`
                scales with the font size rather than being a fixed pixel width.
              */}
              <h1 className="text-display-1 max-w-[12ch] leading-display text-balance">
                <SerifText text="Tu|rning Chaos Into" />{" "}
                <span className="text-accent">
                  Cla<SerifText text="r" />ity.
                </span>
              </h1>
            </Reveal>

            <Reveal trigger="mount" delay={0.16} distance={18}>
              <p className="measure text-base leading-relaxed text-ink-muted md:text-lg">
                {hero.sub}
              </p>
            </Reveal>

            <Reveal trigger="mount" delay={0.24} distance={14}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <ButtonLink href={hero.primary.href} size="lg">
                  {hero.primary.label}
                </ButtonLink>
                <ButtonLink href={hero.secondary.href} variant="outline" size="lg">
                  {hero.secondary.label}
                </ButtonLink>
              </div>
            </Reveal>
        </div>
      </Container>
    </section>
  );
}
