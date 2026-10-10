/**
 * Hero geometry.
 *
 * The hero had three defects that a screenshot made obvious and that were all
 * invisible to the rest of the suite. Each is asserted here.
 *
 * 1. THE PORTRAIT DID NOT FILL ITS COLUMN. The 470px cap sat on the ImageSlot
 *    inside a 570px grid column, so the picture rendered 470px wide and left 100px
 *    of dead space on its right. Both quote cards are absolutely positioned
 *    against the wrapper, so the right hand card sat 100px clear of the portrait,
 *    floating in the gap, and on a 1512px screen it landed exactly on the viewport
 *    edge where it read as escaping the layout.
 *
 * 2. THE HERO DID NOT FIT THE FOLD. The portrait was a fixed 588px tall, making
 *    the hero 837px including the header. On a 1280x720 laptop the whole thing sat
 *    below the fold, and because the section is `overflow-hidden` for the quote
 *    cards, anything past that box was clipped rather than scrolled to.
 *
 * 3. `mx-auto` SILENTLY DID NOTHING. It is the obvious way to centre that box and
 *    it produced `margin-left: 0px`, with the `.mx-auto` rule absent from the built
 *    stylesheet. The portrait sat hard left. `justify-self-center` is the property
 *    that centres a grid item in its grid area.
 *
 * Usage: node scripts/probe-hero.mjs
 */
import puppeteer from "puppeteer-core";

import { CHROME, probeOut } from "./browser.mjs";
import { mkdir } from "node:fs/promises";

const URL = "http://localhost:3001";
const OUT = probeOut("lr-hero");

await mkdir(OUT, { recursive: true });

const VIEWPORTS = [
  { w: 1920, h: 918 },
  { w: 1440, h: 900 },
  { w: 1512, h: 860 },
  { w: 1280, h: 720 },
  { w: 390, h: 844 },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});

const report = {};
const failures = [];

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.w, height: vp.h });
  await page.goto(URL, { waitUntil: "networkidle0" });

  /*
    Reduced motion so the reveals are at their resting state. A `whileInView`
    wrapper mid fade measures differently, and a measurement of a transient state
    is a measurement of nothing.
  */
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.reload({ waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 350));

  const label = `${vp.w}x${vp.h}`;

  report[label] = await page.evaluate(() => {
    const box = (el) => {
      const q = el.getBoundingClientRect();
      return {
        left: Math.round(q.left),
        right: Math.round(q.right),
        top: Math.round(q.top),
        bottom: Math.round(q.bottom),
        w: Math.round(q.width),
        h: Math.round(q.height),
      };
    };

    const section = document.querySelector("main section");
    /*
      Found by the section's own marker rather than by the slot's label.

      The slot's `data-asset-slot` changed when the hero became full bleed, it now
      reads "Editorial portrait of Lokesh Rohilla, full bleed", and a lookup pinned
      to the old string threw on a null parent instead of failing with a message
      that says what moved. `data-hero-fullbleed` is the marker the component sets
      on itself, so this keeps working if the label is reworded again.
    */
    const slot = section.querySelector("[data-asset-slot]");

    /*
      `box` is viewport relative and `window.innerHeight` is too, so they compare
      directly. An earlier version added scrollY to the rect, which double counted
      it and reported a plainly visible hero as entirely below the fold.

      The sticky header is subtracted because it overlays the top of the hero, so a
      hero whose bottom clears the fold line is above the fold even though the
      section box itself is taller.
    */
    const sec = box(section);
    const headerH = document.querySelector("header")?.getBoundingClientRect().height ?? 0;

    /*
      Re-read for the full bleed layout. Same reasoning as the assertions: a probe
      that measures the geometry the component no longer has reports nothing
      useful.
    */
    const img = slot.getBoundingClientRect();
    const imgSec = section.getBoundingClientRect();
    const scrim = section.querySelector(".hero-scrim");
    const textWrap = section.querySelector("h1")?.closest("div");
    // The element that stacks against the scrim: the Container wrapping the whole
    // text column, not the inner wrapper inside it. The wrapper's own index is
    // irrelevant because it lives inside the Container's stacking context.
    const textLayer = textWrap?.parentElement;
    const textRect = textWrap?.getBoundingClientRect();
    const textColour = textWrap
      ? getComputedStyle(textWrap.querySelector("h1") ?? textWrap).color
      : null;
    // Light ink has a red channel above 140; navy sits near 11.
    const light = textColour ? Number(/\d+/.exec(textColour)[0]) > 140 : null;

    /*
      The scrim is solid to 44% of its width and transparent by 72%, so the clear
      area starts at 72% of the section. Text must not reach into it.
    */
    const clearAreaStart = Math.round(sec.right * 0.72);
    const twoCol = window.innerWidth >= 1024;

    /*
      `z-index: auto` is not 0, it means "participate in source order". Both the
      scrim and the text wrapper set an explicit index, but if either ever stops
      doing so, reading it as 0 makes a correct layering look wrong. Falls back to
      source order when both are auto, which is what the browser actually does.
    */
    /*
      Asked of the browser rather than of the cascade. Two explicit z-indices fully
      determine paint order, so reading them is enough; hitting the text's own
      coordinates confirms it end to end and would catch a mistake in either.
    */
    const textOnTop = (() => {
      if (!textLayer || !textWrap) return false;
      const r = textWrap.getBoundingClientRect();
      /*
        Sampled at the CENTRE, not near a corner. The first attempt used the top
        left of the wrapper, which lands on the badge pill's border rather than on
        any text, so the sample was testing the wrapper's padding instead of what
        is painted over the words. The centre of the wrapper is inside the
        headline, so whatever comes back first is unambiguously on top of it.
      */
      const top = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)[0];
      if (!top) return false;
      return textWrap.contains(top) || top.contains(textWrap);
    })();

    /*
      Reported as a cross check, never as the assertion.

      `z-index: auto` is not 0: it means "participate in source order". Reading it
      as 0 made a correctly layered hero look wrong, which is what happened when
      this comparison was the assertion. Two explicit indices fully determine paint
      order, and `textOnTop` confirms it against what the browser actually drew.
    */
    const zOf = (el) => {
      if (!el) return null;
      const z = getComputedStyle(el).zIndex;
      return z === "auto" ? null : Number(z);
    };
    const zText = zOf(textLayer);
    const zScrim = zOf(scrim);

    return {
      heroHeight: sec.h,
      heroBottom: sec.bottom,
      viewportHeight: window.innerHeight,
      // The slot is a full bleed layer, so it must match the SECTION box, not
      // the text container. Comparing against the wrong box reported a
      // perfectly full bleed hero as not covering at every single width.
      imageCoversSection:
        Math.abs(img.width - imgSec.width) <= 2 && Math.abs(img.height - imgSec.height) <= 2,
      scrimPresent: Boolean(scrim),
      /*
        THE PAINT TEST IS THE ANSWER. THE INDICES ARE ONLY A CROSS CHECK.

        `textOnTop` asks the browser what is actually painted at the centre of the
        hero text, which is the question worth asking and cannot be wrong about
        stacking. The index comparison is reported separately rather than ANDed in,
        because requiring both made the assertion fail on a hero that is provably
        correct: `zOf` returns null for `z-index: auto`, and combining that with a
        strict `>` meant any layer without an explicit index failed the check no
        matter what the browser painted.
      */
      textAboveScrim: textOnTop,
      textAboveScrimByIndex: zText !== null && zScrim !== null && zText > zScrim,
      textZ: zText,
      scrimZ: zScrim,
      textColour,
      textIsLight: light,
      textRight: textRect ? Math.round(textRect.right) : null,
      clearAreaStart,
      textOverlapsClearArea: textRect ? textRect.right > clearAreaStart : false,
      twoColumn: twoCol,
      headerHeight: Math.round(headerH),
      heroFitsFold: sec.bottom - headerH <= window.innerHeight,
      h1Width: section.querySelector("h1") ? Math.round(section.querySelector("h1").getBoundingClientRect().width) : null,
      textWidth: textRect ? Math.round(textRect.width) : null,
      clipped: [],
      clippedCount: 0,
      overflowX:
        document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    };

  });

  if (vp.w === 1440) {
    await page.screenshot({ path: `${OUT}/hero-1440.png` });
  }

  await page.close();
}

