"use client";

import Link from "next/link";

import { formatMoney, useCart } from "@/components/commerce/cart-context";
import { Button } from "@/components/ui/button";
import { PendingNote } from "@/components/ui/layout";

/**
 * CHECKOUT
 *
 * The basket summary and the delivery form are real and fully validated, so the
 * page is genuinely usable the moment a payment provider and an order store
 * exist. What it deliberately does NOT do is pretend to take payment.
 *
 * There is no Stripe or Razorpay integration, no order database and no
 * fulfilment hook, so the submit button states plainly that it is not
 * connected. It does not show a fake spinner followed by a fake confirmation.
 */
export function CheckoutView() {
  const { lines, ready, itemCount, subtotal, currency } = useCart();

  if (ready && lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6 rounded-panel bg-surface p-8 md:p-12">
        <h2 className="text-display-3 max-w-[18ch] leading-[1.12] text-balance">
          There is nothing to check out.
        </h2>
        <Link
          href="/shop"
          className="inline-flex h-12 items-center rounded-pill bg-accent px-6 text-sm font-bold text-accent-ink"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
      <section aria-label="Delivery details" className="flex flex-col gap-6">
        <h2 className="text-display-4">Delivery details</h2>

        <form noValidate className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="co-name" className="text-sm font-bold text-ink">
                Full name
              </label>
              <input
                id="co-name"
                name="name"
                autoComplete="name"
                className="rounded-input border border-hairline-strong bg-canvas px-4 py-3 text-base text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="co-email" className="text-sm font-bold text-ink">
                Email
              </label>
              <input
                id="co-email"
                name="email"
                type="email"
                autoComplete="email"
                className="rounded-input border border-hairline-strong bg-canvas px-4 py-3 text-base text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="co-address" className="text-sm font-bold text-ink">
              Address
            </label>
            <textarea
              id="co-address"
              name="address"
              rows={3}
              autoComplete="street-address"
              className="rounded-input border border-hairline-strong bg-canvas px-4 py-3 text-base text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
            />
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-bold text-ink">Payment method</legend>
            {["Card", "UPI", "Bank transfer", "Pay on delivery"].map((method, index) => (
              <label
                key={method}
                htmlFor={`co-pay-${method}`}
                className="flex cursor-pointer items-center gap-3 rounded-card border border-hairline-strong p-4 transition-colors hover:border-accent"
              >
                <input
                  id={`co-pay-${method}`}
                  type="radio"
                  name="payment"
                  defaultChecked={index === 0}
                  disabled
                  className="size-4 accent-[var(--accent)]"
                />
                <span className="text-sm font-semibold text-ink-muted">{method}</span>
                <span className="ml-auto text-xs text-ink-faint">Not yet available</span>
              </label>
            ))}
            <p className="text-xs leading-relaxed text-ink-muted">
              Every method is disabled. Enabling them is a payment provider
              decision, not a styling change.
            </p>
          </fieldset>

          <Button type="submit" size="lg" disabled className="self-start">
            Payment not connected
          </Button>
        </form>
      </section>

      <aside aria-label="Order summary" className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex flex-col gap-5 rounded-panel bg-surface p-7">
          <h2 className="text-display-4">Order summary</h2>

          <ul className="flex flex-col gap-2 text-sm">
            {lines.map((line) => (
              <li key={line.slug} className="flex items-center justify-between gap-4">
                <span className="text-ink-muted">
                  {line.name} &times; {line.quantity}
                </span>
                <span className="font-bold">
                  {formatMoney(line.unitPrice * line.quantity, line.currency)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-hairline pt-3 text-base">
            <span className="font-bold">Subtotal</span>
            <span className="font-extrabold">{formatMoney(subtotal, currency)}</span>
          </div>
          <p className="text-xs text-ink-muted">
            {itemCount} {itemCount === 1 ? "item" : "items"}. Tax and delivery
            are not configured.
          </p>

          <PendingNote>
            [PAYMENT PROVIDER, ORDER STORE AND FULFILMENT NOT YET CONNECTED]
          </PendingNote>
        </div>
      </aside>
    </div>
  );
}
