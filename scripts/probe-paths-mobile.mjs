/**
 * Path selector, across breakpoints.
 *
 * The structure changed once already: the service areas moved out of the detail
 * panel and into the left column, at every width rather than only on touch. The
 * panel now holds the client logo strip, which is shared by all three paths.
 *
 * So the job of this probe changed with it. It used to assert "exactly one of
 * the two item lists is ever visible", because the panel and the mobile list
 * were duplicates. That is no longer the design: the left column list is now the
 * only place a path's own service areas appear, and it must be visible at every
 * width, because with the logos shared it is the only thing distinguishing one
 * path from another.
 *
 * Usage: node scripts/probe-paths-mobile.mjs
 */
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = "http://localhost:3001";
const OUT = "C:/Users/thapa/AppData/Local/Temp/lr-paths";
await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});

const WORDS = ["Businesses", "Individuals", "Leaders & Teams"];
const out = {};

for (const width of [390, 768, 1440]) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    const h = [...document.querySelectorAll("main h2")].find((x) =>
      x.textContent.includes("What I Help Transform"),
    );
    window.scrollTo({
      top: h.closest("section").getBoundingClientRect().top + window.scrollY - 20,
      behavior: "instant",
    });
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 900)));

  out[width] = await page.evaluate((words) => {
    const sec = [...document.querySelectorAll("main section")].find((s) =>
      s.querySelector("h2")?.textContent.includes("What I Help Transform"),
    );
    const vis = (el) => el.offsetParent !== null;

    // Matched by word rather than by href. The hrefs moved to
    // /services/* in the restructure, and a stale href selector silently matched
    // nothing and reported zero rows on every width.
    const rowLinks = [...sec.querySelectorAll("ul > li > a")].filter((a) =>
      words.some((w) => a.textContent.includes(w)),
    );
    const pills = rowLinks.map((a) =>
      [...a.querySelectorAll("span")].find((c) => c.textContent.includes("Explore")),
    );
    /*
      Pills are hidden with `opacity-0`, not `display:none`, so `offsetParent` is
      non-null for all three and cannot tell them apart. Measure the opacity the
      user actually sees.
    */
    const pillOpacities = pills.map((p) => (p ? parseFloat(getComputedStyle(p).opacity) : null));
    const pillsShowing = pillOpacities.filter((o) => o !== null && o > 0).length;
    const panel = sec.querySelector(".sticky");
    /*
      Desktop shows one photograph, for the active path. Below lg there is no
      right column and no hover, so every path renders its own photograph inline
      under its word. Both are counted here so neither can silently disappear.
    */
    const photoSlots = [...sec.querySelectorAll("main [data-asset-spec]")].filter((el) =>
      sec.contains(el),
    );
    const inlinePhotos = photoSlots.filter((el) => el.offsetParent !== null);

    // Each row's own service list, which lives in the left column now.
    const perRowItems = rowLinks.map((a) => {
      const list = a.parentElement.querySelector("ul");
      if (!list) return 0;
      return [...list.querySelectorAll("li")].filter(vis).length;
    });

    return {
      rows: rowLinks.length,
      pillsRendered: pills.filter(Boolean).length,
      pillsShowing,
      pillOpacities,
      panelVisible: panel ? vis(panel) : null,
      photosVisible: inlinePhotos.length,
      photosRendered: photoSlots.length,
      serviceItemsPerPath: perRowItems,
      // Destination label, mobile only: there is no panel to name it there.
      destinationLabelsVisible: [...sec.querySelectorAll("p")].filter(
        (p) => vis(p) && /Explore/.test(p.textContent),
      ).length,
    };
  }, WORDS);

  await page.screenshot({ path: `${OUT}/mobile-${width}.png` });
  await page.close();
}

console.log(JSON.stringify(out, null, 1));
await browser.close();

const failures = [];
for (const width of [390, 768, 1440]) {
  const r = out[width];
  if (r.rows !== 3) failures.push(`${width}px: ${r.rows} path rows, expected 3`);
  if (r.serviceItemsPerPath.some((n) => n === 0)) {
    failures.push(
      `${width}px: a path has no visible service items (${r.serviceItemsPerPath.join(",")})`,
    );
  }
  if (new Set(r.serviceItemsPerPath).size < 2) {
    failures.push(
      `${width}px: all paths show the same service items (${r.serviceItemsPerPath.join(",")})`,
    );
  }

  const isDesktop = width >= 1024;
  if (isDesktop) {
    if (!r.panelVisible) failures.push(`${width}px: the photograph column should be visible`);
    // Exactly one photograph on desktop: the one for the active path.
    if (r.photosVisible !== 1) {
      failures.push(`${width}px: ${r.photosVisible} photographs visible, expected 1`);
    }
    // The probe never hovers or focuses the section, so `engaged` is false and no
    // row is active. Zero pills showing is the correct resting state. Expecting
    // one here would be asserting that the section engages on its own.
    if (r.pillsShowing !== 0) {
      failures.push(
        `${width}px: ${r.pillsShowing} Explore pills showing with no pointer or focus, expected 0`,
      );
    }
    if (r.destinationLabelsVisible !== 0) {
      failures.push(`${width}px: ${r.destinationLabelsVisible} mobile destination labels showing`);
    }
  } else {
    if (r.panelVisible) failures.push(`${width}px: the photograph column must be hidden below lg`);
    // Three photographs, one per path, inline. There is no hover on touch, so
    // all three have to be present or a visitor never sees two of them.
    if (r.photosVisible !== 3) {
      failures.push(
        `${width}px: ${r.photosVisible} photographs visible, expected 3 (one per path, inline)`,
      );
    }
    if (r.destinationLabelsVisible !== 3) {
      failures.push(
        `${width}px: ${r.destinationLabelsVisible} destination labels, expected 3. With the right column hidden there is nothing else naming the destination.`,
      );
    }
  }
}

if (failures.length) {
  console.error("\nPATHS RESPONSIVE FAILURES:\n  " + failures.join("\n  "));
  process.exit(1);
}
console.log(
  "\nPATHS RESPONSIVE OK: one photograph on desktop for the active path, three inline on mobile, every path keeps its own list, destinations named on mobile.",
);