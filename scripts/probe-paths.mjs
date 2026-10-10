/**
 * Drives the path selector interaction and captures each state.
 *
 * Verifies the behaviour that cannot be checked from a static screenshot: the
 * active row inking up, siblings dimming, the Explore pill fading in, and the
 * detail panel cross-fading to the right path. Also checks keyboard focus
 * produces the same state as hover.
 *
 * Usage: node scripts/probe-paths.mjs [outDir]
 */
import puppeteer from "puppeteer-core";

import { CHROME, probeOut } from "./browser.mjs";
import { mkdir } from "node:fs/promises";

const URL = "http://localhost:3001";
const OUT = process.argv[2] ?? probeOut("lr-paths");

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: "networkidle0" });

await page.evaluate(() => {
  const h = [...document.querySelectorAll("main h2")].find((x) =>
    x.textContent.includes("What I Help Transform"),
  );
  const section = h.closest("section");
  window.scrollTo({
    top: section.getBoundingClientRect().top + window.scrollY - 40,
    behavior: "instant",
  });
});
await page.evaluate(() => new Promise((r) => setTimeout(r, 1200)));

const read = () =>
  page.evaluate(() => {
    const rows = [...document.querySelectorAll('main section ul a[href^="/"]')].filter((a) =>
      ["Businesses", "Individuals", "Leaders & Teams"].some((w) => a.textContent.includes(w)),
    );
    const pillOf = (a) => {
      const pill = [...a.querySelectorAll("span")].find((s) => s.textContent.includes("Explore"));
      return pill ? Math.round(parseFloat(getComputedStyle(pill).opacity) * 100) / 100 : null;
    };
    const panel = document.querySelector(".sticky.top-28");
    /*
      The right column no longer holds a list or a logo strip. It holds a
      photograph for the active path, so the probe reads the image slot and its
      spec rather than item text.

      The slot carries the spec in a data attribute, which means the assertion
      can check that the right photograph is the one for the active path, rather
      than only that something is rendered.
    */
    const photo = panel?.querySelector("[data-asset-spec]") ?? null;
    const activeElement = document.activeElement;
    return {
      rows: rows.map((a) => ({
        word: a.textContent.replace("Explore", "").trim(),
        color: getComputedStyle(a.firstElementChild).color,
        pillOpacity: pillOf(a),
      })),
      // Index of the row holding DOM focus, or null when focus is elsewhere.
      // Needed to assert that focus activates its own row rather than some
      // unrelated row a previous interaction left active.
      focusedRowIndex: rows.findIndex((a) => a === activeElement || a.contains(activeElement)),
      panelEyebrow: panel?.querySelector("p")?.textContent?.trim() ?? null,
      /*
        The slot carries its own label in `data-asset-slot`. Reading it from the
        nested markup instead, via `.slot-label span span`, matches nothing:
        the two inner elements are siblings, not nested. That reported "no
        photograph" on a photograph that was rendering correctly.
      */
      photoLabel: photo?.getAttribute("data-asset-slot") ?? null,
      photoSpec: photo?.getAttribute("data-asset-spec") ?? null,
      // The panel must be a bare image now: no card background, no padding.
      panelHasCardChrome: (() => {
        if (!panel) return false;
        const cs = getComputedStyle(panel);
        return (
          cs.backgroundColor !== "rgba(0, 0, 0, 0)" || parseFloat(cs.paddingLeft) > 0
        );
      })(),
      // The photograph must hold its declared 4:3 ratio.
      photoRatio: photo
        ? (() => {
            const r = photo.getBoundingClientRect();
            return r.height > 0 ? Math.round((r.width / r.height) * 100) / 100 : null;
          })()
        : null,
      // Service areas live under each path word in the left column.
      serviceItemsUnderWord: rows.map((a) => {
        const list = a.parentElement.querySelector("ul");
        return list ? list.querySelectorAll("li").length : 0;
      }),
    };
  });

const report = { rest: await read() };
await page.screenshot({ path: `${OUT}/1-rest.png` });

// Hover the third row.
const rows = await page.$$('main section ul a[href^="/"]');
const targets = [];
for (const r of rows) {
  const txt = await page.evaluate((el) => el.textContent, r);
  if (/Businesses|Individuals|Leaders/.test(txt)) targets.push(r);
}
await targets[2].hover();
await page.evaluate(() => new Promise((r) => setTimeout(r, 900)));
report.hoverThird = await read();
await page.screenshot({ path: `${OUT}/2-hover-third.png` });

await targets[1].hover();
await page.evaluate(() => new Promise((r) => setTimeout(r, 900)));
report.hoverSecond = await read();
await page.screenshot({ path: `${OUT}/3-hover-second.png` });

// Keyboard: focus the first row and confirm the same state change happens.
await page.evaluate(() => document.activeElement?.blur());
await page.evaluate(() => {
  const a = [...document.querySelectorAll('main section ul a[href^="/"]')].find((x) =>
    x.textContent.includes("Businesses"),
  );
  a.focus();
});
await page.evaluate(() => new Promise((r) => setTimeout(r, 900)));
report.keyboardFocus = await read();
await page.screenshot({ path: `${OUT}/4-keyboard.png` });

