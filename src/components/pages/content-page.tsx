import { BlockView } from "@/components/pages/block-view";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import type { PageDef } from "@/lib/page-content";

/**
 * PAGE SHELL
 *
 * One component renders all nine content pages. Each is a hero, an in-page
 * section rail, and then the sections themselves with anchors.
 *
 * THE RAIL IS NOT NAVIGATION FOR ITS OWN SAKE
 *
 * These pages are long: the Business Consultation page has nine sections, the
 * Self Development page has ten. Without a rail the visitor scrolls past half of
 * it before knowing what is in it. The rail lists every section with a count, so
 * the shape of the page is visible before any of it is read.
 *
 * It is plain anchor links, so it works without JavaScript, is keyboard
 * reachable, and is announced correctly by a screen reader as a list of links
 * into the same page.
 *
 * DARK BANDS
 *
 * At most two sections per page are dark, for rhythm. Alternating surface tones
 * handle the rest, because a page where every third block is navy reads as a
 * template rather than as editorial pacing.
 */
export function ContentPage({ page }: { page: PageDef }) {
  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden">
        <Container className="pb-12 pt-14 md:pb-16 md:pt-20 lg:pb-20 lg:pt-24">
          <div className="flex max-w-[54rem] flex-col gap-5">
            <Reveal trigger="mount" distance={14}>
              <p className="eyebrow">{page.eyebrow}</p>
            </Reveal>
            <Reveal trigger="mount" delay={0.06} distance={20}>
              <h1 className="text-display-1 max-w-[18ch] leading-display text-balance">
                {page.title}
              </h1>
            </Reveal>
            <Reveal trigger="mount" delay={0.12} distance={18}>
              <p className="measure text-base leading-relaxed text-ink-muted md:text-lg">
                {page.lede}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* In-page section rail */}
      <section className="hairline-t sticky top-[72px] z-[var(--z-sticky)] bg-canvas/90 backdrop-blur-md">
        <Container className="py-4">
          <nav aria-label={`Sections of ${page.title}`}>
            <ul className="flex flex-wrap items-center gap-x-1 gap-y-2">
              {page.sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="inline-flex items-center rounded-input px-3 py-2 text-sm font-semibold text-ink-muted transition-colors duration-200 ease-brand hover:bg-sunk hover:text-accent"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>

      {/* Sections */}
      {page.sections.map((section, index) => {
        const isDark = section.tone === "dark";
        /*
          Non-dark sections alternate canvas and surface so consecutive
          sections never blend into one field. Dark sections take their tone
          from the content, not from the parity.
        */
        const tone = isDark ? "dark" : index % 2 === 0 ? "canvas" : "surface";

        return (
          <section
            key={section.id}
            id={section.id}
            /*
              scroll-mt clears both the sticky header and the sticky section
              rail, otherwise an anchor jump lands under the rail and the section
              heading is invisible.
            */
            className={`scroll-mt-[136px] section-y ${
              isDark ? "band-dark" : ""
            } ${index > 0 ? "hairline-t" : ""} ${
              tone === "surface" && !isDark ? "bg-surface" : ""
            }`}
          >
            <Container>
              <Reveal distance={20}>
                <div className="flex flex-col gap-10">
                  <div className="flex max-w-[54rem] flex-col gap-4">
                    <h2 className="text-display-2 max-w-[20ch] leading-display-2 text-balance">
                      {section.title}
                    </h2>
                    {section.lede ? (
                      <p className="measure text-base leading-relaxed text-ink-muted md:text-lg">
                        {section.lede}
                      </p>
                    ) : null}
                  </div>

                  {section.blocks.map((block, blockIndex) => (
                    <Reveal
                      key={`${section.id}-${block.kind}-${blockIndex}`}
                      delay={blockIndex === 0 ? 0 : 0.05}
                      distance={18}
                    >
                      <BlockView block={block} dark={isDark} />
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </Container>
          </section>
        );
      })}

      {/* Where to next, so no page is a dead end */}
      {/*
          `section-y-tight`, not the main rhythm. This is a closing strip that
          belongs to the last section above it rather than standing as a band of
          its own, so giving it the full step left a hole under the final content.
        */}
        {/*
          `section-y-tight`, not the main rhythm. This is a closing strip that
          belongs to the last section above it rather than standing as a band of
          its own, so giving it the full step left a hole under the final content.
        */}
      <section className="hairline-t section-y-tight">
        <Container>
          <div className="flex flex-col gap-5">
            <p className="eyebrow">Where to next</p>
            <ul className="flex flex-wrap gap-2">
              {NEXT_LINKS.filter((link) => link.href !== page.href).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex items-center rounded-pill border border-hairline-strong px-4 py-2 text-sm font-semibold text-ink transition-colors duration-200 ease-brand hover:border-accent hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}

/**
 * Footer of every content page. Deliberately the whole destination list rather
 * than the two or three most relevant, because the point is that no page in this
 * architecture is a dead end.
 */
const NEXT_LINKS = [
  { label: "My Story", href: "/about" },
  { label: "Business Consultation", href: "/services/business-consultation" },
  { label: "Self-Development Programs", href: "/services/self-development" },
  { label: "Leaders & Team Development", href: "/services/leaders-teams" },
  { label: "Events", href: "/events" },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];