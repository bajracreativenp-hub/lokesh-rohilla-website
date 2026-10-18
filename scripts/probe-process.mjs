/*
  probe-process.mjs

  The process section positions each step figure at a percentage of its band, sizes
  it in `rem`, and hangs it below the band baseline. Those three things interact:
  the figure has a fixed width (four monospace digits) against a band of variable
  width, and it is painted over two colour fields at once.

  None of that is visible to a type checker, and all of it was wrong at least once.
  At 1440 the last figure clipped against the container edge. At 390 the first two
  sat straight through the step titles. And with `overflow-hidden` on the bands the
  figures stopped dead at the baseline, so there was no bleed at all. Every one of
  those passed the rest of the suite and looked plausibly deliberate.

  This measures the rendered boxes at five widths and asserts, per band:

    1. the figure stays inside its band's right edge       (not clipped)
    2. the figure clears its title's right edge             (no overlap)
    3. the figure has actually walked right of its title    (the diagonal)
    4. figures 1 to n-1 hang at least 4px below the baseline, and the last one
       does not hang at all, because below it is the page canvas (the bleed)
    5. each figure clears 3:1 against EVERY colour it overlaps

  Point 5 is the one axe gives up on. It resolves a background by compositing what
  it can see and returns "could not be determined" for a figure straddling two
  bands, which probe-contrast.mjs counts as a failure. probe-contrast.mjs hands
  those nodes here, via `data-contrast-delegated`, and this measures them properly:
  not one background as axe would have, but every background actually painted
  behind the digits. That is a stricter test, not a softer one.

  Also asserted once: the four bands get monotonically darker.

  Run against a production server on :3001.
*/

import puppeteer from "puppeteer-core";
import { CHROME } from "./browser.mjs";

const WIDTHS = [390, 640, 768, 1024, 1440];

/* WCAG relative luminance and contrast, on the same sRGB the browser paints. */
const channel = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});

const failures = [];
const report = [];

