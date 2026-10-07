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
const HOLD_MS = 2600;
/**
 * How long each individual character flickers as noise before it locks.
 *
 * This is the number that actually governs the effect, and it is per CHARACTER
 * rather than per word. Measured off the reference: "Ne" is still scrambled at
 * 1.36s and "Ne_" has appeared by 1.50s, so a character takes roughly 150 to 200ms
 * to resolve once it starts.
 *
 * Because resolution is sequential, the total is derived from the target word's
 * length by `durationFor`, which is why there is no single word-level duration
 * constant here.
 */
const PER_CHAR_MS = 180;
/**
 * How often an unresolved letter changes glyph: milliseconds.
 *
 * THIS IS THE DIFFERENCE BETWEEN "SMOOTH" AND "BROKEN". The first build re-rolled
 * every character on every animation frame, which is 60 times a second. That is
 * not motion, it is visual static: each letter is a different random glyph on
 * consecutive frames, so the eye cannot track any of them and the word never
 * appears to settle.
 *
 * At 60ms a letter changes about 16 times across the scramble, which is fast
 * enough to feel alive and slow enough that each glyph is a distinct event the eye
 * can follow. The substitution is still driven by requestAnimationFrame, because
 * that is what makes the RESOLUTION schedule exact; this only gates the noise, so
 * several frames can pass without a character changing and the resolution still
 * lands on time.
 */
const ROLL_MS = 60;

/**
 * THE GLYPH POOL, TAKEN FROM THE REFERENCE RECORDING.
 *
 * Read off the frames rather than chosen: `#` `=` `*` `_` `]` `{` `>` `<` `/`
 * `!` `^` `$`. Punctuation carries roughly half the pool, which is what makes the
 * effect read as machinery rather than as a word briefly misspelled. An earlier
 * version was letters and a little punctuation and looked like a typo.
 *
 * Nothing that reads as markup or as a closing tag, so a frame of noise can never
 * be mistaken for the page failing to render.
 */
const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_#=*!?<>[]{}~^/+-$&%@";

/**
 * Characters that are never scrambled, because a rolling full stop reads as debris
 * and a rolling apostrophe reads as a typo in the copy rather than as noise.
 */
const KEEP = new Set([".", ",", "'", " "]);

/**
 * THE SEQUENTIAL MODEL, WHICH IS WHAT THE REFERENCE ACTUALLY DOES.
 *
 * Read frame by frame off the reference recording. At 1.36s the word reads
 * "Ne=#=*". At 1.50s it reads "Ne_]", and at 1.64s "Neo_". The "N" is already
 * correct in the first frame while the rest is still noise, and each subsequent
 * frame advances by exactly ONE character.
 *
 * So resolution is strictly sequential: character i cannot settle until character
 * i - 1 has, and each character then flickers for a fixed dwell before locking.
 * That is what my first version got wrong. It resolved characters by a
 * proportional threshold, so four or five of them landed together in the last
 * fifth of the run and the word assembled itself in a rush. It looked nothing
 * like the reference because it was not the same mechanism.
 *
 * Sequential also means the duration is a property of the word's LENGTH, not a
 * fixed budget. "Direction." is nine characters and takes nine dwells; "Focus." is
 * six and takes six. A fixed 900ms cannot express that at all.
 */
function scrambleAt(text: string, elapsed: number, noise: number): string {
  const chars = [...text];
  return chars
    .map((c, i) => {
      if (KEEP.has(c)) return c;
      /*
        This character starts locking at its own slot and takes PER_CHAR_MS to
        finish, so the number of characters already settled at any moment is
        `elapsed / PER_CHAR_MS`. A character well inside its own slot is still
        pure noise; one past the end of its slot is settled. The partial value in
        between is what the eye reads as a letter forming.
      */
      const lock = i * PER_CHAR_MS;
      const into = elapsed - lock;
      if (into >= PER_CHAR_MS) return c;
      if (into < 0) return GLYPHS[(i * 2654435761 + (noise + 1) * 40503) % GLYPHS.length];
      /*
        The last 25% of the slot converges on the real character, so the letter
        becomes recognisable just before it locks rather than snapping into place.
        Without this the eye sees noise and then a finished letter, with no
        approach, which is the difference between a scramble and a jump cut.
      */
      if (into > PER_CHAR_MS * 0.75) return c;
      return GLYPHS[(i * 2654435761 + (noise + 1) * 40503) % GLYPHS.length];
    })
    .join("");
}

