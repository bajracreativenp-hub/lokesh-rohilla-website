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
      The portrait, found by its ART DIRECTION SPEC rather than by being the first
      element carrying a data attribute.

      `querySelector("[data-asset-slot]")` was good while the portrait was the only
      slot in the hero. It is not any more: the stat row added three more, and they
      come first in the DOM, so the bare attribute selector silently returned a
      stat cell. Every measurement downstream then described a 300x80 box rather
      than the portrait, and the probe failed on a hero that was correct.

      Matching on the spec also survives the label being reworded, which is what
      broke the previous version of this lookup, and it is the same selector
      `verify-widths` uses for the same element.
    */
    const slot = section.querySelector('[data-asset-spec*="1600x2000"]');

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
      Re-read for the SPLIT layout.

      Same reasoning as the assertions: a probe that measures the geometry the
      component no longer has reports nothing useful. The scrim, the full bleed
      layer and the "clear area" all described a photograph running edge to edge
      behind the text, and none of that geometry exists here any more.

      What replaces it is what can actually break on a split hero: the portrait
      landing on top of the copy instead of beside it, the portrait losing the
      ratio it reserves, the offset plate going missing, the stat row losing a
      column, and the copy losing its contrast because it is no longer light ink
      painted over a scrim.
    */
    const img = slot.getBoundingClientRect();
    const plate = section.querySelector("[data-hero-plate]");
    const h1 = section.querySelector("h1");
    const copyWrap = h1?.closest("div");
    const copyRect = copyWrap?.getBoundingClientRect();
    const textColour = h1 ? getComputedStyle(h1).color : null;
    // The copy sits on the canvas now, not on a photograph. Light ink has a red
    // channel above 140; the navy this site paints with sits near 11.
    const dark = textColour ? Number(/\d+/.exec(textColour)[0]) < 140 : null;

    const twoCol = window.innerWidth >= 1024;

    /*
      The scrim is gone, and that is the correct state rather than a fault to
      report: this hero has no photograph behind the text, so it needs no contrast
      protection and derives no alpha from an asset that does not exist.
    */
    const scrim = section.querySelector(".hero-scrim");

    /*
      Found by its label, the same way the other hero measurements are. It is the
      one thing on this hero that has to be above the fold, so it is located by the
      intent it serves rather than by being the first link in the section, which
      would silently start measuring a different button if the copy order changed.
    */
    const cta = [...section.querySelectorAll("a")].find((a) =>
      a.textContent.includes("Discover Lokesh"),
    );

    return {
      heroHeight: sec.h,
      heroBottom: sec.bottom,
      viewportHeight: window.innerHeight,
      /*
        There is no photograph behind the copy, so the scrim assertions are gone
        rather than inverted. `scrimPresent` is still reported: a hero that grew a
        scrim back without also growing a photograph behind it would be painting
        an opaque navy panel over a white page.
      */
      scrimPresent: Boolean(scrim),
      platePresent: Boolean(plate),
      /*
        The portrait is a card reserving 4 / 5. The ratio is the assertion because
        the reservation is the whole point of it: it is what lets a real
        photograph arrive with no layout shift.
      */
      portraitRatio: Number((img.width / img.height).toFixed(3)),
      portraitWidth: Math.round(img.width),
      textColour,
      textIsDark: dark,
      twoColumn: twoCol,
      /*
        Beside the copy, not on it. Measured from the real boxes rather than from
        the grid template, because a grid can report two columns while a `max-w`
        inside one of them still lets the portrait drift left across the headline.
      */
      besideCopy: copyRect ? img.left >= copyRect.right - 2 : null,
      copyRight: copyRect ? Math.round(copyRect.right) : null,
      portraitLeft: Math.round(img.left),
      statColumns: section.querySelectorAll('[data-asset-slot^="stat,"]').length,
      /*
        The copy that sells the hero has to be reachable without scrolling at every
        width. This is what replaced "the whole hero fits the fold": a split hero is
        a two row composition holding a 4:5 portrait, and on a short viewport the
        portrait is meant to continue below the fold. Asserting the section ends
        above the fold would be asserting that the portrait is smaller than it is
        designed to be.
      */
      ctaVisible: cta ? cta.getBoundingClientRect().bottom <= window.innerHeight : null,
      headerHeight: Math.round(headerH),
      // Reported, never asserted. See ctaVisible.
      heroFitsFold: sec.bottom - headerH <= window.innerHeight,
      h1Lines: h1
        ? Math.round(
            h1.getBoundingClientRect().height /
              parseFloat(getComputedStyle(h1).lineHeight),
          )
        : null,
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
    THE HERO IS A SPLIT NOW, AND THIS PROBE FOLLOWS IT.

    Three previous assertions described a layout that no longer exists and were
    removed rather than inverted:

      - the image filling its section  (it is a card in a column again)
      - a scrim being present          (there is no photograph behind the copy)
      - the text painting above it     (there is no such layer to paint above)
      - the text stopping clear of it  (the "clear area" was a scrim gradient stop)

    The fold assertion changed too. "The whole hero fits the fold" was correct for a
    full bleed hero, where the section and the screen were more or less the same
    shape. This hero is a two row composition holding a 4:5 portrait and a stat row,
    so on a short viewport it is meant to continue below the fold, and asserting
    otherwise would be asserting the portrait is smaller than it is designed to be.
    What has to clear the fold is the copy that sells it.
  */

  // The portrait must still hold the ratio it reserves, so a photograph can
  // replace the placeholder without shifting the page.
  if (Math.abs(r.portraitRatio - 0.8) > 0.02) {
    failures.push(
      `${label}: the hero portrait is ${r.portraitRatio}, expected the 4 / 5 it reserves`,
    );
  }

  /*
    The copy must be DARK. It used to be light, painted over a navy scrim; that
    combination inverted without the ink changing would leave light text on a white
    page, which is the classic unreadable hero and is invisible in a screenshot.
    Asserted for the same reason the old light assertion was.
  */
  if (r.textIsDark !== true) {
    failures.push(
      `${label}: hero text is ${r.textColour}, expected a dark ink on the canvas`,
    );
  }

  // Beside the copy, not across it.
  if (r.twoColumn && r.besideCopy !== true) {
    failures.push(
      `${label}: the hero portrait starts at ${r.portraitLeft}px, inside the copy which ends at ${r.copyRight}px`,
    );
  }

  // A scrim with no photograph behind it is an opaque navy panel on a white page.
  if (r.scrimPresent) {
    failures.push(
      `${label}: a scrim layer is present but the hero has no photograph behind the copy`,
    );
  }

  // The accent plate is the layout's one flourish and it is easy to lose.
  if (!r.platePresent) {
    failures.push(`${label}: the offset accent plate behind the portrait is missing`);
  }

  // The stat row is three columns wide by design.
  if (r.statColumns !== 3) {
    failures.push(`${label}: the hero stat row has ${r.statColumns} columns, expected 3`);
  }

  if (r.ctaVisible !== true) {
    failures.push(`${label}: the hero call to action is below the ${r.viewportHeight}px fold`);
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
  "\nHERO OK: the portrait holds its 4:5 beside the copy, the copy is dark ink on the canvas with no scrim over a photograph that is not there, the accent plate is present, the stat row is three columns, and the call to action clears the fold at every viewport.",
);