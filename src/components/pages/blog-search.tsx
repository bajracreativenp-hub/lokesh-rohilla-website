"use client";

import { useId, useMemo, useState } from "react";

import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "motion/react";

/**
 * BLOG SEARCH AND CATEGORY FILTER
 *
 * Interactive client-side search and category filter populated with editorial
 * essays across all five core pillars.
 */

export type Article = {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  standfirst: string;
  readTime: string;
};

const ARTICLES: Article[] = [
  {
    slug: "diagnosis-before-prescription-why-turnarounds-stall",
    title: "Diagnosis Before Prescription: Why Most Operational Turnarounds Stall in Month Two",
    category: "business-growth",
    categoryLabel: "Business Growth",
    standfirst:
      "Organizations rarely fail from a lack of energy. They stall because a solution was approved and funded before anyone in the room agreed on the root cause.",
    readTime: "6 min read",
  },
  {
    slug: "when-memory-replaces-systems-founder-bottleneck",
    title: "When Memory Replaces Systems: How Founder Dependency Quietly Caps Growth",
    category: "business-growth",
    categoryLabel: "Business Growth",
    standfirst:
      "If a core workflow stops when one specific person takes a week off, you do not have a process—you have a single point of failure wearing a job title.",
    readTime: "5 min read",
  },
  {
    slug: "decision-rights-vs-consensus-meetings",
    title: "Cutting the Meeting Load: Why Unclear Decision Rights Create Calendar Bloat",
    category: "leadership",
    categoryLabel: "Leadership",
    standfirst:
      "Most leadership teams do not have a communication problem; they have an ownership problem. When nobody knows who decides, every question becomes a committee.",
    readTime: "7 min read",
  },
  {
    slug: "say-the-point-first-structured-speaking-under-pressure",
    title: "Say the Point First: A Framework for Impromptu Speaking in High-Stakes Rooms",
    category: "public-speaking",
    categoryLabel: "Public Speaking",
    standfirst:
      "Spontaneous confidence on stage or in the boardroom does not come from memorizing scripts. It comes from structuring your thought before your first sentence.",
    readTime: "5 min read",
  },
  {
    slug: "attention-not-mysticism-honest-look-at-focus",
    title: "Sustained Attention vs. Wishful Thinking: What Actually Changes Personal Trajectory",
    category: "mindset-motivation",
    categoryLabel: "Mindset & Motivation",
    standfirst:
      "What you consistently measure and notice, you consistently act on. Separating disciplined cognitive focus from motivational clichés.",
    readTime: "6 min read",
  },
  {
    slug: "the-room-after-the-session-building-habits-that-hold",
    title: "The Room After the Session: Why Practice Communities Outperform One-Day Seminars",
    category: "personal-development",
    categoryLabel: "Personal Development",
    standfirst:
      "Inspiration fades by Tuesday morning. Lasting personal transformation requires a room where you rehearse one specific change every week until it becomes automatic.",
    readTime: "5 min read",
  },
];

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
        article.standfirst.toLowerCase().includes(q) ||
        article.categoryLabel.toLowerCase().includes(q);
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
            placeholder="Search articles by topic, keyword, or framework"
            className="w-full bg-transparent py-1 text-base text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>
        <p aria-live="polite" className="text-sm text-ink-muted">
          {searching || activeCategory !== null
            ? `Showing ${filtered.length} of ${ARTICLES.length} articles.`
            : `Showing all ${ARTICLES.length} published essays.`}
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
            <ul className="grid gap-5 md:grid-cols-2">
              {filtered.map((article) => (
                <li
                  key={article.slug}
                  className="flex flex-col justify-between gap-4 rounded-card border border-hairline bg-surface p-6 transition-all duration-300 ease-brand hover:-translate-y-1 hover:border-hairline-strong hover:shadow-card"
                >
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="eyebrow">{article.categoryLabel}</p>
                      <span className="text-xs font-semibold text-ink-muted">{article.readTime}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold leading-snug text-ink">
                      {article.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-muted">{article.standfirst}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-panel bg-sunk p-6">
              <p className="text-sm leading-relaxed text-ink">
                Nothing matches that search term. Try a broader keyword or select &ldquo;All&rdquo; categories above.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
