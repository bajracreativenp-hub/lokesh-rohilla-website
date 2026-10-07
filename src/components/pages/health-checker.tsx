"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

/**
 * BUSINESS HEALTH CHECKER
 *
 * Ten questions about the visitor's company. Each answer scores 1 to 4, the
 * total is shown, and the lowest scoring area is named as the place to look
 * first.
 *
 * WHAT THIS IS NOT
 *
 * It is a self assessment. The only inputs are the visitor's own answers, so
 * nothing here is a claim about Lokesh's clients and nothing is fabricated. It
 * is deliberately NOT presented as an audit, a benchmark, or a score against
 * any industry. There are no industry norms on this page because none have been
 * confirmed, and inventing them would be the exact failure mode this project
 * avoids everywhere else.
 *
 * The result bands are worded as what to do next rather than as what your
 * business is, because a band with no confirmed calibration behind it should not
 * tell a business owner what kind of business they have.
 *
 * `prefers-reduced-motion` is honoured through `useProgressMotion`.
 */

type Option = { label: string; score: number };
type Question = {
  id: string;
  area: string;
  prompt: string;
  why: string;
  options: Option[];
};

/**
 * Ten questions across the six transformation areas, so the result can name an
 * area rather than only a number. Four options each, 1 to 4, no "not sure"
 * escape hatch: a neutral answer is scored 2, which is deliberate. A diagnostic
 * that lets you opt out of every question produces a score nobody trusts.
 */
const QUESTIONS: Question[] = [
  {
    id: "clarity",
    area: "Strategy",
    prompt: "If asked what this business is for, would three different people in the room give three different answers?",
    why: "Strategy. A business that cannot be described consistently cannot be steered consistently.",
    options: [
      { label: "No, we would all say the same thing", score: 4 },
      { label: "Close, with some argument about priorities", score: 3 },
      { label: "Yes, and it is uncomfortable to admit", score: 2 },
      { label: "There is no shared answer at all", score: 1 },
    ],
  },
  {
    id: "decisions",
    area: "Strategy",
    prompt: "When a decision needs making, is it clear who decides?",
    why: "Decision rights. Unclear ownership of a decision is the most common cause of delay.",
    options: [
      { label: "Clear, and written down", score: 4 },
      { label: "Usually clear, but discovered case by case", score: 3 },
      { label: "It gets made, eventually, by whoever pushes hardest", score: 2 },
      { label: "Decisions stall and get made by default", score: 1 },
    ],
  },
  {
    id: "operations",
    area: "Operations",
    prompt: "Could a competent new hire do the core work well after a written process and some support?",
    why: "Operations. Work that only one person can do is a single point of failure wearing a job title.",
    options: [
      { label: "Yes, and we have the process written", score: 4 },
      { label: "Mostly, with gaps we paper over", score: 3 },
      { label: "It takes much longer than it should", score: 2 },
      { label: "No. If that person is absent, it stops", score: 1 },
    ],
  },
  {
    id: "systems",
    area: "Systems",
    prompt: "How much of the business relies on someone remembering to do something?",
    why: "Systems. Memory is not a system, however dependable the person holding it.",
    options: [
      { label: "Very little. It is built into the process", score: 4 },
      { label: "Some, mostly in predictable places", score: 3 },
      { label: "A fair amount, and we all know where", score: 2 },
      { label: "Almost all of it", score: 1 },
    ],
  },
  {
    id: "sales",
    area: "Sales",
    prompt: "Do you know where deals are lost between interest and signature?",
    why: "Sales. Pipeline problems are invisible until they are counted.",
    options: [
      { label: "Yes, with reasons, and we act on them", score: 4 },
      { label: "Roughly, from the team's impression", score: 3 },
      { label: "We know the total but not the reasons", score: 2 },
      { label: "No. Deals vanish and we find out late", score: 1 },
    ],
  },
  {
    id: "promise",
    area: "Marketing",
    prompt: "If a customer described what they bought, would that match what you promised?",
    why: "Marketing. The gap between promise and delivery is where reputation is spent.",
    options: [
      { label: "They match, and we measure it", score: 4 },
      { label: "They match in most cases", score: 3 },
      { label: "There is a gap we are careful not to advertise", score: 2 },
      { label: "There is a gap and customers have noticed", score: 1 },
    ],
  },
  {
    id: "structure",
    area: "Organizational Structure",
    prompt: "Does each person know what they are accountable for, rather than what they are responsible for?",
    why: "Structure. Accountability is the difference between being given tasks and owning outcomes.",
    options: [
      { label: "Yes, explicitly", score: 4 },
      { label: "Broadly, and it is inferred from the role", score: 3 },
      { label: "Not really, it changes by project", score: 2 },
      { label: "No. Everyone is responsible for everything", score: 1 },
    ],
  },
  {
    id: "communication",
    area: "Communication",
    prompt: "How many meetings could be removed this month without losing anything?",
    why: "Communication. Most organizations have a communication load problem, not a willingness problem.",
    options: [
      { label: "Very few. They earn their place", score: 4 },
      { label: "A few, if we were honest", score: 3 },
      { label: "A lot of them, honestly", score: 2 },
      { label: "Most of them. The calendar is the plan", score: 1 },
    ],
  },
  {
    id: "performance",
    area: "Performance",
    prompt: "Could you state what good performance looks like in any given role, in terms someone else could check?",
    why: "Performance. Expectations held privately by the person who set them are not expectations.",
    options: [
      { label: "Yes, written and agreed with the person", score: 4 },
      { label: "Roughly, and people would mostly agree", score: 3 },
      { label: "Not precisely. It depends who is judging", score: 2 },
      { label: "No. It is a matter of opinion", score: 1 },
    ],
  },
  {
    id: "culture",
    area: "Organizational Culture",
    prompt: "If you wrote down what this organization actually rewards, would it match what it says it values?",
    why: "Culture. The gap between the two documents is the culture. Everything else is branding.",
    options: [
      { label: "Yes, and the two agree closely", score: 4 },
      { label: "Broadly, with some uncomfortable edges", score: 3 },
      { label: "Not really", score: 2 },
      { label: "They are opposites", score: 1 },
    ],
  },
];

