"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";

import { ArrowLeft, ArrowRight, Check, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "motion/react";

import { Progress } from "@/components/ui/progress";

/**
 * GROWTH PATH TOOL (formerly Business Health Checker)
 *
 * Split-screen interactive diagnostic assessment covering two distinct tracks:
 * 1. For Your Business (Powered by Business Doctor)
 * 2. For Yourself (Powered by The Bookwishes Club)
 *
 * Each answer scores 1 to 4, total is shown, and the lowest scoring area is
 * identified as the primary focus area.
 */

type Option = { label: string; sublabel: string; score: number };
type Question = {
  id: string;
  area: string;
  stageIndex: number; // 0 to 3 for the 4-stage segmented bar
  prompt: string;
  why: string;
  options: Option[];
};

export type DiagnosticTrack = "business" | "self";

const BUSINESS_STAGES = [
  "1. STRATEGY",
  "2. SYSTEMS",
  "3. REVENUE",
  "4. CULTURE",
] as const;

const SELF_STAGES = [
  "1. SPEAKING",
  "2. MINDSET",
  "3. VISION",
  "4. INFLUENCE",
] as const;

/**
 * Ten questions for business owners and leaders, powered by Business Doctor.
 */
const BUSINESS_QUESTIONS: Question[] = [
  {
    id: "clarity",
    area: "Strategy",
    stageIndex: 0,
    prompt: "If asked what this business is for, would three different people give three different answers?",
    why: "Strategy. A business that cannot be described consistently cannot be steered consistently.",
    options: [
      {
        label: "Aligned & Unified",
        sublabel: "No, we would all say the exact same thing",
        score: 4,
      },
      {
        label: "Mostly Aligned",
        sublabel: "Close, with some argument about near-term priorities",
        score: 3,
      },
      {
        label: "Fragmented Direction",
        sublabel: "Yes, different answers — and it is uncomfortable to admit",
        score: 2,
      },
      {
        label: "No Shared Clarity",
        sublabel: "There is no shared answer or written strategy at all",
        score: 1,
      },
    ],
  },
  {
    id: "decisions",
    area: "Strategy",
    stageIndex: 0,
    prompt: "When a key decision needs making, is it clear who decides?",
    why: "Decision rights. Unclear ownership of a decision is the most common cause of delay.",
    options: [
      {
        label: "Clear & Documented",
        sublabel: "Decision ownership is explicit and written down",
        score: 4,
      },
      {
        label: "Usually Clear",
        sublabel: "Understood in practice, but figured out case by case",
        score: 3,
      },
      {
        label: "Driven by Push",
        sublabel: "It gets made, eventually, by whoever pushes hardest",
        score: 2,
      },
      {
        label: "Stalled by Default",
        sublabel: "Decisions bottleneck at the top or get made by default",
        score: 1,
      },
    ],
  },
  {
    id: "operations",
    area: "Operations",
    stageIndex: 1,
    prompt: "Could a competent new hire do the core work well after a written process and some support?",
    why: "Operations. Work that only one person can do is a single point of failure wearing a job title.",
    options: [
      {
        label: "Fully Systematized",
        sublabel: "Yes, and we have the core playbooks written and tested",
        score: 4,
      },
      {
        label: "Partially Documented",
        sublabel: "Mostly, with tribal-knowledge gaps we paper over",
        score: 3,
      },
      {
        label: "Slow Onboarding",
        sublabel: "It takes months of shadowing longer than it should",
        score: 2,
      },
      {
        label: "Key-Person Dependent",
        sublabel: "No. If that specific person is absent, the work stops",
        score: 1,
      },
    ],
  },
  {
    id: "systems",
    area: "Systems",
    stageIndex: 1,
    prompt: "How much of the business relies on someone remembering to do something?",
    why: "Systems. Memory is not a system, however dependable the person holding it.",
    options: [
      {
        label: "Process-Driven",
        sublabel: "Very little — checklists and workflows trigger the work",
        score: 4,
      },
      {
        label: "Predictable Gaps",
        sublabel: "Some reliance on memory, mostly in known places",
        score: 3,
      },
      {
        label: "Memory-Heavy",
        sublabel: "A fair amount, and we all feel the friction when things slip",
        score: 2,
      },
      {
        label: "Manual & Heroic",
        sublabel: "Almost all of it lives inside people's heads",
        score: 1,
      },
    ],
  },
  {
    id: "sales",
    area: "Sales",
    stageIndex: 2,
    prompt: "Do you know where deals are lost between initial interest and signature?",
    why: "Sales. Pipeline problems are invisible until they are counted.",
    options: [
      {
        label: "Tracked & Actioned",
        sublabel: "Yes, with conversion stages, reasons, and active fixes",
        score: 4,
      },
      {
        label: "Informal Impression",
        sublabel: "Roughly, based on the sales team's gut feel",
        score: 3,
      },
      {
        label: "Totals Only",
        sublabel: "We know the final revenue numbers but not why deals drop",
        score: 2,
      },
      {
        label: "Blind Pipeline",
        sublabel: "No. Deals vanish quietly and we find out too late",
        score: 1,
      },
    ],
  },
  {
    id: "promise",
    area: "Marketing",
    stageIndex: 2,
    prompt: "If a customer described what they bought, would that match what you promised?",
    why: "Marketing. The gap between promise and delivery is where reputation is spent.",
    options: [
      {
        label: "Exact Match",
        sublabel: "Promise and delivery match tightly, and we measure it",
        score: 4,
      },
      {
        label: "Consistent in Most Cases",
        sublabel: "They match for the majority of clients and engagements",
        score: 3,
      },
      {
        label: "Unspoken Gap",
        sublabel: "There is a delivery gap we are careful not to advertise",
        score: 2,
      },
      {
        label: "Visible Friction",
        sublabel: "There is a clear mismatch and customers have noticed",
        score: 1,
      },
    ],
  },
  {
    id: "structure",
    area: "Organizational Structure",
    stageIndex: 3,
    prompt: "Does each person know what they are accountable for, rather than just tasks?",
    why: "Structure. Accountability is the difference between being given tasks and owning outcomes.",
    options: [
      {
        label: "Explicit Outcome Ownership",
        sublabel: "Yes, every role has clear, measurable accountabilities",
        score: 4,
      },
      {
        label: "Broadly Inferred",
        sublabel: "Mostly understood, though inferred from job titles",
        score: 3,
      },
      {
        label: "Shifting by Project",
        sublabel: "Not really — ownership blurs and changes week to week",
        score: 2,
      },
      {
        label: "Shared Blur",
        sublabel: "No. Everyone is responsible for everything, so no one owns it",
        score: 1,
      },
    ],
  },
  {
    id: "communication",
    area: "Communication",
    stageIndex: 3,
    prompt: "How many meetings could be removed this month without losing anything?",
    why: "Communication. Most organizations have a communication load problem, not a willingness problem.",
    options: [
      {
        label: "Lean & High-Signal",
        sublabel: "Very few — every meeting has a clear purpose and decision",
        score: 4,
      },
      {
        label: "Minor Bloat",
        sublabel: "A few status calls could be replaced if we were honest",
        score: 3,
      },
      {
        label: "Meeting Overload",
        sublabel: "A lot of them, honestly — we talk more than we execute",
        score: 2,
      },
      {
        label: "Calendar Is the Plan",
        sublabel: "Most of them. Constant meetings substitute for real systems",
        score: 1,
      },
    ],
  },
  {
    id: "performance",
    area: "Performance",
    stageIndex: 3,
    prompt: "Could you state what good performance looks like in any role, in checkable terms?",
    why: "Performance. Expectations held privately by the person who set them are not expectations.",
    options: [
      {
        label: "Written & Agreed",
        sublabel: "Yes, defined with clear standards agreed with each person",
        score: 4,
      },
      {
        label: "Shared Understanding",
        sublabel: "Roughly defined, and the team would mostly agree",
        score: 3,
      },
      {
        label: "Subjective Judgment",
        sublabel: "Not precisely — it depends on who is judging that week",
        score: 2,
      },
      {
        label: "Matter of Opinion",
        sublabel: "No objective scorecard exists for good performance",
        score: 1,
      },
    ],
  },
  {
    id: "culture",
    area: "Organizational Culture",
    stageIndex: 3,
    prompt: "If you wrote down what this organization actually rewards, would it match its stated values?",
    why: "Culture. The gap between the two documents is the culture. Everything else is branding.",
    options: [
      {
        label: "Values Match Rewards",
        sublabel: "Yes, who gets promoted and praised matches what we preach",
        score: 4,
      },
      {
        label: "Mostly Consistent",
        sublabel: "Broadly aligned, with a few uncomfortable exceptions",
        score: 3,
      },
      {
        label: "Noticeable Drift",
        sublabel: "Not really — we reward firefighting over system building",
        score: 2,
      },
      {
        label: "Stated vs. Actual Opposites",
        sublabel: "What we say we value and what we reward are opposites",
        score: 1,
      },
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
    stageIndex: 0,
    prompt: "When asked to speak in front of a group with little or no notice, how do you respond?",
    why: "Public Speaking. Spontaneous confidence comes from structured thinking frameworks, not memorized speeches.",
    options: [
      {
        label: "Calm & Articulate",
        sublabel: "I structure my thoughts on the spot and deliver with ease",
        score: 4,
      },
      {
        label: "Briefly Nervous, Then Steady",
        sublabel: "A little tension initially, but I find my rhythm quickly",
        score: 3,
      },
      {
        label: "Anxious & Rushed",
        sublabel: "I tend to over-explain, ramble, or hurry just to finish",
        score: 2,
      },
      {
        label: "Frozen or Avoidant",
        sublabel: "I feel overwhelmed and actively avoid speaking up in groups",
        score: 1,
      },
    ],
  },
  {
    id: "articulation_clarity",
    area: "Articulation",
    stageIndex: 0,
    prompt: "Do listeners quickly grasp your core message without needing repeated explanations?",
    why: "Articulation. Clarity of expression directly reflects clarity of thought.",
    options: [
      {
        label: "Sharp & Concise",
        sublabel: "Yes, I communicate directly with structured precision",
        score: 4,
      },
      {
        label: "Clear with Occasional Tangents",
        sublabel: "Mostly, though I sometimes wander before landing the point",
        score: 3,
      },
      {
        label: "Takes Multiple Tries",
        sublabel: "Often takes several explanations to convey what I mean",
        score: 2,
      },
      {
        label: "Frequently Misunderstood",
        sublabel: "People often miss my point or lose track of what I'm saying",
        score: 1,
      },
    ],
  },
  {
    id: "stage_presence",
    area: "Executive Presence",
    stageIndex: 0,
    prompt: "In meetings or high-stakes rooms, how effectively do you command attention?",
    why: "Presence. Authority is communicated through vocal pacing, physical posture, and intentional pauses.",
    options: [
      {
        label: "Commanding & Natural",
        sublabel: "Others listen attentively and lean in when I speak",
        score: 4,
      },
      {
        label: "Strong in Familiar Territory",
        sublabel: "Effective when speaking on topics I know intimately",
        score: 3,
      },
      {
        label: "Easily Talked Over",
        sublabel: "Often interrupted or sidelined by louder voices in the room",
        score: 2,
      },
      {
        label: "Quiet & Held Back",
        sublabel: "I stay silent to avoid scrutiny or unwanted attention",
        score: 1,
      },
    ],
  },
  {
    id: "mindset_resilience",
    area: "Mindset & Resilience",
    stageIndex: 1,
    prompt: "When faced with sharp criticism or unexpected pushback, what is your internal response?",
    why: "Mindset. Emotional regulation dictates whether feedback fuels growth or triggers defensiveness.",
    options: [
      {
        label: "Composed & Objective",
        sublabel: "I separate my personal worth from the critique immediately",
        score: 4,
      },
      {
        label: "Briefly Stung, Quickly Refocused",
        sublabel: "I feel it for a moment, then extract what is actionable",
        score: 3,
      },
      {
        label: "Defensive & Lingering",
        sublabel: "Frustrated in the moment, and the interaction replays for days",
        score: 2,
      },
      {
        label: "Deeply Discouraged",
        sublabel: "I internalize criticism as personal failure and pull back",
        score: 1,
      },
    ],
  },
  {
    id: "reading_learning",
    area: "Learning & Knowledge",
    stageIndex: 1,
    prompt: "How disciplined and consistent is your habit of deep reading and self-development?",
    why: "Knowledge. A structured reading practice is the fastest way to expand mental models and depth.",
    options: [
      {
        label: "Daily Disciplined Habit",
        sublabel: "I read consistently and actively apply new mental models",
        score: 4,
      },
      {
        label: "Regular Reader",
        sublabel: "I read often, though I could apply ideas more systematically",
        score: 3,
      },
      {
        label: "Sporadic Bursts",
        sublabel: "Occasional reading followed by weeks of digital distraction",
        score: 2,
      },
      {
        label: "Rarely Read",
        sublabel: "I struggle to finish books or sustain structured learning",
        score: 1,
      },
    ],
  },
  {
    id: "personal_vision",
    area: "Personal Vision",
    stageIndex: 2,
    prompt: "Can you clearly state your top 3 personal priorities for the next 12 months?",
    why: "Vision. Without clear self-direction, your calendar and energy get consumed by others' priorities.",
    options: [
      {
        label: "Documented & Defended",
        sublabel: "Crystal clear, written down, and reviewed every week",
        score: 4,
      },
      {
        label: "Mental Clarity Only",
        sublabel: "Clear in my head, though not written or strictly protected",
        score: 3,
      },
      {
        label: "Shifting & Reactive",
        sublabel: "Vague and constantly changing with immediate pressures",
        score: 2,
      },
      {
        label: "No Clear Direction",
        sublabel: "Completely reactive to day-to-day demands and urgency",
        score: 1,
      },
    ],
  },
  {
    id: "emotional_composure",
    area: "Stress & Composure",
    stageIndex: 2,
    prompt: "When high pressure or conflict arises, how well do you maintain mental clarity?",
    why: "Composure. High performance requires an anchored nervous system under fire.",
    options: [
      {
        label: "Anchored Under Fire",
        sublabel: "Pressure actually sharpens my focus and decision-making",
        score: 4,
      },
      {
        label: "Mostly Steady",
        sublabel: "Generally composed, with occasional slip-ups at peak stress",
        score: 3,
      },
      {
        label: "Visibly Tense",
        sublabel: "Prone to rushed, emotionally driven reactions under stress",
        score: 2,
      },
      {
        label: "Overwhelmed & Drained",
        sublabel: "High pressure leads to freeze, avoidance, or burnout",
        score: 1,
      },
    ],
  },
  {
    id: "persuasion_influence",
    area: "Storytelling & Influence",
    stageIndex: 3,
    prompt: "How effectively can you inspire or rally others behind an idea using narrative?",
    why: "Influence. People are moved to action by conviction and story, not just bullet points.",
    options: [
      {
        label: "High-Impact Storyteller",
        sublabel: "I use narrative and emotion to create strong alignment",
        score: 4,
      },
      {
        label: "Logical Explainer",
        sublabel: "Strong on facts and data, less practiced with story",
        score: 3,
      },
      {
        label: "Hard to Persuade Skeptics",
        sublabel: "I struggle to build genuine excitement or buy-in",
        score: 2,
      },
      {
        label: "Reliant on Title Alone",
        sublabel: "Unable to influence others without formal authority",
        score: 1,
      },
    ],
  },
  {
    id: "self_belief",
    area: "Confidence & Self-Belief",
    stageIndex: 3,
    prompt: "When stepping into rooms with senior leaders or peers, how secure do you feel?",
    why: "Self-Belief. Unchecked impostor syndrome handicaps your voice before you speak.",
    options: [
      {
        label: "Grounded & Equal",
        sublabel: "I know my value and feel at home in any room",
        score: 4,
      },
      {
        label: "Quickly Settled",
        sublabel: "Brief initial hesitation, then I engage with confidence",
        score: 3,
      },
      {
        label: "Impostor Syndrome",
        sublabel: "I frequently question whether I truly belong at the table",
        score: 2,
      },
      {
        label: "Self-Doubt & Shrinking",
        sublabel: "I minimize my voice and hope not to be called on",
        score: 1,
      },
    ],
  },
  {
    id: "follow_through",
    area: "Discipline & Consistency",
    stageIndex: 3,
    prompt: "How dependable is your follow-through when initial motivation fades?",
    why: "Discipline. Long-term personal authority is built on keeping promises to yourself.",
    options: [
      {
        label: "System-Driven Discipline",
        sublabel: "My habits run on structure and standards, not mood",
        score: 4,
      },
      {
        label: "Generally Reliable",
        sublabel: "Consistent most weeks, with occasional dips when tired",
        score: 3,
      },
      {
        label: "Start-Stop Momentum",
        sublabel: "High excitement at the start, followed by quick drop-off",
        score: 2,
      },
      {
        label: "Struggle to Sustain",
        sublabel: "Rarely keep self-directed commitments past week one",
        score: 1,
      },
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

/**
 * Explicit light-surface variable scope for the right-hand card panel so that
 * it always renders as a crisp white card with dark navy ink, even when placed
 * inside a `.band-dark` section on service pages.
 */
const LIGHT_PANEL_VARS = {
  "--canvas": "#ffffff",
  "--surface": "#f7f9fd",
  "--surface-sunk": "#eef2fa",
  "--ink": "#0b1730",
  "--ink-muted": "#5d6679",
  "--ink-faint": "#8c96ab",
  "--accent": "#3b5fcc",
  "--accent-ink": "#ffffff",
  "--hairline": "rgb(11 23 48 / 0.1)",
  "--hairline-strong": "rgb(11 23 48 / 0.22)",
  backgroundColor: "#ffffff",
  color: "#0b1730",
} as React.CSSProperties;

export function BusinessHealthChecker({
  initialTrack = "business",
}: {
  initialTrack?: DiagnosticTrack;
} = {}) {
  const instanceId = useId();
  const reduce = useReducedMotion();
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
  const stages = track === "business" ? BUSINESS_STAGES : SELF_STAGES;
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
  const currentStage = done ? 3 : (question?.stageIndex ?? 0);

  const switchTrack = (nextTrack: DiagnosticTrack) => {
    if (nextTrack === track) return;
    setTrack(nextTrack);
    setIndex(0);
    setAnswers({});
    setDone(false);
  };

  /* Left dark sidebar shared across both active quiz and results view */
  const leftSidebar = (
    <div className="on-ink flex flex-col justify-between gap-8 p-7 sm:p-9 lg:p-12">
      {/* Track Switcher with sliding spring pill */}
      <div className="flex flex-col gap-3">
        <div
          role="group"
          aria-label="Diagnostic track"
          className="relative inline-grid grid-cols-2 rounded-pill border border-[#f2f5fa]/18 bg-[#14161c] p-1 w-full sm:w-fit"
        >
          {(["business", "self"] as const).map((t) => {
            const isActive = track === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={isActive}
                onClick={() => switchTrack(t)}
                className={`relative z-10 rounded-pill px-4 py-1.5 text-xs font-bold transition-colors duration-200 ease-brand ${
                  isActive
                    ? "text-[#0b1730]"
                    : "text-[#a7b0c2] hover:text-[#f2f5fa]"
                }`}
              >
                {isActive ? (
                  <motion.span
                    layoutId={`${instanceId}-track-pill`}
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-pill bg-[#93a9f5] shadow-xs"
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 450, damping: 34 }
                    }
                  />
                ) : null}
                <span>{t === "business" ? "For Your Business" : "For Yourself"}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Center Hero Copy */}
      <motion.div
        key={track}
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }
        }
        className="my-auto flex flex-col gap-4 py-2 lg:py-6"
      >
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#93a9f5]">
          <Sparkle aria-hidden="true" className="size-3.5 shrink-0" weight="fill" />
          {track === "business" ? "Free Business Quiz" : "Free Self-Mastery Quiz"}
        </p>

        <h3 className="text-3xl sm:text-4xl lg:text-[2.35rem] font-normal leading-[1.14] tracking-[-0.02em] text-[#f2f5fa] text-balance">
          {track === "business" ? (
            <>
              Find your growth match in{" "}
              <span className="text-[#93a9f5]">3 minutes</span>
            </>
          ) : (
            <>
              Find your personal growth edge in{" "}
              <span className="text-[#93a9f5]">3 minutes</span>
            </>
          )}
        </h3>

        <p className="text-sm sm:text-[15px] leading-relaxed text-[#a7b0c2] max-w-[44ch]">
          {track === "business"
            ? "Answer 10 quick questions — we route you to the right Business Doctor focus area: Strategy, Operations, Systems, Sales, Marketing & Culture."
            : "Answer 10 quick questions — we route you to the right Bookwishes Club focus area: Public Speaking, Articulation, Presence, Resilience & Vision."}
        </p>
      </motion.div>

      {/* Bottom 4-Stage Segmented Progress Indicator */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2">
        {stages.map((stageLabel, idx) => {
          const isReached = done || idx <= currentStage;
          const isCurrent = !done && idx === currentStage;
          return (
            <div key={stageLabel} className="flex flex-col gap-2">
              <div className="h-1 w-full overflow-hidden rounded-pill bg-[#f2f5fa]/20">
                <motion.div
                  initial={false}
                  animate={{ scaleX: isReached ? 1 : 0 }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { duration: 0.42, ease: [0.16, 1, 0.3, 1] }
                  }
                  className="h-full w-full origin-left rounded-pill bg-[#93a9f5]"
                />
              </div>
              <span
                className={`text-[11px] font-bold uppercase tracking-[0.06em] transition-colors duration-200 ${
                  isCurrent || done
                    ? "text-[#f2f5fa]"
                    : isReached
                      ? "text-[#f2f5fa]/90"
                      : "text-[#a7b0c2]"
                }`}
              >
                {stageLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (done) {
    const weakest = byArea[0];
    const strongest = byArea[byArea.length - 1];
    const allAreasTied = Boolean(
      weakest && strongest && Math.abs(weakest.average - strongest.average) < 0.001,
    );
    const percent = Math.round((total / maxScore) * 100);

    return (
      <div
        id="health-checker"
        className="grid overflow-hidden rounded-panel border border-hairline shadow-card lg:grid-cols-[44%_56%] lg:min-h-[600px]"
      >
        {leftSidebar}

        <motion.div
          key="quiz-results"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduce ? { duration: 0 } : { duration: 0.36, ease: [0.16, 1, 0.3, 1] }
          }
          style={LIGHT_PANEL_VARS}
          className="flex flex-col justify-between gap-7 p-6 sm:p-9 lg:p-12"
        >
          <div className="flex flex-col gap-3">
            <p className="eyebrow">Your result</p>
            <p className="text-display-2 leading-display-2 text-balance text-[#0b1730]">
              {total} out of {maxScore}
            </p>
            <Progress value={percent} label="Diagnostic assessment score" />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-display-3 max-w-[22ch] leading-[1.12] text-balance text-[#0b1730]">
              {band.headline}
            </h3>
            <p className="measure text-base leading-relaxed text-[#5d6679]">{band.body}</p>
          </div>

          {weakest && strongest ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2 rounded-card border border-[#3b5fcc] bg-[#f7f9fd] p-5 transition-shadow duration-200 hover:shadow-xs">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#3b5fcc]">
                  Look here first
                </p>
                {allAreasTied ? (
                  <>
                    <p className="font-display text-lg font-bold text-[#0b1730]">
                      No clear weak spot
                    </p>
                    <p className="text-sm leading-relaxed text-[#5d6679]">
                      Every area scored the same, so there is nothing to single out.
                      Usually that means the answers were uniform rather than that
                      the business or performance is uniform.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-display text-lg font-bold text-[#0b1730]">
                      {weakest.area}
                    </p>
                    <p className="text-sm leading-relaxed text-[#5d6679]">
                      Your lowest scoring area. This is where targeted coaching or diagnosis would
                      spend its time first.
                    </p>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-2 rounded-card bg-[#eef2fa] p-5 transition-shadow duration-200 hover:shadow-xs">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5d6679]">
                  Strongest area
                </p>
                <p className="font-display text-lg font-bold text-[#0b1730]">
                  {allAreasTied ? "Also no clear leader" : strongest.area}
                </p>
                <p className="text-sm leading-relaxed text-[#5d6679]">
                  {allAreasTied
                    ? "For the same reason, no area stands out as working better than the rest."
                    : "Working well. Worth protecting rather than spending all your attention on."}
                </p>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-4 rounded-card bg-[#f7f9fd] p-4 sm:p-5 border border-[#0b1730]/10">
            <p className="text-xs sm:text-sm leading-relaxed text-[#5d6679]">
              This is a self assessment of your own answers. It is not an audit and
              not a benchmark against any industry. A genuine transformation involves
              examining the actual practice, not asking you to grade it.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={band.cta.href}
                className="inline-flex h-11 min-h-[44px] w-full sm:w-auto items-center justify-center rounded-pill bg-[#3b5fcc] px-6 text-sm font-bold text-[#ffffff] transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:brightness-110 hover:shadow-card active:translate-y-0 active:scale-[0.98]"
              >
                {band.cta.label}
              </Link>
              <button
                type="button"
                onClick={() => switchTrack(track === "business" ? "self" : "business")}
                className="group inline-flex h-11 min-h-[44px] w-full sm:w-auto items-center justify-center gap-1.5 rounded-pill bg-[#eef2fa] border border-[#0b1730]/12 px-5 text-sm font-bold text-[#0b1730] transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:border-[#3b5fcc] hover:text-[#3b5fcc] active:translate-y-0 active:scale-[0.98]"
              >
                <span>Assess {track === "business" ? "For Yourself" : "For Your Business"}</span>
                <span className="transition-transform duration-200 ease-brand group-hover:translate-x-1">&rarr;</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setIndex(0);
                  setDone(false);
                }}
                className="inline-flex h-11 min-h-[44px] w-full sm:w-auto items-center justify-center rounded-pill border border-[#0b1730]/22 px-5 text-sm font-bold text-[#0b1730] transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:border-[#3b5fcc] hover:text-[#3b5fcc] active:translate-y-0 active:scale-[0.98]"
              >
                Start again
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!question) return null;

  const isLast = index === questions.length - 1;

  return (
    <div
      id="health-checker"
      className="grid overflow-hidden rounded-panel border border-hairline shadow-card lg:grid-cols-[44%_56%] lg:min-h-[600px]"
    >
      {leftSidebar}

      {/* Right Column: Clean White Question Panel */}
      <div
        style={LIGHT_PANEL_VARS}
        className="flex flex-col justify-between gap-6 p-6 sm:p-9 lg:p-12"
      >
        <motion.div
          key={`${track}-${question.id}`}
          initial={reduce ? false : { opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={
            reduce ? { duration: 0 } : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
          }
          className="flex flex-col gap-6"
        >
          {/* Question Eyebrow */}
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3b5fcc]">
            Question {index + 1} of {questions.length} &mdash; {question.area}
          </p>

          <fieldset className="flex flex-col gap-6">
            <legend className="flex flex-col gap-2 mb-1">
              <span className="text-2xl sm:text-[1.75rem] font-normal leading-[1.2] tracking-[-0.02em] text-[#0b1730] text-balance">
                {question.prompt}
              </span>
              <span className="text-xs sm:text-sm leading-relaxed text-[#5d6679]">
                {question.why}
              </span>
            </legend>

            {/* Vertical Single-Column Stack of Option Cards */}
            <div className="flex flex-col gap-3">
              {question.options.map((option) => {
                const id = `hc-${question.id}-${option.score}`;
                const isSelected = selected === option.score;
                return (
                  <label
                    key={option.score}
                    htmlFor={id}
                    className={`group flex cursor-pointer items-center justify-between gap-4 rounded-[14px] border px-5 py-3.5 sm:py-4 transition-all duration-200 ease-brand active:scale-[0.99] ${
                      isSelected
                        ? "border-[#3b5fcc] bg-[#eef2fa] shadow-xs -translate-y-0.5"
                        : "border-[#0b1730]/12 bg-[#ffffff] hover:-translate-y-0.5 hover:border-[#3b5fcc]/50 hover:bg-[#f7f9fd] hover:shadow-2xs"
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
                      className="sr-only"
                    />
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[15px] font-bold leading-snug text-[#0b1730] transition-colors duration-200 group-hover:text-[#3b5fcc]">
                        {option.label}
                      </span>
                      <span className="text-xs sm:text-[13px] leading-relaxed text-[#5d6679]">
                        {option.sublabel}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid size-5 shrink-0 place-items-center rounded-full border transition-all duration-200 ease-brand ${
                        isSelected
                          ? "border-[#3b5fcc] bg-[#3b5fcc] text-[#ffffff] scale-105"
                          : "border-[#0b1730]/20 bg-transparent text-transparent group-hover:border-[#3b5fcc]/60"
                      }`}
                    >
                      <Check weight="bold" className="size-3" />
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </motion.div>

        {/* Footer Navigation Bar matching reference: <- BACK on left, count + Next on right */}
        <div className="mt-4 flex items-center justify-between gap-4 pt-3 border-t border-[#0b1730]/8">
          {index > 0 ? (
            <button
              type="button"
              onClick={() => setIndex((i) => i - 1)}
              className="group inline-flex items-center gap-1.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#5d6679] transition-colors duration-200 ease-brand hover:text-[#0b1730]"
            >
              <ArrowLeft
                aria-hidden="true"
                className="size-3.5 transition-transform duration-200 ease-brand group-hover:-translate-x-1"
                weight="bold"
              />
              <span className="sr-only">Previous </span>
              Back
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#5d6679] opacity-40 select-none">
              <ArrowLeft aria-hidden="true" className="size-3.5" weight="bold" />
              Back
            </span>
          )}

          <div className="flex items-center gap-4">
            <span className="tabular-nums text-xs font-bold tracking-wider text-[#5d6679]">
              {index + 1} / {questions.length}
            </span>

            <button
              type="button"
              disabled={selected === undefined}
              onClick={() => (isLast ? setDone(true) : setIndex((i) => i + 1))}
              className="group inline-flex h-10 min-h-[40px] items-center justify-center gap-2 rounded-pill bg-[#0b1730] px-5 text-xs font-bold uppercase tracking-[0.1em] text-[#ffffff] transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:bg-[#3b5fcc] hover:shadow-card active:translate-y-0 active:scale-[0.98] disabled:opacity-35 disabled:pointer-events-none"
            >
              {isLast ? "See the result" : "Next question"}
              <ArrowRight
                aria-hidden="true"
                className="size-3.5 transition-transform duration-200 ease-brand group-hover:translate-x-1"
                weight="bold"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export {
  BusinessHealthChecker as GrowthPathTool,
  BusinessHealthChecker as TransformationDiagnostic,
};
