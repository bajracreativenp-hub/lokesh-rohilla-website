/**
 * PROBES THE HERO'S ROTATING WORD.
 * ===========================================================================
 *
 * THE FILE IS STILL NAMED probe-morph.mjs AND THE SCRIPT IS STILL verify:morph.
 *
 * That is deliberate, to keep `npm run verify:morph` and anything else that calls
 * it working, but the name no longer describes the effect. The word is typed and
 * deleted now, not morphed. The old probe measured the SVG turbulence
 * displacement map this replaced: how much of each stroke's interior survived the
 * filter at rest, and how far the filter inflated the glyph area. None of that is
 * measurable when there is no filter, and none of it is worth measuring, because a
 * typewriter has no threshold to eat a stroke and no area to inflate.
 *
 * So this measures the things that can go wrong in a typewriter instead. All of
 * them are invisible in a screenshot, which is the point: a word that skips three
 * characters at a time, or a headline that reflows on every keystroke, or a screen
 * reader hearing "Cla", all look like a working animation in a still frame.
 *
 * WHAT IS ASSERTED, AND WHY EACH ONE
 *
 *   the word grows ONE CHARACTER AT A TIME
 *     The defining property. Sampling catches the intermediate strings, so a
 *     regression that types a whole word in one frame fails here even though the
 *     word still ends up spelled correctly.
 *
 *   every painted string is a PREFIX of a real word
 *     Catches a malformed serif marker. `SerifText` swaps letters using `|` in the
 *     source string, and if the prefix slicing ever cut a marker in half the
 *     painted text would carry a stray pipe or lose a letter.
 *
 *   the reserved width NEVER CHANGES
 *     The painted stage is out of flow over a hidden sizing layer. If that layer
 *     stopped doing its job the h1 would change width on every keystroke and the
 *     whole headline would twitch for as long as the word was typing.
 *
 *   the caret EXISTS
 *     It is the only thing signalling that this is a typewriter rather than text
 *     appearing.
 *
 *   the accessible name is ALWAYS a WHOLE WORD
 *     It follows the word rather than the caret. A partial word reaching a screen
 *     reader is the one failure here that is invisible on screen and fatal to
 *     read aloud.
 *
 *   reduced motion renders STATIC text, no caret, no per character spans
 *     Not "slower". The static path renders the whole word through `SerifText`
 *     exactly as the component did before it became a typewriter, so none of the
 *     per glyph machinery should exist at all when motion is off.
 *
 * Sampling happens inside the page on a timer and the array is returned once. A
 * round trip per sample would sample Chrome's message passing rather than the
 * animation, and the intermediate states it exists to catch are exactly the ones
 * a round trip would step over.
 */
import { mkdir } from "node:fs/promises";

import puppeteer from "puppeteer-core";

import { CHROME, probeOut } from "./browser.mjs";

const URL = process.env.PROBE_URL ?? "http://localhost:3001";
const OUT = probeOut("lr-type");

/*
  The word list is restated here on purpose. It is the contract: a painted string
  has to be a prefix of one of THESE, and the accessible name has to be exactly
  one of them. Reading the list out of the page instead would make the probe
  agree with whatever the component currently does, which is the failure mode of
  a self describing test.

  Every entry ends in a full stop, so a name missing one is a partial word.
*/
const WORDS = ["Clarity.", "Direction.", "Focus.", "Growth.", "Action."];

/** How long to watch the animation run, in ms. Long enough for a full cycle. */
const WATCH_MS = 9000;

/** Gap between samples, in ms. Under the 110ms typing interval on purpose. */
const SAMPLE_MS = 45;

/** Shorter watch for the reduced motion pass, which must not change at all. */
const REDUCED_WATCH_MS = 2500;

/** How many distinct growing states must be seen before it counts as typing. */
const MIN_TYPED_STATES = 5;

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

/**
 * Samples the word from inside the page.
 *
 * `width` is read from the `inline-block` wrapper rather than from the painted
 * stage: the stage is `absolute inset-0`, so its box is the reserved box by
 * definition and would report a constant even if the sizing layer behind it had
 * collapsed. Reading the wrapper is what actually detects a lost reservation.
 */
const watch = () =>
  page.evaluate(
    async (ms, step) => {
      const stage = document.querySelector("[data-type-stage]");
      const holder = document.querySelector("[data-rotating-word]");
      if (!stage || !holder) return null;

      const nameEl = holder.querySelector(".sr-only");
      const samples = [];
      const t0 = performance.now();

      while (performance.now() - t0 < ms) {
        samples.push({
          text: stage.textContent ?? "",
          width: Math.round(holder.getBoundingClientRect().width),
          name: nameEl ? (nameEl.textContent ?? "") : null,
          caret: Boolean(stage.querySelector("[data-type-caret]")),
          glowSpans: stage.querySelectorAll(".char-glow").length,
        });
        await new Promise((r) => setTimeout(r, step));
      }

      return samples;
    },
    WATCH_MS,
    SAMPLE_MS,
  );

const failures = [];

await page.goto(URL, { waitUntil: "networkidle0" });
const samples = await watch();

if (!samples || samples.length === 0) {
  failures.push(
    "the typewriter stage is not on the page, so nothing could be measured; the hero may not have rendered",
  );
}

const report = { motion: null, reduced: null };

