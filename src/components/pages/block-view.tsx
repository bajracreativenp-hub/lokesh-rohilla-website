import Link from "next/link";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { PendingNote } from "@/components/ui/layout";
import { ImageSlot } from "@/components/ui/portrait-slot";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { BlogSearch } from "@/components/pages/blog-search";
import { ContactForm } from "@/components/pages/contact-form";
import { BusinessHealthChecker } from "@/components/pages/health-checker";
import { LeadForm } from "@/components/pages/leads/generic-form";
import { PhotoBand } from "@/components/pages/photo-band";
import { Timeline } from "@/components/pages/timeline";
import { formPresets } from "@/lib/forms";
import type { Block } from "@/lib/page-content";

/**
 * Renders one block from `page-content.ts`.
 *
 * Six kinds plus three interactive ones. Each is laid out deliberately rather
 * than pushed through a generic card component, because a stack of identical
 * cards for six different kinds of content is what makes a site look generated.
 */
export function BlockView({ block, dark }: { block: Block; dark: boolean }) {
  switch (block.kind) {
    case "prose":
      return (
        <div className="flex flex-col gap-6">
          <h2 className="text-display-3 max-w-[20ch] leading-[1.12] text-balance">
            {block.title}
          </h2>
          <div className="measure flex flex-col gap-4">
            {block.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-base leading-relaxed text-ink-muted md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      );

    case "cards":
      return (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-display-3 max-w-[20ch] leading-[1.12] text-balance">
              {block.title}
            </h2>
            {block.lede ? (
              <p className="measure text-base leading-relaxed text-ink-muted">{block.lede}</p>
            ) : null}
          </div>
          <RevealGroup
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.06}
            distance={16}
          >
            {block.items.map((item) =>
              item.href ? (
                /* A card with a destination is a link in its entirety, so the
                   whole surface is the hit target rather than just the title. */
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex h-full flex-col gap-3 rounded-card bg-surface p-6 transition-shadow duration-200 ease-brand hover:shadow-lift"
                >
                  <h3 className="text-display-4 leading-tight transition-colors duration-200 ease-brand group-hover:text-accent">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-muted">{item.body}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-bold text-accent">
                    Read more
                    <ArrowRight
                      aria-hidden="true"
                      className="size-3.5 shrink-0 transition-transform duration-200 ease-brand group-hover:translate-x-0.5"
                      weight="bold"
                    />
                  </span>
                </Link>
              ) : (
                <article
                  key={item.title}
                  className="flex h-full flex-col gap-3 rounded-card bg-surface p-6"
                >
                  {item.meta ? <p className="eyebrow">{item.meta}</p> : null}
                  <h3 className="text-display-4 leading-tight">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-muted">{item.body}</p>
                </article>
              ),
            )}
          </RevealGroup>
        </div>
      );

    case "steps":
      return (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-display-3 max-w-[20ch] leading-[1.12] text-balance">
              {block.title}
            </h2>
            {block.lede ? (
              <p className="measure text-base leading-relaxed text-ink-muted">{block.lede}</p>
            ) : null}
          </div>
          <RevealGroup
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            stagger={0.06}
            distance={16}
          >
            {block.items.map((item) => (
              <div
                key={item.verb}
                className="flex h-full flex-col gap-3 rounded-card bg-surface p-6"
              >
                <p className="text-display-4 leading-tight">{item.verb}</p>
                <p className="text-sm leading-relaxed text-ink-muted">{item.body}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      );

    case "timeline":
      return (
        <div className="flex flex-col gap-6">
          {/*
            The heading stays an h2 rather than moving inside the carousel. It
            names the whole set of phases and belongs to the section, and it also
            means the carousel itself does not need to carry the label, which
            would otherwise be announced twice.
          */}
          <h2 className="text-display-3 max-w-[20ch] leading-[1.12] text-balance">
            {block.title}
          </h2>
          {block.lede ? (
            <p className="measure text-base leading-relaxed text-ink-muted">{block.lede}</p>
          ) : null}
          <Timeline items={block.items} />
        </div>
      );

    case "list":
      return (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-display-3 max-w-[20ch] leading-[1.12] text-balance">
              {block.title}
            </h2>
            {block.lede ? (
              <p className="measure text-base leading-relaxed text-ink-muted">{block.lede}</p>
            ) : null}
          </div>
          {/*
            Not a plain bulleted ul. Items become numbered rows in a two column
            grid, which reads as an index rather than a spec sheet.
          */}
          <RevealGroup
            className="grid gap-x-8 gap-y-4 sm:grid-cols-2"
            stagger={0.05}
            distance={14}
          >
            {block.items.map((item, index) => (
              <p
                key={item.slice(0, 28)}
                className="hairline-t flex gap-4 pt-4 text-sm leading-relaxed text-ink-muted"
              >
                <span className="shrink-0 font-bold text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </p>
            ))}
          </RevealGroup>
        </div>
      );

    case "note":
      return (
        <div className="flex flex-col gap-4 rounded-panel bg-sunk p-7 md:p-9">
          <p className="eyebrow">{block.title}</p>
          <p className="measure text-base leading-relaxed text-ink md:text-lg">{block.text}</p>
        </div>
      );

    case "cta":
      return dark ? (
        <div className="flex flex-col items-start gap-6 rounded-panel bg-surface p-8 md:flex-row md:items-center md:justify-between md:gap-12 md:p-10">
          <div className="flex max-w-xl flex-col gap-3">
            <h2 className="text-display-3 max-w-[20ch] leading-[1.12] text-balance">
              {block.title}
            </h2>
            <p className="measure-tight text-base leading-relaxed text-ink-muted">{block.body}</p>
          </div>
          <Link
            href={block.href}
            className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-pill bg-accent px-6 text-sm font-bold text-accent-ink"
          >
            {block.label}
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-200 group-hover:translate-x-1"
              weight="bold"
            />
          </Link>
        </div>
      ) : (
        <div className="on-ink flex flex-col items-start gap-6 rounded-panel p-8 md:flex-row md:items-center md:justify-between md:gap-12 md:p-10">
          <div className="flex max-w-xl flex-col gap-3">
            <h2 className="text-display-3 max-w-[20ch] leading-[1.12] text-balance">
              {block.title}
            </h2>
            <p className="measure-tight text-base leading-relaxed text-ink-muted">{block.body}</p>
          </div>
          <Link
            href={block.href}
            className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-pill bg-accent px-6 text-sm font-bold text-accent-ink transition-[filter,transform] duration-200 ease-brand hover:brightness-110 active:translate-y-px"
          >
            {block.label}
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-200 ease-brand group-hover:translate-x-1"
              weight="bold"
            />
          </Link>
        </div>
      );

    case "frames":
      return (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-display-3 max-w-[20ch] leading-[1.12] text-balance">
              {block.title}
            </h2>
            {block.lede ? (
              <p className="measure text-base leading-relaxed text-ink-muted">{block.lede}</p>
            ) : null}
          </div>
          <RevealGroup
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.05}
            distance={16}
          >
            {block.items.map((item) => (
              <figure
                key={item.label}
                className="flex h-full flex-col overflow-hidden rounded-card border border-hairline bg-surface"
              >
                {/*
                  ImageSlot rather than a second hand rolled slot. It already
                  renders the placeholder surface, reserves the exact aspect ratio
                  and emits the `data-asset-slot` and `data-asset-spec` attributes
                  that make the rendered page a machine readable asset manifest.
                  Duplicating that markup here meant two places to forget those
                  attributes.
                */}
                <ImageSlot label={item.label} ratio={item.ratio} spec={item.spec} />
                <figcaption className="flex flex-col gap-1 p-5">
                  <p className="text-sm font-bold text-ink">{item.label}</p>
                  {item.meta ? <p className="text-xs text-ink-muted">{item.meta}</p> : null}
                </figcaption>
              </figure>
            ))}
          </RevealGroup>
        </div>
      );

    case "search":
      return (
        <div className="flex flex-col gap-6">
          <BlogSearch categories={block.categories} />
        </div>
      );

    case "quiz":
      return <BusinessHealthChecker />;

    case "photo":
      return (
        <div className="flex flex-col gap-6">
          {/*
            The heading stays an h2 here, matching every other block. The photograph
            is a `figure` with its own `figcaption`, so it is not double announced:
            the caption names the engagement and the slot carries the asset label.
          */}
          <h2 className="text-display-3 max-w-[20ch] leading-[1.12] text-balance">
            {block.title}
          </h2>
          <PhotoBand photo={block.photo} title={block.photo.label} />
        </div>
      );

    case "form": {
      const preset = formPresets[block.form];

      /*
        The contact form is the one fully interactive form on the site: real
        validation, real error states, a focusable error summary. It is swapped
        in here rather than duplicating it, so it lives in one component and the
        registry stays a single source of truth.
      */
      if (block.form === "contact") {
        return (
          <div className="flex flex-col gap-6">
            <ContactForm />
            <PendingNote>{preset.pending}</PendingNote>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-6">
          <h2 className="text-display-3 max-w-[24ch] leading-[1.12] text-balance">
            {block.title}
          </h2>
          <div className="rounded-panel bg-surface p-7 md:p-10">
            <LeadForm fields={preset.fields} />
          </div>
          <PendingNote>{preset.pending}</PendingNote>
        </div>
      );
    }
  }
}

/**
 * Re-exported so pages do not need to import two modules for one component.
 */
export { Reveal };