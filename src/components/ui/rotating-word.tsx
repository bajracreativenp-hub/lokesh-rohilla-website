"use client";

import { useEffect, useRef, useState } from "react";

import { SerifText } from "@/components/ui/serif-text";

/**
 * THE ROTATING CLOSING WORD, AS A MORPH.
 *
 * "Turning Chaos Into" is completely static. Only the final word changes, and it
 * changes by morphing: both words are on screen at once, displaced apart by animated
 * noise and pulled back together, so the letters of one word flow into the letters
 * of the next rather than one being erased and the other written.
 *
 * THE MECHANISM IS AN SVG FILTER CHAIN, NOT AN OPACITY FADE
 *
 * Four primitives, in this order:
 *
 *   feTurbulence         generates the noise field the displacement samples
 *   feDisplacementMap    shifts each pixel by that noise, which is the warp
 *   feGaussianBlur       softens the warped edges so they can merge
 *   feColorMatrix        pushes alpha hard toward opaque, which turns the soft blur
 *                        into a hard edge and merges nearby letters into one mass
 *
 * That last step is the one that makes it a morph rather than a dissolve.
 * `0 0 0 14 -5` leaves RGB untouched and remaps alpha to `14a - 5`, so anything
 * below alpha 0.357 disappears entirely and anything above 0.429 is fully solid. Two
 * words fading through each other therefore do not read as two sets of letters at
 * half strength, they read as two sets of letters whose touching parts fuse into a
 * single blob, which then resolves as one word. That is the whole effect, and it
 * only exists because both words are painted simultaneously.
 *
 * THE THRESHOLD AND THE BLUR WERE MEASURED AGAINST EACH OTHER
 *
 * Both numbers erode the glyph, and both were originally set to values that looked
 * reasonable and visibly destroyed the settled word: a tighter cut survives a wider
 * blur but merges less well. The pair that holds up is derived in
 * `scripts/probe-morph.mjs`, which counts the accent pixels the settled word keeps
 * with the filter applied. See the comment on the colour matrix for the sweep.
 *
 * WHICH IS WHY "ONE WORD AT A TIME" IS INVERTED HERE
 *
 * The previous scramble painted exactly one word and the reason is recorded at
 * length in git: two scrambling glyph streams overlaid on the same letters read as
 * garbled text. That reasoning was about two streams of NOISE, and it does not
 * transfer. A morph needs both words present, because the merge is the effect. Two
 * words plus a threshold is a morph; one word at a time is a cut.
 *
 * THE NOISE AND THE DISPLACEMENT ARE ANIMATED, THE FILTERS ARE NOT
 *
 * `baseFrequency` and the colour matrix are static. Only `scale` on the
 * displacement map moves, and it follows a sine bell: zero at both ends, peak at the
 * middle of the crossfade. That is why the word looks like it comes apart and then
 * settles, instead of swimming continuously.
 *
 * `scale` is written straight to the DOM node on every frame rather than through
 * React state, because going through a re-render at 60Hz to move one attribute on
 * one SVG element would rebuild this subtree every frame. The two opacities are
 * custom properties for the same reason. React owns which word is live; the frame
 * loop owns the values within the transition.
 *
 * THE FILTER REGION IS SET EXPLICITLY, AND IT IS NOT OPTIONAL
 *
 * A filter's default region is the object bounding box plus ten percent. The
 * displacement pushes glyphs a long way outside that box, and any part pushed
 * outside the region is simply not rendered. The default therefore cuts the letters
 * off in the middle of the morph, which looks like the animation is being clipped
 * rather than like the letters are moving. `x/y/width/height` below open it up far
 * enough to hold the whole displacement at full scale.
 *
 * THE FILTER IS NOT APPLIED UNDER REDUCED MOTION
 *
 * `prefers-reduced-motion` renders one settled word, permanently, with no filter,
 * no crossfade and no timer. A thresholded single word has nothing to merge with,
 * so the filter would be pure cost. Both `prefers-reduced-motion` and
 * `prefers-reduced-data` are read on first render and then subscribed to, so a
 * reader who turns either on mid-session stops the motion immediately.
 *
 * THE FILTER ID IS A CONSTANT, NOT useId()
 *
 * The component renders exactly once, in the hero, and there is no route or layout
 * that renders it twice. React 19's `useId` produces a value containing guillemets,
 * and a fragment identifier containing them is not safe to hand to `url()` in a
 * `filter` property. A plain constant sidesteps the question entirely, and the
 * single-instance fact is what makes it safe.
 */

