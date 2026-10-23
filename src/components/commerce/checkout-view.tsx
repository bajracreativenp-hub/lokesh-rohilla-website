"use client";

import Link from "next/link";
import { useState } from "react";

import { formatMoney, useCart } from "@/components/commerce/cart-context";
import { Button } from "@/components/ui/button";
import { PendingNote } from "@/components/ui/layout";

/**
 * CHECKOUT
 */
export function CheckoutView() {
  const { lines, ready, itemCount, subtotal, currency, clear } = useCart();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-5 rounded-panel bg-surface p-8 md:p-12 border border-hairline-strong">
        <p className="eyebrow">Order Received</p>
        <h2 className="text-display-3 max-w-[22ch] leading-[1.12] text-balance">
          Thank you for your order.
        </h2>
        <p className="measure text-base leading-relaxed text-ink-muted">
          We have received your order details. Our team will send your payment link and fulfilment confirmation directly to your email shortly.
        </p>
        <Link
          href="/shop"
          className="inline-flex h-12 items-center rounded-pill bg-accent px-6 text-sm font-bold text-accent-ink transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:brightness-110"
        >
          Return to shop
        </Link>
      </div>
    );
  }

  if (ready && lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6 rounded-panel bg-surface p-8 md:p-12">
        <h2 className="text-display-3 max-w-[18ch] leading-[1.12] text-balance">
          There is nothing to check out.
        </h2>
        <Link
          href="/shop"
          className="inline-flex h-12 items-center rounded-pill bg-accent px-6 text-sm font-bold text-accent-ink transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:brightness-110"
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

        <form
          noValidate
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            clear();
            setSubmitted(true);
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="co-name" className="text-sm font-bold text-ink">
                Full name
              </label>
              <input
                id="co-name"
                name="name"
                required
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
                required
                autoComplete="email"
                className="rounded-input border border-hairline-strong bg-canvas px-4 py-3 text-base text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="co-address" className="text-sm font-bold text-ink">
              Delivery address
            </label>
            <textarea
              id="co-address"
              name="address"
              rows={3}
              required
              autoComplete="street-address"
              className="rounded-input border border-hairline-strong bg-canvas px-4 py-3 text-base text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
            />
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-bold text-ink">Preferred payment method</legend>
            {["Card / Online Transfer", "QR / Digital Wallet", "Direct Bank Transfer", "Cash on Delivery (Print Editions)"].map((method, index) => (
              <label
                key={method}
                htmlFor={`co-pay-${method}`}
                className="flex cursor-pointer items-center gap-3 rounded-card border border-hairline-strong p-4 transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:border-accent"
              >
                <input
                  id={`co-pay-${method}`}
                  type="radio"
                  name="payment"
                  defaultChecked={index === 0}
                  className="size-4 accent-[var(--accent)]"
                />
                <span className="text-sm font-semibold text-ink">{method}</span>
              </label>
            ))}
          </fieldset>

          <Button type="submit" size="lg" className="self-start">
            Place order
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
            {itemCount} {itemCount === 1 ? "item" : "items"}. Digital access links and shipping confirmation are sent via email.
          </p>

          <PendingNote>
            Need help with a bulk corporate workbook order? Email connect@lokeshrohilla.com.
          </PendingNote>
        </div>
      </aside>
    </div>
  );
}
