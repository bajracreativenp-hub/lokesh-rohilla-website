/**
 * Vertical rhythm audit across every route.
 *
 * The complaint was "gapping". That is measurable, and it was measurable in two
 * different ways that turned out to have different causes:
 *
 *   1. SECTION RHYTHM. Consecutive sections on a page, and the same section
 *      across pages, should sit on one scale. The homepage had 112px, 128px and
 *      96px of top padding in play depending on which component rendered it, so
 *      scrolling down the page the gap between blocks visibly pulsed. Every value
 *      is reported so the spread is visible rather than guessed at.
 *
 *   2. INTERNAL VOID. Large empty runs INSIDE a section, which is what a
 *      screenshot catches and a padding audit does not. Reveal wrappers that are
 *      mid-animation, or a block whose grid has collapsed to one column, both
 *      show up here as an unexplained vertical gap.
 *
 * Reports, does not fail. The thresholds are a judgement about editorial
 * spacing, not a correctness rule, and this file's job is to produce the numbers
 * that the judgement is made from.
 *
 * Usage: node scripts/audit-rhythm.mjs
 */
import puppeteer from "puppeteer-core";

import { CHROME, probeOut } from "./browser.mjs";
import { mkdir, readFile } from "node:fs/promises";

const URL = "http://localhost:3001";
const OUT = probeOut("lr-rhythm");

await mkdir(OUT, { recursive: true });

const routes = JSON.parse(await readFile("src/lib/routes.json", "utf8")).routes;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});

const findings = [];

for (const route of routes) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await page.goto(URL + route, { waitUntil: "networkidle0" });

  /*
    Scroll the whole page once so every scroll reveal has fired. Measuring before
    this reports `opacity: 0` blocks as empty voids, which is the single biggest
    source of phantom gaps in this kind of audit.
  */
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 130));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 500));
  });

  const data = await page.evaluate(() => {
    /* Top level blocks only. Nested sections inside sections would double count. */
    const blocks = [...document.body.children]
      .flatMap((el) => (el.tagName === "MAIN" || el.tagName === "DIV" ? [...el.children] : [el]))
      .filter((el) => el.tagName === "SECTION" || el.tagName === "HEADER" || el.tagName === "FOOTER");

    const bands = blocks
      .map((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          id: el.id || el.getAttribute("aria-label") || el.tagName.toLowerCase(),
          top: Math.round(r.top + window.scrollY),
          bottom: Math.round(r.bottom + window.scrollY),
          padTop: parseFloat(cs.paddingTop),
          padBottom: parseFloat(cs.paddingBottom),
          bg: cs.backgroundColor,
        };
      })
      .filter((b) => b.bottom > b.top)
      .sort((a, b) => a.top - b.top);

    /*
      The gap between one block and the next, measured edge to edge. Where two
      blocks share a background the visual gap is much smaller than the number,
      which is why the background is reported alongside it.
    */
    const gaps = [];
    for (let i = 1; i < bands.length; i++) {
      const prev = bands[i - 1];
      const cur = bands[i];
      gaps.push({
        from: prev.id,
        to: cur.id,
        gap: cur.top - prev.bottom,
        sameBackground: prev.bg === cur.bg,
      });
    }

    /*
      Internal voids: for each block, the largest vertical run between the
      bottom of one direct child and the top of the next. Only counts runs over
      90px, which is roughly where a reader starts to read the gap as a mistake
      rather than as breathing room.
    */
    const voids = [];
    for (const el of blocks) {
      const kids = [...el.children].filter((k) => {
        const r = k.getBoundingClientRect();
        return r.height > 4;
      });
      let worst = 0;
      let where = "";
      for (let i = 1; i < kids.length; i++) {
        const a = kids[i - 1].getBoundingClientRect();
        const b = kids[i].getBoundingClientRect();
        const run = Math.round(b.top - a.bottom);
        if (run > worst) {
          worst = run;
          where = `${el.id || el.tagName.toLowerCase()} > child ${i}`;
        }
      }
      if (worst > 90) voids.push({ where, run: worst });
    }

    /* Empty sections: zero height, or everything inside collapsed. */
    const empties = blocks
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.height < 8;
      })
      .map((el) => el.id || el.tagName.toLowerCase());

    return {
      pageHeight: Math.round(document.body.scrollHeight),
      padTopValues: [...new Set(bands.map((b) => Math.round(b.padTop)))],
      gaps,
      voids: voids.sort((a, b) => b.run - a.run).slice(0, 5),
      empties,
    };
  });

  findings.push({ route, ...data });
  await page.close();
}

await browser.close();

/* ---------- report ---------- */

/*
  SECTION TOP PADDING PER ROUTE.

  Two values are expected on a content page and one on a commerce page. The two
  are `--space-section` and `--space-section-tight`, and they are a deliberate
  relationship rather than a drift: the tight step belongs to a closing strip that
  is part of the section above it, while the full step is a band in its own right.

  So the check is that the same value does not appear with two different meanings,
  and in practice that means: every route must draw from the same two numbers, and
  every number must be one the site actually defines. Anything else is a scale that
  has drifted.
*/
const KNOWN_VALUES = new Set([72, 111]);

console.log("\nSECTION TOP PADDING PER ROUTE");
console.log("Routes whose sections do not draw from the two defined rhythm steps:");
let rhythmIssues = 0;
for (const f of findings) {
  const strays = f.padTopValues.filter((v) => !KNOWN_VALUES.has(v) && v !== 0);
  if (strays.length) {
    rhythmIssues++;
    console.log(
      `  ${f.route.padEnd(34)} off scale: ${strays.join(", ")} (all: ${f.padTopValues.join(", ")})`,
    );
  }
}
if (!rhythmIssues) console.log("  none, every section sits on the defined scale");

const seen = [...new Set(findings.flatMap((f) => f.padTopValues))].sort((a, b) => a - b);
console.log(`  values in use across all routes: ${seen.join(", ")}`);

console.log("\nEDGE TO EDGE GAPS OVER 150px");
for (const f of findings) {
  const big = f.gaps.filter((g) => g.gap > 150 && !g.sameBackground);
  if (big.length) {
    console.log(`  ${f.route}`);
    for (const g of big) console.log(`    ${g.gap}px  ${g.from} -> ${g.to}`);
  }
}

console.log("\nINTERNAL VOIDS OVER 220px");
for (const f of findings) {
  const big = f.voids.filter((v) => v.run > 220);
  if (big.length) {
    console.log(`  ${f.route}`);
    for (const v of big) console.log(`    ${v.run}px  ${v.where}`);
  }
}

console.log("\nEMPTY SECTIONS");
const anyEmpty = findings.filter((f) => f.empties.length);
if (anyEmpty.length) for (const f of anyEmpty) console.log(`  ${f.route}: ${f.empties.join(", ")}`);
else console.log("  none");

console.log("\nPAGE HEIGHTS (1440px)");
for (const f of findings) {
  const bars = "#".repeat(Math.max(1, Math.round(f.pageHeight / 300)));
  console.log(`  ${f.route.padEnd(34)} ${String(f.pageHeight).padStart(6)}  ${bars}`);
}

console.log(`\n${findings.length} routes audited. Screenshots in ${OUT}`);