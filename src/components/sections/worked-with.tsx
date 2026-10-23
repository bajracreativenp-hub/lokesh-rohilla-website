"use client";

import Image from "next/image";

import { useId } from "react";

import { TextLink } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/layout";
import { SerifText } from "@/components/ui/serif-text";
import { clientLogos, workedWith } from "@/lib/content";

export function WorkedWith() {
  const labelId = useId();

  const dimensionsOf = (spec: string) => {
    const [w, h] = spec.split("x").map(Number);
    return { w: Number.isFinite(w) && w > 0 ? w : 1, h: Number.isFinite(h) && h > 0 ? h : 1 };
  };

  const strip = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
    >
      {clientLogos.map((logo) => {
        const { w: logoWidth, h: logoHeight } = dimensionsOf(logo.spec);

        return (
          <li key={logo.name} className="group shrink-0">
            <div
              data-asset-slot="client-logo"
              data-asset-spec={logo.spec}
              title={logo.name}
              className="flex max-w-[12rem] items-center justify-center py-6 grayscale transition-[filter,transform] duration-300 ease-brand group-hover:-translate-y-0.5 group-hover:grayscale-0 group-focus-within:grayscale-0 motion-reduce:transition-none"
            >
              {logo.src ? (
                <Image
                  src={logo.src}
                  alt={`${logo.name} logo`}
                  width={logoWidth}
                  height={logoHeight}
                  className="h-auto max-h-16 w-auto max-w-[12rem] object-contain"
                />
              ) : (
                <div className="flex items-center justify-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="grid size-7 shrink-0 place-items-center rounded-md bg-ink text-[0.625rem] font-extrabold tracking-tight text-canvas transition-colors duration-300 ease-brand group-hover:bg-accent group-hover:text-accent-ink"
                  >
                    {logo.initials}
                  </span>
                  <span className="text-center text-[0.8125rem] font-bold leading-tight tracking-tight text-ink-muted transition-colors duration-300 ease-brand group-hover:text-ink">
                    {logo.name}
                  </span>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <section aria-labelledby={labelId}>
      <Container className="section-y">
        <SectionHeading
          id={labelId}
          eyebrow={workedWith.eyebrow}
          headline={<SerifText text={workedWith.headline} />}
          lede={workedWith.lede}
          size="lg"
        />

        <div className="mt-12 flex flex-col gap-7 md:mt-16">
          <div
            role="group"
            aria-label="Organizations worked with, scrolling"
            data-marquee=""
            data-a11y-rest="strip-filters"
            className="marquee py-2"
          >
            <div className="marquee-track">
              {strip(false)}
              {strip(true)}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <TextLink href={workedWith.cta.href}>{workedWith.cta.label}</TextLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
