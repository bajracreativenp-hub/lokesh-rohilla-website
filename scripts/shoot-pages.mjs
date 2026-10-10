/**
 * Full page screenshots, for looking at rather than measuring.
 *
 * Usage: node scripts/shoot-pages.mjs [route ...]
 */
import puppeteer from "puppeteer-core";

import { CHROME, probeOut } from "./browser.mjs";
import { mkdir } from "node:fs/promises";

const URL = "http://localhost:3001";
const OUT = probeOut("lr-shots");
await mkdir(OUT, { recursive: true });

const routes = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["/"];

const width = Number(process.env.W ?? 1440);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});

for (const route of routes) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
  await page.goto(URL + route, { waitUntil: "networkidle0" });
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 140));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 700));
  });
  const name = route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, "");
  await page.screenshot({ path: `${OUT}/${name}-${width}.png`, fullPage: true });
  console.log(`${OUT}/${name}-${width}.png`);
  await page.close();
}

await browser.close();