const WORDS = [
  { plain: "Clarity.", marked: "Cla|rity." },
  { plain: "Direction.", marked: "Directi|on." },
  { plain: "Focus.", marked: "F|ocus." },
  { plain: "Growth.", marked: "Gr|owth." },
  { plain: "Action.", marked: "Acti|on." },
] as const;

/** How long a word sits still before it starts morphing into the next. */
const HOLD_MS = 2600;

/**
 * How long one word takes to become the next.
 *
 * Long enough for the displacement to peak and come back, which is what makes it
 * read as letters travelling rather than as a fast dissolve. A morph under about
 * 1.2s never reaches a peak worth looking at, because the eye resolves the blob
 * after it is already thinning out again.
 */
const MORPH_MS = 1500;

/**
 * The displacement at the midpoint, in user units.
 *
 * Turbulence output sits roughly in the range -0.5 to 0.5, so this is a peak shift
 * of about 65px either side. The display type is 68px, so that is roughly one glyph
 * of travel: enough for the letters to visibly leave their positions and land in
 * new ones, not so much that the word stops being legible as a word on the way.
 *
 * This is also what the filter region below has to be sized against.
 */
const PEAK_SCALE = 130;

/** Eased out: fast at first, settling. Used for the arriving word. */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Eased in: slow at first, then dropping away. Used for the departing word. */
const easeInCubic = (t: number) => t * t * t;

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

