import type { ReactNode } from "react";

import { ImageSlot } from "@/components/ui/portrait-slot";
import { Reveal } from "@/components/ui/reveal";
import type { Photo } from "@/lib/page-content";

/**
 * EDITORIAL PHOTOGRAPH
 *
 * A photograph that is part of the page's argument rather than a card floating
 * beside some text.
 *
 * WHY THIS EXISTS
 *
 * Every service page was prose, then cards, then steps. Nine sections on the
 * Business Consultation page and not one image. On a services page trust is carried
 * by evidence of the work, not by the claim of it. A photograph is that evidence. A
 * list of promises is not.
 *
 * WHY IT IS A SLOT AND NOT A PLACEHOLDER IMAGE
 *
 * No photography has been supplied and none may be invented: a stock image of a
 * smiling team in a glass atrium is a fabricated claim about this business, and it
 * is worse than an empty frame because it looks like evidence. So the box reserves
 * the exact aspect ratio the delivered file will occupy, carries the art
 * direction as a machine-readable attribute, and says plainly that the photograph
 * is pending.
 *
 * LAYOUT
 *
 * `paired` puts the photograph beside a caption and is for a page that has prose
 * next to it. Unpaired it becomes a full width band, which is what a section with
 * no adjacent copy wants. Both use the same slot, so a real image drops into either
 * without a layout change.
 */
export function PhotoBand({
  photo,
  title,
}: {
  photo: Photo;
  title: string;
}) {
  /*
    A 16:9 box on a 1304px container is 733px wide and 412px tall, which reads as a
    band. But the slot inside it must actually FILL that box.

    The first version put the aspect ratio on a wrapper div and let the slot sit
    inside it unconstrained. `.slot` is `display: grid` with no height of its own, so
    it collapsed to its text and left roughly 450px of dead space under a 90px strip.
    The ratio belongs on the slot itself, which is the element that reserves space
    everywhere else on the site.

    `layout: "half"` keeps the ratio on a narrower column, which is why it is
    expressed through the same prop rather than a second code path.
  */
  return (
    <figure className="flex flex-col gap-5">
      <ImageSlot
        label={photo.label}
        spec={photo.spec}
        direction={photo.direction}
        ratio={photo.ratio}
        elevated={false}
        className="!rounded-panel"
      />

      {/*
        `figcaption` rather than a `div`, because it describes the photograph above
        it. The caption is real prose about the engagement, not a description of the
        image file.
      */}
      <figcaption className="flex flex-col gap-1">
        <p className="meta-label">{title}</p>
        {photo.caption ? (
          <p className="measure-tight text-sm leading-relaxed text-ink-muted">
            {photo.caption}
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}

/**
 * A photograph running alongside a block of text.
 *
 * `PhotoBand` above is a standalone band. This one owns a two column grid and is
 * meant to sit next to prose. The text goes in as a child rather than being
 * fetched from here, because a layout component that reaches into the content
 * model for copy it will then be responsible for keeping in sync is how the same
 * paragraph ends up written twice.
 */
export function PhotoAside({
  photo,
  title,
  children,
}: {
  photo: Photo;
  title: string;
  /** The prose that runs alongside the photograph. */
  children: ReactNode;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-14">
      <Reveal distance={18} className="order-2 lg:order-1">
        {children}
      </Reveal>

      <Reveal distance={18} className="order-1 lg:order-2">
        <figure className="flex flex-col gap-4">
          <ImageSlot
            label={photo.label}
            spec={photo.spec}
            direction={photo.direction}
            ratio={photo.ratio}
            elevated={false}
          />
          <figcaption className="flex flex-col gap-1">
            <p className="meta-label">{title}</p>
            {photo.caption ? (
              <p className="text-sm leading-relaxed text-ink-muted">{photo.caption}</p>
            ) : null}
          </figcaption>
        </figure>
      </Reveal>
    </div>
  );
}