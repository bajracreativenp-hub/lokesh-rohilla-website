/**
 * Drives the five entry navigation with a real mouse and keyboard, and asserts
 * the behaviour a static screenshot cannot show.
 *
 * Checks: the five entries appear in the right order, About and Services open a
 * dropdown and the other three do not, closed at rest, opens on hover and on
 * Enter, caret rotates, panel geometry, Escape closes and restores focus,
 * arrows move between entries, pointer leaving the bar closes, only one panel is
 * ever mounted, and all nine destinations are reachable from both the desktop
 * navigation and the mobile panel.
 *
 * Usage: node scripts/probe-nav.mjs [outDir]
 */
import puppeteer from "puppeteer-core";

import { CHROME, probeOut } from "./browser.mjs";
import { mkdir } from "node:fs/promises";

const URL = "http://localhost:3001";
const OUT = process.argv[2] ?? probeOut("lr-nav");

/** The nine destinations from the architecture. All must be reachable. */
const NINE = [
  "/about",
  "/services/business-consultation",
  "/services/self-development",
  "/services/leaders-teams",
  "/events",
  "/shop",
  "/blog",
  "/gallery",
  "/contact",
];

/** The five top level entries, in the order they must appear. */
const FIVE = ["About", "Services", "Events", "Shop", "Contact Us"];

/** Only these two open a dropdown. */
const DROPDOWNS = ["About", "Services"];

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: "networkidle0" });
await page.evaluate(() => new Promise((r) => setTimeout(r, 900)));

const report = {};

/*
  Top level entries are a mix of <button> (dropdown triggers) and <Link> (plain
  destinations), so both have to be collected.

  Scoped to `nav[aria-label="Primary"]` on purpose. The mobile panel is also a
  <nav> inside the same <header>, so an unscoped `header nav > ul > li` selector
  matches all ten entries and reports the five expected ones twice.
*/
const DESKTOP_NAV = 'nav[aria-label="Primary"]';

const topLevel = () =>
  page.evaluate(
    (scope) =>
      [...document.querySelectorAll(`${scope} > ul > li`)].map((li) => {
        const control = li.querySelector("button, a");
        return {
          label: (control?.textContent || "").trim(),
          tag: control?.tagName ?? null,
          expanded: control?.getAttribute("aria-expanded"),
          isTrigger: control?.tagName === "BUTTON",
        };
      }),
    DESKTOP_NAV,
  );

report.topLevel = await topLevel();

/** Opens a dropdown and reads its geometry. */
const state = () =>
  page.evaluate(() => {
    const trigger = [...document.querySelectorAll("header nav button")].find((b) =>
      /Services/.test(b.textContent || ""),
    );
    const panel = document.querySelector("header nav ul[aria-label]");
    return {
      expanded: trigger?.getAttribute("aria-expanded"),
      caretClass: trigger?.querySelector("svg")?.getAttribute("class") ?? null,
      panelPresent: Boolean(panel),
      panelRect: panel
        ? {
            w: Math.round(panel.parentElement.getBoundingClientRect().width),
            h: Math.round(panel.parentElement.getBoundingClientRect().height),
            radius: getComputedStyle(panel.parentElement).borderRadius,
            bg: getComputedStyle(panel.parentElement).backgroundColor,
            items: panel.querySelectorAll("li").length,
            offsetBelowBar: Math.round(
              panel.parentElement.getBoundingClientRect().top -
                document.querySelector("header > div").getBoundingClientRect().bottom,
            ),
          }
        : null,
    };
  });

report.rest = await state();

/** Centred coordinates of a top level entry, whether it is a button or a link. */
const boxOf = (label) =>
  page.evaluate(
    (want, scope) => {
      const el = [
        ...document.querySelectorAll(`${scope} > ul > li > button, ${scope} > ul > li > a`),
      ].find((x) => (x.textContent || "").trim() === want);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
    },
    label,
    DESKTOP_NAV,
  );

/*
  A point that is outside the header AND outside any open panel. An earlier
  version used a fixed (700, 700), which sits inside a wide open dropdown, so
  "leaving" never happened and the probe reported a failure that did not exist.
*/
const AWAY = { x: 1420, y: 880 };

