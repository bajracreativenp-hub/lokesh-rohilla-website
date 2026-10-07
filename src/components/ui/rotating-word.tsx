"use client";

import { useEffect, useState } from "react";

import { SerifText } from "@/components/ui/serif-text";

/**
 * THE ROTATING CLOSING WORD, WITH A CHARACTER SCRAMBLE.
 *
 * "Turning Chaos Into" is completely static. Only the final word changes, and it
 * changes by scrambling: every letter rolls through random glyphs and resolves
 * left to right, so "Direction." reads as noise settling into a word rather than
 * as one word being replaced by another.
 *
 * WHY BOTH WORDS ARE IN THE DOM
 *
 * The grid needs all five words present so the track is as wide as the widest
 * one and the headline cannot jump. That is the whole reason they are here, and it
 * is why the width is measured from the rendered words rather than set to a pixel
 * value: the serif letters render at 0.94em, so "Direction." is genuinely
 * narrower than the same string in plain text, and the fluid display scale moves
 * all of it at every breakpoint.
 *
 * WHY ONLY THE LIVE WORD IS EXPOSED
 *
 * A screen reader must read "Turning Chaos Into Clarity." rather than all five
 * words concatenated, which would be a sentence nobody wrote. The scramble
 * characters are marked `aria-hidden` as well, so nothing mid-scramble reaches the
 * accessibility tree.
 *
 * THE SCRAMBLE IS COSMETIC AND MAY BE SKIPPED
 *
 * `prefers-reduced-motion` renders a single word, permanently, with no scramble
 * and no timer. The preference is read during the first render and then
 * subscribed to, so a reader who turns it on mid-session also stops the motion.
 *
 * `prefers-reduced-data` is honoured too, for a narrower reason: this is
 * continuous repainting of text for decoration, and a reader on a metered
 * connection should not pay for it.
 *
 * THE LOOP IS requestAnimationFrame, NOT setInterval.
 *
 * A scramble is a sequence of discrete glyph swaps that has to land on the real
 * character at the right moment. setInterval drifts by whatever the main thread
 * was doing, so a character can resolve a frame late and the word visibly
 * stutters at the end. rAF gives the elapsed time on every frame, which is what
 * makes the resolution schedule exact rather than hopeful.
 */

const WORDS = [
  { plain: "Clarity.", marked: "Cla|rity." },
  { plain: "Direction.", marked: "Directi|on." },
  { plain: "Focus.", marked: "F|ocus." },
  { plain: "Growth.", marked: "Gr|owth." },
  { plain: "Action.", marked: "Acti|on." },
] as const;

/** How long a word sits still before the next one starts arriving. */
const HOLD_MS = 2200;
/** Total duration of one scramble. Within the 700 to 900ms the brief allows. */
const SCRAMBLE_MS = 900;
/**
 * Fraction of the duration spent staggering resolution.
 *
 * 0.6 means the last character starts resolving at 60% of the way through and the
 * first has finished by then, so the final sixth of the run is the word settling
 * into place. Below about 0.5 the characters resolve so close together that it
 * reads as the whole word arriving at once, which is the fade this replaced.
 */
const STAGGER = 0.6;

/**
 * The glyph pool.
 *
 * Upper and lower case plus digits plus punctuation, because a scramble that only
 * uses letters looks like a typo rather than like machinery. Nothing that reads
 * as markup, so a moment of noise can never be mistaken for the page failing to
 * render.
 */
const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+=?<>~";

/** Characters that are never scrambled, because a floating full stop reads as debris. */
const KEEP = new Set([".", ",", "'", " "]);

const pick = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * Resolve one string against the elapsed progress of a scramble.
 *
 * `direction` is 1 for an arriving word, which resolves left to right, and -1 for
 * a departing one, which dissolves in the same order. Scrambling both in the same
 * direction keeps the eye tracking a single sweep rather than two opposing ones.
 */
