"use client";

import { useEffect, useState } from "react";

import { SerifText } from "@/components/ui/serif-text";

/**
 * THE ROTATING WORD IN THE HERO HEADLINE
 *
 * "Turning Chaos Into ___", where the blank cycles.
 *
 * A TYPEWRITER, NOT A MORPH.
 *
 * This used to crossfade between two words through an SVG turbulence displacement
 * map, at sixty frames a second, writing two custom properties per frame. That has
 * been replaced with characters being typed and deleted, which is the effect the
 * client asked for and which needs none of that machinery.
 *
 * What was actually removed, and it is worth being precise because the old probe
 * measured all of it:
 *
 *   - the `feTurbulence` + `feDisplacementMap` + `feColorMatrix` filter chain, and
 *     the per frame `baseFrequency` and `scale` writes that drove it
 *   - the second painted word, so there is one word on screen at a time instead of
 *     two overlapping
 *   - the 60fps React state update loop, replaced by three chained timeouts
 *
 * THE CYCLE
 *
 *   hold -> delete -> pause -> type -> hold
 *
 * Typing is slower than deleting, which is what makes it read as typing rather
 * than as a symmetrical wipe. The first word is shown complete on mount, so the
 * headline is never briefly empty and never shows a word arriving character by
 * character as the page loads.
 *
 * THE GLOW IS CSS, NOT A TICKER
 *
 * Each character mounts when it is typed, so its glow is a one shot keyframe that
 * decays on its own. There is no interval, no animation frame and no state write
 * while the word sits still holding. The old component had to drive a repaint
 * sixty times a second to fade a filter, which is the entire reason this is
 * cheaper than what it replaces rather than merely different.
 *
 * THE KEYS ARE THE WORD INDEX AND THE CHARACTER INDEX, AND THAT IS THE TRICK
 *
 * React reuses a DOM node when the key survives. Keying by `${wordIndex}-${i}`
 * therefore means that as a word grows, the characters already on screen keep their
 * nodes and do not replay their glow, and only the newly typed one mounts and
 * lights up. When the word changes, every key changes at once and the next word
 * lights up from its first character.
 *
 * Keying by character index alone would reuse the old word's nodes for the new
 * word and the new word would arrive already cold, with no glow at all.
 *
 * THE MARKED STRING AND WHY PREFIXES ARE PRECOMPUTED
 *
 * `SerifText` swaps single letters for a serif italic and marks them with `|` in
 * the source, so "Clarity." is written "Cla|rity." The typewriter has to reveal
 * the word one VISIBLE character at a time, and the markers are not visible
 * characters, so slicing the marked string by index would cut a marker in half or
 * reveal two glyphs at once.
 *
 * `markedPrefixes` walks the string once at module load and returns every prefix
 * counted in visible characters, so `prefixes[n]` is always a string that renders
 * exactly `n` glyphs with any markers correctly attached. The slice then costs
 * nothing at runtime and cannot produce a malformed marker sequence.
 *
 * THE ACCESSIBLE NAME IS A WHOLE WORD AND NEVER A PARTIAL ONE
 *
 * A screen reader must not hear "Turn-ing chaos into Cla" and then wait for the
 * next syllable. So the visible characters are `aria-hidden` and an `sr-only`
 * element carries the current word in full. It follows the word, not the caret, so
 * it changes when the word changes and not while it is being typed.
 *
 * REDUCED MOTION
 *
 * The word is rendered complete and nothing is scheduled at all: no typing, no
 * caret, no glow. That is a static headline rather than a slowed down one, which
 * is the correct resting state for someone who has asked the site to stop moving.
 * `prefers-reduced-data` is honoured too, since this animation is decoration.
 */

const WORDS = [
  { plain: "Clarity.", marked: "Cla|rity." },
  { plain: "Direction.", marked: "Directi|on." },
  { plain: "Focus.", marked: "F|ocus." },
  { plain: "Growth.", marked: "Gr|owth." },
  { plain: "Action.", marked: "Acti|on." },
] as const;

