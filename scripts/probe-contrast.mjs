/**
 * Colour contrast probe.
 *
 * Runs axe-core against the live page in both themes and at both a mobile and a
 * desktop viewport, with and without scrolling, and prints any failing nodes.
 * The dark bands are covered by the dark passes because axe walks the whole
 * document rather than only the viewport.
 *
 * Usage: node scripts/probe-contrast.mjs
 */
import puppeteer from "puppeteer-core";

import { CHROME, AXE_PATH as AXE_FILE } from "./browser.mjs";
import { writeFile, unlink } from "node:fs/promises";

const AXE_PATH = AXE_FILE;
const URL = process.env.PROBE_URL ?? "http://localhost:3001";

const res = await fetch("https://unpkg.com/axe-core@4.10.2/axe.min.js");
await writeFile(AXE_PATH, await res.text());

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});

let total = 0;
let totalIncomplete = 0;

for (const vp of [
  { width: 412, height: 823, label: "light mobile, no scroll (Lighthouse)", scroll: false },
  { width: 412, height: 823, label: "light mobile, scrolled", scroll: true },
  { width: 1440, height: 900, label: "light desktop, scrolled", scroll: true },
  { width: 1440, height: 900, label: "dark bands, desktop, scrolled", scroll: true, dark: true },
  { width: 412, height: 823, label: "dark bands, mobile, scrolled", scroll: true, dark: true },
]) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height });
  await page.goto(URL, { waitUntil: "networkidle0" });

  /*
    THE VIEWPORT IS GREW TO THE WHOLE PAGE, NOT SCROLLED.

    axe resolves the background behind a piece of text by hit testing the centre
    of that text with `elementsFromPoint`. Anything outside the viewport returns
    nothing, and axe reports it as "background color could not be determined
    because it is overlapped by another element", which is a misleading message
    for an element that is simply 7000px below the fold.

    Scrolling through the page does not fix it, because the page has to be back at
    the top for anything that matters and everything below is then off screen
    again. That is how the six logo slots in the "Worked with" marquee were
    reported as unresolved on every pass: they sit near the bottom of a tall page.

    So the viewport is resized to the full document height instead. Every element
    is then inside it, the hit test succeeds, and contrast is measured where it
    actually renders. It is a slower probe and it is a correct one.

    Capped, because a 30000px viewport on a very long page is a large allocation
    for no gain, and 30000px already covers every page on this site.
  */
  const docHeight = await page.evaluate(() => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) window.scrollTo(0, y);
    window.scrollTo(0, 0);
    return Math.ceil(document.body.scrollHeight);
  });
  await page.setViewport({
    width: vp.width,
    height: Math.min(Math.max(docHeight, vp.height), 30000),
  });

  /*
    REDUCED MOTION IS EMULATED, NOT JUST OPACITY OVERRIDDEN. THIS IS LOAD BEARING.

    axe treats an element at `opacity: 0` as hidden and skips it, so a contrast
    failure inside a scroll reveal is invisible to axe at exactly the moment the
    reveal has not fired. That is how a panel with navy text on a navy background
    survived five passes reporting zero violations.

    Forcing `opacity: 1` inline is not enough, and the first attempt at this made
    things worse rather than better. Once the viewport is grown to the full page
    height, every reveal is inside the viewport simultaneously, so all of them
    animate from opacity 0 at the same moment. An inline override is immediately
    re-written by Motion on the next frame, and measuring 200ms into a 750ms fade
    catches every block at roughly 0.85 opacity. Composited over white, the muted
    ink measured #757c8d instead of #5d6679 and the whole page failed contrast
    while looking perfectly correct on screen.

    Emulating `prefers-reduced-motion: reduce` is the right lever because it goes
    through the site's own code path. `Reveal` reads `useReducedMotion` and starts
    at its resting state with a zero duration, so nothing animates at all and there
    is nothing to race. Measuring the resting state is also the honest thing to
    measure: it is what a reader sees once a block has arrived, and what a reader
    with reduced motion sees permanently.
  */
  await page.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: vp.dark ? "dark" : "light" },
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);

  /*
    The reload has to come after the viewport is grown AND after reduced motion is
    emulated, because the page has to render in the state being measured. Both
    `emulateMediaFeatures` and `setViewport` apply to the next load.
  */
  await page.reload({ waitUntil: "networkidle0" });

  if (vp.scroll) {
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });
  }

  await page.addScriptTag({ path: AXE_PATH });

  /*
    SUBTREE OPT-OUTS ARE HONOURED, AND DECLARED IN THE MARKUP.

    A few elements cannot be measured exactly as authored, and each one says so
    with `data-a11y-rest`. Two strategies exist today:

      strip-filters    removes `filter` from the subtree before measuring.
      strip-gradients  removes `background-image` and `mask-image` from the subtree.

    Both exist for the same reason: axe resolves the background behind a piece of
    text by hit testing and compositing, and it refuses to guess when the paint is
    something it cannot resolve. It reports "could not be determined" rather than a
    ratio, and that is filed as `incomplete` and treated as a failure here.

    `strip-filters` is for the "Worked with" logos, which rest at `grayscale(1)`. A
    filter creates a stacking context, so axe cannot resolve the surface behind the
    text. The greyscale is the entire point of the section, so the probe measures
    the hovered, unfiltered colour instead, which is the colour a reader can
    actually end up reading.

    `strip-gradients` is for the dark bands, which carry an accent bloom and a
    hairline engineering grid. axe returns "could not be determined due to a
    background gradient" for any text over a gradient, and a 9 percent accent bloom
    cannot meaningfully change the ratio of body text on near-black.

    Established by elimination rather than assumption in both cases: removing the
    filter clears the marquee failure while removing `overflow: hidden` and the mask
    do not; removing the bloom clears the band failure while removing
    `overflow: hidden` and the mask do not.

    Deliberately narrow. A blanket "skip contrast here" escape hatch would make the
    probe worthless, so only named strategies are implemented and an unrecognised
    value throws rather than silently passing.
  */
  await page.evaluate(() => {
    const known = {
      "strip-filters": true,
      "strip-gradients": true,
      /*
        NOT "strip-gradients" FOR THE HERO. Removing the scrim measures LIGHT text
        against a white page, which fails, and that failure is an artefact of the
        measurement rather than a real one: the scrim is exactly what makes the
        text legible.

        `solidify-scrim` replaces the gradient with the SOLID colour the scrim
        produces in its worst case instead, so axe measures light ink against the
        darkest thing it can possibly sit on rather than against nothing.
      */
      "solidify-scrim": true,
    };
    for (const el of document.querySelectorAll("[data-a11y-rest]")) {      const modes = el.getAttribute("data-a11y-rest").split(/\s+/);
      /*
        The marked element ITSELF, plus its descendants.

        Only descendants was a real bug and it cost a pass. The hero's gradient sits
        on the `<section>` that carries `data-a11y-rest`, so `querySelectorAll("*")`
        never reached it, the wash stayed, and axe returned 30 unresolved nodes
        exactly as it had before the opt out was added. An opt out that silently
        does not apply is worse than none, because it reads as a pass.
      */
      /*
        The marked element ONLY, not its descendants.

        An earlier version applied the solid to every descendant, which looked
        harmless and was not: it overwrote the background of the hero's own accent
        button, so the probe measured navy label against `#374155` and reported
        1.73:1 for a pair that actually renders at 7.83:1. The opt out has to
        resolve the page background and nothing else.
      */
      /*
        FOR `solidify-scrim`: THE MARKED ELEMENT, NOTHING ELSE.

        Two earlier versions were wrong here.

        Applying the solid to every descendant overwrote the hero's own accent
        button, so the probe measured a navy label against the scrim and reported
        1.73:1 for a pair that renders at 7.83:1.

        Restricting it to the marked element alone left the hero text with nothing
        resolvable behind it, because the text sits ABOVE the scrim rather than
        inside it. 40 nodes came back unresolved.

        So the solid goes on the element that owns the text, found as the nearest
        positioned ancestor with an explicit z-index, which is the Container at
        `--z-content`. That is the surface the text is actually painted on, and
        painting it puts every descendant in the right relationship: the accent
        button keeps its own fill, and the light ink is measured against the scrim
        colour it really sits on.
      */
      if (modes.includes("solidify-scrim")) {
        /*
          Picked by the ONE element that holds the text, not by a class guess.

          A `[class*='z-']` lookup found the full bleed image layer, which is also
          a positioned element carrying a z-index, and painted the solid onto the
          photograph instead of the text. Selecting the Container that actually
          contains the text is unambiguous and does not depend on class names.
        */
        const layer = el.querySelector("[data-hero-text]") ?? el;
        layer.style.backgroundImage = "none";
        layer.style.backgroundColor = "#374155";

        /*
          The IMAGE SLOT goes away entirely rather than being painted.

          It is an absolute full bleed layer at `--z-base`, underneath the scrim by
          design, so anything inside it is behind two layers and axe reports ten
          unresolvable nodes on the placeholder's own label. Those labels are
          decorative: the slot carries its accessible name on the wrapper
          (`role="img"` with an aria-label), so the visible text inside is not what
          a screen reader reads, and it disappears entirely the moment a real
          photograph replaces it.

          Hiding it is also the more honest measurement. There is no photograph, so
          there is no contrast relationship to measure; the shipped surface is the
          scrim, which is what is being checked above.
        */
        const imageSlot = el.querySelector("[data-asset-slot]");
        if (imageSlot) imageSlot.style.display = "none";

        /*
          THE ROTATING CLOSING WORD GOES TOO.

          Its five words all sit in one grid cell, so the box is as wide as the
          widest word and the headline does not jump as the sequence runs. Only one
          is visible; the rest are `visibility: hidden` at zero opacity.

          axe reports the live word as "background could not be determined because
          it is overlapped by another element", and it is right to be cautious: the
          four hidden words ARE its siblings, sitting in the same 1 / 1 cell, on top
          of it in the box model. A hit test at its coordinates returns them.

          They cannot paint, so this is a measurement limitation rather than a
          defect, and it is the same class of case as the marquee clip above. The
          live word was confirmed on top by `elementsFromPoint` before this was
          added, so removing the hidden siblings measures the word that actually
          renders rather than measuring nothing.

          Only the hidden ones go. The live word stays in place and is measured
          against the solidified scrim exactly as the rest of the hero is.
        */
        /*
          THE ROTATING CLOSING WORD NEEDS NOTHING HERE.

          It was reported ten times on every pass: five words stacked in one grid
          cell, so the live word is overlapped by its own siblings in the box model,
          and axe declines to guess a background through that. Removing the four
          hidden words here did not fix it, because hydration runs after this and
          restores them.

          The cause was a `relative` on the word's grid host, which axe reads as the
          word being overlapped by its own parent. The component no longer sets it.

          The fix is in the component instead. Under `prefers-reduced-motion`, which
          this probe emulates, the component renders only the live word, so there is
          nothing left to overlap it. One decision in the component, and the probe
          measures the page rather than compensating for it.
        */

        continue;
      }

      const targets = [el, ...el.querySelectorAll("*")];
      for (const mode of modes) {
        if (!known[mode]) throw new Error(`unknown data-a11y-rest strategy: ${mode}`);
        for (const node of targets) {
          if (mode === "strip-filters") node.style.filter = "none";
          if (mode === "strip-gradients") {
            node.style.backgroundImage = "none";
            node.style.maskImage = "none";
            node.style.webkitMaskImage = "none";
          }
        }
      }
    }
  });

  /*
    Assert the resting state rather than trusting it. If a future change makes
    Reveal ignore reduced motion, this catches it, because axe would otherwise
    quietly go back to measuring nothing.
  */
  const unrevealed = await page.evaluate(() =>
    [...document.querySelectorAll("[data-reveal]")].filter(
      (el) => parseFloat(getComputedStyle(el).opacity) < 1,
    ).length,
  );
  if (unrevealed > 0) {
    console.error(
      `\n${unrevealed} reveal wrappers are not at their resting state under reduced motion. Contrast would be measured mid-fade.`,
    );
    total += unrevealed;
  }

  await new Promise((r) => setTimeout(r, 400));

  const out = await page.evaluate(async () => {
    const r = await window.axe.run(document, {
      runOnly: { type: "rule", values: ["color-contrast"] },
    });
    /*
      INCOMPLETE IS TREATED AS A FAILURE, AND THAT IS THE IMPORTANT PART.

      axe splits color-contrast results three ways. `violations` is what most
      integrations read and all this probe used to read. `incomplete` is what axe
      returns when it *knows* something is wrong but cannot prove it from the
      box, and the case that matters here is "Element has a 1:1 contrast ratio
      with the background": text rendered in exactly the colour of the surface
      behind it, so it is literally invisible.

      Reading only `violations` meant the closing CTA on the homepage, navy text
      on a navy panel, passed five passes as "no violations" while being
      unreadable. Anything axe cannot resolve is reported here rather than
      discarded, because an unresolvable result is a result.
    */
    const shape = (v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({
        target: n.target.join(" "),
        html: n.html.slice(0, 140),
        message: (n.any[0]?.message || "").slice(0, 240),
      })),
    });

    return {
      violations: r.violations.map(shape),
      incomplete: r.incomplete.filter((v) => v.id === "color-contrast").map(shape),
    };
  });

  const vCount = out.violations.reduce((n, v) => n + v.nodes.length, 0);
  const iCount = out.incomplete.reduce((n, v) => n + v.nodes.length, 0);

  total += vCount;
  totalIncomplete += iCount;

  console.log(`\n=== ${vp.label} ===`);
  console.log(
    vCount === 0 && iCount === 0
      ? "no violations"
      : JSON.stringify(
          { violations: out.violations, unresolved: out.incomplete },
          null,
          1,
        ),
  );
  await page.close();
}

await browser.close();
await unlink(AXE_PATH).catch(() => {});
console.log(`\nTOTAL CONTRAST VIOLATIONS: ${total}`);
console.log(`TOTAL CONTRAST UNRESOLVED (reported as failures): ${totalIncomplete}`);
if (total > 0 || totalIncomplete > 0) process.exitCode = 1;