const servicesBox = await boxOf("Services");
await page.mouse.move(servicesBox.x, servicesBox.y);
await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));
report.hover = await state();
await page.screenshot({ path: `${OUT}/1-hover-services.png` });

// About should swap the panel rather than stack a second one.
const aboutBox = await boxOf("About");
await page.mouse.move(aboutBox.x, aboutBox.y);
await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));
report.secondGroup = await page.evaluate(() => {
  const panels = [...document.querySelectorAll("header nav ul[aria-label]")];
  return {
    panelLabel: panels[0]?.getAttribute("aria-label"),
    items: [...(panels[0]?.querySelectorAll("li") ?? [])].map((li) =>
      li.textContent.trim().replace(/\s+/g, " ").slice(0, 44),
    ),
    openPanels: panels.length,
  };
});
await page.screenshot({ path: `${OUT}/2-hover-about.png` });

// Move away: the bar should close after the delay.
await page.mouse.move(AWAY.x, AWAY.y);
await page.evaluate(() => new Promise((r) => setTimeout(r, 700)));
report.afterLeave = await state();

/*
  Keyboard open from a cold state. Moving the mouse onto the trigger already
  opens it by hover, so a real mouse click would toggle it straight back shut.
  Focus the button and press Enter, which is the keyboard path a touch or screen
  reader user actually takes.
*/
await page.mouse.move(AWAY.x, AWAY.y);
await page.evaluate(() => new Promise((r) => setTimeout(r, 700)));
await page.evaluate(() => {
  [...document.querySelectorAll("header nav button")]
    .find((b) => /Services/.test(b.textContent || ""))
    ?.focus();
});
await page.keyboard.press("Enter");
await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));
report.clickOpen = await state();

await page.keyboard.press("Escape");
await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));
report.afterEscape = await page.evaluate(() => ({
  expanded: [...document.querySelectorAll("header nav button")]
    .find((b) => /Services/.test(b.textContent || ""))
    ?.getAttribute("aria-expanded"),
  focusRestored: document.activeElement?.textContent?.includes("Services") ?? false,
  panelPresent: Boolean(document.querySelector("header nav ul[aria-label]")),
}));

/*
  Caret rotation, read as a computed style rather than a class name.

  Reads the `rotate` property first, because Tailwind v4 implements `rotate-180`
  with the standalone CSS `rotate` property rather than `transform`. Checking
  `transform` alone reports "none" in both states and fails a caret that is
  visibly turning.
*/
report.caret = await page.evaluate(async () => {
  const btn = [...document.querySelectorAll("header nav button")].find((b) =>
    /Services/.test(b.textContent || ""),
  );
  const caret = btn.querySelector("svg");
  const read = () => {
    const cs = getComputedStyle(caret);
    return `${cs.rotate}|${cs.transform}`;
  };
  const before = read();
  btn.click();
  await new Promise((r) => setTimeout(r, 400));
  const after = read();
  btn.click();
  await new Promise((r) => setTimeout(r, 300));
  return { rotated: before !== after, before, after };
});

// Arrow keys between the five entries.
await page.mouse.move(AWAY.x, AWAY.y);
await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));
await page.evaluate(() => {
  document.querySelector("nav[aria-label=\"Primary\"] > ul > li > button, nav[aria-label=\"Primary\"] > ul > li > a")?.focus();
});
await page.keyboard.press("ArrowRight");
await page.keyboard.press("ArrowRight");
report.afterArrow = await page.evaluate(() => ({
  focused: document.activeElement?.textContent?.trim(),
}));

