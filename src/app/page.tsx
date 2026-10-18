import { BrandStatement } from "@/components/sections/brand-statement";
import { ExperienceTeaser } from "@/components/sections/experience-teaser";
import { FinalCta } from "@/components/sections/final-cta";
import { FocusAreas } from "@/components/sections/focus-areas";
import { Hero } from "@/components/sections/hero";
import { Insights } from "@/components/sections/insights";
import { Philosophy } from "@/components/sections/philosophy";
import { WorkedWith } from "@/components/sections/worked-with";
import { Testimonials } from "@/components/sections/testimonials";
import { TransformPaths } from "@/components/sections/transform-paths";

/**
 * HOMEPAGE
 *
 * Ten sections, opening on the hero.
 *
 *   Hero                     the photograph, the wordmark, and the page's h1
 *   Worked with              one strip of client marks, directly under the hero
 *   Brand statement          philosophy, not biography
 *   Philosophy               the method, on a dark band
 *   What I work on           five areas of expertise
 *   What I help transform    the visitor picks their own path
 *   Experience               18+ years, on a dark band
 *   Testimonials             structured, nothing invented, equal frames
 *   Insights                 the content section
 *   Final CTA                one invitation
 *
 * WORKED WITH MOVED TO SECOND, FROM SEVENTH
 *
 * It is the shortest section on the page and it answers the first question anyone
 * has about a consultant, which is who they have already worked with. It was
 * sitting below Experience, where a visitor had to read five sections to reach it.
 *
 * Under the hero it is also the first thing to follow a full bleed photograph,
 * which is why it was reduced to a single strip. Two counter-scrolling rows
 * directly beneath a wordmark the size of the hero's meant the first two things on
 * the page competed; one strip reads as a line of evidence and hands the page back
 * to the hero.
 *
 * STILL REMOVED, at the client's instruction:
 *
 *   Verb rail                Explore / Learn / Get Help / Join / Shop
 *   Platform grid            One Platform. Multiple Opportunities.
 *   Events and sessions      Where We Meet
 *
 * Those three shared a source file with the hero. The hero has been restored;
 * they have not, because only the hero was asked for. Events remain reachable
 * from the top navigation and the footer.
 *
 * Events are still reachable from the top navigation and from the footer. The
 * section was removed from this page only.
 *
 * The complete biography, timeline and background live on /about.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <WorkedWith />
      <BrandStatement />
      <Philosophy />
      <FocusAreas />
      <TransformPaths />
      <ExperienceTeaser />
      <Testimonials />
      <Insights />
      <FinalCta />
    </>
  );
}