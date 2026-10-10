/**
 * Audits every route, not just the homepage.
 *
 * Checks each page for horizontal overflow at five widths, empty or unfinished
 * sections, heading order, and colour contrast failures. A page that builds
 * cleanly can still be broken, so every route is walked.
 *
 * ROUTES ARE DISCOVERED, NOT LISTED. Reading the generated HTML out of
 * `.next/server/app` means this script audits exactly what was built, and
 * cannot silently fall behind a hand-maintained list. The previous version
 * missed 60 of the 71 routes because the list still named /insights and
 * /leadership-programs long after they had been replaced.
 *
 * Usage: node scripts/audit-routes.mjs [baseUrl]
 *   default base http://localhost:3001 (next start), because Lighthouse and axe
 *   both report phantom failures against next dev.
 */
import puppeteer from "puppeteer-core";

import { CHROME, AXE_PATH as AXE_FILE } from "./browser.mjs";
import { readdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3001";
const AXE_PATH = AXE_FILE;
const APP_DIR = path.resolve(".next/server/app");

/**
 * Every prerendered route, derived from the build. `[brand]` and `[slug]` are
 * already resolved because those routes are statically generated, so no
 * parameter guessing is needed.
 */
async function discoverRoutes() {
  async function walk(dir, prefix = "") {
    const out = [];
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return out;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // Next's own internals: `_not-found`, `_global-error`, RSC payloads.
        if (entry.name.startsWith("_") || entry.name === "node_modules") continue;
        out.push(...(await walk(full, `${prefix}/${entry.name}`)));
      } else if (entry.name.endsWith(".html")) {
        const slug = entry.name.slice(0, -".html".length);
        out.push(slug === "index" ? prefix || "/" : `${prefix}/${slug}`);
      }
    }
    return out;
  }

  const routes = (await walk(APP_DIR)).filter((r) => !r.startsWith("/_"));
  routes.push("/this-route-does-not-exist");
  return routes.sort();
}

const ROUTES = await discoverRoutes();
console.log(`Auditing ${ROUTES.length} routes from ${APP_DIR} against ${BASE}\n`);

const WIDTHS = [390, 768, 1280, 1440];

const axeSrc = await (await fetch("https://unpkg.com/axe-core@4.10.2/axe.min.js")).text();
await writeFile(AXE_PATH, axeSrc);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});

/*
  STYLESHEET PREFLIGHT

  Every check below reads the DOM: element boxes, computed colours, text
  content. None of them notice that the CSS never loaded. An unstyled page has
  no overflow, no contrast failures and no heading problems, so this audit
  reports a flawless result on a site that is visibly broken.

  That is not hypothetical. A stale `.next` served HTML pointing at chunk hashes
  from an older build, every asset 500'd, and this script reported 0 issues
  across 73 routes while the site rendered as unstyled markup.

  So: confirm the stylesheets actually load before trusting anything below. A
  page whose CSS failed is reported as a failure, loudly.
*/
{
  const page = await browser.newPage();
  const failed = [];
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });

  const css = await page.evaluate(() => {
    const sheets = [...document.querySelectorAll('link[rel="stylesheet"]')];
    return {
      count: sheets.length,
      // A loaded stylesheet has non-zero sheet.cssRules length.
      rules: sheets.reduce((n, s) => {
        try {
          return n + (s.sheet?.cssRules?.length ?? 0);
        } catch {
          return n;
        }
      }, 0),
      // Proves utilities were generated, not just that a file was fetched.
      hasUtility: (() => {
        try {
          for (const s of sheets) {
            const rules = [...(s.sheet?.cssRules ?? [])];
            if (rules.some((r) => r.selectorText === ".band-dark")) return true;
          }
        } catch {
          /* cross-origin */
        }
        return false;
      })(),
    };
  });
  await page.close();

  if (failed.length || css.count === 0 || css.rules === 0 || !css.hasUtility) {
    console.error("\nSTYLESHEET PREFLIGHT FAILED. Every result below would be meaningless.\n");
    if (failed.length) console.error("  failed requests:\n    " + failed.join("\n    "));
    console.error(
      `  stylesheets: ${css.count}, css rules parsed: ${css.rules}, .band-dark present: ${css.hasUtility}`,
    );
    console.error("\n  This is a stale or corrupt build. Run:\n    npm run verify:build\n  then restart the server.");
    await browser.close();
    await unlink(AXE_PATH).catch(() => {});
    process.exit(1);
  }
  console.log(
    `Preflight OK: ${css.count} stylesheet(s), ${css.rules} rules parsed, utilities generated.\n`,
  );
}

