import { TextLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { experienceTeaser } from "@/lib/content";

      export function ExperienceTeaser() {
  return (
    <section className="band-dark">
      <Container className="section-y">
        <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-14">
          {/*
            `tabular-nums` is load bearing: this is the one large figure on the site,
            and if it ever becomes a counting animation the digits must not shift
            sideways as they change.
          */}
          <Reveal distance={18}>
            <p className="text-display-1 leading-none tabular-nums text-accent">
              18+
            </p>
          </Reveal>

          <Reveal delay={0.08} distance={18} className="flex flex-col gap-4 lg:pb-3">
            <h2 className="text-display-3 max-w-[20ch] leading-[1.12] text-balance">
              Multiple Industries. One Perspective.
            </h2>
            <p className="measure text-base leading-relaxed text-ink-muted md:text-lg">
              {experienceTeaser.body}
            </p>
          </Reveal>
        </div>

        {/*
          A plain grid of `Reveal` items, NOT a `RevealGroup`.

          This was a `RevealGroup` whose children were themselves `Reveal`
          elements, which is a double reveal: the group wrapped each child in one
          `Reveal` and the child inside it was another. Two things went wrong. The
          group applied its own stagger on top of the per child delay, so the
          chips landed at `index * 0.05` from the group and `index * 0.05` from
          the inner wrapper, twice as slow as intended. And each chip had two
          opacity ramps stacked, so it faded in over a longer window than every
          other card on the site.

          The column span has to live on a wrapper because the wrapper is the grid
          item, which is why this is written out rather than delegated. Seven
          industries in four columns leaves a hole in row two, so the last chip
          spans two and the grid closes cleanly.
        */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {experienceTeaser.industries.map((industry, index) => {
            const isLast = index === experienceTeaser.industries.length - 1;

            return (
              <Reveal
                key={industry}
                delay={index * 0.05}
                distance={14}
                className={isLast ? "sm:col-span-2 lg:col-span-2" : undefined}
              >
                {/*
                  The accent bar is the only thing that separates these chips, and it
                  is a pseudo element rather than a real element so it costs nothing
                  in the accessibility tree. It is `aria-hidden` by construction: no
                  role, no content, nothing to announce.

                  `inset-0` on the rounded parent means the bar follows the card's own
                  radius, so it does not poke out past the corners at any breakpoint.
                */}
                <div className="group relative flex h-full items-center overflow-hidden rounded-card bg-surface px-5 py-4 text-display-4 leading-tight transition-colors duration-300 ease-brand hover:bg-sunk motion-reduce:transition-none">
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-accent transition-transform duration-300 ease-brand group-hover:scale-y-100"
                  />
                  {industry}
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1} className="mt-12 md:mt-14">
          <TextLink href={experienceTeaser.cta.href}>{experienceTeaser.cta.label}</TextLink>
        </Reveal>
      </Container>
    </section>
  );
}
