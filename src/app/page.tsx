import { BrandStatement } from "@/components/sections/brand-statement";
import { DiagnosticSection } from "@/components/sections/diagnostic-section";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { ImpactMetrics } from "@/components/sections/impact-metrics";
import { Testimonials } from "@/components/sections/testimonials";
import { TransformationPillars } from "@/components/sections/transformation-pillars";
import { TransformPaths } from "@/components/sections/transform-paths";
import { WorkedWith } from "@/components/sections/worked-with";

/**
 * HOMEPAGE
 *
 * Nine sections structured for results-driven personal & business authority,
 * inspired by Tony Robbins' architecture:
 *
 *   1. Hero                   Cinematic photograph, wordmark, and clear mission
 *   2. Worked with            Client marks strip directly under the hero
 *   3. Impact metrics         18+ Years, 4.6★ Google reviews (318+), 2 core arms
 *   4. Brand statement        "Listen. Understand. Simplify. Transform."
 *   5. Transformation pillars 01 Business Systems • 02 Leadership • 03 Public Speaking
 *   6. Transform paths        Interactive path explorer with photo reveals
 *   7. Interactive diagnostic 10-Question Business Health Check assessment
 *   8. Testimonials           Verified Google Reviews & video frames
 *   9. Final CTA              Direct call to action to start with a conversation
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <WorkedWith />
      <ImpactMetrics />
      <BrandStatement />
      <TransformationPillars />
      <TransformPaths />
      <DiagnosticSection />
      <Testimonials />
      <FinalCta />
    </>
  );
}