"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import {
  CaretDown,
  List,
  MagnifyingGlass,
  ShoppingBag,
  UserCircle,
  X,
} from "@phosphor-icons/react/dist/ssr";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useCart } from "@/components/commerce/cart-context";
import { DESTINATIONS, NAV, ROUTES } from "@/lib/ia";

/**
 * NAVIGATION
 *
 * Five entries, exactly as specified:
 *
 *   About      My Story, Events, Blog, Gallery
 *   Services   Business Consultation, Self-Development Programs,
 *              Leaders & Team Development
 *   Events
 *   Shop
 *   Contact Us
 *
 * Note that Events appears twice, at the top level and inside the About
 * dropdown. That is what the brief asks for, so it is what is built. Both links
 * resolve to the same page, so it is a redundancy rather than a dead end.
 *
 * Panel interaction: white rounded panel below the trigger, links that dim rather
 * than fill on hover, caret rotating 180 degrees, 200ms fade.
 *
 * Two entries open a dropdown, and both hold four and three links respectively,
 * so both use the same narrow panel width. There is no multi-brand
 * cluster any more, which removed the reason for the wide three column panel
 * that the previous structure needed.
 *
 * Accessibility, verified by `npm run verify:nav`:
 *   - triggers are real <button>s with aria-expanded / aria-controls
 *   - only the open panel is rendered, so no hidden links sit in the tab order
 *   - ArrowDown opens, arrows move between entries, Escape closes and restores
 *     focus to the trigger
 *   - the mobile panel lists all nine destinations and every sub page flat
 *   - the cart badge is aria-live so quantity changes are announced
 *   - all nine destinations must be reachable from the navigation, or the probe
 *     fails the run
 */

