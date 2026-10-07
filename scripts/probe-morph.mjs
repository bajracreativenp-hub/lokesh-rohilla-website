import puppeteer from "puppeteer-core";

/*
 * PROBE: does the morph filter eat the letterforms?
 *
 * WHAT THIS EXISTS FOR.
 *
 * The threshold filter remaps alpha to `S*A - O`. Any pixel whose alpha after the
 * blur falls below O/S is deleted outright, and any pixel above it is forced fully
 * solid, so the filter can only ever erode a glyph or inflate it. On display type both
 * are plainly visible, and erosion is the dangerous direction: at 60px, a roughly 3px
 * stroke blurred by 4 and then cut at the original 18/-7 lands near alpha 0.29, below
 * the 0.39 cut, so the middle of every stroke is removed and the settled word renders
 * as fragments.
 *
 * That is worth catching mechanically. The settled state is what a visitor looks at
 * for most of the time, and the hero probe examines the section as a whole, so nothing
 * else here would notice.
 *
 * CORE SURVIVAL, NOT AREA. THIS IS THE PART THAT WAS GETTING IT WRONG.
 *
 * The first version of this compared total ink area, filtered against unfiltered, and
 * reported the current filter at 0.987, which read as a pass. The word was visibly
 * wrecked. The reason is that a wider blur inflates the antialiased halo around every
 * stroke at the same time as it erodes the stroke core, so the two effects cancel in
 * the total and a badly damaged word scores the same as an intact one.
 *
 * So the metric is erosion of the CORE. The unfiltered mask is eroded by one pixel
 * with a 3x3 minimum, which keeps only pixels with all eight neighbours also inked,
 * and that is the part of a stroke the filter has to preserve. The score is the
 * fraction of those core pixels still inked in the filtered render.
 *
 * Measured, sweeping the two parameters against both metrics:
 *
 *   stdDev 3    area 1.076   core 0.902
 *   stdDev 2.5  area 1.144   core 0.961
 *   stdDev 2    area 1.168   core 0.979
 *   stdDev 1.5  area 1.167   core 0.993
 *   stdDev 1    area 1.149   core 1.000
 *
 * Note how the area column barely moves while core collapses. That is the whole
 * reason this metric exists.
 *
 * THE BANDS, AND WHY THE UPPER ONE IS LOOSE.
 *
 * Floor at 0.97: below that, stroke cores have separated and the glyphs stop reading
 * as letters. A little erosion is not a defect, it is what gives the morph its fused
 * edges, and asking for 1.00 would be asking for the effect not to work.
 *
 * The ceiling is 1.35 rather than something tight, and it exists for a different
 * reason: inflation. Too little blur and too soft a cut thickens every stroke until
 * adjacent letters meet and counters close. The measured values sit at or above 1.0
 * because blur inflates, and the band is set where the settled word still looks like
 * the unfiltered one rather than at the arithmetic midpoint.
 *
 * WHY THE PIXELS ARE COUNTED IN THE BROWSER.
 *
 * An earlier draft decoded the PNGs in Node with pngjs, which is not a dependency of
 * this project, and adding a package to assert something a browser can already do was
 * not worth it. The capture comes back as base64, `createImageBitmap` decodes it off
 * the main thread, and `getImageData` does the rest in the same process that produced
 * the image, so there is no encoder to disagree with.
 *
 * WHY PIXELS ARE COUNTED BY COLOUR RATHER THAN AS "NOT BACKGROUND".
 *
 * The word is `text-accent`, royal blue on a dark canvas, so the pixels of interest
 * are the ones where blue clearly exceeds red. The antialiased halo is a low-alpha
 * version of the same hue and belongs to the glyph, so counting by hue keeps it with
 * the stroke instead of with the page.
 */

const MIN_CORE = 0.97;
const MAX_AREA = 1.35;

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto("http://localhost:3001/", { waitUntil: "networkidle0" });

/*
 * Wait for a settled word rather than sleeping a fixed time.
 *
 * A fixed sleep races the loop: the morph starts at HOLD_MS, and a capture landing
 * inside it measures a warped mid transition word and reports the motion as if it were
 * erosion. Polling the displacement scale for zero twice in a row means the capture is
 * genuinely at rest.
 */
const settled = await page.evaluate(async () => {
  const disp = () => document.querySelector("feDisplacementMap");
  let zeros = 0;
  const deadline = performance.now() + 12000;
  while (performance.now() < deadline) {
    zeros = disp() && disp().getAttribute("scale") === "0" ? zeros + 1 : 0;
    if (zeros > 15) return true;
    await new Promise((r) => setTimeout(r, 50));
  }
  return false;
});

if (!settled) {
  console.error(
    "MORPH PROBE: never reached a settled word, so nothing was measured",
  );
  await browser.close();
  process.exit(1);
}

