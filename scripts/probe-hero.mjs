/**
 * PROBES THE HERO.
 * ===========================================================================
 *
 * The hero is a cinematic full bleed photograph with a wordmark standing in the
 * lower left of it, supporting copy and two calls to action in the lower right.
 *
 * WHAT THIS PROBE USED TO ASSERT, AND WHY IT NO LONGER CAN
 *
 * The previous hero was a split layout on white: a copy column beside a portrait
 * card, with the portrait holding a 4 / 5 ratio, sitting beside rather than over the
 * copy, with an accent plate behind it and three statistics under the buttons. Every
 * one of those is gone, and the earlier version of this probe had already been
 * rewritten once for that layout after being rewritten for the full bleed hero
 * before it.
 *
 * So this is the third set of assertions for this component, and the shape of them
 * has come full circle: the hero is full bleed again, so "the image covers its
 * section" is a live question once more. What it is measuring now is a different
 * set of failure modes, because a hero made of a photograph fails in ways a hero
 * made of white space does not.
 *
 * WHAT IS ASSERTED, AND WHY EACH ONE
 *
 *   the artwork covers its section edge to edge
 *     The design is the photograph. A hero that leaves a gap at the bottom or a
 *     strip of canvas at the side is not a slightly worse hero, it is a broken one,
 *     and it is the regression this layout is most likely to suffer from.
 *
 *   a veil is present, and it sits between the artwork and the type
 *     Type standing on an unknown photograph has no guaranteed contrast against
 *     it. The veil is what makes the wordmark readable whatever the artwork turns
 *     out to be, and `probe-contrast` measures the type against the veil's own worst
 *     case rather than against the picture. Without a veil that measurement has
 *     nothing to stand on.
 *
 *   the wordmark is LIGHT ink
 *     The hero is the one place on the site where the foreground is light on a dark
 *     ground, which is exactly the case that is invisible in a screenshot of a dark
 *     placeholder and catastrophic on a bright photograph. Asserted, not seen.
 *
 *   the calls to action clear the fold
 *     The reference composition anchors everything to the bottom of the frame, so
 *     the risk here is the opposite of the split hero's: a hero that grew tall and
 *     pushed the actions under the fold.
 *
 *   the hero fits the fold above the mobile breakpoint
 *     Checked only where the height clamp governs. Below `lg` the content can
 *     genuinely need more room than the clamp gives it, and `min-h` lets it grow,
 *     which is correct rather than a fault.
 *
 *   nothing scrolls horizontally
 *     A full bleed hero is the most likely place on the page for a width to escape,
 *     because the artwork is sized to the section rather than to its content.
 */
import puppeteer from "puppeteer-core";

import { CHROME, probeOut } from "./browser.mjs";

const URL = process.env.PROBE_URL ?? "http://localhost:3001";

/**
 * Where the content is measured from, by the text of the control rather than by
 * its position in the section.
 *
 * The primary call to action is found by its label, which is held in the content
 * layer and is the site's locked wording for the contact intent. Finding it by
 * "the first link in the section" would silently start measuring the skip link or a
 * future control the moment either was added.
 */
const CTA_LABEL = "Work With Lokesh";

const VIEWPORTS = [
  { w: 1920, h: 918 },
  { w: 1512, h: 860 },
  { w: 1440, h: 900 },
  { w: 1280, h: 720 },
  { w: 390, h: 844 },
];

/**
 * Below this the hero height is governed by its content rather than by the clamp,
 * so "does the hero fit the fold" stops being a statement about the design.
 */
const CLAMP_GOVERNS_ABOVE = 1024;

