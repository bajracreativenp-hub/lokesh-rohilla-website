import type { Metadata } from "next";

import { ButtonLink, TextLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * Not found state. Styled on brand rather than left as the framework default.
 * Contact is deliberately not offered: arriving at a dead link is not the
 * moment to try to sell something.
 */
export default function NotFound() {
  return (
    <Container className="flex min-h-[70dvh] flex-col justify-center py-24">
      <div className="flex flex-col items-start gap-6">
        <p className="eyebrow">Error 404</p>
        <h1 className="text-display-2 max-w-[16ch] leading-display-2 text-balance">
          This page does not exist.
        </h1>
        <p className="measure text-base leading-relaxed text-ink-muted md:text-lg">
          The link may be out of date, or the page may have moved. Nothing is
          lost. Start again from the beginning, or read the full story.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <ButtonLink href="/">Back to Lokesh Rohilla</ButtonLink>
          <TextLink href="/about">Read About Lokesh</TextLink>
        </div>
      </div>
    </Container>
  );
}