if (samples && samples.length) {
  await page.screenshot({ path: `${OUT}/word-1440.png` });

  const widths = samples.map((s) => s.width);
  const minWidth = Math.min(...widths);
  const maxWidth = Math.max(...widths);

  const texts = samples.map((s) => s.text);
  // Consecutive duplicates removed, so the list is the sequence of states the word
  // actually passed through rather than each state repeated a dozen times.
  const distinct = texts.filter((t, i) => i === 0 || t !== texts[i - 1]);

  const isPrefixOfAWord = (t) => WORDS.some((w) => w.startsWith(t));
  const strayText = distinct.filter((t) => t.length > 0 && !isPrefixOfAWord(t));

  /*
    The longest run of states where each is exactly one character longer than the
    one before it.

    Scanned rather than assumed, because the cycle is hold, delete, pause, type:
    the sample window contains three separate descending runs and one ascending
    one, and only the ascending run is evidence of typing. Requiring a minimum run
    length is what separates a real typewriter from text that merely appeared.
  */
  let bestRun = 0;
  let run = 1;
  for (let i = 1; i < distinct.length; i++) {
    if (distinct[i].length === distinct[i - 1].length + 1) {
      run += 1;
      if (run > bestRun) bestRun = run;
    } else {
      run = 1;
    }
  }

  const names = [...new Set(samples.map((s) => s.name))];
  const badNames = names.filter((n) => n !== null && !WORDS.includes(n));
  const sawCaret = samples.some((s) => s.caret);
  const sawGlow = samples.some((s) => s.glowSpans > 0);

  report.motion = {
    samples: samples.length,
    distinctStates: distinct.length,
    longestAscendingRun: bestRun,
    longestWordSeen: Math.max(...distinct.map((t) => t.length)),
    widthMin: minWidth,
    widthMax: maxWidth,
    sawCaret,
    sawGlow,
    namesSeen: names,
  };

  if (maxWidth - minWidth > 1) {
    failures.push(
      `the reserved width moved from ${minWidth}px to ${maxWidth}px while the word was typing, so the headline reflows on every keystroke`,
    );
  }

  if (bestRun < MIN_TYPED_STATES) {
    failures.push(
      `the longest run of one character at a time was ${bestRun} states, expected at least ${MIN_TYPED_STATES}; the word is appearing in chunks rather than being typed`,
    );
  }

  if (strayText.length) {
    failures.push(
      `painted text that is not a prefix of any word: ${JSON.stringify(strayText.slice(0, 4))}; the serif markers are being sliced wrongly`,
    );
  }

  if (!sawCaret) {
    failures.push("no caret was ever rendered, so this does not read as a typewriter");
  }

  if (!sawGlow) {
    failures.push("no per character spans were ever rendered, so newly typed characters cannot glow");
  }

  if (badNames.length) {
    failures.push(
      `the accessible name was not always a whole word: ${JSON.stringify(badNames.slice(0, 4))}`,
    );
  }
}

/* ------------------------------------------------- reduced motion is static */

await page.emulateMediaFeatures([
  { name: "prefers-reduced-motion", value: "reduce" },
]);
await page.reload({ waitUntil: "networkidle0" });

const reducedSamples = await page.evaluate(
  async (ms, step) => {
    const stage = document.querySelector("[data-type-stage]");
    const holder = document.querySelector("[data-rotating-word]");
    if (!stage || !holder) return null;

    const nameEl = holder.querySelector(".sr-only");
    const samples = [];
    const t0 = performance.now();

    while (performance.now() - t0 < ms) {
      samples.push({
        text: stage.textContent ?? "",
        width: Math.round(holder.getBoundingClientRect().width),
        name: nameEl ? (nameEl.textContent ?? "") : null,
        caret: Boolean(stage.querySelector("[data-type-caret]")),
        glowSpans: stage.querySelectorAll(".char-glow").length,
      });
      await new Promise((r) => setTimeout(r, step));
    }

    return samples;
  },
  REDUCED_WATCH_MS,
  SAMPLE_MS,
);

if (!reducedSamples || reducedSamples.length === 0) {
  failures.push("the typewriter stage disappeared under reduced motion");
} else {
  const texts = [...new Set(reducedSamples.map((s) => s.text))];
  const names = [...new Set(reducedSamples.map((s) => s.name))];
  const sawCaret = reducedSamples.some((s) => s.caret);
  const sawGlow = reducedSamples.some((s) => s.glowSpans > 0);

  report.reduced = {
    samples: reducedSamples.length,
    distinctTexts: texts,
    namesSeen: names,
    sawCaret,
    sawGlow,
  };

  if (texts.length !== 1) {
    failures.push(
      `under reduced motion the word changed between ${JSON.stringify(texts)}; it must be static`,
    );
  }

  if (texts.length === 1 && !WORDS.includes(texts[0])) {
    failures.push(
      `under reduced motion the word is "${texts[0]}", which is not a whole word`,
    );
  }

  if (sawCaret) {
    failures.push(
      "a caret is rendered under reduced motion, which promises typing that is not happening",
    );
  }

  if (sawGlow) {
    failures.push(
      "per character glow spans exist under reduced motion; a static word should render through SerifText with none of them",
    );
  }

  if (names.length !== 1) {
    failures.push(
      `the accessible name changed under reduced motion: ${JSON.stringify(names)}`,
    );
  }
}

await browser.close();

console.log(JSON.stringify(report, null, 1));

if (failures.length) {
  console.error("\nWORD FAILURES:\n  " + failures.join("\n  "));
  process.exit(1);
}

console.log(
  "\nWORD OK: the word types one character at a time, every painted state is a real prefix, the reserved width never moves, the caret is lit, the accessible name is always a whole word, and reduced motion renders it static with no caret and no per character spans.",
);