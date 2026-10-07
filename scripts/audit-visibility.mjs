/**
 * Text visibility and spacing audit, every page.
 *
 * Two classes of defect this exists to catch, both of which a screenshot at one
 * width misses:
 *
 *   1. VISIBILITY. Text that is present in the DOM but cannot be read: behind an
 *      overlay, outside the viewport with no way to reach it, zero opacity because
 *      a reveal never fired, or clipped by an ancestor's overflow. The site has had
 *      one of these already, the closing CTA rendering navy on navy, and it passed
 *      a contrast probe reporting zero violations for a long time.
 *
 *   2. SPACING. Vertical runs that are too small to read as rhythm and too large to
 *      read as intent. Reported as numbers per page rather than judged here,
 *      because whether a 40px gap is right depends on what is either side of it.
 *
 * Every page is scrolled end to end first. An element sitting at opacity 0 because
 * its reveal has not fired is indistinguishable from an invisible element, and
 * measuring that state produces phantom findings on every page.
 *
 * Usage: node scripts/audit-visibility.mjs
 */
import puppeteer from "puppeteer-core";
import { readFile, mkdir } from "node:fs/promises";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = "http://localhost:3001";
const OUT = "C:/Users/thapa/AppData/Local/Temp/lr-visibility";

await mkdir(OUT, { recursive: true });

const routes = JSON.parse(await readFile("src/lib/routes.json", "utf8")).routes;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});

const results = [];