for (const width of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
  await page.goto("http://localhost:3001", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 600));

  /*
    Bring the section up and let the springs settle. Measuring while a band is
    mid-translate reports a box that is not where it will end up, which reads as a
    layout bug that vanishes when you look at it by hand.
  */
  const top = await page.evaluate(() => {
    const h = document.getElementById("process-title");
    return h ? Math.round(h.getBoundingClientRect().top + window.scrollY) - 100 : 0;
  });
  for (let y = top; y < top + 1500; y += 300) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await new Promise((r) => setTimeout(r, 260));
  }
  await new Promise((r) => setTimeout(r, 900));

  const { bands, figures, titles, pageBg } = await page.evaluate(() => {
    /*
      RESOLVE ANY CSS COLOUR TO sRGB BYTE TRIPLE, VIA A CANVAS.

      Tailwind v4 defines its palette in oklch, and Chrome serialises the computed
      value back as `lab(88.6983 -11.3978 -16.8488)`. Parsing the three numbers out
      of that and treating them as R, G and B is the obvious thing to do and it is
      completely wrong: they are lightness, a and b, and every ratio comes back
      around 1.1:1, which looks like a design failure rather than a maths error.

      So the colour is painted one pixel onto a canvas and read back. Whatever the
      source space, the browser resolves it to the sRGB it is actually displaying,
      which is the thing the contrast formula is defined over.

      Only opaque colours are passed. These all are: band backgrounds, the figure
      ink, and the page canvas.
    */
    const toRgb = (css) => {
      const c = document.createElement("canvas");
      c.width = c.height = 1;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.fillStyle = "#000";
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]];
    };

    const box = (el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      // Two decimals: float noise should not be able to invent a 1px failure.
      const px = (n) => Math.round(n * 100) / 100;
      return {
        left: px(r.left),
        right: px(r.right),
        top: px(r.top),
        bottom: px(r.bottom),
        colour: toRgb(cs.color),
      };
    };
    const bandBox = (el) => ({ ...box(el), bg: toRgb(getComputedStyle(el).backgroundColor) });

    const section = document.getElementById("process-title").closest("section");
    const bandEls = [...section.querySelectorAll("h3")].map((h3) =>
      h3.closest("div[class*='relative']"),
    );

    return {
      bands: bandEls.map((el) => ({ verb: el.querySelector("h3").textContent.trim(), ...bandBox(el) })),
      figures: bandEls.map((el) =>
        box(el.querySelector("[data-contrast-delegated]") ?? el.querySelector("span[class*='font-figure']")),
      ),
      titles: bandEls.map((el) => ({
        verb: el.querySelector("h3").textContent.trim(),
        right: box(el.querySelector("h3")).right,
      })),
      pageBg: toRgb(getComputedStyle(document.body).backgroundColor),
    };
  });

  if (figures.some((f) => !f)) {
    failures.push(`${width}px  a band has no figure element`);
    await page.close();
    continue;
  }

  const bandLumas = bands.map((b) => luminance(b.bg));

  bands.forEach((band, i) => {
    const fig = figures[i];
    const label = `${width}px  ${band.verb}`;

    if (fig.right > band.right) {
      failures.push(
        `${label}: figure clipped by ${Math.round(fig.right - band.right)}px ` +
          `(right ${fig.right} > band ${band.right})`,
      );
    }

    const title = titles.find((t) => t.verb === band.verb);
    if (fig.left < title.right) {
      failures.push(
        `${label}: figure overlaps title by ${Math.round(title.right - fig.left)}px ` +
          `(figure left ${fig.left} < title right ${title.right})`,
      );
    }

    /*
      The bleed, and it is not the same rule for every band. Bands one to n-1 have
      another band beneath them to hang over and must bleed at least 4px. The last
      band has the page canvas beneath it, so it must NOT bleed at all: that figure
      is white and the canvas is white, and a bleed would put the bottom of the last
      digits on a background the same colour as themselves.
    */
    const isLast = i === bands.length - 1;
    const bleedPx = fig.bottom - band.bottom;

    if (isLast) {
      if (bleedPx > 0) {
        failures.push(
          `${label}: final figure bleeds ${Math.round(bleedPx)}px past the last band ` +
            `onto the page canvas (white on white)`,
        );
      }
    } else if (bleedPx < 4) {
      failures.push(`${label}: figure does not bleed below the baseline (${bleedPx}px)`);
    }

    /*
      The check axe could not make. A figure overlaps its own band and the one
      beneath it, and the deepest one may reach past the last band, so every painted
      background behind those digits gets measured rather than the single one a
      compositing pass would have guessed at.
    */
    const behind = [];
    bands.forEach((b) => {
      if (fig.top < b.bottom && fig.bottom > b.top) behind.push({ verb: b.verb, bg: b.bg });
    });
    const lastBand = bands[bands.length - 1];
    if (fig.bottom > lastBand.bottom) {
      behind.push({ verb: "page canvas", bg: pageBg });
    }

    const ratios = behind.map((b) => contrast(fig.colour, b.bg));

    for (const [n, b] of behind.entries()) {
      if (ratios[n] < 3) {
        failures.push(
          `${label}: figure contrast ${ratios[n].toFixed(2)}:1 against ${b.verb} ` +
            `(rgb(${fig.colour}) on rgb(${b.bg})), needs 3:1 for large text`,
        );
      }
    }

    report.push(
      `  ${String(width).padStart(4)}px  ${band.verb.padEnd(11)} ` +
        `left ${Math.round(fig.left)} ` +
        `${isLast ? "rests" : "bleed"} ${Math.round(Math.abs(bleedPx))} ` +
        `over [${behind.map((b) => b.verb).join(" + ")}] ` +
        `min ${Math.min(...ratios).toFixed(2)}:1`,
    );
  });

  /* The diagonal: each figure further right than the one above it. */
  for (let i = 1; i < figures.length; i += 1) {
    if (figures[i].left <= figures[i - 1].left) {
      failures.push(
        `${width}px  ${bands[i].verb}: offset did not advance ` +
          `(${figures[i - 1].left} -> ${figures[i].left})`,
      );
    }
  }

  /* The cascade: each band darker than the one above it. */
  for (let i = 1; i < bandLumas.length; i += 1) {
    if (bandLumas[i] >= bandLumas[i - 1]) {
      failures.push(
        `${width}px  ${bands[i].verb}: band did not darken ` +
          `(${bandLumas[i - 1].toFixed(3)} -> ${bandLumas[i].toFixed(3)})`,
      );
    }
  }

  await page.close();
}

await browser.close();

console.log("PROCESS SECTION");
console.log(report.join("\n"));

if (failures.length) {
  console.log(`\nFAILURES (${failures.length}):`);
  for (const f of failures) console.log(`  x ${f}`);
  process.exitCode = 1;
} else {
  console.log(
    "\nOK  no clipping, no title overlap, diagonal advances, bleed present," +
      "\n    cascade darkens, every figure clears 3:1 on every colour behind it",
  );
}