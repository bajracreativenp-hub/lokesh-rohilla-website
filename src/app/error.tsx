"use client";

import { Button, ButtonLink } from "@/components/ui/button";
import { Container, PendingNote } from "@/components/ui/layout";

/**
 * Route level error state.
 *
 * Next.js requires error boundaries to be client components. Kept deliberately
 * plain: state what happened, offer a retry, and point somewhere useful. No
 * stack traces, which mean nothing to a visitor.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="flex min-h-[70dvh] flex-col justify-center py-24">
      <div className="flex max-w-xl flex-col items-start gap-6">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="text-display-2 max-w-[18ch] leading-display-2 text-balance">
          This section did not load.
        </h1>
        <p className="measure text-base leading-relaxed text-ink-muted md:text-lg">
          A page failed to render. Trying again usually clears it. If it keeps
          happening, the error reference below is worth passing on.
        </p>

        {error.digest ? (
          <PendingNote>Error reference: {error.digest}</PendingNote>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href="/" variant="outline">
            Back to Lokesh Rohilla
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