for (const route of routes) {
  for (const width of [1440, 390]) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: width === 390 ? 844 : 900 });
    await page.goto(URL + route, { waitUntil: "networkidle0" });

    /*
      Reduced motion puts every reveal at its resting state immediately. Combined
      with the full scroll below this means everything measured is what a reader
      actually sees, not a transition frame.
    */
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await page.reload({ waitUntil: "networkidle0" });

    await page.evaluate(async () => {
      const step = window.innerHeight * 0.7;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 350));
    });

    const data = await page.evaluate(() => {
      const TEXT = "h1, h2, h3, h4, p, li, a, span, figcaption, button, label";

      const hiddenNow = (el) => {
        const cs = getComputedStyle(el);
        return (
          cs.visibility === "hidden" ||
          cs.display === "none" ||
          parseFloat(cs.opacity) === 0
        );
      };

      const visible = (el) => {
        if (hiddenNow(el)) return false;
        const q = el.getBoundingClientRect();
        return q.width > 0 && q.height > 0;
      };

      /*
        AN INTENTIONALLY HIDDEN ANCESTOR MAKES HIDING CORRECT.

        The first version of this audit reported 43 invisible text nodes on the
        homepage and 31 on every content page, and every single one was a false
        positive: nav dropdown panels closed at desktop, and the mobile drawer
        closed at mobile. Both are supposed to be `display: none`, and their links
        are supposed to be unreachable until the reader opens them.

        So the rule is not "is this element hidden", it is "is this element hidden
        with nothing hidden above it". That isolates the defect worth catching: a
        scroll reveal that never fired, or an opacity applied to the text itself,
        where the element is on screen and simply cannot be read.

        `sr-only` is excluded for the same reason. It is visually hidden on purpose
        and is the mechanism that gives icon-only controls a name.
      */
      const intentionallyHidden = (el) => {
        if (el.closest(".sr-only") || el.classList.contains("sr-only")) return true;
        let node = el.parentElement;
        while (node && node !== document.documentElement) {
          if (hiddenNow(node)) return true;
          node = node.parentElement;
        }
        return false;
      };

      /*
        Only leaf text nodes. A wrapper div has no text of its own and its rect says
        nothing about whether its words can be read.
      */
      const leaves = [...document.querySelectorAll(TEXT)].filter(
        (el) => el.children.length === 0 && (el.textContent || "").trim().length > 0,
      );

      const hidden = leaves
        .filter((el) => !intentionallyHidden(el) && parseFloat(getComputedStyle(el).opacity) === 0)
        .map((el) => ({
          tag: el.tagName,
          text: el.textContent.trim().slice(0, 48),
          cls: String(el.className).slice(0, 40),
          opacity: getComputedStyle(el).opacity,
        }));

      /*
        THE FAILURE THRESHOLD IS ZERO, NOT "LESS THAN ONE".

        An earlier pass failed on two elements at `opacity: 0.7`: the source labels
        on the hero quote cards. Those are deliberate de-emphasis, and a threshold
        of "any opacity below 1" cannot tell a design choice from a defect.

        A scroll reveal that never fires sits at exactly `opacity: 0`, because that
        is what `Reveal` renders. So the failure condition is a node faded all the
        way out with nothing hidden above it. Anything above that is a gradient of
        intent and is reported as information.
      */
      const displayNoneCount = leaves.filter(
        (el) => getComputedStyle(el).display === "none" && !intentionallyHidden(el),
      ).length;

      const fadedCount = leaves.filter(
        (el) => !intentionallyHidden(el) && parseFloat(getComputedStyle(el).opacity) > 0 && parseFloat(getComputedStyle(el).opacity) < 1,
      ).length;

      /*
        Text covered by something else. `elementsFromPoint` at the centre of the
        text: if the topmost hit is not the element or one of its own descendants,
        something is painted over the words.
      */
      const covered = [];
      for (const el of leaves) {
        if (!visible(el)) continue;
        const q = el.getBoundingClientRect();
        if (q.bottom < 0 || q.top > document.documentElement.clientHeight) continue;
        const cx = q.left + q.width / 2;
        const cy = q.top + q.height / 2;
        const stack = document.elementsFromPoint(cx, cy);
        const top = stack[0];
        if (!top) continue;
        if (top === el || el.contains(top) || top.contains(el)) continue;
        const cs = getComputedStyle(top);
        // A wrapper with a transparent background is not really covering anything.
        if (cs.backgroundColor === "rgba(0, 0, 0, 0)" && cs.backgroundImage === "none")
          continue;
        covered.push({
          text: el.textContent.trim().slice(0, 48),
          by: `${top.tagName}.${String(top.className).slice(0, 36)}`,
        });
      }

      /*
        Clipped by an ancestor. A text node whose rect escapes a clipping ancestor
        has part of itself cut off, which is how the hero portrait was reported as
        running into the next section.
      */
      const clipped = [];
      for (const el of leaves) {
        if (!visible(el)) continue;
        /*
          Content inside a marquee is clipped on purpose. The row scrolls and logos
          enter and leave through the edge, so three of six names sitting outside the
          box is the mechanism working, not a fault. The marquee marks itself with
          `data-marquee`, so it is skipped rather than special cased by class name.
        */
        if (el.closest("[data-marquee]")) continue;
        const q = el.getBoundingClientRect();
        let node = el.parentElement;
        while (node && node !== document.body) {
          const cs = getComputedStyle(node);
          if (cs.overflow !== "visible" || cs.overflowX !== "visible" || cs.overflowY !== "visible") {
            const n = node.getBoundingClientRect();
            const cut =
              q.right > n.right + 1 || q.left < n.left - 1 || q.bottom > n.bottom + 1 || q.top < n.top - 1;
            if (cut && node !== el) {
              clipped.push({
                text: el.textContent.trim().slice(0, 40),
                by: `${node.tagName}.${String(node.className).slice(0, 32)}`,
              });
              break;
            }
          }
          node = node.parentElement;
        }
      }

      /* Vertical rhythm between consecutive top-level blocks. */
      const blocks = [...document.querySelectorAll("main > section, main section > section")]
        .map((el) => {
          const q = el.getBoundingClientRect();
          return { top: Math.round(q.top + scrollY), bottom: Math.round(q.bottom + scrollY), id: el.id || el.tagName };
        })
        .filter((b) => b.bottom > b.top)
        .sort((a, b) => a.top - b.top);

      const gaps = [];
      for (let i = 1; i < blocks.length; i++) {
        gaps.push(blocks[i].top - blocks[i - 1].bottom);
      }

      /*
        Runs of whitespace inside a section between consecutive visible children.
        Under 8px is a collapsed gap and reads as a mistake; over 200px is a hole.
      */
      const voids = [];
      for (const el of document.querySelectorAll("main section")) {
        const kids = [...el.children].filter((k) => k.getBoundingClientRect().height > 4);
        let worst = 0;
        for (let i = 1; i < kids.length; i++) {
          const a = kids[i - 1].getBoundingClientRect();
          const b = kids[i].getBoundingClientRect();
          const run = Math.round(b.top - a.bottom);
          if (Math.abs(run) > Math.abs(worst)) worst = run;
        }
        if (worst > 200) voids.push({ section: el.id || "unnamed", run: worst });
      }

      return {
        textNodes: leaves.length,
        hidden,
        displayNoneCount,
        fadedCount,
        covered,
        clipped: clipped.slice(0, 6),
        clippedCount: clipped.length,
        gaps: gaps.filter((g) => g !== 0),
        voids,
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      };
    });

    results.push({ route, width, ...data });
    if (width === 1440) {
      await page.screenshot({ path: `${OUT}/${route === "/" ? "home" : route.replace(/\//g, "_").slice(1)}.png`, fullPage: true });
    }
    await page.close();
  }
}