export function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [morphing, setMorphing] = useState(false);
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(prefers-reduced-data: reduce)").matches),
  );

  /**
   * The displacement map, reached directly so `scale` can be written per frame.
   *
   * The stage, for the two opacity custom properties. Same reason.
   */
  const displacement = useRef<SVGFEDisplacementMapElement | null>(null);
  const stage = useRef<HTMLSpanElement | null>(null);

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

    /*
      The word that is arriving is derived, not stored. `index` is the word on
      screen, so the one arriving is always the next one, and there is no second
      piece of state that could fall out of step with the first.
    */
    const nextIndex = (index + 1) % WORDS.length;

    const holdTimer = window.setTimeout(() => setMorphing(true), HOLD_MS);

    let frame = 0;
    let began = 0;

    /*
      The two opacity curves, which are not mirrors of each other.

      The departing word is gone by 45% of the transition. The arriving word does
      not begin until 20%, because the threshold makes anything under about 0.39
      alpha invisible anyway, and starting it earlier would spend the first fifth of
      the morph fading in something nobody can see.

      That gap is also what produces the blob. Both words are partly solid at the
      same time, in the same place, and the colour matrix fuses their touching
      edges. Overlap the curves and the effect is a dissolve; overlap them into the
      middle third and it is a morph.
    */
    const outAlpha = (p: number) => 1 - easeInCubic(clamp01(p / 0.45));
    const inAlpha = (p: number) => easeOutCubic(clamp01((p - 0.2) / 0.55));

    const tick = (now: number) => {
      if (!began) began = now;

      /*
        Elapsed is recomputed from a single origin every frame rather than
        accumulated, so a dropped frame skips forward instead of making the whole
        morph run slow and finish late.
      */
      const elapsed = now - began;
      const p = clamp01(elapsed / MORPH_MS);

      if (stage.current) {
        stage.current.style.setProperty("--out-alpha", outAlpha(p).toFixed(4));
        stage.current.style.setProperty("--in-alpha", inAlpha(p).toFixed(4));
      }

      /*
        A sine bell, so the displacement is zero at both ends and largest in the
        middle. A linear ramp would leave the word visibly warped for a frame after
        it had already settled, which reads as a wobble rather than as motion.
      */
      if (displacement.current) {
        displacement.current.setAttribute(
          "scale",
          (Math.sin(p * Math.PI) * PEAK_SCALE).toFixed(2),
        );
      }

      if (p < 1) {
        frame = window.requestAnimationFrame(tick);
        return;
      }

      frame = 0;
      /*
        Reset before the state change so the next hold begins from a known state
        rather than from whatever the last frame happened to write. Leaving the
        scale at zero matters most: a non-zero scale with a settled word warps the
        one word that is on screen and nothing else.
      */
      if (displacement.current) displacement.current.setAttribute("scale", "0");
      setIndex(nextIndex);
      setMorphing(false);
    };

    const morphTimer = window.setTimeout(() => {
      frame = window.requestAnimationFrame(tick);
    }, HOLD_MS);

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(morphTimer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [index, reduced]);

  /*
    Under reduced motion only the settled word exists. The other four were only ever
    there to size the grid track, and with nothing changing there is no width to
    hold steady.

    Dropping them also removes a measurable problem: five words in one grid cell
    means each one is overlapped by its own siblings in the box model, and axe
    declines to guess a background through that.
  */
  const showMorph = !reduced;
  const words = reduced ? WORDS.slice(0, 1) : WORDS;

  return (
    /*
      `grid` with the sizing layer in `1 / 1`. The widest word sets the track width
      and the painted stage is taken out of flow on top of it, so the headline holds
      still while the letters inside it move.

      NO `relative` ON THIS ELEMENT. The stage is positioned with `absolute`, which
      needs a containing block, and this span is `inline-block`, so it is already
      one. Adding `relative` would be harmless for layout and would make the element
      read to axe as covering its own in-flow children.
    */
    <span className="text-accent relative inline-block align-baseline" data-rotating-word="">
      {/*
        THE SIZING LAYER, AND IT IS NOT OPTIONAL.

        The two painted words are out of flow, and the widest of them, "Direction.",
        is not the widest at every width: the serif letter renders at 0.94em, the
        display scale is fluid, and the two words have different letter counts. So
        the track is sized by a hidden copy of all five SETTLED words, which never
        changes. Content that is stable by construction, while the stage above it
        moves freely.
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

        During a morph both words are on screen at once, so deriving the accessible
        name from what is painted would produce "Clarity.Direction." at every frame,
        which is a phrase nobody wrote and changes far too fast to follow.

        So the name lives in its own element, which always holds exactly one real
        word and is never filtered, never displaced and never crossfaded. It follows
        `index`, so it changes at the moment the morph resolves. A screen reader
        reads one complete word at all times.

        `sr-only` is the project's existing visually hidden utility, already used by
        the cart controls for the same reason, and already excluded by
        `audit-visibility`.
      */}
      <span className="sr-only">{WORDS[index].plain}</span>

      {/*
        THE STAGE. BOTH WORDS, BOTH FILTERED, FILTER ON THE PARENT.

        The filter is on this element and not on the two words because the merge has
        to happen after they are composited. Filtering each word separately and then
        stacking them gives two clean sets of letters with no shared blur, and the
        threshold cannot fuse edges that were never in the same buffer.

        Opacity comes from custom properties rather than inline `style`, because the
        frame loop writes them sixty times a second and two properties on one element
        is cheaper than sixty re-renders of this subtree.
      */}
      <span
        ref={stage}
        aria-hidden="true"
        className="absolute inset-0 whitespace-nowrap"
        data-morph-stage=""
        style={
          showMorph
            ? {
                filter: "url(#morph-threshold) blur(0.35px)",
                /*
                  Both defaults matter. The outgoing word has to be fully opaque and
                  the incoming fully transparent at rest, or the headline shows two
                  words at the moment the page loads.
                */
                "--out-alpha": morphing ? undefined : "1",
                "--in-alpha": morphing ? undefined : "0",
              } as React.CSSProperties
            : undefined
        }
      >
        {words.map((word, i) => {
          const isCurrent = i === index;
          const isNext = i === (index + 1) % words.length;

          /*
            Visibility is keyed on the morph running, not on which word is current.
            At rest exactly one word is visible. While morphing, both are, because
            that overlap is the effect. `aria-hidden` is unconditional either way:
            the accessible name comes from the element above.
          */
          const visible = reduced
            ? isCurrent
            : morphing
              ? isCurrent || isNext
              : isCurrent;

          return (
            <span
              key={word.plain}
              aria-hidden="true"
              className="absolute inset-0 whitespace-nowrap"
              style={
                showMorph
                  ? {
                      opacity: isCurrent ? "var(--out-alpha)" : "var(--in-alpha)",
                      visibility: visible ? "visible" : "hidden",
                    } as React.CSSProperties
                  : { visibility: visible ? "visible" : "hidden" }
              }
            >
              {/*
                `SerifText`, not per-character spans. The old scramble needed one
                span per character because each character resolved independently in
                time and had to be legible per character on screen. Nothing here
                resolves per character: the whole word is displaced as one glyph run
                and the threshold treats it as one mass, so splitting it would only
                give the displacement more edges to tear.

                The font is inherited from the h1 and restated nowhere, so the noise
                is set in the same face, size, weight and tracking as the word it
                becomes.

                NO TRANSITION PROPERTY. Opacity here is driven per frame, and a
                transition on top of that would lag a frame behind the value being
                animated and fight it.
              */}
              <SerifText text={word.marked} />
            </span>
          );
        })}
      </span>

      {/*
        THE FILTER DEFINITION.

        Inline in the document rather than in a file, because `filter: url(#id)`
        only resolves against filters in the same document, and an SVG loaded from
        a separate resource does not expose its defs that way.

        `width/height 0` with `overflow: hidden` rather than `display: none`. A
        hidden filter host is resolved in some engines and not others, and the
        symptom when it fails is a silently unfiltered headline that still animates,
        which is the hardest version of this bug to see.
      */}
      <svg
        aria-hidden="true"
        focusable="false"
        width="0"
        height="0"
        className="pointer-events-none absolute overflow-hidden"
      >
        <defs>
          <filter
            id="morph-threshold"
            /*
              The region. The default is the object box plus ten percent, and the
              displacement moves glyphs by up to PEAK_SCALE, so the default crops
              the letters in half at the middle of the morph. These values hold the
              full travel with room to spare, and `primitiveUnits` stays
              `userSpaceOnUse` so `stdDeviation` and `scale` are in pixels rather
              than fractions of the box.
            */
            x="-25%"
            y="-40%"
            width="150%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            {/*
              `fractalNoise` with two octaves: the second octave is what gives the
              warp its edges some structure instead of a smooth wobble. The seed is
              fixed so the field is identical on every frame and every load, so the
              morph is the same motion each time rather than random noise the viewer
              has to re-read.
            */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.006 0.009"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            {/*
              `scale` is animated from JavaScript. It starts at 0 so the first paint
              is an unwarped word rather than a burst of noise before anything has
              had a chance to load.
            */}
            <feDisplacementMap
              ref={displacement}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
              result="warped"
            />
            {/*
              Blurred BEFORE the threshold, not after. This is the order that makes
              the two words merge: blurring fuses their alpha fields into one soft
              region, and the colour matrix then hardens that single region into one
              shape. Blurring afterwards would only soften edges that the matrix has
              already made sharp.
            */}
            <feGaussianBlur in="warped" stdDeviation="1.5" result="soft" />
            {/*
              The threshold. RGB rows are the identity so the accent colour passes
              through untouched. The alpha row is `14a - 5`: nothing below alpha 0.357
              survives, everything above 0.429 is solid, and the narrow band between
              them is the only soft edge in the result.

              That band width is the entire morph. Two words crossfading through it
              without touching would look like a dissolve. Two words overlapping in
              it have their edges meet, their blurs add, and they leave as one blob.

              14 AND -5 ARE MEASURED, NOT CHOSEN, AND 1.5 IS THE BLUR THAT GOES WITH
              THEM. The threshold can only erode a glyph or inflate it, and on display
              type both are plainly visible. The original pair, `stdDeviation` 4 with
              `18 - 7`, deleted the middle of every stroke: a roughly 3px stroke blurs
              to a peak alpha near 0.29, the 0.39 cut removes it, and the settled word
              rendered as fragments.

              Swept with `verify:morph`, which erodes the unfiltered mask by one pixel
              and asks what fraction of those stroke CORES survive the filter. Area
              alone is not the metric, because a wider blur inflates area while it
              erodes the same pixels, and the two cancel:

                stdDev 3   area 1.076   core survival 0.902
                stdDev 2.5 area 1.144   core survival 0.961
                stdDev 2   area 1.168   core survival 0.979
                stdDev 1.5 area 1.167   core survival 0.993
                stdDev 1   area 1.149   core survival 1.000

              1.5 is where the trade stops paying. Below it the settled word is
              indistinguishable from unfiltered, which is what a resting headline
              should be, and above it the erosion is visible in the letterforms on
              screen. It still fuses two overlapping words mid transition, because
              during the morph the two words' alphas ADD before the threshold is
              applied, so what the threshold sees there is far denser than any single
              word ever is. That is why the blur can be this small and the morph can
              still work.
            */}
            <feColorMatrix
              in="soft"
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 14 -5
              "
            />
          </filter>
        </defs>
      </svg>
    </span>
  );
}