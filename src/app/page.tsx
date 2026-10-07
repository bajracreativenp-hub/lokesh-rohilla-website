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
 *   Hero                     the person, the portrait, the two CTAs, and the
 *                            page's h1
 *   Brand statement          philosophy, not biography
 *   Philosophy               the method, on a dark band
 *   What I work on           five areas of expertise
 *   What I help transform    the visitor picks their own path, with client logos
 *   Experience               18+ years, on a dark band
 *   Selected work            documented engagements
 *   Testimonials             structured, nothing invented, equal frames
 *   Insights                 the content section
 *   Final CTA                one invitation
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
      <BrandStatement />
      <Philosophy />
      <FocusAreas />
      <TransformPaths />
      <ExperienceTeaser />
      <WorkedWith />
      <Testimonials />
      <Insights />
      <FinalCta />
    </>
  );
}