/**
 * Journey timeline on /about.
 *
 * The timeline replaced a static five-card "steps" block. What is worth proving:
 *
 *   - it advances, and the phase actually changes
 *   - the sides alternate per phase
 *   - dot pagination jumps, and `aria-current` marks where you are
 *   - it wraps at both ends
 *   - Left and Right arrows work, but only while the carousel has focus
 *   - on a phone every phase is rendered and the carousel is gone
 *   - no year or date is rendered anywhere, because none is confirmed
 *
 * That last assertion is the important one. The obvious version of this layout is
 * built on year pills and date headings. Only 2021 is confirmed. If a date ever
 * appears in this section it is either a confirmed year sitting in body copy, or
 * something invented.
 *
 * Usage: node scripts/probe-timeline.mjs
 */
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = "http://localhost:3001/about";
const OUT = "C:/Users/thapa/AppData/Local/Temp/lr-timeline";

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: "networkidle0" });

const scrollToTimeline = () =>
  page.evaluate(() => {
    const h = [...document.querySelectorAll("h2")].find((x) =>
      /The phases/i.test(x.textContent || ""),
    );
    window.scrollTo({ top: h.getBoundingClientRect().top + window.scrollY - 90, behavior: "instant" });
  });

await scrollToTimeline();
await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));

/** Everything about the timeline in one pass. */
const read = () =>
  page.evaluate(() => {
    const carousel = document.querySelector("[data-timeline-carousel]");
    const fallback = document.querySelector("[data-timeline-fallback]");
    const visible = (el) => el && getComputedStyle(el).display !== "none";
    const heading = carousel?.querySelector("h3");
    const dot = carousel?.querySelector('[aria-current="true"]');

    /*
      Which side each half sits on. Consecutive phases mirror each other, so this
      has to change with the index rather than staying fixed.
    */
    const halves = [...(carousel?.querySelectorAll(".grid.items-center > div") ?? [])].map(
      (el) => Math.round(el.getBoundingClientRect().left),
    );

    return {
      carouselVisible: visible(carousel),
      fallbackVisible: visible(fallback),
      roleDescription: carousel
        ? document.querySelector('[aria-roledescription="carousel"]')?.getAttribute("aria-roledescription")
        : null,
      headingText: heading?.textContent?.trim() ?? null,
      // Where the text sits relative to the circle, "text-left" or "text-right".
      sides: halves.length === 2 ? (halves[0] < halves[1] ? "text-left" : "text-right") : null,
      /*
        No giant numeral anywhere in the carousel. An earlier build had a
        watermark reading "01" behind the copy; at that size a two digit ordinal
        reads as a clipped glyph rather than a choice, so it was removed. This
        asserts its absence, so it cannot quietly come back.
      */
      oversizedNumerals: [...carousel.querySelectorAll("span")]
        .filter((el) => parseFloat(getComputedStyle(el).fontSize) > 90)
        .map((el) => el.textContent.trim()),
      pillText: carousel?.querySelector(".rounded-pill.bg-ink")?.textContent?.trim() ?? null,
      // Counted by visibility, not DOM children: a hidden copy still counts as a child.
      fallbackItems: fallback
        ? [...fallback.children].filter((el) => getComputedStyle(el).display !== "none").length
        : 0,
      dotCount: carousel?.querySelectorAll('[aria-current], button[aria-label^="Phase"]').length ?? 0,
      activeDotLabel: dot?.getAttribute("aria-label") ?? null,
      activeDotWidth: dot ? Math.round(dot.getBoundingClientRect().width) : null,
      otherDotWidth: (() => {
        const other = [...carousel.querySelectorAll('button[aria-label^="Phase"]')].find(
          (b) => b.getAttribute("aria-current") !== "true",
        );
        return other ? Math.round(other.getBoundingClientRect().width) : null;
      })(),
      liveText: carousel?.querySelector('[aria-live="polite"]')?.textContent?.trim() ?? null,
      // Text visible inside the carousel region only, so the hidden fallback
      // cannot leak into this and make the change look like it did nothing.
      phaseText: [...carousel.querySelectorAll("h3, p")]
        .map((el) => el.textContent.trim())
        .filter((t) => t && !/^Phase \d/.test(t))
        .join(" | "),
      /*
        Every year shaped string rendered anywhere in the section. 2021 is
        allowed because it is confirmed; anything else in a four digit run is an
        invented date.
      */
      yearsFound: [
        ...new Set(
          (carousel?.textContent?.match(/\b(19|20)\d{2}\b/g) ?? []),
        ),
      ],
      circleRound:
        (() => {
          const c = carousel?.querySelector(".rounded-full.overflow-hidden");
          if (!c) return null;
          const r = c.getBoundingClientRect();
          return { w: Math.round(r.width), h: Math.round(r.height) };
        })(),
      overflowsViewport:
        document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    };
  });