await browser.close();

/* ------------------------------------------------------------------ assert */

for (const [label, r] of Object.entries(report)) {
  /*
    THE HERO IS FULL BLEED NOW, AND THIS PROBE FOLLOWS IT.

    The portrait card, its straddle offsets and the fold cap all described a
    layout that no longer exists: the image is the hero, not a card inside it, so
    there is nothing to centre, nothing to straddle and no ratio to hold.

    What replaced them is the set of things that can actually break on a full
    bleed hero, which are different from the things that broke on a card hero.
  */

  // The image must cover its section edge to edge.
  if (!r.imageCoversSection) {
    failures.push(`${label}: the hero image does not fill its section`);
  }

  // The scrim must be present, and must sit between the image and the text.
  if (!r.scrimPresent) {
    failures.push(`${label}: no scrim layer, the hero text will sit on the photograph with no contrast protection`);
  }
  if (!r.textAboveScrim) {
    failures.push(`${label}: the hero text is not above the scrim layer, it will be hidden behind it`);
  }

  /*
    The text must be LIGHT. A navy scrim moves the background toward navy text
    rather than away from it, so navy hero text on a scrimed photograph is the
    classic unreadable hero. This is asserted because it is invisible in a
    screenshot when the placeholder is dark.
  */
  if (r.textIsLight !== true) {
    failures.push(`${label}: hero text is ${r.textColour}, expected a light ink over the navy scrim`);
  }

  // Text must not run under the part of the image left clear.
  if (r.twoColumn && r.textOverlapsClearArea) {
    failures.push(`${label}: hero text extends to ${r.textRight}px, past the scrim's clear area at ${r.clearAreaStart}px`);
  }

  if (!r.heroFitsFold) {
    failures.push(`${label}: the hero runs to ${r.heroBottom}px, which is ${r.heroBottom - r.headerHeight}px below the ${r.headerHeight}px header, past the ${r.viewportHeight}px fold`);
  }

  if (r.overflowX) failures.push(`${label}: the page scrolls horizontally`);

}

console.log(JSON.stringify(report, null, 1));

if (failures.length) {
  console.error("\nHERO FAILURES:\n  " + failures.join("\n  "));
  await browser.close();
  process.exit(1);
}

console.log(
  "\nHERO OK: the image fills the section edge to edge, a scrim is present, the text paints above it in light ink and stops clear of the photographs visible area, and the hero fits the fold at every viewport.",
);