const MAX = QUESTIONS.length * 4;

type Band = {
  floor: number;
  headline: string;
  body: string;
  cta: { label: string; href: string };
};

/**
 * Result bands, ordered BEST to WORST, with `floor` being the minimum total to
 * land in that band. `BANDS.find((b) => total >= b.floor)` then returns the
 * highest band the score qualifies for.
 *
 * THE ORDER IS LOAD BEARING.
 *
 * The bands were originally written worst-first, so `find` returned the first
 * match and a perfect score landed in the worst band, which printed "Several of
 * these are structural" under a 40 out of 40. Nothing crashed, the probe still
 * saw a score, and the copy was simply the opposite of the meaning.
 *
 * Wording is deliberately about the next step rather than a verdict on the
 * business, because no band here has a confirmed calibration behind it.
 */
const BANDS: Band[] = [
  {
    floor: 34,
    headline: "Almost all of it is working.",
    body: "On a self assessment, this usually means either the business is genuinely well run, or the answers are optimistic. Both are worth acting on, in opposite directions. Either way, look at the lowest area below rather than at the total.",
    cta: { label: "Book a consultation", href: "/contact#book-a-consultation" },
  },
  {
    floor: 24,
    headline: "Most of this is already working.",
    body: "This is a real result, and worth noticing which answers scored lowest rather than looking only at the total. Averages reward consistency, so a single genuine weak point can hide inside a good number.",
    cta: { label: "Book a consultation", href: "/contact#book-a-consultation" },
  },
  {
    floor: 14,
    headline: "The foundations hold. The load is on the middle.",
    body: "The basics work, which means this is usually a prioritization problem rather than a capability one. That is a better position than it sounds: you are choosing what to fix, not deciding whether the business works.",
    cta: { label: "Book a consultation", href: "/contact#book-a-consultation" },
  },
  {
    floor: 0,
    headline: "Several of these are structural, which is good news.",
    body: "Low scores here usually mean the problem is in a system rather than in the people, and systems can be changed once they are visible. Starting with the lowest area below is faster than starting where it feels most obvious.",
    cta: { label: "Book a consultation", href: "/contact#book-a-consultation" },
  },
];