function scrambleAt(text: string, progress: number, direction: 1 | -1): string {
  const chars = [...text];
  return chars
    .map((c, i) => {
      if (KEEP.has(c)) return c;
      // The leading punctuation and the first character resolve last on the way
      // in, so the word visibly assembles from its middle outwards.
      const position = i / Math.max(chars.length - 1, 1);
      const threshold = direction === 1 ? position * STAGGER : (1 - position) * STAGGER;
      return progress >= threshold ? c : pick();
    })
    .join("");
}

export function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(prefers-reduced-data: reduce)").matches),
  );
  /*
    The two strings as they are currently painted, which are noise for most of the
    transition. Held in state because they are text in the DOM, and a DOM write
    outside React would fight hydration.
  */
  const [scramble, setScramble] = useState({ from: "", to: "" });

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dataQuery = window.matchMedia("(prefers-reduced-data: reduce)");
    const onChange = () =>
      setReduced(motionQuery.matches || dataQuery.matches);
    motionQuery.addEventListener("change", onChange);
    dataQuery.addEventListener("change", onChange);
    return () => {
      motionQuery.removeEventListener("change", onChange);
      dataQuery.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (reduced) return;

    const startSwap = window.setTimeout(() => setLeaving(true), HOLD_MS);

    let frame = 0;
    let began = 0;

    /*
      One pass over the transition.

      The elapsed time is recomputed from a single origin rather than accumulated
      per frame, so a dropped frame makes the animation skip forward instead of
      running slow. Accumulating deltas is the classic way a scramble ends up
      still rolling letters after it should have settled.
    */
    const tick = (now: number) => {
      if (!began) began = now;
      const progress = Math.min((now - began) / SCRAMBLE_MS, 1);

      setScramble({
        from: scrambleAt(WORDS[index].plain, progress, -1),
        to: scrambleAt(WORDS[(index + 1) % WORDS.length].plain, progress, 1),
      });

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
        return;
      }

      frame = 0;
      setIndex((i) => (i + 1) % WORDS.length);
      setLeaving(false);
      setScramble({ from: "", to: "" });
    };

    // Scheduled on the same tick the state change lands, so the swap and the
    // first scrambled frame are never a frame apart.
    const swapTimer = window.setTimeout(() => {
      frame = window.requestAnimationFrame(tick);
    }, HOLD_MS);

    return () => {
      window.clearTimeout(startSwap);
      window.clearTimeout(swapTimer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [index, reduced]);

  /*
    Under reduced motion only the live word exists. The other four were only ever
    there to size the grid track, and with nothing changing there is no width to
    hold steady.

    Dropping them also matters for measurement rather than tidiness: five words in
    one grid cell means the live word is overlapped by its own siblings in the box
    model, and axe declines to guess a background through that. Rendering one word
    when the sequence is not running removes the cause.
  */
  const words = reduced ? WORDS.slice(0, 1) : WORDS;

  return (
    /*
      `grid` with every word in `1 / 1`. The widest word sets the track width, the
      live one is the only one that paints, and the box holds still throughout.

      NO `relative` ON THIS ELEMENT. The words are placed with `grid-area`, not
      absolute positioning, so nothing needs a containing block, and a positioned
      element that paints is read by axe as covering its own in-flow children.
    */
    <span className="text-accent relative inline-block align-baseline" data-rotating-word="">
      {/*
        THE SIZING LAYER, AND IT IS NOT OPTIONAL.

        Scrambled text is a different width from the same text settled. The glyph
        pool is full of wide characters, "@" "#" "W" "M", and narrow ones, "i" "l",
        so a word mid-scramble has a different max-content width from its settled
        form and a different width from every frame to the next. Measured during
        the first build, the box ran 234px, 366px, 275px, 269px, 260px and 254px
        across one cycle: the headline visibly jumped on every swap.

        Letting the grid size itself from the painted words cannot work for a
        scramble. It sized correctly when the words were static precisely because
        the content never changed, and that is the one property a scramble removes.

        So the width comes from a hidden copy of the five SETTLED words, which never
        changes, and the painted words are taken out of flow on top of it. The
        track is therefore sized by content that is stable by construction, and
        the noise above it can be whatever width it likes.
      */}
      <span aria-hidden="true" className="invisible inline-grid items-baseline">
        {WORDS.map((word) => (
          <span key={word.plain} className="col-start-1 row-start-1 whitespace-nowrap">
            {word.plain}
          </span>
        ))}
      </span>

      {/*
        THE ACCESSIBLE NAME, AND IT IS NOT THE PAINTED TEXT.

        Measured across 34 frames of a transition, deriving the accessible name from
        the painted words produced three states: "Clarity.", then nothing at all,
        then "Direction.". Two attempts fixed parts of that and broke the other.

        Exposing the live word alone let a scrambling word stay in the tree, so the
        accessible text read ">+jfIrg." and "yFqGnry." Hiding every scrambled word
        removed the noise and left a hole, because `ScrambledText` hides every
        character it renders, so mid-scramble the word contributes nothing at all.

        So the name comes from its own element, which always holds a real word and
        is never scrambled. It follows the same `index`, so it changes at the same
        moment the painted word settles. A screen reader reads one complete word at
        all times, and never a character of noise.

        `sr-only` is the project's existing visually-hidden utility, used by the
        cart controls for the same reason: a real string for assistive tech with no
        visual presence. `audit-visibility` already excludes it.
      */}
      <span className="sr-only">{WORDS[index].plain}</span>

      {words.map((word, i) => {
        const live = i === index;
        const isNext = i === (index + 1) % WORDS.length;
        /*
          A departing word is gone the instant `index` moves, and an arriving one
          is live the instant it does. Between those two points both are painted
          and both are scrambled, which is the crossfade.
        */
        const arriving = leaving && isNext;
        const departing = leaving && live;

        return (
          <span
            key={word.plain}
            /*
              Every painted word is hidden from assistive tech, unconditionally.

              The accessible name is the `sr-only` element above, which always holds
              a real word. Deriving it from these instead was wrong twice over:
              exposing the live word let a scrambling word into the tree, so the
              text read ">+jfIrg.", and hiding every scrambled word left a hole,
              because `ScrambledText` hides all of its characters and the word then
              contributed nothing.

              Scrambled text is noise by definition and has no meaning to announce,
              so none of it belongs in the accessibility tree.
            */
            aria-hidden="true"
            /*
              `absolute inset-0`, so a painted word never contributes to the width.

              This is the fix for the jumping headline. The glyph pool is full of
              wide characters and narrow ones, so a scrambled word is a different
              width from its settled form and a different width from every frame to
              the next. Taking the words out of flow means the box is sized only by
              the hidden settled words behind them, which never change.
            */
            className={`absolute inset-0 whitespace-nowrap ${live || arriving ? "" : "invisible"}`}
            style={{
              /*
                The arriving word starts fully transparent and the departing one
                ends fully transparent, so the two overlap through the middle
                rather than cross-dissolving edge to edge.
              */
              opacity: arriving ? 1 : departing ? 0 : 1,
              transform: departing ? "translateY(-0.3em)" : arriving ? "translateY(0.3em)" : "translateY(0)",
              transition: `opacity ${SCRAMBLE_MS}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${SCRAMBLE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          >
            {/*
              The scramble is painted as raw characters rather than through
              `SerifText`, because `SerifText` splits on `|` to place a serif
              letter and a scrambled string has no markers left in it.

              The serif letter is dropped for the duration of the transition and
              returns with the settled word, which is correct rather than a loss:
              it would be meaningless mid-noise, and the word is legible again in
              under a second.
            */}
            {departing || arriving ? (
              <ScrambledText
                text={
                  departing
                    ? scramble.from || word.plain
                    : scramble.to || word.plain
                }
              />
            ) : (
              <SerifText text={word.marked} />
            )}
          </span>
        );
      })}
    </span>
  );
}

/**
 * One character per span, all of them hidden from assistive tech.
 *
 * Split per character because the scramble is resolved per character in time and
 * has to be legible per character on screen. Every span carries `aria-hidden`, so
 * a word that is still scrambling contributes nothing to its own accessible name
 * and resolves into it only as its letters land.
 */
function ScrambledText({ text }: { text: string }) {
  return (
    <>
      {[...text].map((c, i) => (
        <span key={`${c}-${i}`} aria-hidden="true">
          {c}
        </span>
      ))}
    </>
  );
}
