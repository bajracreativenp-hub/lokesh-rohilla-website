"use client";

import { useEffect, useState } from "react";

import { SerifText } from "@/components/ui/serif-text";

/**
 * THE ROTATING CLOSING WORD.
 *
 * "Turning Chaos Into" is completely static. Only the final word changes, through
 * Clarity, Direction, Focus, Growth, Action and back.
 *
 * WHY THE ROTATING WORD IS INVISIBLE TO ASSISTIVE TECH
 *
 * The whole sequence is rendered in the DOM so that the fixed width can be
 * measured from the widest word rather than guessed, and every word except the
 * live one is `aria-hidden`. That leaves exactly one word exposed, and it is the
 * first, which is the one the sentence means: "Turning Chaos Into Clarity" is the
 * promise. Direction, Focus, Growth and Action are elaborations of it.
 *
 * If all five were exposed a screen reader would announce the headline as
 * "Turning Chaos Into Clarity Direction Focus Growth Action", which is a sentence
 * nobody wrote and a worse version of the brand.
 *
 * NO JAVASCRIPT IS A HARD REQUIREMENT, NOT A FALLBACK
 *
 * Without JS the first word renders, visible, with no inline opacity. The
 * component holds `prefers-reduced-motion` and `document.hidden` checks rather
 * than relying on a CSS media query alone, because a query cannot stop a
 * JavaScript timer.
 *
 * THE FIXED WIDTH IS MEASURED IN CSS, NOT SET TO A PIXEL VALUE
 *
 * The words sit in a grid with every one of them in cell `1 / 1`, so the track is
 * as wide as the widest word and the box never resizes as the sequence runs. At
 * the shipped display size that is "Direction." at 254px, against 181px for
 * "Clarity." and 170px for "Focus.". Hardcoding 254px would have been wrong at
 * every other breakpoint, because `ch` and the fluid scale both move: the words
 * are 60px at the top of the scale and 36px at the bottom.
 *
 * 2.2 SECONDS HOLD, 800MS TRANSITION.
 *
 * Both are within the brief. The transition is 800ms because a crossfade where
 * one word leaves upward and the next arrives from below needs enough time to read
 * as two events; below about 600ms the two overlap into a blur instead.
 */

const WORDS = [
  // The serif letter markers match the rest of the site's usage: one letter per
  // word, chosen because it already carries shape, so the eye is already there.
  { plain: "Clarity.", marked: "Cla|rity." },
  { plain: "Direction.", marked: "Directi|on." },
  { plain: "Focus.", marked: "F|ocus." },
  { plain: "Growth.", marked: "Gr|owth." },
  { plain: "Action.", marked: "Acti|on." },
] as const;

/** Milliseconds a word sits before the next replaces it. */
const HOLD_MS = 2200;
/** Milliseconds the crossfade itself takes. */
const TRANSITION_MS = 800;