/**
 * No reduced motion hook is needed here. `Progress` declares its transition in
 * CSS and switches it off with `motion-reduce:`, so the quiz ships no extra
 * JavaScript for something the stylesheet already handles.
 */
export function BusinessHealthChecker() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const total = useMemo(
    () => Object.values(answers).reduce((n, v) => n + v, 0),
    [answers],
  );

  /** Per area, so the result can name a place rather than only a number. */
  const byArea = useMemo(() => {
    const map = new Map<string, { sum: number; n: number }>();
    for (const q of QUESTIONS) {
      const score = answers[q.id];
      if (score === undefined) continue;
      const entry = map.get(q.area) ?? { sum: 0, n: 0 };
      entry.sum += score;
      entry.n += 1;
      map.set(q.area, entry);
    }
    return [...map.entries()]
      .map(([area, { sum, n }]) => ({ area, average: sum / n }))
      .sort((a, b) => a.average - b.average);
  }, [answers]);

  const band = BANDS.find((b) => total >= b.floor) ?? BANDS[BANDS.length - 1];

  const question = QUESTIONS[index];
  const selected = question ? answers[question.id] : undefined;
  const answeredCount = Object.keys(answers).length;

  if (done) {
    const weakest = byArea[0];
    const strongest = byArea[byArea.length - 1];
    const allAreasTied = Boolean(
      weakest && strongest && Math.abs(weakest.average - strongest.average) < 0.001,
    );
    const percent = Math.round((total / MAX) * 100);

    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">Your result</p>
          <p className="text-display-2 leading-display-2 text-balance">
            {total} out of {MAX}
          </p>
          <Progress value={percent} label="Health check score" />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-display-3 max-w-[22ch] leading-[1.12] text-balance">
            {band.headline}
          </h3>
          <p className="measure text-base leading-relaxed text-ink-muted">{band.body}</p>
        </div>

        {/*
          COLOUR RULES ON A DARK BAND

          `.band-dark` RE-SCOPES the colour tokens rather than adding a parallel
          dark palette: `--canvas` becomes near black and `--ink` becomes near
          white. So a hardcoded `text-canvas` here renders near-black text on a
          near-black band and disappears, which is exactly what happened: the
          ten answer labels were present in the DOM and invisible on screen, and
          axe reported no contrast failure because it had no text to measure.

          Every colour below is therefore semantic: `ink`, `ink-muted`, `surface`,
          `hairline`. Those invert correctly inside the band and read correctly
          outside it. Only `bg-accent` / `text-accent-ink` is a hardcoded pair,
          which is safe because both halves invert together.
        */}
        {weakest && strongest ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {/*
              Both cards are `bg-surface`, and the emphasised one is separated by
              an accent border rather than by a different background colour. On a
              dark band `bg-ink` would be a near-white card, so an "emphasised"
              dark card is not available; a border is the honest way to create
              the hierarchy.
            */}
            <div className="flex flex-col gap-2 rounded-card border border-accent bg-surface p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                Look here first
              </p>
              {/* When every area scores the same there is no weakest one, and
                  naming an arbitrary area as the weak spot would be inventing a
                  finding. Say so instead. */}
              {allAreasTied ? (
                <>
                  <p className="font-display text-lg font-bold text-ink">No clear weak spot</p>
                  <p className="text-sm leading-relaxed text-ink-muted">
                    Every area scored the same, so there is nothing to single out.
                    Usually that means the answers were uniform rather than that
                    the business is uniform.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-display text-lg font-bold text-ink">{weakest.area}</p>
                  <p className="text-sm leading-relaxed text-ink-muted">
                    Your lowest scoring area. This is where a diagnostic would
                    spend its time.
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-col gap-2 rounded-card bg-surface-sunk p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">
                Strongest area
              </p>
              <p className="font-display text-lg font-bold text-ink">
                {allAreasTied ? "Also no clear leader" : strongest.area}
              </p>
              <p className="text-sm leading-relaxed text-ink-muted">
                {allAreasTied
                  ? "For the same reason, no area stands out as working better than the rest."
                  : "Working well. Worth protecting rather than spending attention on."}
              </p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-4 rounded-panel bg-surface p-6">
          <p className="text-sm leading-relaxed text-ink-muted">
            This is a self assessment of your own answers. It is not an audit and
            not a benchmark against any industry. A real diagnosis involves
            looking at the business, not asking its owner to grade it.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={band.cta.href}
              className="inline-flex h-12 items-center justify-center rounded-pill bg-accent px-6 text-sm font-bold text-accent-ink transition-[filter,transform] duration-200 ease-brand hover:brightness-110 active:translate-y-px"
            >
              {band.cta.label}
            </Link>
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setIndex(0);
                setDone(false);
              }}
              className="inline-flex h-12 items-center justify-center rounded-pill border border-hairline-strong px-6 text-sm font-bold transition-colors duration-200 ease-brand hover:border-accent hover:text-accent"
            >
              Start again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const isLast = index === QUESTIONS.length - 1;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <p className="eyebrow">
            Question {index + 1} of {QUESTIONS.length}
          </p>
          <p className="text-sm font-bold text-ink-muted">{question.area}</p>
        </div>
        <Progress
          value={Math.round(((index + (selected ? 1 : 0)) / QUESTIONS.length) * 100)}
          label="Questions answered"
        />
      </div>

      <fieldset className="flex flex-col gap-5">
        <legend className="flex flex-col gap-3">
          <span className="text-display-3 max-w-[26ch] leading-[1.14] text-balance">
            {question.prompt}
          </span>
          <span className="measure text-sm leading-relaxed text-ink-muted">{question.why}</span>
        </legend>

        <div className="grid gap-3 sm:grid-cols-2">
          {question.options.map((option) => {
            const id = `hc-${question.id}-${option.score}`;
            const isSelected = selected === option.score;
            return (
              <label
                key={option.score}
                htmlFor={id}
                className={`flex cursor-pointer items-start gap-3 rounded-card border p-4 transition-colors duration-200 ease-brand ${
                  isSelected
                    ? "border-accent bg-surface"
                    : "border-hairline bg-surface-sunk hover:border-hairline-strong"
                }`}
              >
                <input
                  id={id}
                  type="radio"
                  name={`hc-${question.id}`}
                  checked={isSelected}
                  onChange={() =>
                    setAnswers((a) => ({ ...a, [question.id]: option.score }))
                  }
                  className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
                />
                <span className="text-sm leading-relaxed text-ink">{option.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {index > 0 ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIndex((i) => i - 1)}
            className="border-hairline-strong text-ink"
          >
            <ArrowLeft aria-hidden="true" className="size-4" weight="bold" />
            Previous
          </Button>
        ) : null}

        <Button
          type="button"
          disabled={selected === undefined}
          onClick={() => (isLast ? setDone(true) : setIndex((i) => i + 1))}
          className="sm:ml-auto"
        >
          {isLast ? "See the result" : "Next question"}
          <ArrowRight aria-hidden="true" className="size-4" weight="bold" />
        </Button>
      </div>

      <p className="text-xs leading-relaxed text-ink-muted">
        {answeredCount} of {QUESTIONS.length} answered. Answers stay in this
        browser and are not transmitted anywhere, because there is nowhere to send
        them yet.
      </p>
    </div>
  );
}