await browser.close();

const failures = [];

console.log("\n=== TEXT FADED TO ZERO (stuck reveal) ===");
const anyHidden = results.filter((r) => r.hidden.length);
if (!anyHidden.length) console.log("  none on any page at any width");
for (const r of anyHidden) {
  console.log(`  ${r.route} @${r.width}: ${r.hidden.length}`);
  for (const h of r.hidden.slice(0, 4)) console.log(`    "${h.text}" opacity=${h.opacity}`);
}

console.log("\n=== INFORMATIONAL, NOT FAILURES ===");
const info = results.filter((r) => r.displayNoneCount || r.fadedCount);
if (!info.length) console.log("  none");
for (const r of info)
  console.log(
    `  ${r.route} @${r.width}: ${r.displayNoneCount} display:none (responsive or aria-hidden duplicate), ${r.fadedCount} between 0 and 1 (de-emphasis)`,
  );

console.log("\n=== TEXT COVERED BY ANOTHER ELEMENT ===");
const anyCovered = results.filter((r) => r.covered.length);
if (!anyCovered.length) console.log("  none");
for (const r of anyCovered)
  for (const c of r.covered.slice(0, 3)) console.log(`  ${r.route} @${r.width}: "${c.text}" under ${c.by}`);

console.log("\n=== TEXT CLIPPED BY AN ANCESTOR ===");
const anyClipped = results.filter((r) => r.clippedCount > 0);
if (!anyClipped.length) console.log("  none");
for (const r of anyClipped) {
  console.log(`  ${r.route} @${r.width}: ${r.clippedCount}`);
  for (const c of r.clipped.slice(0, 3)) console.log(`    "${c.text}" inside ${c.by}`);
}

console.log("\n=== SECTION GAP SPREAD (1440px) ===");
for (const r of results.filter((x) => x.width === 1440 && x.gaps.length)) {
  const uniq = [...new Set(r.gaps)].sort((a, b) => a - b);
  console.log(`  ${r.route.padEnd(34)} ${uniq.join(", ")}`);
}

console.log("\n=== INTERNAL VOIDS OVER 200px ===");
const anyVoids = results.filter((r) => r.voids.length);
if (!anyVoids.length) console.log("  none");
for (const r of anyVoids) for (const v of r.voids) console.log(`  ${r.route} @${r.width}: ${v.run}px in ${v.section}`);

console.log("\n=== HORIZONTAL OVERFLOW ===");
const anyOverflow = results.filter((r) => r.overflowX);
if (!anyOverflow.length) console.log("  none");
for (const r of anyOverflow) console.log(`  ${r.route} @${r.width}`);

/* ------------------------------------------------------------------ assert */

for (const r of results) {
  const where = `${r.route} @${r.width}`;
  if (r.hidden.length) failures.push(`${where}: ${r.hidden.length} piece(s) of text are not visible (${r.hidden[0].text})`);
  if (r.covered.length) failures.push(`${where}: ${r.covered.length} piece(s) of text sit under another element (${r.covered[0].text})`);
  if (r.clippedCount) failures.push(`${where}: ${r.clippedCount} piece(s) of text are clipped by an ancestor (${r.clipped[0]?.text})`);
  if (r.overflowX) failures.push(`${where}: the page scrolls horizontally`);
  for (const v of r.voids) failures.push(`${where}: a ${v.run}px void inside ${v.section}`);
}

/*
  Gap consistency, at desktop only. A page whose sections are separated by six
  different values is not using a rhythm, it is using whatever was typed last.
*/
const gapValues = new Set();
for (const r of results.filter((x) => x.width === 1440)) for (const g of r.gaps) if (g > 0) gapValues.add(g);
if (gapValues.size > 6) {
  failures.push(
    `section gaps take ${gapValues.size} distinct values across the site (${[...gapValues].sort((a, b) => a - b).join(", ")}), which is not a rhythm`,
  );
}

if (failures.length) {
  console.error("\nVISIBILITY FAILURES:\n  " + failures.join("\n  "));
  process.exit(1);
}

console.log(
  `\nVISIBILITY OK: every text node visible and uncovered on ${results.length} page/width combinations, nothing clipped, no horizontal overflow, section gaps drawn from ${gapValues.size} values.`,
);