import { ButtonLink } from "@/components/ui/button";
import { Container, PendingNote } from "@/components/ui/layout";
import { ImageSlot } from "@/components/ui/portrait-slot";
import { RotatingWord } from "@/components/ui/rotating-word";
import { Reveal } from "@/components/ui/reveal";
import { SerifText } from "@/components/ui/serif-text";
import { hero } from "@/lib/content";

/**
 * HERO
 * Layout family: split. Copy in a left hand column, portrait in a right hand one,
 * with an accent plate offset behind the photograph.
 *
 * WHY THIS IS NO LONGER A FULL BLEED HERO
 *
 * The photograph used to be the hero: it ran edge to edge across the section and
 * the text sat over it on a navy split scrim, which meant light text, a `hero-scrim`
 * gradient, and an alpha derived in `globals.css` against a photograph that does
 * not exist yet. The client asked for a split layout instead, which is the shape
 * this now has.
 *
 * Two consequences worth knowing, because both are invisible in the markup:
 *
 * - There is no scrim and nothing to derive. Dark text on the canvas is the
 *   highest contrast pair on the site and needs no photograph dependent maths.
 * - The portrait is a CARD in a column again, so it goes back to a fixed `4 / 5`
 *   with its own frame, and the text no longer depends on where in the frame the
 *   subject happens to be standing.
 *
 * THE OFFSET PLATE
 *
 * A solid accent rounded rectangle, the same size as the portrait, translated
 * down and to the right behind it so a band of accent shows along the bottom and
 * right edges. It is `aria-hidden` and purely decorative.
 *
 * It is inset-0 rather than given explicit dimensions so it is always exactly the
 * portrait's box, including when the photograph is still pending and the box is
 * only a reserved `aspect-ratio`. Two separately sized rectangles would drift the
 * moment either changed.
 *
 * IT IS `bg-accent`, NOT A HARD CODED COLOUR.
 *
 * The plate takes the live accent token, so it follows the palette in both colour
 * schemes instead of being pinned to the blue it was designed in. It sits directly
 * on the canvas at full saturation, which is the one place on this hero where the
 * accent is used as a surface rather than as a mark on text.
 *
 * THE STAT ROW
 *
 * Three figures under the calls to action. Every value is `null` in the content
 * layer, because every one of them would be an unverified claim about results, so
 * the hero renders a pending mark instead of a number. The reasoning is recorded
 * where the values live, in `hero.stats`.
 *
 * The `topic` under each one names a category of measure rather than making an
 * assertion, which is why those three lines can be published today and only the
 * figures above them cannot.
 *
 * DOM ORDER IS THE MOBILE ORDER
 *
 * The stat row sits inside the left column rather than being a third grid child,
 * so on a phone it falls between the calls to action and the photograph. That is
 * the order it reads in on a desktop too, and it keeps the primary CTA well above
 * the fold on the narrowest viewport rather than pushing it under a portrait that
 * used to be underneath everything.
 *
 * THE HEADLINE MEASURE IS UNCHANGED, AND THE WIDTH PROBE DEPENDS ON IT
 *
 * `max-w-[12ch]` puts "Turning Chaos" on the first line and "Into Clarity." on the
 * second. `verify-widths` fails the build above three lines at any width from 320
 * up, and a headline that filled its column instead would break that at the narrow
 * end. Two lines is also where the break belongs in this sentence.
 */