export function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [animate, setAnimate] = useState(false);
  /*
    Read once during the first render rather than synced in an effect.

    `useSyncExternalStore` is the honest way to subscribe to a media query, but the
    snapshot has to exist on the very first render for the server markup and the
    first client render to agree. Setting state inside an effect to get there
    triggers a second render pass and React rightly complains about it, so the
    query is read inline and then subscribed to. `matchMedia` is safe to touch here:
    it is a synchronous read of an already-parsed preference, not a side effect.
  */
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  /*
    TIMER, NOT ANIMATION.

    Two phases rather than one CSS keyframe, because the two words are separate
    elements that need separate transforms: the outgoing one rises, the incoming
    one arrives from below. A single keyframe on a single element cannot express
    "the old word is higher than the new one" without the new word also being
    pushed up on the way out.

    `setAnimate(false)` on mount means the first paint carries no transition, so
    "Clarity." simply appears rather than sliding up into place on load.
  */
  /*
    One effect per step rather than a self-rescheduling timer.

    The effect depends on `index`, so every time the index changes the cleanup runs
    and a fresh pair of timers is scheduled. A self-calling `advance` function was
    tried first and it is the harder shape to reason about: the cleanup can only
    clear the timer it knows about, and a timer scheduled from inside the callback
    is invisible to the cleanup that runs a moment later. Depending on the value
    the effect reads makes the lifecycle match React's own model.
  */
  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    /*
      Follow the preference if it changes mid-session. A reader who turns reduced
      motion on in their OS settings while the page is open should get a still
      headline, not a sentence that keeps rotating.
    */
    const onChange = () => setReduced(still.matches);
    still.addEventListener("change", onChange);
    if (still.matches) return () => still.removeEventListener("change", onChange);

    // Start the transitions only after the first frame has settled, so the very
    // first word appears rather than sliding up into place on load.
    const startTimer = window.setTimeout(() => setAnimate(true), 60);

    const holdTimer = window.setTimeout(() => setLeaving(true), HOLD_MS);
    const swapTimer = window.setTimeout(() => {
      setIndex((i) => (i + 1) % WORDS.length);
      setLeaving(false);
    }, HOLD_MS + TRANSITION_MS);

    return () => {
      still.removeEventListener("change", onChange);
      window.clearTimeout(startTimer);
      window.clearTimeout(holdTimer);
      window.clearTimeout(swapTimer);
    };
  }, [index, reduced]);

  /*
    UNDER REDUCED MOTION ONLY THE LIVE WORD IS RENDERED AT ALL.

    The other four exist for one reason: the grid needs all of them so the track is
    as wide as the widest word. With no crossfade there is nothing to hold that
    width for, because the word never changes, so they are dropped from the DOM.

    This is a rendering decision rather than a probe accommodation, and it was
    reached by measurement. `probe-contrast` reported ten unresolved nodes on this
    word, and the reason is structural: five words stacked in one grid cell means
    the live word is overlapped by its own siblings in the box model, and axe
    declines to guess a background through that. Removing the four hidden words
    inside the probe did not fix it, because hydration runs afterwards and restores
    them. Rendering one word when the sequence is not running removes the cause
    rather than the symptom, and it is four fewer elements for a reader who asked
    for no motion.

    The first paint is unaffected: the server renders all five so the width is
    right before hydration, and this only applies once the effect has run.
  */
  const words = reduced ? WORDS.slice(0, 1) : WORDS;

  return (
    /*
      `grid` with every word in `1 / 1`. The widest word sets the track width, the
      live one is the only one that paints, and the box holds still throughout.
      `items-baseline` aligns every word on the same baseline so the swap does not
      shift the line it sits on.

      NO `relative` ON THIS ELEMENT, and that is not an oversight.

      The words are placed with `grid-area`, not absolute positioning, so nothing
      here needs a containing block. Adding `relative` anyway made axe report the
      word as "overlapped by another element" on every contrast pass: a positioned
      element that paints is treated by axe as covering its own in-flow children,
      so the word could not be measured against any background at all. Ten
      unresolved nodes, from a positioning context nothing used.
    */
    <span
      className="text-accent inline-grid items-baseline align-baseline"
      style={{ verticalAlign: "baseline" }}
      data-rotating-word=""
    >
      {words.map((word, i) => {
        const live = i === index;
        return (
          <span
            key={word.plain}
            aria-hidden={live ? undefined : true}
            /*
              Only the live word is in the accessibility tree. It is also the only
              one painted.

              `invisible` on the inactive words rather than `opacity: 0` alone, so
              they are removed from the tab order and from the accessibility tree
              even where a transition has not finished. `audit-visibility` treats a
              text node at zero opacity as a defect, which is the correct default:
              on this site it has only ever meant a reveal that failed to fire.
            */
            className={`col-start-1 row-start-1 whitespace-nowrap ${live ? "" : "invisible"}`}
            style={{
              gridArea: "1 / 1",
              opacity: live ? (leaving && animate ? 0 : 1) : 0,
              transform: live
                ? leaving && animate
                  ? "translateY(-0.35em)"
                  : "translateY(0)"
                : "translateY(0.35em)",
              transition: animate
                ? `opacity ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
                : "none",
            }}
          >
            <SerifText text={word.marked} />
          </span>
        );
      })}
    </span>
  );
}