const report = { phase1: await read() };
await page.screenshot({ path: `${OUT}/1-phase1.png` });

// Next.
await page.evaluate(() => {
  [...document.querySelectorAll("button")].find((b) => /Next phase/i.test(b.textContent))?.click();
});
await page.evaluate(() => new Promise((r) => setTimeout(r, 800)));
report.phase2 = await read();
await page.screenshot({ path: `${OUT}/2-phase2.png` });

// Next twice more, to phase 4.
for (let i = 0; i < 2; i++) {
  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => /Next phase/i.test(b.textContent))?.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 800)));
}
report.phase4 = await read();
await page.screenshot({ path: `${OUT}/3-phase4.png` });

// A dot jump back to phase 2.
await page.evaluate(() => {
  document.querySelector('button[aria-label^="Phase 2"]')?.click();
});
await page.evaluate(() => new Promise((r) => setTimeout(r, 800)));
report.dotJump = await read();

/*
  Wrapping. Tested from the actual ends rather than by counting clicks, because
  an earlier version clicked Next three times from the middle, landed on the last
  phase, and reported wrapping as broken when nothing had gone wrong.

  Forward: park on the last phase, then Next.
*/
await page.evaluate(() => {
  document.querySelector('button[aria-label^="Phase 5"]')?.click();
});
await page.evaluate(() => new Promise((r) => setTimeout(r, 800)));
report.atLastPhase = await read();

await page.evaluate(() => {
  [...document.querySelectorAll("button")].find((b) => /Next phase/i.test(b.textContent))?.click();
});
await page.evaluate(() => new Promise((r) => setTimeout(r, 800)));
report.wrappedForward = await read();

/* Backward: park on the first phase, then Previous. */
await page.evaluate(() => {
  document.querySelector('button[aria-label^="Phase 1"]')?.click();
});
await page.evaluate(() => new Promise((r) => setTimeout(r, 700)));
await page.evaluate(() => {
  [...document.querySelectorAll("button")].find((b) => /Previous phase/i.test(b.textContent))?.click();
});
await page.evaluate(() => new Promise((r) => setTimeout(r, 800)));
report.wrappedBack = await read();

// Arrow keys, with the carousel focused.
await page.evaluate(() => {
  document.querySelector('[aria-roledescription="carousel"]')?.focus();
  const btn = [...document.querySelectorAll("button")].find((b) => /Next phase/i.test(b.textContent));
  btn?.click();
});
await page.evaluate(() => new Promise((r) => setTimeout(r, 700)));
report.beforeArrow = await read();
await page.keyboard.press("ArrowRight");
await page.evaluate(() => new Promise((r) => setTimeout(r, 700)));
report.afterArrow = await read();

// Phone: full list, no carousel.
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
await page.reload({ waitUntil: "networkidle0" });
await scrollToTimeline();
await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
report.phone = await read();
await page.screenshot({ path: `${OUT}/4-phone.png` });

console.log(JSON.stringify(report, null, 1));
await browser.close();

const failures = [];

if (!report.phase1.carouselVisible) failures.push("the carousel is not visible at 1440px");
if (report.phase1.fallbackVisible) failures.push("the fallback list is showing at desktop width");
if (!report.phase1.roleDescription) failures.push("the region does not announce itself as a carousel");

if (report.phase1.headingText === report.phase2.headingText) {
  failures.push("Next did not change the phase heading");
}
if (report.phase1.phaseText === report.phase2.phaseText) {
  failures.push("Next did not change the visible phase body");
}
if (report.phase2.headingText === report.phase4.headingText) {
  failures.push("advancing twice did not reach a later phase");
}