const report = [];

for (const route of ROUTES) {
  const entry = { route, overflow: [], checks: {}, contrast: 0, errors: [] };

  for (const width of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900 });
    page.on("pageerror", (e) => entry.errors.push(String(e.message).slice(0, 120)));
    await page.goto(BASE + route, { waitUntil: "networkidle0" });
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });

    if (width === 1440) {
      await page.addScriptTag({ path: AXE_PATH });
      /*
        Neutralise the reveal animation before auditing. Otherwise axe samples
        elements mid transition, sees a partially transparent colour, and
        reports a contrast failure that does not exist once the animation has
        settled. Real colour relationships are unaffected by this.
      */
      await page.addStyleTag({
        content: "[data-reveal]{opacity:1!important;transform:none!important}",
      });
      await page.evaluate(() => new Promise((r) => setTimeout(r, 300)));
      const a11y = await page.evaluate(async () => {
        const r = await window.axe.run(document, {
          runOnly: { type: "rule", values: ["color-contrast"] },
        });
        return r.violations.flatMap((v) =>
          v.nodes.map((n) => `${n.target.join(" ")} :: ${(n.any[0]?.message || "").slice(0, 110)}`),
        );
      });
      entry.contrast = a11y.length;
      entry.contrastNodes = a11y.slice(0, 4);

      entry.checks = await page.evaluate(() => {
        const inScroller = (el) => {
          for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
            const ox = getComputedStyle(p).overflowX;
            if (ox === "auto" || ox === "scroll" || ox === "hidden") return true;
          }
          return false;
        };
        const wide = [...document.querySelectorAll("main *, footer *")]
          .filter(
            (el) =>
              el.getBoundingClientRect().right >
                document.documentElement.clientWidth + 1 && !inScroller(el),
          )
          .slice(0, 3)
          .map((el) => `${el.tagName}.${String(el.className).slice(0, 50)}`);

        const headings = [...document.querySelectorAll("h1,h2,h3,h4")].map((h) =>
          Number(h.tagName[1]),
        );
        let skips = 0;
        for (let i = 1; i < headings.length; i++) {
          if (headings[i] - headings[i - 1] > 1) skips++;
        }

        /*
          A `RevealGroup` item should contain exactly ONE element.

          `RevealGroup` used to wrap its children with `children.map(...)`, which
          does not flatten the array a caller's `.map()` returns. Every list on
          the site arrived as a single child, so each grid cell held the entire
          list stacked and `grid-cols-3` quietly became one column.

          The failure is invisible in a DOM-only audit, because every element is
          present and the text is all there. What breaks is the grid: the cell
          count no longer matches the item count. So check that directly.

          Only `[data-reveal-item]` wrappers are checked. A singular `Reveal` is
          legitimately allowed to wrap several elements, such as a hero stack.
        */
        const crowdedReveals = [...document.querySelectorAll("[data-reveal-item]")]
          .filter((el) => el.children.length > 1)
          .slice(0, 3)
          .map(
            (el) =>
              `${el.children.length} siblings in one [data-reveal-item] (${String(el.className).slice(0, 40) || "no class"})`,
          );

        // Grid cells vs declared columns: catches a collapsed grid directly.
        const collapsedGrids = [...document.querySelectorAll("main *")]
          .filter((el) => {
            const cs = getComputedStyle(el);
            if (cs.display !== "grid" && cs.display !== "inline-grid") return false;
            const cols = cs.gridTemplateColumns.split(" ").filter(Boolean).length;
            // Only judge grids that actually declare multiple columns.
            if (cols < 2) return false;
            // A grid with fewer children than columns is not necessarily wrong
            // (a final partial row), so require a real shortfall.
            return el.children.length > 0 && el.children.length < Math.min(cols, 2);
          })
          .slice(0, 3)
          .map(
            (el) =>
              `${el.children.length} children in a ${getComputedStyle(el).gridTemplateColumns.split(" ").length} column grid`,
          );

        return {
          h1Count: document.querySelectorAll("h1").length,
          h1Text: (document.querySelector("h1")?.innerText || "").replace(/\s+/g, " ").trim(),
          headingSkips: skips,
          sections: document.querySelectorAll("main section").length,
          pendingNotes: document.querySelectorAll('[class*="rounded-card"][class*="bg-sunk"]').length,
          textLength: document.body.innerText.replace(/\s+/g, " ").trim().length,
          overflowing: wide,
          crowdedReveals,
          collapsedGrids,
        };
      });
    }

    const over = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (over > 1) entry.overflow.push(`${width}px:+${over}`);
    await page.close();
  }

  report.push(entry);
}