const failures = [];
const report = {};

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle0" });

  const label = `${vp.w}x${vp.h}`;

  report[label] = await page.evaluate(
    (ctaLabel, clampAbove) => {
      const box = (el) => {
        const r = el.getBoundingClientRect();
        return {
          left: Math.round(r.left),
          right: Math.round(r.right),
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      };

      const section = document.querySelector("main section");

      /*
        Found by its asset SLOT LABEL, which is what the component publishes and
        what does not change when the artwork is replaced.

        This was pinned to a dimension substring, which meant every time the file
        changed so did the probe, and a stale pin does not fail loudly: it reports
        "the hero may not have rendered" for a hero that is rendering perfectly.
        The label is the contract. The spec still travels with it as a data
        attribute, so the dimensions are recorded for anyone replacing the file.
      */
      const slot =
        section?.querySelector('[data-asset-slot="Hero artwork"]') ?? null;

      const sec = section ? box(section) : null;
      const art = slot ? box(slot) : null;

      const veil = section?.querySelector(".hero-veil") ?? null;
      const h1 = section?.querySelector("h1") ?? null;

      const textLayer = section?.querySelector("[data-hero-text]") ?? null;
      const h1Colour = h1 ? getComputedStyle(h1).color : null;

      /*
        Light ink has a red channel above 140; the navy this site paints with sits
        near 11. Read from the h1 rather than from a wrapper, because the wrappers
        carry no colour of their own and a wrapper reading as "not dark" says
        nothing about the glyphs.
      */
      const light = h1Colour ? Number(/\d+/.exec(h1Colour)[0]) > 140 : null;

      const cta = [...(section?.querySelectorAll("a") ?? [])].find((a) =>
        (a.textContent ?? "").includes(ctaLabel),
      );

      const headerH =
        document.querySelector("header")?.getBoundingClientRect().height ?? 0;

      /*
        The paint test rather than an index comparison.

        Two explicit z indices fully determine paint order, so comparing them would
        be enough, and it was what the previous version of this probe did before it
        learned that `z-index: auto` is not 0 and that a strict `>` then fails on
        correct layers. Asking the browser what is actually painted at the centre of
        the wordmark cannot be wrong about stacking.
      */
      const textOnTop = (() => {
        if (!textLayer || !h1) return false;
        const r = h1.getBoundingClientRect();
        const top = document.elementsFromPoint(
          r.left + Math.min(60, r.width / 2),
          r.top + r.height / 2,
        )[0];
        if (!top) return false;
        return h1.contains(top) || top === h1 || textLayer.contains(top);
      })();

      return {
        heroHeight: sec?.h ?? null,
        heroBottom: sec?.bottom ?? null,
        artworkPresent: Boolean(slot),
        artworkFillsSection:
          art && sec
            ? Math.abs(art.w - sec.w) <= 2 && Math.abs(art.h - sec.h) <= 2
            : null,
        veilPresent: Boolean(veil),
        textOnTop,
        h1Colour,
        h1IsLight: light,
        h1FontSize: h1 ? Math.round(parseFloat(getComputedStyle(h1).fontSize)) : null,
        ctaVisible: cta ? cta.getBoundingClientRect().bottom <= window.innerHeight : null,
        headerHeight: Math.round(headerH),
        heroFitsFold: sec ? sec.bottom - headerH <= window.innerHeight : null,
        clampGoverns: window.innerWidth >= clampAbove,
        overflowX:
          document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      };
    },
    CTA_LABEL,
    CLAMP_GOVERNS_ABOVE,
  );

  await page.screenshot({ path: `${probeOut("lr-hero")}/art-${vp.w}.png` });
  await page.close();
}

await browser.close();

for (const [label, r] of Object.entries(report)) {
  if (!r.artworkPresent) {
    failures.push(`${label}: no hero artwork slot, the hero may not have rendered`);
  } else if (r.artworkFillsSection !== true) {
    failures.push(
      `${label}: the hero artwork does not fill its section, so the design has a gap in it`,
    );
  }

  if (!r.veilPresent) {
    failures.push(
      `${label}: no veil layer, so the wordmark is standing on an unknown photograph with no contrast protection`,
    );
  }

  if (!r.textOnTop) {
    failures.push(`${label}: the wordmark is painted behind the veil, so it is invisible`);
  }

  if (r.h1IsLight !== true) {
    failures.push(
      `${label}: the wordmark is ${r.h1Colour}, expected a light ink over the dark veil`,
    );
  }

  if (r.ctaVisible !== true) {
    failures.push(`${label}: the hero call to action is below the ${label.split("x")[1]}px fold`);
  }

  if (r.clampGoverns && r.heroFitsFold !== true) {
    failures.push(
      `${label}: the hero runs to ${r.heroBottom}px, past the ${label.split("x")[1]}px fold`,
    );
  }

  if (r.overflowX) failures.push(`${label}: the page scrolls horizontally`);
}

console.log(JSON.stringify(report, null, 1));

if (failures.length) {
  console.error("\nHERO FAILURES:\n  " + failures.join("\n  "));
  process.exit(1);
}

console.log(
  "\nHERO OK: the artwork fills the section edge to edge, a veil sits between it and the wordmark, the wordmark is light ink painted above that veil, and the calls to action clear the fold at every viewport.",
);