/*
  COVERAGE

  All nine destinations must be reachable from the navigation. Two of them,
  Shop and Contact, are top level links rather than dropdown entries, so this
  collects from BOTH the top level controls and the open panel. Scanning only
  panel links reported those two as missing, which was the probe being wrong,
  not the site.
*/
const hrefsSeen = new Set();
for (const label of FIVE) {
  await page.mouse.move(AWAY.x, AWAY.y);
  await page.evaluate(() => new Promise((r) => setTimeout(r, 250)));
  const box = await boxOf(label);
  if (!box) continue;
  await page.mouse.move(box.x, box.y);
  await page.evaluate(() => new Promise((r) => setTimeout(r, 350)));
  const found = await page.evaluate(
    (scope) =>
      [
        // The top level entry itself, whether it is a dropdown or a plain link.
        ...[...document.querySelectorAll(`${scope} > ul > li > a`)].map((a) =>
          a.getAttribute("href"),
        ),
        // Plus whatever its panel exposes.
        ...[...document.querySelectorAll(`${scope} ul[aria-label] a`)].map((a) =>
          a.getAttribute("href"),
        ),
      ].filter(Boolean),
    DESKTOP_NAV,
  );
  found.forEach((h) => hrefsSeen.add(h));
}
report.coverage = {
  reachable: NINE.filter((h) => hrefsSeen.has(h)),
  missing: NINE.filter((h) => !hrefsSeen.has(h)),
};

// Mobile: every destination present and flat.
await page.setViewport({ width: 390, height: 900, deviceScaleFactor: 1 });
await page.reload({ waitUntil: "networkidle0" });
await page.evaluate(() => new Promise((r) => setTimeout(r, 700)));
/* The desktop nav is display:none below xl, so click the disclosure button by
   its accessible name rather than a bare selector. */
await page.evaluate(() => {
  [...document.querySelectorAll("header button")]
    .find((b) => /open menu/i.test(b.textContent || ""))
    ?.click();
});
await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));
report.mobile = await page.evaluate((nine) => {
  const panel = [...document.querySelectorAll("header nav")].find(
    (n) => n.getAttribute("aria-label") === "Primary mobile",
  );
  const hrefs = [...panel.querySelectorAll("a")].map((a) => a.getAttribute("href"));
  return {
    links: hrefs.length,
    missing: nine.filter((h) => !hrefs.includes(h)),
    // A nested button in a flat list is the failure mode this guards.
    hasGroups: Boolean(panel.querySelector("button")),
  };
}, NINE);
await page.screenshot({ path: `${OUT}/3-mobile.png` });

console.log(JSON.stringify(report, null, 1));
await browser.close();

/*
  Hard assertions. A probe that only prints its findings is a probe nobody reads,
  so everything that matters fails the process.
*/
const failures = [];
const labels = report.topLevel.map((t) => t.label);

if (labels.join(" | ") !== FIVE.join(" | ")) {
  failures.push(`top level is "${labels.join(", ")}", expected "${FIVE.join(", ")}"`);
}
for (const label of DROPDOWNS) {
  if (!report.topLevel.find((t) => t.label === label)?.isTrigger) {
    failures.push(`${label} should be a dropdown trigger (a button), not a link`);
  }
}
for (const label of FIVE.filter((l) => !DROPDOWNS.includes(l))) {
  if (report.topLevel.find((t) => t.label === label)?.isTrigger) {
    failures.push(`${label} should be a plain link, not a dropdown trigger`);
  }
}
if (report.coverage.missing.length) {
  failures.push(`desktop nav cannot reach: ${report.coverage.missing.join(", ")}`);
}
if (report.mobile.missing.length) {
  failures.push(`mobile nav cannot reach: ${report.mobile.missing.join(", ")}`);
}
if (report.mobile.hasGroups) failures.push("mobile panel contains a nested dropdown button");
if (report.rest.panelPresent) failures.push("panel is open at rest");
if (!report.hover.panelPresent) failures.push("panel did not open on hover");
if (report.afterLeave.panelPresent) failures.push("panel did not close after pointer left");
if (report.clickOpen.panelPresent !== true) failures.push("panel did not open on Enter");
if (report.afterEscape.panelPresent) failures.push("Escape did not close the panel");
if (!report.afterEscape.focusRestored) failures.push("Escape did not restore focus to the trigger");
if (!report.caret.rotated) failures.push("caret did not rotate when the panel opened");
if (report.secondGroup.openPanels > 1) failures.push("more than one panel is mounted at once");

if (failures.length) {
  console.error("\nNAV FAILURES:\n  " + failures.join("\n  "));
  process.exit(1);
}
console.log(
  `\nNAV OK: 5 entries in order, 2 dropdowns, 9/9 destinations reachable from desktop and mobile.`,
);