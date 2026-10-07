import {
  CirclesThreePlus,
  Compass,
  GraduationCap,
  Strategy,
  Users,
} from "@phosphor-icons/react/dist/ssr";

import { Container, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { SerifText } from "@/components/ui/serif-text";
import { focusAreas } from "@/lib/content";

/**
 * SECTION 4 - WHAT I WORK ON
 * Layout family: asymmetric card grid, 7 / 5 then 4 / 4 / 4.
 *
 * Exactly five cells for exactly five areas. No filler tile, no empty cell.
 *
 * IMPORTANT: the column span lives on the Reveal wrapper, because the wrapper
 * is the grid item. Putting lg:col-span-* on the inner article instead would
 * silently do nothing and collapse every card into one narrow column.
 *
 * ICONS ARE PAIRED BY POSITION, NOT BY NAME
 *
 * `focusAreas.icons` holds one icon per area, in the same order. They are
 * matched by index rather than by looking up an icon keyed on the title, because a
 * title keyed lookup fails silently: rename a card and the icon vanishes rather
 * than erroring, and the card is left with an empty plate. A missing entry here is
 * a visible gap in a row of five, which is the correct way to fail.
 *
 * The icons are decorative. Each one is `aria-hidden` and the card heading already
 * names the area, so announcing "buildings" before "Business Transformation" would
 * be noise for a screen reader and nothing for anyone else.
 */

/** One icon per area, matched by index. Five areas, five icons. */
const ICONS = [
  Strategy,
  Users,
  GraduationCap,
  CirclesThreePlus,
  Compass,
] as const;

export function FocusAreas() {
  return (
    <section>
      <Container className="section-y">
        <SectionHeading
          eyebrow={focusAreas.eyebrow}
          headline={<SerifText text={focusAreas.headline} />}
          lede={focusAreas.lede}
          size="lg"
        />

        <div className="mt-12 grid gap-5 md:mt-16 lg:grid-cols-12">
          {focusAreas.areas.map((area, index) => {
            const isFeature = area.span === "wide";

            const span = isFeature
              ? "lg:col-span-7"
              : area.span === "tall"
                ? "lg:col-span-5"
                : "lg:col-span-4";

            const Icon = ICONS[index];

            return (
              <Reveal
                key={area.title}
                delay={index * 0.06}
                distance={18}
                className={span}
              >
                <article
                  className={`group flex h-full flex-col justify-between gap-6 rounded-panel p-7 transition-shadow duration-300 ease-brand hover:shadow-lift md:p-8 ${
                    isFeature ? "on-ink" : "bg-surface"
                  }`}
                >
                  {/*
                    The plate lifts and the icon shifts on hover, with the movement
                    kept under 4px. A larger travel reads as the card jumping rather
                    than as a response, and the whole card is already moving its
                    shadow. Both transitions are declared together so the icon does
                    not lag a frame behind the plate.
                  */}
                  <span
                    className={`icon-plate transition-[transform,background-color] duration-300 ease-brand group-hover:-translate-y-0.5 ${
                      isFeature ? "icon-plate-on-ink" : ""
                    }`}
                  >
                    <Icon
                      aria-hidden="true"
                      className="size-6 transition-transform duration-300 ease-brand group-hover:scale-110 motion-reduce:transition-none"
                      weight="duotone"
                    />
                  </span>

                  <h3
                    className={`mt-2 max-w-[18ch] leading-tight text-balance ${
                      isFeature ? "text-display-3" : "text-display-4"
                    }`}
                  >
                    {area.title}
                  </h3>
                  <p
                    className={`measure max-w-[42ch] text-sm leading-relaxed md:text-base ${
                      isFeature ? "" : "text-ink-muted"
                    }`}
                  >
                    {area.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
