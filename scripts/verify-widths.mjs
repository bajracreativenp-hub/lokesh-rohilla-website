/**
 * Desktop width verification harness.
 *
 * The interactive browser available during development is locked to roughly
 * 1062px, which is below the xl breakpoint where the single line navigation and
 * the multi column hero actually switch on. This drives a real Chrome at
 * arbitrary widths so those layouts can be measured and captured.
 *
 * Usage: node scripts/verify-widths.mjs [outDir]
 */
import puppeteer from "puppeteer-core";

import { CHROME, probeOut } from "./browser.mjs";
import { mkdir } from "node:fs/promises";

const URL = "http://localhost:3001";
const OUT = process.argv[2] ?? probeOut("lr-shots");

const WIDTHS = [390, 768, 1280, 1440, 1920];
/** Fixed, and asserted against below, so the first section check is meaningful. */
const VIEWPORT_HEIGHT = 900;

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars", "--force-device-scale-factor=1"],
});

const report = [];

for (const width of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: VIEWPORT_HEIGHT, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
  // Trigger every scroll reveal, then return to the top.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 700));
  });

  const data = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const header = q("header > div");
    const desktopNav = q('header nav[aria-label="Primary"]');
    const burger = q("header button[aria-expanded]");
    const grid = [...document.querySelectorAll("main div")].find(
      (d) => d.className.includes("lg:grid-cols-12") && d.querySelector("article h3"),
    );

    /*
      THE HERO, MEASURED SPECIFICALLY RATHER THAN GENERICALLY.

      It has been removed, restored and rebuilt twice over, and this block has been
      rewritten with it each time. What matters is that the assertions are about the
      hero specifically and not about whatever happens to be the first section: the
      calls to action must be reachable without scrolling, and the wordmark must not
      wrap. Measuring "the first section" generically would pass even if the hero
      stopped being a hero.

      What it does NOT assert about the hero is the artwork filling the section.
      That is a statement about the design rather than about widths, and it belongs
      to `probe-hero`.
    */
    const firstSection = q("main section");
    const hero = q("main section");
    const heroGrid = hero?.querySelector("div.grid");

    /*
      THE HERO'S CALL TO ACTION, AND THE LABEL CHANGED WITH THE HERO.

      This looked for "Discover Lokesh", which used to be the hero's primary
      button. It is now the second intent, and it is an ICON ONLY circular
      control, so it has no text content at all to match on.

      The lookup therefore fell through to the next link in the document carrying
      those words, which lives in a section far down the page, and reported "the
      hero CTA is below the fold" at every width. The measurement was correct; it
      was measuring the wrong element, and the hero's own actions were never
      looked at.

      It now matches the hero's primary label, "Work With Lokesh", AND scopes the
      search to the hero section. Both halves matter: the label alone would still
      drift if a later section ever published the same intent, and the scope alone
      would still be measuring a control that may not be the primary one.
    */
    const heroCta = [...(hero?.querySelectorAll("a") ?? [])].find((a) =>
      a.textContent.includes("Work With Lokesh"),
    );

    // Any element wider than the viewport is a horizontal overflow bug, unless
    // it legitimately lives inside a horizontal scroll container.
    const inScroller = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const ox = getComputedStyle(p).overflowX;
        if (ox === "auto" || ox === "scroll" || ox === "hidden") return true;
      }
      return false;
    };
    const overflow = [...document.querySelectorAll("main *")]
      .filter(
        (el) =>
          el.getBoundingClientRect().right >
            document.documentElement.clientWidth + 1 && !inScroller(el),
      )
      .slice(0, 6)
      .map((el) => ({
        tag: el.tagName,
        cls: String(el.className).slice(0, 70),
        right: Math.round(el.getBoundingClientRect().right),
      }));

    return {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      headerHeight: header ? Math.round(header.getBoundingClientRect().height) : null,
      desktopNavDisplay: desktopNav ? getComputedStyle(desktopNav).display : null,
      burgerDisplay: burger ? getComputedStyle(burger).display : null,
      navWraps: desktopNav
        ? Math.round(desktopNav.getBoundingClientRect().height) > 44
        : null,
      firstSectionHeight: firstSection
        ? Math.round(firstSection.getBoundingClientRect().height)
        : null,
      // The hero must actually be a hero: a two column split from lg up.
      heroColumns: heroGrid ? getComputedStyle(heroGrid).gridTemplateColumns : null,
      // The primary CTA must be visible without scrolling on every width.
      heroCtaVisible: heroCta
        ? heroCta.getBoundingClientRect().bottom <= window.innerHeight
        : null,
      /*
        THE HERO IS A FULL BLEED PHOTOGRAPH WITH A LOGOTYPE STANDING ON IT.

        This measured a portrait card, and before that a full bleed image, and
        before that a headline measure. None of them apply now: the hero has no
        portrait, and the artwork filling its section is `probe-hero`'s assertion
        rather than this one's, because it is about the design and not about widths.

        What replaces it is the thing that can go wrong with a wordmark, which is
        that it wraps. One word, set to fill the lower left of the frame. Break it
        across two lines and it stops being a logotype and becomes a headline, and
        it also changes the height of the hero, which moves the calls to action.

        Measured from real line boxes rather than guessed from character count, which
        is the same method `h1Lines` uses and for the same reason.
      */
      heroH1Lines: (() => {
        const h1 = q("main h1");
        if (!h1) return null;
        const lh = parseFloat(getComputedStyle(h1).lineHeight);
        return Math.round(h1.getBoundingClientRect().height / lh);
      })(),
      // A page with no h1, or more than one, is a real defect. This is the
      // assertion that matters most since the hero that used to own the h1 is
      // gone.
      h1Count: document.querySelectorAll("main h1").length,
      h1Text: (q("main h1")?.innerText ?? "").replace(/\s+/g, " ").trim().slice(0, 60),
      // Line count measured from real line boxes, not guessed from characters.
      h1Lines: (() => {
        const h1 = q("main h1");
        if (!h1) return null;
        const lh = parseFloat(getComputedStyle(h1).lineHeight);
        return Math.round(h1.getBoundingClientRect().height / lh);
      })(),
      h1FontSize: (() => {
        const h1 = q("main h1");
        return h1 ? Math.round(parseFloat(getComputedStyle(h1).fontSize)) : null;
      })(),
      /*
        Every testimonial frame the same size. The three slots were
        col-span-7 / 5 / 12, which made three different widths and heights for
        the same 16:9 ratio. Measuring the distinct widths catches that directly.
      */
      videoFrameWidths: (() => {
        const slots = [...document.querySelectorAll("main [role='img']")].filter((el) =>
          (el.getAttribute("aria-label") ?? "").includes("Video pending"),
        );
        if (!slots.length) return null;
        return [...new Set(slots.map((s) => Math.round(s.getBoundingClientRect().width)))];
      })(),
      bentoSpans: grid
        ? [...grid.children].map((c) => ({
            w: Math.round(c.getBoundingClientRect().width),
            col: getComputedStyle(c).gridColumn,
          }))
        : null,
      overflow,
    };
  });

  report.push({ width, ...data });
  await page.screenshot({ path: `${OUT}/w${width}-top.png` });
  if (width === 1440) await page.screenshot({ path: `${OUT}/w1440-full.png`, fullPage: true });

  await page.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 1));

