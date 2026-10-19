"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

/**
 * TRANSFORMATION DIAGNOSTIC (formerly Business Health Checker)
 *
 * Diagnostic assessment covering two distinct tracks:
 * 1. For Your Business (Powered by Business Doctor)
 * 2. For Yourself (Powered by The Bookwishes Club)
 *
 * Each answer scores 1 to 4, total is shown, and the lowest scoring area is
 * identified as the primary focus area.
 */

type Option = { label: string; score: number };
type Question = {
  id: string;
  area: string;
  prompt: string;
  why: string;
  options: Option[];
};

export type DiagnosticTrack = "business" | "self";

/**
 * Ten questions for business owners and leaders, powered by Business Doctor.
 */
const BUSINESS_QUESTIONS: Question[] = [
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

/**
 * Ten questions for personal growth, public speaking, and mindset, powered by The Bookwishes Club.
 */
const SELF_QUESTIONS: Question[] = [
  {
    id: "spontaneous_speaking",
    area: "Public Speaking",
    prompt: "When asked to speak in front of a group with little or no notice, how do you typically respond?",
    why: "Public Speaking. Spontaneous confidence comes from structured thinking frameworks, not memorized speeches.",
    options: [
      { label: "Calm and articulate; I structure my thoughts and deliver with ease", score: 4 },
      { label: "A little nervous initially, but I find my rhythm and get my point across", score: 3 },
      { label: "Anxious and rushed; I usually over-explain or hurry to finish", score: 2 },
      { label: "Overwhelmed or frozen; I actively avoid speaking in front of groups", score: 1 },
    ],
  },
  {
    id: "articulation_clarity",
    area: "Articulation",
    prompt: "Do listeners quickly grasp the core point of your message without needing repeated explanations?",
    why: "Articulation. Clarity of expression directly reflects clarity of thought. Verbosity usually conceals uncertainty.",
    options: [
      { label: "Yes, I communicate directly with structured conciseness", score: 4 },
      { label: "Mostly, though I occasionally wander into tangents before landing the point", score: 3 },
      { label: "Often takes several tries to communicate what I actually mean", score: 2 },
      { label: "People frequently misunderstand or misinterpret what I say", score: 1 },
    ],
  },
  {
    id: "stage_presence",
    area: "Executive Presence",
    prompt: "In meetings or high-stakes discussions, how effectively do you command attention and hold the room?",
    why: "Presence. Authority is communicated through vocal pacing, physical posture, and intentional pauses.",
    options: [
      { label: "Commanding and natural; others listen attentively when I speak", score: 4 },
      { label: "Effective when speaking on topics I know intimately", score: 3 },
      { label: "Easily talked over or sidelined by louder voices in the room", score: 2 },
      { label: "Invisible; I stay quiet to avoid unwanted attention", score: 1 },
    ],
  },
  {
    id: "mindset_resilience",
    area: "Mindset & Resilience",
    prompt: "When faced with sharp criticism or unexpected pushback, what is your immediate internal response?",
    why: "Mindset. Emotional regulation dictates whether feedback fuels rapid improvement or triggers defensiveness.",
    options: [
      { label: "Receptive and composed; I separate my personal worth from the critique", score: 4 },
      { label: "Briefly stung, but I quickly refocus on what is actionable", score: 3 },
      { label: "Defensive and frustrated; the interaction lingers for days", score: 2 },
      { label: "Deeply discouraged; I view criticism as personal failure", score: 1 },
    ],
  },
  {
    id: "reading_learning",
    area: "Learning & Knowledge",
    prompt: "How disciplined and consistent is your habit of deep reading and intellectual development?",
    why: "Knowledge. A structured reading practice is the single fastest way to expand mental models and strategic depth.",
    options: [
      { label: "Consistent daily habit; I actively extract and apply insights", score: 4 },
      { label: "Regular reader, though I struggle to retain and systematically apply ideas", score: 3 },
      { label: "Sporadic reading bursts followed by weeks of passive digital scrolling", score: 2 },
      { label: "Rarely read books or structured self-development material", score: 1 },
    ],
  },
  {
    id: "personal_vision",
    area: "Personal Vision",
    prompt: "Can you clearly articulate your top 3 personal priorities and boundaries for the next 12 months?",
    why: "Vision. Without clear self-direction, your calendar and energy get consumed by everyone else's priorities.",
    options: [
      { label: "Crystal clear, documented, and reviewed weekly", score: 4 },
      { label: "Clear in my head, though not documented or strictly defended", score: 3 },
      { label: "Vague and constantly shifting depending on immediate pressures", score: 2 },
      { label: "No clear personal direction; completely reactive to day-to-day demands", score: 1 },
    ],
  },
  {
    id: "emotional_composure",
    area: "Stress & Composure",
    prompt: "When high pressure or conflict arises, how well do you maintain mental clarity and emotional control?",
    why: "Composure. High performance requires an anchored nervous system capable of making sound decisions under fire.",
    options: [
      { label: "Anchored and clear-headed; pressure sharpens my focus", score: 4 },
      { label: "Mostly composed, with occasional reactive slip-ups under peak stress", score: 3 },
      { label: "Visibly tense and prone to hasty, emotionally driven reactions", score: 2 },
      { label: "Overwhelmed by anxiety, leading to avoidance or burnout", score: 1 },
    ],
  },
  {
    id: "persuasion_influence",
    area: "Storytelling & Influence",
    prompt: "How effectively can you inspire, persuade, or rally others behind an idea using narrative and emotion?",
    why: "Influence. People are moved to action by emotional conviction and story, not just logical bullet points.",
    options: [
      { label: "Very effectively; I use storytelling to create buy-in and alignment", score: 4 },
      { label: "Good at explaining facts and logic, but less practiced with emotional narrative", score: 3 },
      { label: "Struggle to persuade skeptics or build genuine excitement", score: 2 },
      { label: "Unable to influence others without formal authority or title", score: 1 },
    ],
  },
  {
    id: "self_belief",
    area: "Confidence & Self-Belief",
    prompt: "When stepping into unfamiliar rooms with senior leaders or industry peers, how secure do you feel in your seat?",
    why: "Self-Belief. Unchecked impostor syndrome handicaps your contribution before you even say a word.",
    options: [
      { label: "Fully grounded; I know my value and feel at home in any room", score: 4 },
      { label: "Brief hesitation, but I quickly settle in and engage", score: 3 },
      { label: "Frequent impostor syndrome; I constantly question if I belong", score: 2 },
      { label: "Paralyzing self-doubt; I minimize my voice and stay unnoticed", score: 1 },
    ],
  },
  {
    id: "follow_through",
    area: "Discipline & Consistency",
    prompt: "How dependable is your follow-through on personal commitments when initial enthusiasm and motivation fade?",
    why: "Discipline. Motivation is temporary; long-term personal authority is built on keeping promises to yourself.",
    options: [
      { label: "Uncompromising; my habits run on systems and discipline, not mood", score: 4 },
      { label: "Generally reliable, with occasional drops when fatigue sets in", score: 3 },
      { label: "Inconsistent; I start with high excitement but abandon momentum quickly", score: 2 },
      { label: "Rarely sustain self-directed commitments past the first week", score: 1 },
    ],
  },
];

type Band = {
  floor: number;
  headline: string;
  body: string;
  cta: { label: string; href: string };
};

const BUSINESS_BANDS: Band[] = [
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

const SELF_BANDS: Band[] = [
  {
    floor: 34,
    headline: "High personal mastery with targeted growth edges.",
    body: "You possess strong self-command, clear articulation, and grounded presence. Look at your lowest scoring area below to sharpen your edge and step into higher-leverage public influence.",
    cta: { label: "Explore The Bookwishes Club", href: "/services/self-development" },
  },
  {
    floor: 24,
    headline: "Solid foundation with identifiable communication gaps.",
    body: "You perform well in comfortable environments, but pressure, larger rooms, or spontaneous speaking expose hesitation. Strengthening your structured speaking frameworks will unlock immediate confidence.",
    cta: { label: "Explore The Bookwishes Club", href: "/services/self-development" },
  },
  {
    floor: 14,
    headline: "Self-doubt and friction are holding back your potential.",
    body: "Stage anxiety, conversational over-thinking, or inconsistent personal discipline are capping your impact. These are learned skills with proven training methods, not fixed personality traits.",
    cta: { label: "Discover The Bookwishes Club", href: "/services/self-development" },
  },
  {
    floor: 0,
    headline: "Time for a structured communication and mindset reset.",
    body: "Hesitation, fear of speaking, and lack of clarity are costing you career advancement and personal confidence. Beginning with a supportive community and structured practice creates rapid transformation.",
    cta: { label: "Explore Self-Development Programs", href: "/services/self-development" },
  },
];

export function BusinessHealthChecker({
  initialTrack = "business",
}: {
  initialTrack?: DiagnosticTrack;
} = {}) {
  const [track, setTrack] = useState<DiagnosticTrack>(initialTrack);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  // Sync track with URL params or hash (?track=self, #track=self, etc.)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateFromUrl = () => {
      const searchParams = new URLSearchParams(window.location.search);
      let t = searchParams.get("track");
      if (!t && window.location.hash) {
        if (window.location.hash.includes("track=self")) t = "self";
        else if (window.location.hash.includes("track=business")) t = "business";
      }
      if (t === "business" || t === "self") {
        setTrack(t);
        setIndex(0);
        setAnswers({});
        setDone(false);
      }
    };

    updateFromUrl();
    window.addEventListener("hashchange", updateFromUrl);
    window.addEventListener("popstate", updateFromUrl);
    return () => {
      window.removeEventListener("hashchange", updateFromUrl);
      window.removeEventListener("popstate", updateFromUrl);
    };
  }, []);

  const questions = track === "business" ? BUSINESS_QUESTIONS : SELF_QUESTIONS;
  const bands = track === "business" ? BUSINESS_BANDS : SELF_BANDS;
  const maxScore = questions.length * 4;

  const total = useMemo(
    () => Object.values(answers).reduce((n, v) => n + v, 0),
    [answers],
  );

  /** Per area, so the result can name a place rather than only a number. */
  const byArea = useMemo(() => {
    const map = new Map<string, { sum: number; n: number }>();
    for (const q of questions) {
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
  }, [answers, questions]);

  const band = bands.find((b) => total >= b.floor) ?? bands[bands.length - 1];

  const question = questions[index];
  const selected = question ? answers[question.id] : undefined;
  const answeredCount = Object.keys(answers).length;

  const switchTrack = (nextTrack: DiagnosticTrack) => {
    if (nextTrack === track) return;
    setTrack(nextTrack);
    setIndex(0);
    setAnswers({});
    setDone(false);
  };

  if (done) {
    const weakest = byArea[0];
    const strongest = byArea[byArea.length - 1];
    const allAreasTied = Boolean(
      weakest && strongest && Math.abs(weakest.average - strongest.average) < 0.001,
    );
    const percent = Math.round((total / maxScore) * 100);

    return (
      <div id="health-checker" className="flex flex-col gap-8">
        {/* Track Switcher */}
        <div className="flex flex-col gap-3 border-b border-hairline pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              {track === "business" ? "Powered by Business Doctor" : "Powered by The Bookwishes Club"}
            </span>
            <p className="text-sm font-bold text-ink">
              {track === "business" ? "Business Systems & Growth Diagnostic" : "Self-Development & Speaking Diagnostic"}
            </p>
          </div>

          <div className="grid grid-cols-2 p-1 rounded-pill bg-surface-sunk border border-hairline w-full sm:w-auto">
            <button
              type="button"
              onClick={() => switchTrack("business")}
              className={`px-4 py-2 rounded-pill text-xs font-bold transition-all duration-200 ${
                track === "business"
                  ? "bg-ink text-canvas shadow-xs"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              For Your Business
            </button>
            <button
              type="button"
              onClick={() => switchTrack("self")}
              className={`px-4 py-2 rounded-pill text-xs font-bold transition-all duration-200 ${
                track === "self"
                  ? "bg-accent text-accent-ink shadow-xs"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              For Yourself
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="eyebrow">Your result</p>
          <p className="text-display-2 leading-display-2 text-balance">
            {total} out of {maxScore}
          </p>
          <Progress value={percent} label="Diagnostic assessment score" />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-display-3 max-w-[22ch] leading-[1.12] text-balance">
            {band.headline}
          </h3>
          <p className="measure text-base leading-relaxed text-ink-muted">{band.body}</p>
        </div>

        {weakest && strongest ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 rounded-card border border-accent bg-surface p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                Look here first
              </p>
              {allAreasTied ? (
                <>
                  <p className="font-display text-lg font-bold text-ink">No clear weak spot</p>
                  <p className="text-sm leading-relaxed text-ink-muted">
                    Every area scored the same, so there is nothing to single out.
                    Usually that means the answers were uniform rather than that
                    the business or performance is uniform.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-display text-lg font-bold text-ink">{weakest.area}</p>
                  <p className="text-sm leading-relaxed text-ink-muted">
                    Your lowest scoring area. This is where targeted coaching or diagnosis would
                    spend its time first.
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
                  : "Working well. Worth protecting rather than spending all your attention on."}
              </p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-4 rounded-panel bg-surface p-4 sm:p-6">
          <p className="text-sm leading-relaxed text-ink-muted">
            This is a self assessment of your own answers. It is not an audit and
            not a benchmark against any industry. A genuine transformation involves
            examining the actual practice, not asking you to grade it.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={band.cta.href}
              className="inline-flex h-12 min-h-[48px] w-full sm:w-auto items-center justify-center rounded-pill bg-accent px-6 text-sm font-bold text-accent-ink transition-[filter,transform] duration-200 ease-brand hover:brightness-110 active:translate-y-px"
            >
              {band.cta.label}
            </Link>
            <button
              type="button"
              onClick={() => switchTrack(track === "business" ? "self" : "business")}
              className="inline-flex h-12 min-h-[48px] w-full sm:w-auto items-center justify-center rounded-pill bg-surface-sunk border border-hairline px-6 text-sm font-bold text-ink transition-colors duration-200 ease-brand hover:border-accent hover:text-accent"
            >
              Assess {track === "business" ? "For Yourself" : "For Your Business"} &rarr;
            </button>
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setIndex(0);
                setDone(false);
              }}
              className="inline-flex h-12 min-h-[48px] w-full sm:w-auto items-center justify-center rounded-pill border border-hairline-strong px-6 text-sm font-bold transition-colors duration-200 ease-brand hover:border-accent hover:text-accent"
            >
              Start again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const isLast = index === questions.length - 1;

  return (
    <div id="health-checker" className="flex flex-col gap-8">
      {/* Track Switcher */}
      <div className="flex flex-col gap-3 border-b border-hairline pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            {track === "business" ? "Powered by Business Doctor" : "Powered by The Bookwishes Club"}
          </span>
          <p className="text-sm font-bold text-ink">
            {track === "business" ? "Business Systems & Growth Diagnostic" : "Self-Development & Speaking Diagnostic"}
          </p>
        </div>

        <div className="grid grid-cols-2 p-1 rounded-pill bg-surface-sunk border border-hairline w-full sm:w-auto">
          <button
            type="button"
            onClick={() => switchTrack("business")}
            className={`px-4 py-2 rounded-pill text-xs font-bold transition-all duration-200 ${
              track === "business"
                ? "bg-ink text-canvas shadow-xs"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            For Your Business
          </button>
          <button
            type="button"
            onClick={() => switchTrack("self")}
            className={`px-4 py-2 rounded-pill text-xs font-bold transition-all duration-200 ${
              track === "self"
                ? "bg-accent text-accent-ink shadow-xs"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            For Yourself
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <p className="eyebrow">
            Question {index + 1} of {questions.length}
          </p>
          <p className="text-sm font-bold text-ink-muted">{question.area}</p>
        </div>
        <Progress
          value={Math.round(((index + (selected ? 1 : 0)) / questions.length) * 100)}
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
                className={`flex cursor-pointer items-start gap-3 rounded-card border p-3.5 sm:p-4 min-h-[48px] transition-colors duration-200 ease-brand ${
                  isSelected
                    ? "border-accent bg-surface"
                    : "border-hairline bg-surface-sunk hover:border-hairline-strong active:bg-surface"
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

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
        {index > 0 ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIndex((i) => i - 1)}
            className="w-full sm:w-auto border-hairline-strong text-ink min-h-[44px]"
          >
            <ArrowLeft aria-hidden="true" className="size-4" weight="bold" />
            Previous
          </Button>
        ) : null}

        <Button
          type="button"
          disabled={selected === undefined}
          onClick={() => (isLast ? setDone(true) : setIndex((i) => i + 1))}
          className="w-full sm:w-auto sm:ml-auto min-h-[44px]"
        >
          {isLast ? "See the result" : "Next question"}
          <ArrowRight aria-hidden="true" className="size-4" weight="bold" />
        </Button>
      </div>

      <p className="text-xs leading-relaxed text-ink-muted">
        {answeredCount} of {questions.length} answered. Answers stay in this
        browser and are not transmitted anywhere.
      </p>
    </div>
  );
}

export { BusinessHealthChecker as TransformationDiagnostic };