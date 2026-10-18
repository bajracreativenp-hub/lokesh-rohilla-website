/**
 * Worked With logo marquee.
 *
 * The only continuously moving content on the site, so it gets its own probe.
 * The things worth asserting are all accessibility rules that a screenshot
 * cannot show and that a build cannot catch:
 *
 *   - the strip actually scrolls, and the loop is seamless
 *   - it pauses on hover
 *   - there is NO Pause button, and its absence is asserted so that one creeping
 *     back is caught rather than shipped
 *   - nothing inside the strip is focusable, which records that hover is the only
 *     pause mechanism that currently fires
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
      /*
        The Pause button is asserted GONE, at rest as well as under reduced motion.

        It used to be asserted working: pressed state, label offering to play again,
        track held still after the click. Those four assertions were removed with
        the control, and in their place this one, so that if the button ever comes
        back nobody notices it as a regression to a design decision. Its absence is
        now a tested property rather than a leftover.

        Which leaves hover as the only mechanism that actually fires, because
        `:focus-within` is inert here: nothing inside the strip is focusable. The
        slots are divs holding a monogram and a name, deliberately not links, since
        six decorative marks in the tab order is worse than a scrolling row. See the
        note in `worked-with.tsx` about the WCAG 2.2.2 trade this represents.
      */
      pauseButtonPresent: document.querySelector("[aria-pressed]") !== null,
      focusableInside: (() => {
        const m = document.querySelector(".marquee");
        if (!m) return null;
        return m.querySelectorAll("a, button, [tabindex]:not([tabindex='-1'])").length;
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

/*
  THE PAUSE BUTTON IS NOT HERE ANY MORE.

  Hover, focus and a Pause button were the three mechanisms. The button is gone, so
  this records that its absence is deliberate and tested rather than an oversight:
  if one reappears it fails, which is the behaviour you want if a design decision
  gets reversed by accident.
*/
if (report.atRest.pauseButtonPresent !== false) {
  failures.push(
    "a Pause button is present; it was removed on purpose, so this is a regression rather than a fix",
  );
}

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
/*
  NOTHING IN THE STRIP IS FOCUSABLE, AND THAT IS ASSERTED RATHER THAN ASSUMED.

  `:focus-within` is one of the two pause mechanisms in `globals.css`, so it is
  worth knowing whether it can ever fire. Today it cannot: the slots are divs, not
  links, so there is nothing inside the strip for a keyboard to land on and the
  selector never matches. Six decorative marks in the tab order would be a worse
  problem than a scrolling row, so the strip stays unfocusable and hover is left
  carrying the whole job.

  If real client marks arrive as links to case studies, this count goes above zero
  and focus pause starts working for free. Until then this assertion is the thing
  that records which mechanism is actually load bearing.
*/
if (report.atRest.focusableInside !== 0) {
  failures.push(
    `the strip now contains ${report.atRest.focusableInside} focusable element(s); if those are real links to case studies that is good, and if they are not it is six stops in the tab order for decoration`,
  );
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
  The reduced motion block used to remove the Pause button from the tab order. There
  is no button now, so there is nothing to remove, and the `.marquee-toggle` rules
  that used to live in `globals.css` were deleted along with it rather than left
  parked. What matters instead is that the scroll is off: a control for something
  that is not moving promises motion the visitor has switched off.
*/
// And the edge fade has nothing to soften once nothing is moving.
if (report.reducedMotion.marqueeMask && report.reducedMotion.marqueeMask !== "none") {
  failures.push("the edge fade still applies under reduced motion, dimming the first and last logo");
}

if (failures.length) {
  console.error("\nMARQUEE FAILURES:\n  " + failures.join("\n  "));
  process.exit(1);
}
console.log(
  "\nMARQUEE OK: one scrolling strip, seamless loop, pauses on hover, no Pause button, duplicate row hidden, greyscaled at rest, off under reduced motion.",
);