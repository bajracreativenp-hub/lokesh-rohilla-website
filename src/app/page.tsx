import { BrandStatement } from "@/components/sections/brand-statement";
import { FeaturedTalks } from "@/components/sections/featured-talks";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { WorkedWith } from "@/components/sections/worked-with";
import { Testimonials } from "@/components/sections/testimonials";
import { TransformPaths } from "@/components/sections/transform-paths";

/**
 * HOMEPAGE
 *
 * Seven sections, opening on the hero.
 *
 *   Hero                     the photograph, the wordmark, and the page's h1
 *   Worked with              one strip of client marks, directly under the hero
 *   Brand statement          philosophy, not biography
 *   What I help transform    the visitor picks their own path
 *   Featured talks & podcast real episodes from The Book Talk & YouTube
 *   Testimonials             Google reviews banner & verified cards
 *   Final CTA                one invitation
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <WorkedWith />
      <BrandStatement />
      <TransformPaths />
      <FeaturedTalks />
      <Testimonials />
      <FinalCta />
    </>
  );
}