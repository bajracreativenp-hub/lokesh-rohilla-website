import { BrandStatement } from "@/components/sections/brand-statement";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { WorkedWith } from "@/components/sections/worked-with";
import { Testimonials } from "@/components/sections/testimonials";
import { TransformPaths } from "@/components/sections/transform-paths";

/**
 * HOMEPAGE
 *
 * Six sections, opening on the hero.
 *
 *   Hero                     the photograph, the wordmark, and the page's h1
 *   Worked with              one strip of client marks, directly under the hero
 *   Brand statement          philosophy, not biography
 *   What I help transform    the visitor picks their own path
 *   Testimonials             structured, nothing invented, equal frames
 *   Final CTA                one invitation
 *
 * FOUR SECTIONS REMOVED, at the client's instruction:
 *
 *   Philosophy               the method, four colour bands
 *   What I work on           five areas of expertise
 *   Experience               18+ years, multiple industries
 *   Insights                 the content section
 *
 * Each was deleted rather than commented out: the component, its content block,
 * and the probe that tested it. Nothing on this page referenced any of them, so
 * none of the remaining six sections changed shape.
 *
 * WHAT CHANGED VISUALLY, STATED PLAINLY
 *
 * Experience was the last section carrying a full width `band-dark`, so the four
 * light sections between the hero and the closing panel are now one unbroken run
 * with nothing to break them up.
 *
 * The page still opens dark and still closes dark: the hero is a dark photograph
 * and the Final CTA is a dark `on-ink` panel. What is gone is the dark band that
 * used to sit mid page, so the middle of the page is now longer and flatter than
 * it was. That is a real change to the rhythm and it is only visible on the full
 * page, not in any single section.
 *
 * The four content blocks are deleted too, so this copy is no longer held
 * anywhere in the repo: the five areas of expertise, the seven industry names,
 * the six insight categories and the four method steps. Any of it can be
 * restored from the previous commit if it comes back.
 *
 * `/about/philosophy` is NOT affected. That is a section of the About page with
 * its own `#philosophy` anchor and its own copy, and the redirect to it stays.
 * The method section removed here was a different section that happened to share
 * a name.
 *
 * ALREADY REMOVED, at the client's instruction, earlier:
 *
 *   Verb rail                Explore / Learn / Get Help / Join / Shop
 *   Platform grid            One Platform. Multiple Opportunities.
 *   Events and sessions      Where We Meet
 *
 * Those three shared a source file with the hero. The hero has been restored;
 * they have not, because only the hero was asked for. Events remain reachable
 * from the top navigation and the footer, and so does `/blog`, which the removed
 * Insights section used to link to.
 *
 * The complete biography, timeline and background live on /about.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <WorkedWith />
      <BrandStatement />
      <TransformPaths />
      <Testimonials />
      <FinalCta />
    </>
  );
}