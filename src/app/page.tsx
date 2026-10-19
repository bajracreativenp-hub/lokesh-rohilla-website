import { BrandStatement } from "@/components/sections/brand-statement";
import { CoachingSection } from "@/components/sections/coaching-section";
import { DiagnosticSection } from "@/components/sections/diagnostic-section";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { HungerSection } from "@/components/sections/hunger-section";
import { ImpactMetrics } from "@/components/sections/impact-metrics";
import { Testimonials } from "@/components/sections/testimonials";
import { TransformationPillars } from "@/components/sections/transformation-pillars";
import { TransformPaths } from "@/components/sections/transform-paths";
import { WorkedWith } from "@/components/sections/worked-with";

/**
 * HOMEPAGE
 *
 * Comprehensive results-driven personal & business authority,
 * faithfully adopting Tony Robbins' architecture and UI components:
 *
 *   1. Hero                   Cinematic photograph, wordmark, and clear mission
 *   2. Worked with            Client marks strip directly under the hero
 *   3. Impact metrics         18+ Years (animated count-up), 4.6★ Google reviews, 2 core arms
 *   4. Hunger for Quality     Bento grid, portrait, press logos & "Rohilla equals results" carousel
 *   5. Coaching & Guidance    Dark signature bento with amber coaching badge, 81%/70% stats & video
 *   6. Brand statement        "Listen. Understand. Simplify. Transform."
 *   7. Transformation pillars 01 Business Systems • 02 Leadership • 03 Public Speaking
 *   8. Transform paths        Interactive path explorer with photo reveals
 *   9. Growth Path Tool       Interactive dual-track diagnostic assessment
 *   10. Testimonials          Verified Google Reviews & video frames
 *   11. Final CTA             Direct call to action to start with a conversation
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <WorkedWith />
      <ImpactMetrics />
      <HungerSection />
      <CoachingSection />
      <BrandStatement />
      <TransformationPillars />
      <TransformPaths />
      <DiagnosticSection />
      <Testimonials />
      <FinalCta />
    </>
  );
}