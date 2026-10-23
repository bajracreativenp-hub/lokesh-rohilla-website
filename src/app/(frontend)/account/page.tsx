import type { Metadata } from "next";
import Link from "next/link";

import { AccountForms } from "@/components/pages/account-forms";
import { PageHero, PageSection } from "@/components/pages/shared";

export const metadata: Metadata = {
  title: "My account",
  description: "Sign in or create an account.",
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  return (
    <>
      <PageHero
        eyebrow="Account"
        headline="My account."
        lede="Sign in to access your orders, digital workbooks, event registrations, and saved delivery details."
      />

      <PageSection tone="canvas" bordered>
        <AccountForms />

        <div className="mt-10 max-w-2xl rounded-panel bg-surface p-7 md:p-9">
          <h2 className="text-display-4">Your member benefits</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {[
              "Order history, invoices, and real-time dispatch tracking.",
              "Saved delivery addresses for seamless checkout.",
              "Instant access to purchased workbooks, templates, and session recordings.",
              "Masterclass and Bookwishes Club registrations in one place.",
              "Direct access to weekly essays and reading recommendations.",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-accent" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-muted">
            No account is required to{" "}
            <Link
              href="/contact#join-newsletter"
              className="font-bold text-accent underline underline-offset-4"
            >
              subscribe to the newsletter
            </Link>{" "}
            or to{" "}
            <Link
              href="/events#event-registration"
              className="font-bold text-accent underline underline-offset-4"
            >
              register for an event
            </Link>
            .
          </p>
        </div>
      </PageSection>
    </>
  );
}
