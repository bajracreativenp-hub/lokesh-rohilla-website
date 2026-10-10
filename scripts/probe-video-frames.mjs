/**
 * Extracts frames from a local video so they can be looked at.
 *
 * Chrome will not seek a `file://` video, and the read tool cannot interpret
 * video, so the file is served over HTTP and seeked in a real browser.
 *
 * Usage: node scripts/probe-video-frames.mjs <url> <outDir> [count]
 */
import puppeteer from "puppeteer-core";

import { CHROME, probeOut } from "./browser.mjs";
import { mkdir } from "node:fs/promises";

const URL = process.argv[2];
const OUT = process.argv[3] ?? probeOut("lr-frames");
const COUNT = Number(process.argv[4] ?? 12);

if (!URL) {
  console.error("usage: node scripts/probe-video-frames.mjs <url> <outDir> [count]");
  process.exit(1);
}

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars", "--autoplay-policy=no-user-gesture-required"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });

// A bare player sized to the video's own dimensions, so the frame is not
// letterboxed against the browser chrome.
await page.setContent(`
  <body style="margin:0;background:#111;display:grid;place-items:center;height:100vh">
    <video id="v" src="${URL}" muted playsinline preload="auto" style="max-width:100%;max-height:100vh"></video>
  </body>
`);

const meta = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const v = document.getElementById("v");
      const done = () =>
        resolve({
          duration: v.duration,
          width: v.videoWidth,
          height: v.videoHeight,
        });
      if (v.readyState >= 1) done();
      else v.addEventListener("loadedmetadata", done, { once: true });
      setTimeout(() => resolve({ duration: v.duration, width: v.videoWidth, height: v.videoHeight }), 20000);
    }),
);

console.log("metadata:", JSON.stringify(meta));

if (!meta.duration || !isFinite(meta.duration)) {
  console.error("could not read the duration; the codec is probably unsupported by this Chrome build.");
  await browser.close();
  process.exit(1);
}

/** Seeks and waits for the frame to actually be decoded, not just for seeked. */
async function frameAt(seconds) {
  await page.evaluate(async (t) => {
    const v = document.getElementById("v");
    await new Promise((resolve) => {
      const onSeeked = () => requestAnimationFrame(() => resolve());
      v.addEventListener("seeked", onSeeked, { once: true });
      v.currentTime = t;
    });
  }, seconds);
  await new Promise((r) => setTimeout(r, 260));
}

const frames = [];
for (let i = 0; i < COUNT; i++) {
  // Sample across the recording, skipping the very first and last instant.
  const t = (meta.duration * (i + 0.5)) / COUNT;
  await frameAt(t);
  const file = `${OUT}/frame-${String(i).padStart(2, "0")}.png`;
  await page.screenshot({ path: file });
  frames.push({ t: Math.round(t * 10) / 10, file });
}

console.log(JSON.stringify(frames, null, 1));
await browser.close();