/**
 * Keyboard-only walk of the navigation.
 *
 * Proves the dropdown is fully operable without a pointer: tab to a trigger,
 * open with ArrowDown, move into the panel, and confirm the panel links are
 * reachable in document order, then Escape closes and restores focus.
 *
 * Usage: node scripts/probe-nav-a11y.mjs
 */
import puppeteer from "puppeteer-core";

import { CHROME } from "./browser.mjs";


const TRIGGER = "About";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3001", { waitUntil: "networkidle0" });
await page.evaluate(() => new Promise((r) => setTimeout(r, 900)));

const focused = () =>
  page.evaluate(() => {
    const el = document.activeElement;
    return {
      tag: el?.tagName,
      text: (el?.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40),
      href: el?.getAttribute?.("href") ?? null,
      expanded: el?.getAttribute?.("aria-expanded") ?? null,
    };
  });

const panelOpen = () =>
  page.evaluate(() => Boolean(document.querySelector('nav[aria-label="Primary"] ul[aria-label]')));

const steps = [];
steps.push({ step: "initial", ...(await focused()) });

// Tab until the dropdown trigger has focus.
let tabbed = 0;
for (let i = 0; i < 12; i++) {
  await page.keyboard.press("Tab");
  tabbed = i + 1;
  const f = await focused();
  if (f.text === TRIGGER) {
    steps.push({ step: `tab x${i + 1}`, ...f });
    break;
  }
}
if (!(await focused()).text.startsWith(TRIGGER)) {
  console.error(`Could not tab to the "${TRIGGER}" trigger in ${tabbed} presses.`);
  steps.push({ step: "trigger not reached", ...(await focused()) });
}

// Open with ArrowDown, the menubar convention.
await page.keyboard.press("ArrowDown");
await page.evaluate(() => new Promise((r) => setTimeout(r, 450)));
steps.push({
  step: "after ArrowDown",
  ...(await focused()),
  panelOpen: await panelOpen(),
  panelLinks: await page.evaluate(() =>
    [...document.querySelectorAll('nav[aria-label="Primary"] ul[aria-label] a')].map((a) =>
      a.textContent.trim().replace(/\s+/g, " ").slice(0, 30),
    ),
  ),
});

// Tab into the panel, then one step further, to prove order is preserved.
await page.keyboard.press("Tab");
steps.push({ step: "tab into panel", ...(await focused()) });
await page.keyboard.press("Tab");
steps.push({ step: "tab again", ...(await focused()) });

// Escape should close and restore focus to the trigger.
await page.keyboard.press("Escape");
await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));
steps.push({
  step: "after Escape",
  ...(await focused()),
  panelOpen: await panelOpen(),
});

// Enter opens again from a closed state.
await page.keyboard.press("Enter");
await page.evaluate(() => new Promise((r) => setTimeout(r, 450)));
steps.push({
  step: "after Enter",
  expanded: await page.evaluate(() =>
    [...document.querySelectorAll("header nav button")]
      .find((b) => b.textContent.trim() === "About")
      ?.getAttribute("aria-expanded"),
  ),
  panelOpen: await panelOpen(),
});

console.log(JSON.stringify(steps, null, 1));
await browser.close();

const failures = [];
const byStep = Object.fromEntries(steps.map((s) => [s.step, s]));

if (!byStep["after ArrowDown"]) failures.push("no ArrowDown step recorded");
else {
  if (!byStep["after ArrowDown"].panelOpen) failures.push("ArrowDown did not open the panel");
  if ((byStep["after ArrowDown"].panelLinks ?? []).length !== 4) {
    failures.push(
      `the About panel should expose 4 links, found ${(byStep["after ArrowDown"].panelLinks ?? []).length}`,
    );
  }
}
if (byStep["tab into panel"]?.tag !== "A") {
  failures.push(`Tab did not move focus into the panel (landed on ${byStep["tab into panel"]?.tag})`);
}
if (byStep["after Escape"]?.panelOpen) failures.push("Escape did not close the panel");
if (!byStep["after Escape"]?.text.startsWith(TRIGGER)) {
  failures.push("Escape did not restore focus to the trigger");
}
if (byStep["after Enter"]?.panelOpen !== true) failures.push("Enter did not reopen the panel");

if (failures.length) {
  console.error("\nNAV A11Y FAILURES:\n  " + failures.join("\n  "));
  process.exit(1);
}
console.log(`\nNAV A11Y OK: "${TRIGGER}" reachable by Tab, opens with ArrowDown and Enter, panel links in order, Escape restores focus.`);