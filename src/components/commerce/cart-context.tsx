"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * CART
 *
 * Client-side basket persisted to localStorage.
 *
 * SCOPE, STATED PLAINLY: this is a real, working cart. It is not connected to
 * a payment provider, an order database or a fulfilment system, because none of
 * those exist yet. Adding to cart, editing quantity and removing all work and
 * survive a reload. Checkout deliberately stops before taking any money, and
 * says so on the page rather than pretending to process a payment.
 *
 * Written as a context rather than pulled from a library because the whole
 * surface is four actions and one derived total, and because the catalogue
 * itself is still pending. A store library would be more code than it replaces.
 *
 * Price is held as integer paise-style minor units to avoid floating point
 * drift on totals. Nothing is priced yet, so the catalogue is empty and this
 * maths is exercised by the tests rather than by the UI.
 */

export type CartLine = {
  slug: string;
  name: string;
  /** Minor units, for example 49900 for 499.00. */
  unitPrice: number;
  currency: string;
  quantity: number;
  maxQuantity?: number;
};

type CartState = {
  lines: CartLine[];
  ready: boolean;
  itemCount: number;
  subtotal: number;
  currency: string;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartState | null>(null);

const STORAGE_KEY = "lokesh-rohilla.cart.v1";

const MAX_QTY = 20;

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Validate every entry. localStorage is user-writable and survives across
    // deploys, so it cannot be trusted to hold the shape this code expects.
    return parsed.filter((entry): entry is CartLine => {
      if (typeof entry !== "object" || entry === null) return false;
      const e = entry as Record<string, unknown>;
      return (
        typeof e.slug === "string" &&
        typeof e.name === "string" &&
        typeof e.unitPrice === "number" &&
        Number.isFinite(e.unitPrice) &&
        typeof e.currency === "string" &&
        typeof e.quantity === "number" &&
        Number.isFinite(e.quantity)
      );
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  /*
    Reading localStorage after mount, deliberately not during render.

    The server has no localStorage and always renders an empty cart, so reading
    storage in a useState initialiser would produce a hydration mismatch. This is
    exactly what an effect is for: syncing with an external system the renderer
    cannot see. The lint rule flags any setState in an effect body, which is a
    sound default but a false positive for this case, so it is suppressed here
    with the reason rather than worked around with worse code.
  */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is an external system the renderer cannot see. Reading it after mount is the documented way to avoid a hydration mismatch, and this is the only place the cart is seeded.
    setLines(readStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Private browsing or a full quota. The cart still works for this session.
    }
  }, [lines, ready]);

  // Keep tabs in sync.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setLines(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback<CartState["add"]>((line, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((l) => l.slug === line.slug);
      if (existing) {
        return current.map((l) =>
          l.slug === line.slug
            ? {
                ...l,
                quantity: Math.min(MAX_QTY, (l.maxQuantity ?? MAX_QTY), l.quantity + quantity),
              }
            : l,
        );
      }
      return [
        ...current,
        { ...line, quantity: Math.min(MAX_QTY, line.maxQuantity ?? MAX_QTY, quantity) },
      ];
    });
  }, []);

  const setQuantity = useCallback<CartState["setQuantity"]>((slug, quantity) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((l) => l.slug !== slug)
        : current.map((l) =>
            l.slug === slug
              ? { ...l, quantity: Math.min(MAX_QTY, l.maxQuantity ?? MAX_QTY, quantity) }
              : l,
          ),
    );
  }, []);

  const remove = useCallback<CartState["remove"]>((slug) => {
    setLines((current) => current.filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartState>(() => {
    const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0);
    return {
      lines,
      ready,
      itemCount,
      subtotal,
      currency: lines[0]?.currency ?? "USD",
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [lines, ready, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

/** Formats minor units for display. */
export function formatMoney(minor: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(minor / 100);
  } catch {
    return `${(minor / 100).toFixed(2)} ${currency}`;
  }
}