export function Hero() {
  return (
    /* `data-hero-split` replaced `data-hero-fullbleed`, which is what
       `probe-hero.mjs` used to find this section. The marker moves with the
       design rather than pinning the probe to a layout that no longer exists. */
    <section className="relative isolate" data-hero-split="">
      <Container className="section-y">
        {/*
          ASYMMETRIC COLUMNS, AND A PORTRAIT SMALLER THAN ITS COLUMN.

          An even `lg:grid-cols-2` gave the photograph half the 1400px container,
          which at 4:5 is a 700x875 block and made the hero taller than the fold on
          a laptop. The composition this follows puts roughly half the width to
          copy and about a third to the portrait.

          So the copy column is the wider of the two, and the portrait is capped
          and centred inside its own column rather than filling it. Both numbers
          are here because the reference proportion is the whole point of the
          change; the cap is what keeps the hero from growing with the viewport.
        */}
        <div className="grid items-center gap-x-16 gap-y-14 lg:grid-cols-[1.12fr_0.88fr]">
          {/* ---------------------------------------------------------- copy */}
          <div className="flex flex-col items-start gap-6">
            <Reveal trigger="mount" distance={14}>
              {/*
                The role, set as an eyebrow.

                It was a filled badge with the name in a pill above it. A badge is
                right when it is competing with a photograph for attention; this
                hero has white space to spend and the eyebrow spends it without
                adding a block to the stack.

                `eyebrow` is the existing utility: uppercase, meta size, and it
                takes the accent, so the role reads in the same colour as the
                rotating word rather than in a second accent of its own.
              */}
              <p className="eyebrow">{hero.role}</p>
            </Reveal>

            <Reveal trigger="mount" delay={0.08} distance={20}>
              {/* Serif letters on the two "r"s: see `SerifText`. */}
              <h1 className="text-display-1 max-w-[12ch] leading-display text-balance">
                <SerifText text="Tu|rning Chaos Into" />{" "}
                <RotatingWord />
              </h1>
            </Reveal>

            <Reveal trigger="mount" delay={0.16} distance={18}>
              {/* `measure` is 62ch, which is wider than this column and would let
                  the supporting line run the full measure of a 700px column. It is
                  capped against the column instead. */}
              <p className="max-w-[46ch] text-base leading-relaxed text-ink-muted md:text-lg">
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

            <Reveal trigger="mount" delay={0.32} distance={14}>
              {/*
                A hairline above the row rather than below each figure. It reads as
                one ruled measure with three columns in it, which is what the three
                of them are, and it keeps the vertical rhythm of the hero to a
                single rule instead of three.
              */}
              <dl className="grid w-full grid-cols-3 gap-6 border-t border-hairline pt-6">
                {hero.stats.map((stat) => (
                  <div key={stat.topic} className="flex flex-col gap-1.5">
                    {/*
                      `stat.value` is null for all three until the client confirms
                      them, so this renders the pending mark rather than a figure.
                      Supplying a value is the only edit needed to publish one: the
                      pending state and the real one are the same markup path.
                    */}
                    <dd
                      className="text-display-2 leading-none text-accent tabular-nums"
                      data-asset-slot={`stat, ${stat.topic}`}
                      data-asset-spec="Hero stat figure, one line, 3 characters or fewer"
                    >
                      {stat.value ?? <span className="text-placeholder-ink">—</span>}
                    </dd>
                    <dt className="text-sm leading-snug text-ink-muted">{stat.topic}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>

            <div className="max-w-2xl">
              <PendingNote>
                The three figures above are placeholders. No outcome has been
                verified for publication, so no number is shown.
              </PendingNote>
            </div>
          </div>

          {/* ------------------------------------------------------ portrait */}
          <Reveal trigger="mount" delay={0.1} distance={22}>
            {/*
              `max-w-[24rem]` caps and centres the portrait inside its column, and
              `mx-auto` is what centres it. The offset plate is inside this box, so
              it is capped and offset with the photograph rather than escaping its
              column.
            */}
            <div className="relative isolate mx-auto w-full max-w-[24rem]">
              {/*
                The offset plate. `aria-hidden`, and behind the portrait because
                `isolate` scopes this stacking context to the wrapper and the slot
                below is `relative`, so paint order follows the markup rather than
                whichever element happens to be positioned first.

                Translated rather than offset with negative insets: a negative inset
                would have to be cancelled against the parent's own padding, and
                the two would disagree as soon as either changed. A translate moves
                the box without changing its layout position, so the portrait
                above still sits on the wrapper's box and the section height is
                unaffected by the decoration.

                Held to the same radius as `.slot`, which rounds at
                `--radius-panel`. A plate with a smaller radius than the photograph
                in front of it shows a sliver of accent at the corners.
              */}
              <div
                aria-hidden="true"
                data-hero-plate=""
                className="absolute inset-0 translate-x-4 translate-y-4 rounded-panel bg-accent sm:translate-x-6 sm:translate-y-6"
              />

              {/*
                `preload` because this is the largest contentful paint on the
                landing page. The `priority` prop it replaces is deprecated in
                Next 16.

                `sizes` is the real rendered width: the capped portrait, not the
                grid column it sits in and not the viewport. Without it the browser
                fetches the 1600px source into a 384px box.
              */}
              <ImageSlot
                label="Editorial portrait of Lokesh Rohilla"
                ratio={hero.portrait.ratio}
                spec={hero.portrait.spec}
                direction={hero.portrait.direction}
                className="relative"
                src={hero.portrait.src}
                alt={hero.portrait.alt}
                preload
                sizes="(min-width: 1024px) 24rem, 100vw"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}