/**
 * Every prefix of a marked word, counted in VISIBLE characters.
 *
 * "Cla|rity." becomes ["C", "Cl", "Cla", "Cla|r", "Cla|ri", "Cla|rit", "Cla|rity",
 * "Cla|rity."] — eight entries for eight visible characters, and every one of them
 * renders cleanly through `SerifText` with no dangling marker.
 *
 * The trailing marker case is the reason this walks the string rather than
 * splitting it: "Cla|r" ends on a serif letter that still needs its marker, while
 * "Cla" must not be given one, because a marker with nothing after it opens a
 * serif span that wraps an empty string.
 */
function markedPrefixes(marked: string): string[] {
  const out: string[] = [];
  let current = "";

  for (const ch of marked) {
    if (ch === "|") {
      current += ch;
      continue;
    }
    current += ch;
    // Pushed once per VISIBLE character, which is what makes the array index the
    // character count. A marker is only ever carried into a prefix that has a
    // glyph following it, so no prefix ends on a dangling marker.
    out.push(current);
  }

  return out;
}

const PREFIXES = WORDS.map((word) => markedPrefixes(word.marked));

/** How long one character takes to appear. */
const TYPE_MS = 110;

/** How long a finished word rests before it is taken back. */
const HOLD_MS = 1700;

/**
 * How long one character takes to disappear.
 *
 * Deliberately half the typing interval. A delete at the same speed as the type
 * reads as a symmetric in and out wipe rather than as backspacing.
 */
const DELETE_MS = 55;

/** The gap between the word emptying and the next one starting. */
const SWAP_PAUSE_MS = 260;

/** How long the caret is given to find the word that just finished typing. */
const SETTLE_MS = 180;

type Phase = "typing" | "holding" | "deleting";