export function Nav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const navId = useId();
  const { itemCount, ready } = useCart();

  const [openEntry, setOpenEntry] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const mobileId = useId();
  const searchId = useId();

  const triggerRefs = useRef<(HTMLElement | null)[]>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isCurrent = useCallback(
    (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href)),
    [pathname],
  );

  const closeAll = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenEntry(null);
  }, []);

  // Escape closes whichever surface is open.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (searchOpen) {
        setSearchOpen(false);
        return;
      }
      if (openEntry) {
        const index = NAV.findIndex((entry) => entry.label === openEntry);
        closeAll();
        triggerRefs.current[index]?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openEntry, searchOpen, closeAll]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  // "/" focuses search, the convention visitors already expect.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey) return;
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (typing) return;
      event.preventDefault();
      setSearchOpen(true);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenEntry(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next = (index + delta + NAV.length) % NAV.length;
      triggerRefs.current[next]?.focus();
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const entry = NAV[index];
      if (!entry.children) return;
      setOpenEntry(entry.label);
    }
  };

  /*
    Search scans destinations and their sections. With thirteen routes a client
    side scan is instant and adds no dependency. Each result is a real link, so
    it works identically with the overlay closed.
  */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const out: { label: string; href: string; group: string; hint?: string }[] = [];

    for (const destination of DESTINATIONS) {
      if (
        destination.label.toLowerCase().includes(q) ||
        destination.summary.toLowerCase().includes(q)
      ) {
        out.push({ label: destination.label, href: destination.href, group: "Pages" });
      }

      for (const entry of NAV) {
        const child = entry.children?.find((c) => c.href === destination.href);
        if (
          child &&
          (child.label.toLowerCase().includes(q) || (child.hint ?? "").toLowerCase().includes(q))
        ) {
          out.push({ label: child.label, href: child.href, group: entry.label, hint: child.hint });
        }
      }
    }

    const seen = new Set<string>();
    return out
      .filter((r) => (seen.has(r.href) ? false : (seen.add(r.href), true)))
      .slice(0, 8);
  }, [query]);

  return (
    <>
      <header
        className="sticky top-0 z-[var(--z-nav)] border-b border-hairline bg-canvas/85 backdrop-blur-md"
        onMouseLeave={scheduleClose}
        onMouseEnter={cancelClose}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-[1400px] items-center justify-between gap-4 px-5 md:px-8 lg:px-12">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center rounded-[10px] bg-ink text-[0.8125rem] font-extrabold text-canvas"
            >
              LR
            </span>
            <span className="hidden text-[0.9375rem] font-extrabold tracking-[-0.01em] sm:block">
              Lokesh Rohilla
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {NAV.map((entry, index) => {
                const open = openEntry === entry.label;
                const current = isCurrent(entry.href);
                const panelId = `${navId}-${index}`;

                return (
                  <li key={entry.label} className="relative">
                    {entry.children ? (
                      <button
                        ref={(el) => {
                          triggerRefs.current[index] = el;
                        }}
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        aria-haspopup="true"
                        onClick={() => {
                          cancelClose();
                          setOpenEntry((currentEntry) =>
                            currentEntry === entry.label ? null : entry.label,
                          );
                        }}
                        onMouseEnter={() => {
                          cancelClose();
                          setOpenEntry(entry.label);
                        }}
                        onKeyDown={(e) => onTriggerKeyDown(e, index)}
                        className={`flex items-center gap-1.5 rounded-input px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ease-brand hover:text-accent ${
                          current || open ? "text-accent" : "text-ink-muted"
                        }`}
                      >
                        {entry.label}
                        <CaretDown
                          aria-hidden="true"
                          className={`size-3.5 transition-transform duration-200 ease-brand ${
                            open ? "rotate-180" : ""
                          }`}
                          weight="bold"
                        />
                      </button>
                    ) : (
                      <Link
                        ref={(el) => {
                          triggerRefs.current[index] = el;
                        }}
                        href={entry.href}
                        aria-current={current ? "page" : undefined}
                        onMouseEnter={cancelClose}
                        onKeyDown={(e) => onTriggerKeyDown(e, index)}
                        className={`flex items-center rounded-input px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ease-brand hover:text-accent ${
                          current ? "text-accent" : "text-ink-muted"
                        }`}
                      >
                        {entry.label}
                      </Link>
                    )}

                    <AnimatePresence>
                      {open && entry.children ? (
                        <motion.div
                          key={panelId}
                          initial={reduce ? false : { opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduce ? undefined : { opacity: 0, y: -6 }}
                          transition={
                            reduce
                              ? { duration: 0 }
                              : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                          }
                          className="absolute left-0 top-[calc(100%_+_8px)] z-10 w-[21rem] max-h-[calc(100dvh_-_7rem)] overflow-y-auto overscroll-contain rounded-card bg-canvas p-5 shadow-lift"
                          onMouseEnter={cancelClose}
                        >
                          <ul id={panelId} aria-label={entry.label} className="flex flex-col gap-4">
                            {entry.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={closeAll}
                                  aria-current={isCurrent(child.href) ? "page" : undefined}
                                  className="group flex flex-col gap-0.5"
                                >
                                  <span
                                    className={`font-display text-base font-bold ${
                                      isCurrent(child.href) ? "text-accent" : "text-ink"
                                    }`}
                                  >
                                    {child.label}
                                  </span>
                                  <span className="text-xs leading-relaxed text-ink-muted">
                                    {child.hint}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-expanded={searchOpen}
              aria-controls={searchId}
              className="inline-flex size-11 items-center justify-center rounded-pill text-ink-muted transition-colors duration-200 ease-brand hover:bg-sunk hover:text-ink"
            >
              <span className="sr-only">Search</span>
              <MagnifyingGlass aria-hidden="true" className="size-5" weight="bold" />
            </button>

            <Link
              href="/account"
              className="hidden size-11 items-center justify-center rounded-pill text-ink-muted transition-colors duration-200 ease-brand hover:bg-sunk hover:text-ink lg:inline-flex"
            >
              <span className="sr-only">My account</span>
              <UserCircle aria-hidden="true" className="size-5" weight="bold" />
            </Link>

            <Link
              href="/cart"
              className="relative inline-flex size-11 items-center justify-center rounded-pill text-ink-muted transition-colors duration-200 ease-brand hover:bg-sunk hover:text-ink"
            >
              <span className="sr-only">
                Cart{ready && itemCount > 0 ? `, ${itemCount} items` : ""}
              </span>
              <ShoppingBag aria-hidden="true" className="size-5" weight="bold" />
              {/* aria-live so a quantity change is announced, not just seen. */}
              <span
                aria-live="polite"
                className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-pill bg-accent px-1 text-[0.625rem] font-extrabold leading-4 text-accent-ink"
              >
                {ready && itemCount > 0 ? itemCount : null}
              </span>
            </Link>

            <Link
              href="/services/business-consultation#health-checker"
              className="ml-1 hidden h-11 items-center rounded-pill bg-accent px-6 text-sm font-bold text-accent-ink transition-[filter,transform] duration-200 ease-brand hover:brightness-110 active:translate-y-px lg:inline-flex"
            >
              Business Health Check
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls={mobileId}
              className="inline-flex size-11 items-center justify-center rounded-pill border border-hairline-strong text-ink transition-colors duration-200 ease-brand hover:border-accent hover:text-accent xl:hidden"
            >
              <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
              {mobileOpen ? (
                <X aria-hidden="true" className="size-5" weight="bold" />
              ) : (
                <List aria-hidden="true" className="size-5" weight="bold" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile: every destination flat, because dropdowns are unusable on a
            small screen. */}
        <div
          id={mobileId}
          hidden={!mobileOpen}
          className="max-h-[calc(100dvh_-_72px)] overflow-y-auto border-t border-hairline bg-canvas xl:hidden"
        >
          <nav aria-label="Primary mobile" className="mx-auto max-w-[1400px] px-5 py-6 md:px-8">
            <ul className="flex flex-col">
              {NAV.map((entry) => (
                <li key={entry.label} className="border-b border-hairline py-4">
                  <Link
                    href={entry.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block font-display text-lg font-bold ${
                      isCurrent(entry.href) ? "text-accent" : "text-ink"
                    }`}
                  >
                    {entry.label}
                  </Link>
                  {entry.children ? (
                    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      {entry.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className={`text-sm ${
                              isCurrent(child.href) ? "text-accent" : "text-ink-muted"
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/services/business-consultation#health-checker"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-12 w-full items-center justify-center rounded-pill bg-accent px-6 text-sm font-bold text-accent-ink"
              >
                Business Health Check
              </Link>
              <div className="flex gap-3">
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-pill border border-hairline-strong text-sm font-bold"
                >
                  My account
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-pill border border-hairline-strong text-sm font-bold"
                >
                  Cart
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            key="search"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.15 }}
            className="fixed inset-0 z-[var(--z-skip)] bg-ink/40 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              id={searchId}
              role="dialog"
              aria-modal="true"
              aria-label="Search"
              initial={reduce ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: reduce ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-[12vh] w-[min(40rem,calc(100%_-_2.5rem))] rounded-panel bg-canvas p-5 shadow-lift"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <MagnifyingGlass
                  aria-hidden="true"
                  className="size-5 shrink-0 text-ink-muted"
                  weight="bold"
                />
                <label htmlFor={`${searchId}-input`} className="sr-only">
                  Search the site
                </label>
                <input
                  id={`${searchId}-input`}
                  ref={searchInputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pages and sections"
                  className="w-full bg-transparent py-2 text-base text-ink placeholder:text-ink-faint focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-pill text-ink-muted transition-colors hover:bg-sunk hover:text-ink"
                >
                  <span className="sr-only">Close search</span>
                  <X aria-hidden="true" className="size-4" weight="bold" />
                </button>
              </div>

              <div className="mt-4 border-t border-hairline pt-4">
                {query.trim().length < 2 ? (
                  <p className="text-sm text-ink-muted">
                    Type at least two characters. Press Escape to close.
                  </p>
                ) : results.length === 0 ? (
                  <p className="text-sm text-ink-muted">
                    Nothing matches that. Try a broader term such as leadership, events or shop.
                  </p>
                ) : (
                  <ul className="flex flex-col">
                    {results.map((result) => (
                      <li key={result.href}>
                        <Link
                          href={result.href}
                          onClick={() => {
                            setSearchOpen(false);
                            setQuery("");
                          }}
                          className="flex items-center justify-between gap-4 rounded-input px-3 py-2.5 transition-colors duration-200 hover:bg-sunk"
                        >
                          <span className="flex flex-col">
                            <span className="text-sm font-bold text-ink">{result.label}</span>
                            <span className="text-xs text-ink-muted">{result.group}</span>
                          </span>
                          <CaretDown
                            aria-hidden="true"
                            className="size-3.5 shrink-0 -rotate-90 text-ink-faint"
                            weight="bold"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <p className="mt-4 border-t border-hairline pt-3 text-xs text-ink-faint">
                Searching {ROUTES.length} pages.
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}