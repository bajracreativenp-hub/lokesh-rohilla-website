import type { Metadata } from "next";
import Link from "next/link";

import { AccountForms } from "@/components/pages/account-forms";
import { PageHero, PageSection } from "@/components/pages/shared";

export const metadata: Metadata = {
  title: "My account",
  description: "Sign in or create an account.",
  robots: { index: false, follow: true },
};

/**
 * ACCOUNT
 *
 * The diagram calls for Login / Sign Up (My Account). The forms live in a client
 * leaf so this page stays a Server Component.
 *
 * Both forms are inert: there is no auth provider, no user store and no
 * password handling anywhere in this codebase.
 */
export default function AccountPage() {
  return (
    <>
      <PageHero
        eyebrow="Account"
        headline="My account."
        lede="Where a customer would sign in, see their orders and manage their details."
      />

      <PageSection tone="canvas" bordered>
        <AccountForms />

        <div className="mt-10 max-w-2xl rounded-panel bg-surface p-7 md:p-9">
          <h2 className="text-display-4">What accounts are for</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {[
              "Order history and tracking, once fulfilment exists.",
              "Saved addresses for faster checkout.",
              "Access to purchased downloads and recordings.",
              "Masterclass and event registrations in one place.",
              "The newsletter, if you choose to subscribe separately.",
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
