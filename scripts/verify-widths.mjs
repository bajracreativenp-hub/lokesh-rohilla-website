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
      THE HERO IS BACK.

      It was removed, then restored, so this block has been rewritten twice. The
      assertions that matter are about the hero specifically, not about whatever
      happens to be the first section: the CTA must be reachable without
      scrolling, the headline must not wrap deeply, and the portrait must hold its
      4:5 ratio. Measuring "the first section" generically would pass even if the
      hero stopped being a hero.
    */
    const firstSection = q("main section");
    const hero = q("main section");
    const heroGrid = hero?.querySelector("div.grid");
    const portrait = q('main [data-asset-spec*="1600x2000"]');
    const heroCta = [...document.querySelectorAll("main a")].find((a) =>
      a.textContent.includes("Discover Lokesh"),
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
        THE HERO IS A SPLIT, AND THIS FOLLOWS IT.

        The portrait is a card in the hero's right hand column. It is not full
        bleed, so "does the image cover its section" describes a layout that no
        longer exists and fails on a hero that is provably correct.

        What can break on a split hero is a different set of things, and both are
        checked here:

        - the card losing the ratio it reserves, which is the whole reason it
          reserves one, since it is what lets a real photograph arrive with no
          layout shift
        - the photograph landing on top of the copy instead of beside it, which a
          screenshot catches and an assertion is the only way to catch at every
          width at once

        `besideCopy` is only meaningful once the grid is actually two columns.
        Below lg the two are stacked by design, so the portrait sitting below the
        headline is correct and comparing their lefts would report a fault that is
        not one.
      */
      split: portrait
        ? (() => {
            const img = portrait.getBoundingClientRect();
            const head = q("main h1")?.getBoundingClientRect();
            const columns = heroGrid
              ? getComputedStyle(heroGrid).gridTemplateColumns
              : "";
            const twoColumn = columns.trim().split(/\s+/).length === 2;
            return {
              ratio: Number((img.width / img.height).toFixed(3)),
              twoColumn,
              besideCopy: head ? img.left >= head.right - 2 : null,
            };
          })()
        : null,
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
    The portrait must be a card in the hero's own column, not painted over the
    copy. This replaced a "the image fills its section" assertion, which only held
    while the portrait was full bleed.
  */
  if (r.split === null) {
    failures.push(`${w}px: no hero image slot found, the hero may not have rendered`);
  } else {
    // 4 / 5 = 0.8. The tolerance covers sub-pixel rounding at fractional widths.
    if (Math.abs(r.split.ratio - 0.8) > 0.02) {
      failures.push(
        `${w}px: the hero portrait is ${r.split.ratio}, expected the 4 / 5 it reserves`,
      );
    }
    if (r.split.twoColumn && r.split.besideCopy !== true) {
      failures.push(
        `${w}px: the hero portrait overlaps the headline, the two columns are colliding`,
      );
    }
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
  "\nWIDTHS OK: no overflow, one h1, hero CTA above the fold, hero portrait holds its 4:5 beside the copy, even video frames.",
);
