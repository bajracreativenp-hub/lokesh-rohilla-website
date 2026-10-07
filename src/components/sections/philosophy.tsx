import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { Container } from "@/components/ui/layout";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { SerifText } from "@/components/ui/serif-text";
import { philosophy } from "@/lib/content";

      export function Philosophy() {
  return (
    <section className="band-dark">
      <Container className="section-y">
        <div className="mx-auto flex max-w-[52rem] flex-col items-center gap-6 text-center">
          <Reveal>
            {/*
              A small mark above the headline. Not a section index: this is the one
              place on the page where the argument is stated as a sequence, so the
              sequence gets named rather than numbered. The eyebrow is the existing
              `eyebrow` utility, which is already the accent-uppercase cue.
            */}
            <p className="eyebrow mb-1">The method</p>
            <h2 className="text-display-1 max-w-[18ch] leading-display text-balance">
              <SerifText text="The o|rde|r" />{" "}
              <span className="text-accent">
                <SerifText text="is the discip|ine." />
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="measure text-base leading-relaxed text-ink-muted md:text-lg">
              {philosophy.body}
            </p>
          </Reveal>
        </div>

        {/*
          The four verbs, wired into a chain rather than presented as four
          unrelated cards. The arrow between them is `aria-hidden`, because the
          order is the argument being made in the copy above and announcing "arrow"
          between each step would be noise. The visible arrows carry the meaning.
        */}
        <RevealGroup
          className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-20 lg:grid-cols-4"
          stagger={0.08}
          distance={16}
        >
          {philosophy.steps.map((step, index) => (
            <div key={step.verb} className="relative">
              <div className="flex h-full flex-col gap-3 rounded-card bg-surface p-6">
                {/*
                  The index is part of the sequence being argued, so unlike the
                  decorative section numerals it is not hidden from assistive tech.
                  It is also what makes the cards read as ordered rather than as a
                  set of four, which was the whole problem with this row.
                */}
                <p className="meta-label tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="text-display-4 leading-tight">{step.verb}</p>
                <p className="text-sm leading-relaxed text-ink-muted">{step.body}</p>
              </div>

              {/*
                Not rendered on the last card, and not rendered below `lg` where the
                four cards sit in a 2x2 grid and a right arrow would point at
                nothing. The arrow is a desktop-only connector for a desktop-only
                arrangement.
              */}
              {index < philosophy.steps.length - 1 ? (
                <ArrowRight
                  aria-hidden="true"
                  className="absolute -right-5 top-1/2 hidden size-4 -translate-y-1/2 text-accent lg:block"
                  weight="bold"
                />
              ) : null}
            </div>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