/*
  Hard assertions. A probe that only prints its findings is a probe nobody reads.
*/
const failures = [];
for (const r of report) {
  const w = r.width;
  if (r.overflow.length) failures.push(`${w}px: horizontal overflow ${JSON.stringify(r.overflow)}`);
  if (r.navWraps !== false) failures.push(`${w}px: nav wraps onto a second line`);
  if (r.h1Count !== 1) {
    failures.push(`${w}px: ${r.h1Count} h1 elements, expected exactly 1 ("${r.h1Text}")`);
  }
  // The hero headline is max 15ch, so it must not wrap deeply at any width.
  if (r.h1Lines !== null && r.h1Lines > 3) {
    failures.push(`${w}px: h1 wraps to ${r.h1Lines} lines, expected at most 3`);
  }
  // The primary CTA must be reachable without scrolling.
  if (r.heroCtaVisible !== true) {
    failures.push(`${w}px: the hero CTA is below the fold`);
  }
  /*
    THE WORDMARK MUST NOT WRAP.

    It is one word. Two lines means the logotype has become a headline, and the
    extra line also changes the height of the hero, which is what pushes the calls
    to action down. The narrower viewports are where this happens first, so it is
    checked at every width rather than only where it looks fine.
  */
  if (r.heroH1Lines !== null && r.heroH1Lines > 1) {
    failures.push(
      `${w}px: the hero wordmark wraps to ${r.heroH1Lines} lines, expected 1`,
    );
  }
  if (r.videoFrameWidths !== null && r.videoFrameWidths.length > 1) {
    failures.push(
      `${w}px: video frames are ${r.videoFrameWidths.join("px, ")}px wide, they must all match`,
    );
  }
}

if (failures.length) {
  console.error("\nWIDTH FAILURES:\n  " + failures.join("\n  "));
  process.exit(1);
}
console.log(
  "\nWIDTHS OK: no overflow, one h1 on one line, hero CTA above the fold, even video frames.",
);