// Mobile: every path's items must be present in the flow, pills always visible.
await page.setViewport({ width: 390, height: 900, deviceScaleFactor: 1 });
await page.reload({ waitUntil: "networkidle0" });
await page.evaluate(() => {
  const h = [...document.querySelectorAll("main h2")].find((x) =>
    x.textContent.includes("What I Help Transform"),
  );
  window.scrollTo({ top: h.closest("section").getBoundingClientRect().top + window.scrollY - 20, behavior: "instant" });
});
await page.evaluate(() => new Promise((r) => setTimeout(r, 900)));
report.mobile = await page.evaluate(() => {
  const sec = [...document.querySelectorAll("main section")].find((s) =>
    s.querySelector("h2")?.textContent.includes("What I Help Transform"),
  );
  const visibleLists = [...sec.querySelectorAll("ul")].filter((u) => u.offsetParent !== null);
  const pills = [...sec.querySelectorAll("a span span")].filter((s) => s.textContent.includes("Explore"));
  return {
    visibleItemLists: visibleLists.length,
    totalItems: visibleLists.reduce((n, u) => n + u.querySelectorAll("li").length, 0),
    pillsVisible: pills.length,
    minPillOpacity: Math.min(...pills.map((p) => parseFloat(getComputedStyle(p).opacity))),
  };
});
await page.screenshot({ path: `${OUT}/5-mobile.png` });

console.log(JSON.stringify(report, null, 1));
await browser.close();

/*
  Hard assertions.
*/
const failures = [];
const asRead = (x) => (typeof x === "object" && x !== null ? x : report.rest);

if (asRead(report.rest).rows.length !== 3) {
  failures.push(`expected 3 path rows, found ${asRead(report.rest).rows.length}`);
}
if (!asRead(report.rest).panelEyebrow) {
  failures.push("the detail panel has no eyebrow");
}
for (const key of ["hoverThird", "hoverSecond", "keyboardFocus"]) {
  const state = asRead(report[key]);
  if (!state) {
    failures.push(`${key} produced no reading`);
    continue;
  }
  if (state.rows.length !== 3) failures.push(`${key}: ${state.rows.length} rows, expected 3`);
  // Exactly one row may be at full ink; the siblings must dim.
  const active = state.rows.filter((r) => parseFloat(r.pillOpacity ?? "0") > 0);
  if (active.length !== 1) {
    failures.push(`${key}: ${active.length} rows show the Explore pill, expected exactly 1`);
  }
  // The photograph must change with the active path, and must be there at all.
  if (!state.photoLabel) {
    failures.push(`${key}: no photograph in the right column`);
  }
  if (state.photoRatio !== null && Math.abs(state.photoRatio - 4 / 3) > 0.02) {
    failures.push(`${key}: photograph ratio is ${state.photoRatio}, expected 4:3`);
  }
  // The panel must be a bare image: no card background or padding left behind.
  if (state.panelHasCardChrome) {
    failures.push(`${key}: the right column still has panel background or padding`);
  }
  // Keyboard focus must activate the row that actually has focus.
  //
  // An earlier version compared the focused row against a hover of the *third*
  // row and demanded they matched. They cannot: focusing row 0 and hovering row
  // 2 are different interactions and should select different rows. The check
  // that matters is that focus selects its own row, not that focus and an
  // unrelated hover agree.
  if (key === "keyboardFocus") {
    const focusedIndex = state.focusedRowIndex;
    const activeIndex = state.rows.findIndex((r) => parseFloat(r.pillOpacity ?? "0") > 0);
    if (focusedIndex === null) {
      failures.push("could not determine which row holds focus");
    } else if (focusedIndex !== activeIndex) {
      failures.push(
        `row ${focusedIndex} has focus but row ${activeIndex} is active; they must match`,
      );
    }
    // And the siblings must dim, or focus is not producing the same state.
    const dimmed = state.rows.filter((r, i) => i !== focusedIndex && r.color !== state.rows[focusedIndex]?.color);
    if (dimmed.length !== 2) {
      failures.push(`only ${dimmed.length} siblings dimmed on focus, expected 2`);
    }
  }
  // Each path must keep its own service list, or the three are indistinguishable.
  const lists = state.serviceItemsUnderWord ?? [];
  if (lists.some((n) => n === 0)) {
    failures.push(`${key}: a path has no service items under its word (${lists.join(",")})`);
  }
  if (new Set(lists).size < 2) {
    failures.push(`${key}: every path shows the same service list (${lists.join(",")})`);
  }
}

/*
  The photograph must be the one belonging to the active path.

  This is the assertion that catches the failure mode specific to this design:
  three identical placeholders that render fine but never actually swap. Reading
  the slot's own label, rather than counting elements, is what proves the swap
  happened.
*/
const rest = asRead(report.rest);
if (!rest.photoLabel) failures.push("no photograph at rest");

const labels = {
  hoverThird: "Leadership workshop",
  hoverSecond: "Self-development session",
  keyboardFocus: "Business consultation",
};
for (const [key, expected] of Object.entries(labels)) {
  const state = asRead(report[key]);
  if (!state?.photoLabel) continue;
  if (!state.photoLabel.includes(expected)) {
    failures.push(
      `${key}: photograph shows "${state.photoLabel}", expected the one for "${expected}"`,
    );
  }
}

if (failures.length) {
  console.error("\nPATHS FAILURES:\n  " + failures.join("\n  "));
  process.exit(1);
}
console.log(
  "\nPATHS OK: focus activates its own row, siblings dim, one pill visible, the photograph changes per path at 4:3, each path keeps its own list.",
);
