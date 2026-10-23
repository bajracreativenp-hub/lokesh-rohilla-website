"use client";

import { useId, useMemo, useState } from "react";

import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "motion/react";

/**
 * BLOG SEARCH AND CATEGORY FILTER
 *
 * A real client side filter, not a decorative one. It searches a local index and
 * filters by category, and it says plainly when it has nothing to show.
 *
 * The index is currently empty, because no articles have been supplied. That is
 * stated rather than papered over with invented headlines: a plausible fake
 * headline is worse than an empty result, because a visitor will assume Lokesh
 * wrote it.
 *
 * Filtering real content the moment it arrives needs no changes here. Add an
 * entry to `ARTICLES` and it appears in the list and in the search index.
 */

export type Article = {
  slug: string;
  title: string;
  category: string;
  /** Optional one line summary. */
  standfirst?: string;
  date?: string;
};

/**
 * Empty by design. Populated from `page-content.ts` once articles are supplied.
 */
const ARTICLES: Article[] = [];

export function BlogSearch({
  categories,
}: {
  categories: { slug: string; label: string; note: string }[];
}) {
  const instanceId = useId();
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTICLES.filter((article) => {
      const matchesCategory = activeCategory === null || article.category === activeCategory;
      const matchesQuery =
        q.length < 2 ||
        article.title.toLowerCase().includes(q) ||
        (article.standfirst ?? "").toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  const searching = query.trim().length >= 2;

  return (
    <div className="flex flex-col gap-8">
      {/* Search */}
      <div className="flex flex-col gap-3">
        <label htmlFor="blog-search" className="eyebrow">
          Search {ARTICLES.length} articles
        </label>
        <div className="flex items-center gap-3 rounded-input border border-hairline-strong bg-surface px-4 py-3 transition-colors duration-200 ease-brand focus-within:border-accent">
          <MagnifyingGlass aria-hidden="true" className="size-5 shrink-0 text-ink-muted" weight="bold" />
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles"
            className="w-full bg-transparent py-1 text-base text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>
        <p aria-live="polite" className="text-sm text-ink-muted">
          {ARTICLES.length === 0
            ? "Nothing published yet, so there is nothing to search."
            : searching
              ? `${filtered.length} of ${ARTICLES.length} matching.`
              : `Showing all ${ARTICLES.length}.`}
        </p>
      </div>

      {/* Categories with sliding pill switch */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            aria-pressed={activeCategory === null}
            className={`relative z-10 inline-flex items-center rounded-pill border px-4 py-2 text-sm font-semibold transition-all duration-200 ease-brand active:scale-[0.98] ${
              activeCategory === null
                ? "border-accent text-accent-ink"
                : "border-hairline-strong text-ink hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            }`}
          >
            {activeCategory === null ? (
              <motion.span
                layoutId={`${instanceId}-category-pill`}
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-pill bg-accent"
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 450, damping: 34 }
                }
              />
            ) : null}
            <span>All</span>
          </button>
          {categories.map((category) => {
            const isActive = activeCategory === category.slug;
            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => setActiveCategory(isActive ? null : category.slug)}
                aria-pressed={isActive}
                className={`relative z-10 inline-flex items-center rounded-pill border px-4 py-2 text-sm font-semibold transition-all duration-200 ease-brand active:scale-[0.98] ${
                  isActive
                    ? "border-accent text-accent-ink"
                    : "border-hairline-strong text-ink hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                }`}
              >
                {isActive ? (
                  <motion.span
                    layoutId={`${instanceId}-category-pill`}
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-pill bg-accent"
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 450, damping: 34 }
                    }
                  />
                ) : null}
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        <motion.div
          key={activeCategory ?? "all"}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduce ? { duration: 0 } : { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
          }
        >
          {filtered.length > 0 ? (
            <ul className="flex flex-col divide-y divide-hairline">
              {filtered.map((article) => (
                <li key={article.slug} className="py-5">
                  <p className="eyebrow">{article.category}</p>
                  <p className="mt-2 font-display text-lg font-bold text-ink">{article.title}</p>
                  {article.standfirst ? (
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">{article.standfirst}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-panel bg-sunk p-6">
              <p className="text-sm leading-relaxed text-ink">
                {ARTICLES.length === 0
                  ? "No articles have been published yet. The search and the categories above are working and will filter content as soon as it is added."
                  : searching
                    ? `Nothing matches that. Try a broader term, or clear the category filter.`
                    : "No articles in that category yet."}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