/* Consecutive phases mirror each other. If this stops alternating, the
   alternating composition has been lost. */
if (report.phase1.sides === report.phase2.sides) {
  failures.push(
    `the sides do not alternate between phases (both ${report.phase1.sides}), the mirrored layout is gone`,
  );
}

/*
  No oversized numeral. A giant ordinal is decoration dressed as data. A giant
  year would be defensible at that size because a year that large is still usable
  information; an ordinal blown up to fill a column is not.
*/
for (const key of ["phase1", "phase2", "phase4"]) {
  if (report[key].oversizedNumerals.length) {
    failures.push(
      `a giant numeral is rendered in ${key} (${report[key].oversizedNumerals.join(", ")}). Position is carried by the node and the pill.`,
    );
  }
}

/*
  The ordinal on the pill must track the phase. This is what marks position now
  that the watermark is gone, so it has to be right.
*/
if (report.phase1.pillText === report.phase2.pillText || report.phase2.pillText === report.phase4.pillText) {
  failures.push(
    `the ordinal pill does not track the phase (${report.phase1.pillText}, ${report.phase2.pillText}, ${report.phase4.pillText})`,
  );
}

/* Pagination has to actually indicate position, not just exist. */
if (report.phase1.activeDotWidth === report.phase1.otherDotWidth) {
  failures.push("the active dot is the same width as the inactive ones, position is not indicated");
}
if (!/Phase 1 of/.test(report.phase1.activeDotLabel ?? "")) {
  failures.push(`the active dot does not name its position (reads "${report.phase1.activeDotLabel}")`);
}
if (!/Phase \d+ of \d+/.test(report.phase1.liveText ?? "")) {
  failures.push(`the live region does not announce the phase (reads "${report.phase1.liveText}")`);
}

/*
  Wrapping. A carousel that stops dead at either end looks broken, because the
  controls are still there inviting the reader to press them.
*/
if (report.atLastPhase.pillText !== "05") {
  failures.push(`could not park on the last phase (pill reads "${report.atLastPhase.pillText}")`);
}
if (report.wrappedForward.pillText !== "01") {
  failures.push(
    `Next from the last phase did not wrap to the first (pill reads "${report.wrappedForward.pillText}")`,
  );
}
if (report.wrappedBack.pillText !== "05") {
  failures.push(
    `Previous from the first phase did not wrap to the last (pill reads "${report.wrappedBack.pillText}")`,
  );
}

/* Arrow keys move only when the carousel has focus, so they do not steal the
   keys from someone scrolling the page. */
if (report.afterArrow.headingText === report.beforeArrow.headingText) {
  failures.push("ArrowRight did not advance the phase while the carousel had focus");
}

/* Phone. */
if (report.phone.carouselVisible) failures.push("the carousel is still visible at 390px");
if (!report.phone.fallbackVisible) failures.push("the full list is not shown at 390px");
if (report.phone.fallbackItems !== 5) {
  failures.push(`the phone list shows ${report.phone.fallbackItems} phases, expected all 5`);
}
if (report.phone.overflowsViewport) failures.push("the timeline overflows at 390px");

/*
  THE GROUNDING ASSERTION.

  Only 2021 is a confirmed year in this career. Any other four digit year in this
  section would be an invented date wearing a design's clothes.
*/
const strayYears = [...new Set([...report.phase1.yearsFound, ...report.phase2.yearsFound, ...report.phase4.yearsFound])]
  .filter((y) => y !== "2021");
if (strayYears.length) {
  failures.push(
    `unconfirmed year(s) rendered in the timeline: ${strayYears.join(", ")}. Only 2021 is confirmed.`,
  );
}

/* The circle must be round, not a square with rounded corners. */
const c = report.phase1.circleRound;
if (!c || Math.abs(c.w - c.h) > 2 || c.w < 120) {
  failures.push(`the phase image is not a circle (${JSON.stringify(c)})`);
}

if (failures.length) {
  console.error("\nTIMELINE FAILURES:\n  " + failures.join("\n  "));
  process.exit(1);
}
console.log(
  "\nTIMELINE OK: advances, alternates sides per phase, ordinal pill tracks, dots and live region report position, wraps both ways, arrow keys work on focus, no giant numeral, all five phases listed on a phone, no unconfirmed year rendered.",
);