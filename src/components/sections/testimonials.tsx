import { Container, PendingNote, SectionHeading } from "@/components/ui/layout";
import { VideoSlot } from "@/components/ui/portrait-slot";
import { Reveal } from "@/components/ui/reveal";
import { SerifText } from "@/components/ui/serif-text";
import { testimonials } from "@/lib/content";

/**
 * SECTION 7 - TESTIMONIALS
 * Layout family: an even row of three equal media frames over a tinted review
 * panel.
 *
 * EVERY FRAME IS THE SAME SIZE.
 *
 * These were `lg:col-span-7`, `lg:col-span-5` and `lg:col-span-12`. Each slot is
 * 16:9, so the three frames came out at three different widths and three
 * different heights, which read as a broken row rather than a set. All three now
 * take `lg:col-span-4`, so they are identical at every breakpoint.
 *
 * The rule generalises: the frame count decides the span. Three frames in a
 * twelve column grid is four columns each. Adding a fourth frame means four
 * columns each, not a new bespoke span, otherwise the row stops being a set.
 *
 * Nothing in this section is invented. No placeholder names, no placeholder
 * quotes, no placeholder star ratings, no fabricated review counts. The slots
 * reserve the exact frame each real video will occupy so the page can be
 * reviewed as a design today and populated later without reflowing.
 *
 * IMPORTANT: the column span lives on the Reveal wrapper, because the wrapper
 * is the grid item.
 */
export function Testimonials() {
  return (
    <section>
      <Container className="section-y">
        <SectionHeading
          eyebrow={testimonials.eyebrow}
          headline={<SerifText text={testimonials.headline} />}
          lede={testimonials.lede}
          size="lg"
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-12">
          {testimonials.videoSlots.map((slot, index) => (
            <Reveal
              key={`${slot.label}-${index}`}
              delay={index * 0.08}
              distance={20}
              className="lg:col-span-4"
            >
              {/*
                The index makes the row read as three parts of one set rather than
                as three loose frames. It is real text in a `figcaption`, so it is
                announced, but it carries no meaning the heading does not already
                carry, and the frame above it is labelled independently.
              */}
              <VideoSlot
                spec={slot.spec}
                label={slot.label}
                index={index + 1}
                /* DEMO ONLY, a poster frame. Absent means the plain pending slot. */
                src={slot.src}
                alt={slot.alt}
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-6">
          <div className="flex flex-col gap-6 rounded-panel bg-surface p-7 md:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="flex flex-col gap-2">
              <h3 className="text-display-4">Google Reviews</h3>
              <p className="measure-tight text-sm leading-relaxed text-ink-muted">
                Written reviews sit underneath the video testimonials. The live
                Google profile link and current review count will be added here
                once confirmed.
              </p>
            </div>
            <div className="w-full max-w-sm shrink-0">
              <PendingNote>{testimonials.pending}</PendingNote>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
