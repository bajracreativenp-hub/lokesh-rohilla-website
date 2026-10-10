/**
 * Worked With logo marquee.
 *
 * The only continuously moving content on the site, so it gets its own probe.
 * The things worth asserting are all accessibility rules that a screenshot
 * cannot show and that a build cannot catch:
 *
 *   - the row actually scrolls, and the loop is seamless
 *   - it pauses on hover, on keyboard focus, and via an explicit toggle
 *   - the toggle reports its state through aria-pressed
 *   - the duplicated row is hidden from assistive tech, so names are not
 *     announced twice
 *   - logos are greyscaled at rest and reveal colour on hover
 *   - nothing overflows the viewport
 *
 * Usage: node scripts/probe-marquee.mjs
 */
import puppeteer from "puppeteer-core";

import { CHROME, probeOut } from "./browser.mjs";
import { mkdir } from "node:fs/promises";

const URL = "http://localhost:3001";
const OUT = probeOut("lr-marquee");

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: "networkidle0" });
await page.evaluate(() => {
  const h = [...document.querySelectorAll("main h2")].find((x) =>
    /Organizations he has worked with/i.test(x.textContent || ""),
  );
  window.scrollTo({
    top: h.getBoundingClientRect().top + window.scrollY - 80,
    behavior: "instant",
  });
});
await page.evaluate(() => new Promise((r) => setTimeout(r, 900)));

const report = {};

/** Reads everything about the marquee in one pass. */
const read = () =>
  page.evaluate(() => {
    const marquee = document.querySelector(".marquee");
    const track = marquee?.querySelector(".marquee-track");
    const logos = [...(marquee?.querySelectorAll('[data-asset-slot="client-logo"]') ?? [])];
    const rows = [...(track?.children ?? [])];
    const firstLogo = logos[0];

    return {
      marqueePresent: Boolean(marquee),
      labelledGroup: marquee?.getAttribute("role") === "group" && Boolean(marquee?.getAttribute("aria-label")),
      animationName: track ? getComputedStyle(track).animationName : null,
      playState: track ? getComputedStyle(track).animationPlayState : null,
      duration: track ? getComputedStyle(track).animationDuration : null,
      // A translateX mid flight proves it is moving rather than merely declared.
      trackTransform: track ? getComputedStyle(track).transform : null,
      // Exactly two rows, and the second hidden from assistive tech.
      rowCount: rows.length,
      // Counted by visibility, not by DOM children. Under reduced motion the
      // duplicate row is `display: none`, which removes it from the layout but
      // not from `children`, so a DOM count reports 2 either way and can never
      // tell "hidden" apart from "still there".
      rowsVisible: rows.filter((r) => getComputedStyle(r).display !== "none").length,
      secondRowHidden: rows[1]?.getAttribute("aria-hidden") === "true",
      logosRendered: logos.length,
      // Six per row, not twelve in one list.
      logosPerRow: rows.map((r) => r.querySelectorAll("li").length),
      logoFilterAtRest: firstLogo ? getComputedStyle(firstLogo).filter : null,
      // The row must be wider than the viewport, otherwise there is nothing to
      // scroll and the whole thing is decorative.
      trackWidth: track ? Math.round(track.getBoundingClientRect().width) : null,
      viewportWidth: document.documentElement.clientWidth,
      overflowsViewport:
        marquee && marquee.getBoundingClientRect().right > document.documentElement.clientWidth + 1,
      toggleLabel: document.querySelector("[aria-pressed]")?.textContent?.trim() ?? null,
      togglePressed: document.querySelector("[aria-pressed]")?.getAttribute("aria-pressed") ?? null,
      toggleVisible: (() => {
        const b = document.querySelector("[aria-pressed]");
        return b ? getComputedStyle(b).display !== "none" && b.offsetParent !== null : null;
      })(),
      // The edge fade only makes sense on a moving row.
      marqueeMask: marquee ? getComputedStyle(marquee).maskImage : null,
    };
  });

report.atRest = await read();

// It must be moving. Sample the transform twice.
await page.evaluate(() => new Promise((r) => setTimeout(r, 700)));
report.after700ms = await read();

// Hover pauses it.
const box = await page.evaluate(() => {
  const m = document.querySelector(".marquee");
  const r = m.getBoundingClientRect();
  return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
});
await page.mouse.move(box.x, box.y);
await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));
report.onHover = await read();
await page.screenshot({ path: `${OUT}/1-hover.png` });

const hoveredTransform = report.onHover.trackTransform;
await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
const stillHovered = await read();
report.hoverIsStatic = stillHovered.trackTransform === hoveredTransform;