export function RotatingWord() {
  /*
    Mounts with the first word COMPLETE and already holding.

    Starting empty would mean the headline reads "Turning Chaos Into " for a beat
    on every page load, which is the one moment nobody is watching the animation
    and the one moment the headline is supposed to be readable.
  */
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(WORDS[0].plain.length);
  const [phase, setPhase] = useState<Phase>("holding");

  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(prefers-reduced-data: reduce)").matches),
  );

  /*
    Listens rather than reading the query once, because a visitor can change the
    setting while the page is open and the headline should follow them out of the
    animation instead of continuing regardless.
  */
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

  /*
    THE WHOLE MACHINE, AS THREE BRANCHES OF ONE TIMEOUT.

    A single effect that re-arms itself per step, rather than three effects racing
    to set the same state. Every branch returns one `clearTimeout`, so there is
    exactly one pending timer at any moment and unmounting cancels it.

    Reduced motion returns before scheduling anything at all, so the animation is
    not merely paused: no timer is ever created.
  */
  useEffect(() => {
    if (reduced) return;

    let timer: ReturnType<typeof setTimeout>;

    if (phase === "holding") {
      timer = setTimeout(() => setPhase("deleting"), HOLD_MS);
    } else if (phase === "deleting") {
      if (count > 0) {
        timer = setTimeout(() => setCount((c) => c - 1), DELETE_MS);
      } else {
        // Only now is the next word chosen, so `sr-only` holds one whole word for
        // the entire delete rather than switching early and naming a word that is
        // not on screen.
        timer = setTimeout(() => {
          setIndex((i) => (i + 1) % WORDS.length);
          setPhase("typing");
        }, SWAP_PAUSE_MS);
      }
    } else if (count < WORDS[index].plain.length) {
      timer = setTimeout(() => setCount((c) => c + 1), TYPE_MS);
    } else {
      timer = setTimeout(() => setPhase("holding"), SETTLE_MS);
    }

    return () => clearTimeout(timer);
  }, [phase, count, index, reduced]);

  const word = WORDS[index];

  /*
    What is painted. Under reduced motion this is the whole marked word; otherwise
    it is the prefix for the current character count, and `count === 0` indexes
    past the start of the array on purpose, which is how the word empties.
  */
  const shownMarked = reduced ? word.marked : (PREFIXES[index][count - 1] ?? "");

  /*
    Split into per character spans, so each can carry its own one shot glow.

    The serif marker is consumed here rather than handed to `SerifText`, because
    `SerifText` renders one span for the whole word and a per character treatment
    needs a span per character. A marked letter gets both classes on one element:
    `serif-letter` for the typeface, `char-glow` for the animation. They do not
    collide, one sets font properties and the other sets `animation`.

    The key is the word index and the character index together. See the note at
    the top of the file: that pairing is what makes the existing characters keep
    their spent glow while the new one lights up.
  */
  const characters: React.ReactNode[] = [];
  let serif = false;
  let visibleIndex = 0;

  for (const ch of shownMarked) {
    if (ch === "|") {
      serif = true;
      continue;
    }
    const isSerif = serif;
    serif = false;
    const key = `${index}-${visibleIndex}`;
    visibleIndex += 1;
    characters.push(
      <span key={key} className={isSerif ? "char-glow serif-letter" : "char-glow"}>
        {ch}
      </span>,
    );
  }

  return (
    /*
      `inline-block` so it is already a containing block for the absolutely
      positioned stage, and so the sizing layer below can establish a width.

      NO `relative` ON THIS ELEMENT, for the same reason it was absent before:
      `absolute` already makes it a containing block, and adding `relative` makes
      it read to axe as covering its own in-flow children.
    */
    <span className="text-accent relative inline-block align-baseline" data-rotating-word="">
      {/*
        THE SIZING LAYER, AND IT IS NOT OPTIONAL.

        The painted stage is out of flow, so without this the headline would
        reflow on every single keystroke: the h1 would change width, the text
        around it would move, and the page would visibly twitch for as long as the
        word was typing.

        It holds all five SETTLED words stacked in one grid cell, so the track is
        sized by the widest of them, "Direction.", and never changes. The painted
        stage sits on top and is free to be any length from nothing to all of it.

        Stable by construction: nothing in here depends on the animation.
      */}
      <span aria-hidden="true" className="invisible inline-grid items-baseline">
        {WORDS.map((w) => (
          <span key={w.plain} className="col-start-1 row-start-1 whitespace-nowrap">
            {w.plain}
          </span>
        ))}
      </span>

      {/*
        THE ACCESSIBLE NAME, AND IT IS NOT THE PAINTED TEXT.

        The painted characters are mid word most of the time, so deriving the name
        from them would produce "Cla" for several hundred milliseconds at a time.
        This element always holds one complete word and follows `index`, not
        `count`, so a screen reader hears "Turning Chaos Into Clarity." in full.

        `sr-only` is the project's existing visually hidden utility, already used
        by the cart controls for the same reason and already excluded by
        `audit-visibility`.
      */}
      <span className="sr-only">{word.plain}</span>

      {/*
        THE PAINTED STAGE.

        `absolute inset-0` over the sizing layer, so it inherits the width that was
        reserved for it and the characters start at its left edge. The caret hangs
        off the end of whatever has been typed, which is why it is inside this
        element and not a sibling of it.

        `aria-hidden` because the name above is the real one.
      */}
      <span
        aria-hidden="true"
        className="absolute inset-0 whitespace-nowrap"
        data-type-stage=""
      >
        {/*
          Reduced motion renders the whole marked word through `SerifText`, exactly
          as this component did before it became a typewriter: one span for the
          serif letter, none of the per character spans, and no `char-glow` class
          anywhere.

          Splitting a static word into one span per glyph would leave a pile of
          elements whose only job was to animate, doing nothing, on every page load
          for every visitor who has asked the site to stop moving.

          The caret is not rendered either. A blinking insertion point promises
          typing that is not happening, which is the same reasoning that removes the
          marquee's Pause button rather than merely hiding it.
        */}
        {reduced ? <SerifText text={word.marked} /> : characters}

        {/*
          The caret, and it hangs off the end of whatever has been typed so far,
          which is why it lives inside this absolutely positioned stage rather than
          beside it.
        */}
        {reduced ? null : <span className="type-caret" data-type-caret="" />}
      </span>
    </span>
  );
}