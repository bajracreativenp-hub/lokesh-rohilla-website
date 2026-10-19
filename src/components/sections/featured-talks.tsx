import { ArrowUpRight, Broadcast, Play, YoutubeLogo } from "@phosphor-icons/react/dist/ssr";

import { Container, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { SerifText } from "@/components/ui/serif-text";
import { featuredTalks } from "@/lib/content";

/**
 * FEATURED TALKS & CONVERSATIONS
 *
 * Real public talks, masterclasses, and podcast discussions from
 * "The Book Talk" and The Bookwishes Club YouTube channel (@thebookwishesclub2021).
 */
export function FeaturedTalks() {
  return (
    <section>
      <Container className="section-y">
        <SectionHeading
          eyebrow={featuredTalks.eyebrow}
          headline={<SerifText text={featuredTalks.headline} />}
          lede={featuredTalks.lede}
          size="lg"
        />

        {/* YouTube Channel Banner */}
        <div className="mt-12 md:mt-16">
          <Reveal>
            <div className="flex flex-col gap-6 rounded-panel border border-hairline bg-surface p-7 md:p-9 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-card bg-[#FF0000]/10 text-[#FF0000]">
                  <YoutubeLogo weight="fill" className="size-7" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-display-4 font-bold leading-tight text-ink">
                      {featuredTalks.channelTitle}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-pill bg-[#FF0000]/10 px-2.5 py-0.5 text-[0.6875rem] font-bold text-[#FF0000]">
                      <Broadcast weight="bold" className="size-3" />
                      Podcast & Channel
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold tracking-wide text-ink-muted">
                    Official episodes, frameworks & workshops • {featuredTalks.channelHandle}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <a
                  href={featuredTalks.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-12 items-center gap-2 rounded-pill bg-ink px-6 text-sm font-bold text-canvas transition-[background-color,transform,box-shadow] duration-200 ease-brand hover:bg-[#FF0000] hover:text-white hover:shadow-card active:translate-y-px"
                >
                  <YoutubeLogo weight="fill" className="size-4" />
                  <span>Subscribe on YouTube</span>
                  <ArrowUpRight
                    weight="bold"
                    className="size-4 transition-transform duration-200 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Featured Talks Grid */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {featuredTalks.talks.map((talk, index) => (
            <Reveal key={talk.title} delay={0.06 * index} distance={18}>
              <article className="group flex h-full flex-col justify-between gap-6 rounded-panel border border-hairline bg-canvas p-7 transition-all duration-300 ease-brand hover:border-hairline-strong hover:bg-surface hover:shadow-card">
                <div className="flex flex-col gap-4">
                  {/* Meta row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-pill bg-sunk px-3 py-1 text-xs font-bold text-ink-muted">
                      <Play weight="fill" className="size-2.5 text-accent" />
                      {talk.badge}
                    </span>
                    <span className="text-xs font-semibold tracking-wide text-ink-muted">
                      {talk.series}
                    </span>
                  </div>

                  {/* Title & Topic */}
                  <div>
                    <h3 className="text-display-4 font-bold leading-snug text-ink transition-colors duration-200 group-hover:text-accent">
                      {talk.title}
                    </h3>
                    <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                      {talk.topic}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-ink-muted">
                    {talk.description}
                  </p>
                </div>

                {/* Footer bar */}
                <div className="flex items-center justify-between border-t border-hairline pt-4">
                  <span className="text-xs font-semibold text-ink-muted">
                    {talk.role}
                  </span>
                  <a
                    href={talk.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-bold text-ink transition-colors duration-200 group-hover:text-accent"
                  >
                    <span>Watch Talk</span>
                    <ArrowUpRight
                      weight="bold"
                      className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