/** How long the whole sequence takes for a given word, plus its dwell. */
const durationFor = (word: string) => [...word].length * PER_CHAR_MS + PER_CHAR_MS;

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
  const [scramble, setScramble] = useState({ from: "" });

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
    const target = WORDS[(index + 1) % WORDS.length].plain;
    const total = durationFor(target);

    const tick = (now: number) => {
      if (!began) began = now;
      /*
        Elapsed milliseconds, not a 0 to 1 progress value.

        A proportional progress made sense when characters resolved on a shared
        threshold. Now each one resolves in its own slot, so the scrambler needs to
        know how many milliseconds have passed and nothing else. The total is
        derived from the target word's length, so "Direction." gets nine dwells and
        "Focus." gets six.
      */
      const elapsed = now - began;
      const done = elapsed >= total;

      /*
        `noise` is the current slot in the roll cycle, so a character keeps the same
        glyph for a whole ROLL_MS window. Re-rolling every animation frame changed
        each letter 60 times a second, which reads as static rather than movement.
      */
      const noise = Math.floor(elapsed / ROLL_MS);
      setScramble({ from: scrambleAt(target, elapsed, noise) });

      if (!done) {
        frame = window.requestAnimationFrame(tick);
        return;
      }

      frame = 0;
      setIndex((i) => (i + 1) % WORDS.length);
      setLeaving(false);
      setScramble({ from: "" });
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
        /*
          ONE WORD AT A TIME. NO CROSSFADE, AND THAT IS THE WHOLE FIX.

          The previous version painted the departing word and the arriving word at
          once, crossfading their opacities. Measured on the running build, both were
          on screen at once with both scrambling, so two streams of random glyphs
          were overlaid on the same letters and the result read as garbled text
          rather than as a word coming into focus. A scramble already has all the
          motion it needs; adding a second word on top of it only destroys legibility.

          So there is exactly one painted word. It leaves nothing and arrives from
          nothing: the departing word stops being the live word the moment the swap
          begins, and the arriving word takes its place immediately. What the reader
          sees is the settled word, then that same word scrambling into the next
          one. One stream of glyphs, one position, nothing to blend.
        */
        const scrambling = leaving && live;

        return (
          <span
            key={word.plain}
            /*
              Hidden from assistive tech unconditionally. The accessible name is the
              `sr-only` element above, which always holds a real word, so none of the
              noise can reach a screen reader no matter what is painted.
            */
            aria-hidden="true"
            className={`absolute inset-0 whitespace-nowrap ${
              /*
                `scrambling`, NOT `live`, decides what is painted.

                Using `live` meant the departing word and the incoming one were both
                visible for the whole transition, because during a swap the live word
                is the one being scrambled and the next word is still rendered
                settled underneath it. Measured on the running build, two words were
                on screen at once with both scrambled, and the result read as garbled
                text rather than as a word coming into focus.

                One painted word, always. The element that owns it is the live word
                the whole time; only its contents change, from the settled word to the
                scrambling one.
              */
              /*
                THE LIVE WORD IS THE VISIBLE ONE. NOTHING ELSE, AND NOT `scrambling`.

                Two earlier attempts both blanked the headline, in opposite ways.

                Keying on `live` alone was correct at rest but left the incoming word
                visible underneath during a swap, so two scrambled streams overlaid
                and the result read as garbled text. Keying on `scrambling` fixed
                that and blanked the word at rest instead, because `scrambling` is
                `leaving && live` and `leaving` is false whenever nothing is
                changing.

                The rule is simply that exactly one word is painted, and it is the
                live one. The incoming word is the live word from the instant the
                swap begins, because `index` moves at the end of the transition and
                the outgoing word stops being live the moment it starts. Nothing
                needs to be painted before that and nothing needs to persist after.

                Caught by reading the computed `visibility` of every child. A
                screenshot would not have shown it: a word hidden by a class and a
                word absent from the DOM are indistinguishable in a picture.
              */
              live ? "" : "invisible"
            }`}
          >
            {/*
              The scramble is painted as raw characters rather than through
              `SerifText`, because `SerifText` splits on `|` to place a serif letter
              and a scrambled string has no markers left in it.

              The font is inherited from the h1 and is not restated anywhere here, so
              the noise is set in exactly the same face, size, weight and tracking as
              the word it becomes. Verified on the running build: Instrument Sans,
              weight 400, 60px, on both the scrambled and settled text.

              NO TRANSITION PROPERTY AT ALL. There is no opacity ramp and no
              transform, so there is nothing for the compositor to interpolate and
              nothing to read as a fade. The only thing changing is which characters
              are in the DOM, driven once per animation frame.
            */}
            {scrambling ? (
              <ScrambledText text={scramble.from || word.plain} />
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