await page.mouse.move(1439, 60);
await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));
report.afterLeave = await read();

// The explicit toggle.
await page.evaluate(() => document.querySelector("[aria-pressed]")?.click());
await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));
report.afterToggle = await read();

const toggledTransform = report.afterToggle.trackTransform;
await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
const stillToggled = await read();
report.toggleIsStatic = stillToggled.trackTransform === toggledTransform;
await page.screenshot({ path: `${OUT}/2-paused.png` });

// Reduced motion must switch it off entirely, not merely slow it.
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await page.reload({ waitUntil: "networkidle0" });
await page.evaluate(() => new Promise((r) => setTimeout(r, 700)));
report.reducedMotion = await read();
await page.screenshot({ path: `${OUT}/3-reduced-motion.png` });

console.log(JSON.stringify(report, null, 1));
await browser.close();

const failures = [];

if (!report.atRest.marqueePresent) failures.push("no .marquee on the page");
if (!report.atRest.labelledGroup) {
  failures.push("the marquee is not a labelled group, so a screen reader is not told what scrolls");
}
if (report.atRest.animationName === "none") {
  failures.push("the track has no animation, the row does not scroll");
}
if (report.atRest.trackTransform === report.after700ms.trackTransform) {
  failures.push("the track did not move over 700ms");
}
if (report.atRest.rowCount !== 2) {
  failures.push(`expected exactly 2 rows for a seamless loop, found ${report.atRest.rowCount}`);
}
if (!report.atRest.secondRowHidden) {
  failures.push("the duplicated row is not aria-hidden, organisation names are announced twice");
}
if (report.atRest.logosPerRow.some((n) => n === 0)) {
  failures.push(`a row has no logos (${report.atRest.logosPerRow.join(",")})`);
}
if (!report.atRest.logoFilterAtRest || report.atRest.logoFilterAtRest === "none") {
  failures.push(
    `logos are not greyscaled at rest (filter: ${report.atRest.logoFilterAtRest}), the rest state is lost`,
  );
}
if (report.atRest.overflowsViewport) {
  failures.push("the marquee overflows the viewport");
}
if (report.onHover.playState !== "paused") {
  failures.push(`hover did not pause the scroll (play-state: ${report.onHover.playState})`);
}
if (!report.hoverIsStatic) failures.push("the track kept moving while hovered");
if (report.afterLeave.playState === "paused") {
  failures.push("the row stayed paused after the pointer left");
}
if (report.afterToggle.togglePressed !== "true") {
  failures.push(`the toggle did not report pressed state (aria-pressed: ${report.afterToggle.togglePressed})`);
}
if (!report.toggleIsStatic) failures.push("the track kept moving after the toggle was set to paused");
if (!/play/i.test(report.afterToggle.toggleLabel ?? "")) {
  failures.push(`the toggle label does not offer to play again (reads: "${report.afterToggle.toggleLabel}")`);
}

/*
  Reduced motion must not merely slow it. The global override sets
  animation-iteration-count to 1, which would park the track at -50% and show
  the duplicated row with a gap. Assert it is fully off and unwrapped.
*/
if (report.reducedMotion.animationName !== "none") {
  failures.push(
    `reduced motion still animates the marquee (animation-name: ${report.reducedMotion.animationName})`,
  );
}
if (report.reducedMotion.rowsVisible !== 1) {
  failures.push(
    `reduced motion shows ${report.reducedMotion.rowsVisible} rows, expected 1 with the duplicate hidden`,
  );
}
if (report.reducedMotion.overflowsViewport) {
  failures.push("reduced motion layout overflows the viewport");
}

/*
  Under reduced motion the Pause button must be GONE, not merely idle.

  A control for something that is not moving promises motion the visitor has
  switched off, and it has to leave the tab order as well as the screen.
*/
if (report.reducedMotion.toggleVisible !== false) {
  failures.push(
    `the Pause button is still shown under reduced motion (visible: ${report.reducedMotion.toggleVisible})`,
  );
}
// And the edge fade has nothing to soften once nothing is moving.
if (report.reducedMotion.marqueeMask && report.reducedMotion.marqueeMask !== "none") {
  failures.push("the edge fade still applies under reduced motion, dimming the first and last logo");
}

if (failures.length) {
  console.error("\nMARQUEE FAILURES:\n  " + failures.join("\n  "));
  process.exit(1);
}
console.log(
  "\nMARQUEE OK: scrolls, seamless loop, pauses on hover and by toggle, duplicate row hidden, greyscaled at rest, off under reduced motion.",
);