await browser.close();
await unlink(AXE_PATH).catch(() => {});

/*
  DUPLICATE CONTENT CHECK

  Two different routes serving byte-identical body text is almost never
  intentional, and it is invisible in a build log. A catch-all route that
  silently swallows unlisted paths produces exactly this: the 404 page, or
  another page, served at a URL that should have had its own content.

  Compare a normalised fingerprint of each page's visible text so a duplicate
  is reported against both routes.
*/
const fingerprints = new Map();
for (const e of report) {
  if (e.route === "/this-route-does-not-exist") continue;
  const key = `${e.checks.h1Text}|${e.checks.textLength}`;
  if (!fingerprints.has(key)) fingerprints.set(key, []);
  fingerprints.get(key).push(e.route);
}
const duplicates = [...fingerprints.values()].filter((g) => g.length > 1);

for (const e of report) {
  console.log(
    `${e.route.padEnd(28)} overflow:${(e.overflow.join(",") || "none").padEnd(12)} contrast:${e.contrast} h1:${e.checks.h1Count} skips:${e.checks.headingSkips} secs:${e.checks.sections} text:${e.checks.textLength}`,
  );
  if (e.checks.overflowing?.length) console.log("   wide:", e.checks.overflowing.join(" | "));
  if (e.checks.crowdedReveals?.length) console.log("   crowded reveal:", e.checks.crowdedReveals.join(" | "));
  if (e.checks.collapsedGrids?.length) console.log("   collapsed grid:", e.checks.collapsedGrids.join(" | "));
  if (e.contrastNodes?.length) console.log("   contrast:", e.contrastNodes.join("\n             "));
  if (e.errors.length) console.log("   js errors:", e.errors.join(" | "));
}

if (duplicates.length) {
  console.log("\nDUPLICATE CONTENT (same h1 and same text length):");
  for (const group of duplicates) console.log("  ", group.join(" == "));
}

const bad = report.filter(
  (e) =>
    e.contrast > 0 ||
    e.overflow.length ||
    e.errors.length ||
    e.checks.h1Count !== 1 ||
    e.checks.headingSkips > 0 ||
    e.checks.crowdedReveals?.length ||
    e.checks.collapsedGrids?.length ||
    (e.route !== "/this-route-does-not-exist" && e.checks.sections < 2),
);
console.log(`\nROUTES WITH ISSUES: ${bad.length} of ${report.length}`);
if (duplicates.length) console.log(`DUPLICATE CONTENT GROUPS: ${duplicates.length}`);