const clip = await page.evaluate(() => {
  const r = document.querySelector("[data-morph-stage]").getBoundingClientRect();
  return {
    x: Math.max(0, Math.round(r.left)),
    y: Math.max(0, Math.round(r.top)),
    width: Math.round(r.width),
    height: Math.round(r.height),
  };
});

/*
 * The unfiltered capture is the ground truth, so it is taken first and with the filter
 * genuinely off. The inline value is read rather than assumed, because this component
 * sets the filter from a React style prop and an earlier draft cleared the style
 * attribute outright, which left NO filter on the stage and made every parameter look
 * perfect.
 */
const prior = await page.evaluate(() => {
  const stage = document.querySelector("[data-morph-stage]");
  const existing = stage.style.filter;
  stage.style.filter = "none";
  window.__priorFilter = existing;
  return existing;
});
const plain = await page.screenshot({ encoding: "base64", clip });
await page.evaluate((value) => {
  document.querySelector("[data-morph-stage]").style.filter = value;
}, prior);

const filtered = await page.screenshot({ encoding: "base64", clip });

const measured = await page.evaluate(
  async (plainData, filteredData) => {
    const load = async (data) => {
      const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
      const bitmap = await createImageBitmap(
        new Blob([bytes], { type: "image/png" }),
      );
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(bitmap, 0, 0);
      const { data: px } = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      const mask = new Uint8Array(canvas.width * canvas.height);
      for (let i = 0, j = 0; i < px.length; i += 4, j++) {
        /* Blue over red identifies the accent hue. Green is skipped deliberately:
           royal blue is judged on the gap between blue and red, and including green
           only widens the accepted range without adding any discrimination. */
        const r = px[i];
        const b = px[i + 2];
        const a = px[i + 3];
        mask[j] = a >= 32 && b > r + 24 && b > 90 && r < 190 ? 1 : 0;
      }
      return { mask, width: canvas.width, height: canvas.height };
    };

    const plain_ = await load(plainData);
    const filtered_ = await load(filteredData);

    /*
      3x3 minimum is a one pixel binary erosion. A pixel survives as core only if all
      eight neighbours are inked in the unfiltered mask, which is exactly the interior
      of a stroke and never the halo.
    */
    const { mask, width, height } = plain_;
    const inked = (x, y) =>
      x < 0 || y < 0 || x >= width || y >= height ? 0 : mask[y * width + x];

    let plainInk = 0;
    let filteredInk = 0;
    let core = 0;
    let kept = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        if (filtered_.mask[i]) filteredInk++;
        if (!mask[i]) continue;
        plainInk++;
        let interior = 1;
        for (let dy = -1; dy <= 1 && interior; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (!inked(x + dx, y + dy)) {
              interior = 0;
              break;
            }
          }
        }
        if (!interior) continue;
        core++;
        if (filtered_.mask[i]) kept++;
      }
    }

    return {
      plainInk,
      filteredInk,
      core,
      kept,
      areaRatio: plainInk === 0 ? 0 : filteredInk / plainInk,
      coreSurvival: core === 0 ? 0 : kept / core,
    };
  },
  plain,
  filtered,
);

const round = (n) => Number(n.toFixed(3));

console.log(
  JSON.stringify(
    {
      clip,
      plainInk: measured.plainInk,
      filteredInk: measured.filteredInk,
      corePixels: measured.core,
      areaRatio: round(measured.areaRatio),
      coreSurvival: round(measured.coreSurvival),
      minCore: MIN_CORE,
      maxArea: MAX_AREA,
    },
    null,
    1,
  ),
);

const failures = [];
if (measured.plainInk < 1500) {
  failures.push(
    `the unfiltered capture holds only ${measured.plainInk} ink pixels, so the crop is wrong and the comparison would be meaningless`,
  );
}
if (measured.core === 0) {
  failures.push(
    "no stroke cores were found in the unfiltered capture, so erosion cannot be measured and the score would be meaningless",
  );
}
if (measured.coreSurvival < MIN_CORE) {
  failures.push(
    `the filter keeps only ${(measured.coreSurvival * 100).toFixed(1)}% of the stroke cores; below ${(MIN_CORE * 100).toFixed(0)}% the interiors of the strokes have been eaten away and the settled word stops reading as letters`,
  );
}
if (measured.areaRatio > MAX_AREA) {
  failures.push(
    `the filter inflates the word to ${(measured.areaRatio * 100).toFixed(0)}% of its unfiltered area; above ${(MAX_AREA * 100).toFixed(0)}% the strokes have thickened until adjacent letters meet and the counters close`,
  );
}

if (failures.length) {
  console.error("\nMORPH FILTER FAILURES:\n  " + failures.join("\n  "));
  await browser.close();
  process.exit(1);
}

console.log(
  "\nMORPH OK: the settled word keeps " +
    (measured.coreSurvival * 100).toFixed(1) +
    " percent of its stroke cores and renders at " +
    (measured.areaRatio * 100).toFixed(0) +
    " percent of its unfiltered area, so the letters survive at rest and still fuse mid morph.",
);

await browser.close();