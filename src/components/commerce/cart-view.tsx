"use client";

import Link from "next/link";

import { Minus, Plus, Trash } from "@phosphor-icons/react/dist/ssr";

import { formatMoney, useCart } from "@/components/commerce/cart-context";
import { ButtonLink } from "@/components/ui/button";
import { PendingNote } from "@/components/ui/layout";

/**
 * CART PAGE
 *
 * Fully functional basket: add, edit quantity, remove, clear, persisted across
 * reloads and synced between tabs.
 */
export function CartView() {
  const { lines, ready, itemCount, subtotal, currency, setQuantity, remove, clear } = useCart();

  // Empty state is a real, designed state rather than a blank page.
  if (ready && lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6 rounded-panel bg-surface p-8 md:p-12">
        <h2 className="text-display-3 max-w-[18ch] leading-[1.12] text-balance">
          Your cart is empty.
        </h2>
        <p className="measure text-base leading-relaxed text-ink-muted">
          Explore books, operational workbooks, recorded masterclasses, and executive templates in the shop.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/shop">Browse the shop</ButtonLink>
          <Link
            href="/blog"
            className="inline-flex h-12 items-center rounded-pill border border-hairline-strong px-6 text-sm font-bold text-ink transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:border-ink active:translate-y-0"
          >
            Read the blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
      <section aria-label="Cart items">
        <div className="flex flex-col gap-4">
          {!ready ? (
            <p className="text-sm text-ink-muted">Loading your cart.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {lines.map((line) => (
                <li
                  key={line.slug}
                  className="flex flex-col gap-4 rounded-card bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-display text-lg font-bold text-ink">{line.name}</p>
                    <p className="text-sm text-ink-muted">
                      {formatMoney(line.unitPrice, line.currency)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-pill border border-hairline-strong">
                      <button
                        type="button"
                        onClick={() => setQuantity(line.slug, line.quantity - 1)}
                        className="inline-flex size-10 items-center justify-center text-ink transition-colors hover:text-accent"
                      >
                        <span className="sr-only">Decrease quantity of {line.name}</span>
                        <Minus aria-hidden="true" className="size-4" weight="bold" />
                      </button>
                      <span
                        aria-live="polite"
                        className="min-w-8 text-center text-sm font-bold"
                      >
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(line.slug, Math.min(20, line.quantity + 1))
                        }
                        className="inline-flex size-10 items-center justify-center text-ink transition-colors hover:text-accent"
                      >
                        <span className="sr-only">Increase quantity of {line.name}</span>
                        <Plus aria-hidden="true" className="size-4" weight="bold" />
                      </button>
                    </div>

                    <p className="min-w-20 text-right text-sm font-bold">
                      {formatMoney(line.unitPrice * line.quantity, line.currency)}
                    </p>

                    <button
                      type="button"
                      onClick={() => remove(line.slug)}
                      className="inline-flex size-10 items-center justify-center rounded-pill text-ink-muted transition-colors hover:bg-sunk hover:text-accent"
                    >
                      <span className="sr-only">Remove {line.name}</span>
                      <Trash aria-hidden="true" className="size-4" weight="bold" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {lines.length > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="self-start text-sm font-semibold text-ink-muted underline underline-offset-4 transition-colors hover:text-accent"
            >
              Clear cart
            </button>
          ) : null}
        </div>
      </section>

      <aside aria-label="Order summary" className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex flex-col gap-5 rounded-panel bg-surface p-7">
          <h2 className="text-display-4">Summary</h2>

          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-ink-muted">Items</dt>
              <dd className="font-bold">{itemCount}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-hairline pt-2 text-base">
              <dt className="font-bold">Subtotal</dt>
              <dd className="font-extrabold">
                {formatMoney(subtotal, currency)}
              </dd>
            </div>
          </dl>

          <p className="text-xs leading-relaxed text-ink-muted">
            Digital downloads are delivered immediately by email. Physical workbooks ship within 3–5 business days.
          </p>

          <Link
            href="/checkout"
            className="inline-flex h-12 items-center justify-center rounded-pill bg-accent px-6 text-sm font-bold text-accent-ink transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:brightness-110 hover:shadow-card active:translate-y-0"
          >
            Proceed to checkout
          </Link>

          <PendingNote>
            Orders are processed with direct email confirmation and concierge support from our office.
          </PendingNote>
        </div>
      </aside>
    </div>
  );
}
