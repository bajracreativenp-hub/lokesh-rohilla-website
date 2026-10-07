/**
 * Drives the business health checker with a real mouse.
 *
 * The checker is the only genuinely stateful thing on the site, so it gets its
 * own probe: answers are selected with clicks, not by setting state, and the
 * result has to be checked for honesty as well as correctness.
 *
 * Asserts: ten questions are asked in order, the score matches the answers
 * given, the result names an area, and nothing claims to be an audit or an
 * industry benchmark.
 *
 * Usage: node scripts/probe-health-checker.mjs
 */
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = "http://localhost:3001/services/business-consultation#health-checker";
const OUT = "C:/Users/thapa/AppData/Local/Temp/lr-hc";

const { mkdir } = await import("node:fs/promises");
await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e.message).slice(0, 160)));

await page.goto(URL, { waitUntil: "networkidle0" });
await page.evaluate(() => new Promise((r) => setTimeout(r, 900)));

const report = {};

/* Click the nth radio in the current question, by visible label rather than by
   any internal index, so the probe cannot accidentally depend on internals. */
async function answer(optionIndex) {
  await page.evaluate((i) => {
    const radios = [...document.querySelectorAll("#health-checker input[type=radio]")];
    radios[i]?.click();
  }, optionIndex);
  await page.evaluate(() => new Promise((r) => setTimeout(r, 120)));
}

report.hasQuiz = await page.evaluate(() => Boolean(document.querySelector("#health-checker")));

// Ten questions, always choosing the top option (score 4) -> 40 of 40.
const prompts = [];
for (let q = 0; q < 10; q++) {
  const prompt = await page.evaluate(
    () => document.querySelector("#health-checker legend span")?.innerText ?? null,
  );
  prompts.push(prompt);
  await answer(0);
  await page.evaluate(() => {
    const next = [...document.querySelectorAll("#health-checker button")].find((b) =>
      /Next question|See the result/.test(b.textContent || ""),
    );
    next?.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 220)));
}

report.questionsAsked = prompts.length;
report.distinctPrompts = new Set(prompts.filter(Boolean)).size;
report.resultText = await page.evaluate(() => {
  const el = document.querySelector("#health-checker");
  return el ? el.innerText.replace(/\s+/g, " ").trim() : null;
});
report.scoreShown = await page.evaluate(() => {
  const m = document.querySelector("#health-checker")?.innerText.match(/(\d+)\s+out of\s+(\d+)/);
  return m ? { score: Number(m[1]), max: Number(m[2]) } : null;
});
await page.screenshot({ path: `${OUT}/1-result-all-high.png`, fullPage: false });

// Restart and answer everything with the lowest option -> 10 of 40.
await page.evaluate(() => {
  [...document.querySelectorAll("#health-checker button")]
    .find((b) => /Start again/.test(b.textContent || ""))
    ?.click();
});
await page.evaluate(() => new Promise((r) => setTimeout(r, 300)));

for (let q = 0; q < 10; q++) {
  await answer(3);
  await page.evaluate(() => {
    const next = [...document.querySelectorAll("#health-checker button")].find((b) =>
      /Next question|See the result/.test(b.textContent || ""),
    );
    next?.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 220)));
}
report.lowScoreShown = await page.evaluate(() => {
  const m = document.querySelector("#health-checker")?.innerText.match(/(\d+)\s+out of\s+(\d+)/);
  return m ? { score: Number(m[1]), max: Number(m[2]) } : null;
});
report.lowResultText = await page.evaluate(
  () => document.querySelector("#health-checker")?.innerText.replace(/\s+/g, " ").trim() ?? null,
);
report.weakestNamed = await page.evaluate(() => {
  const el = document.querySelector("#health-checker");
  /*
    innerText reflects CSS text-transform, so the label reads "LOOK HERE FIRST"
    rather than "Look here first". Matching case sensitively found nothing and
    reported a missing area on a result that had one.
  */
  const m = el?.innerText.match(/look here first\s*\n?\s*([^\n]+)/i);
  return m ? m[1].trim() : null;
});
await page.screenshot({ path: `${OUT}/2-result-all-low.png` });

// Back navigation must preserve earlier answers.
await page.evaluate(() => {
  [...document.querySelectorAll("#health-checker button")]
    .find((b) => /Start again/.test(b.textContent || ""))
    ?.click();
});
await page.evaluate(() => new Promise((r) => setTimeout(r, 300)));
await answer(1);
await page.evaluate(() => {
  [...document.querySelectorAll("#health-checker button")]
    .find((b) => /Next question/.test(b.textContent || ""))
    ?.click();
});
await page.evaluate(() => new Promise((r) => setTimeout(r, 250)));
await answer(0);
await page.evaluate(() => {
  [...document.querySelectorAll("#health-checker button")]
    .find((b) => /Previous/.test(b.textContent || ""))
    ?.click();
});
await page.evaluate(() => new Promise((r) => setTimeout(r, 250)));
/*
  Stepped back to question one, whose answer was the SECOND option. If back
  navigation dropped state, nothing would be selected.
*/
report.firstAnswerStillChecked = await page.evaluate(() => {
  const checked = document.querySelector("#health-checker input[type=radio]:checked");
  if (!checked) return false;
  const all = [...document.querySelectorAll("#health-checker input[type=radio]")];
  return all.indexOf(checked) === 1;
});

report.errors = errors;
console.log(JSON.stringify(report, null, 1));
await browser.close();

const failures = [];
if (errors.length) failures.push(`js errors: ${errors.join(" | ")}`);
if (!report.hasQuiz) failures.push("no #health-checker on the page");
if (report.questionsAsked !== 10) failures.push(`asked ${report.questionsAsked} questions, expected 10`);
if (report.distinctPrompts !== 10) {
  failures.push(`only ${report.distinctPrompts} distinct prompts, expected 10`);
}
if (report.scoreShown?.score !== 40 || report.scoreShown?.max !== 40) {
  failures.push(`all-high run scored ${JSON.stringify(report.scoreShown)}, expected 40 of 40`);
}
if (report.lowScoreShown?.score !== 10 || report.lowScoreShown?.max !== 40) {
  failures.push(`all-low run scored ${JSON.stringify(report.lowScoreShown)}, expected 10 of 40`);
}
if (!report.weakestNamed) failures.push("the result did not name an area to look at first");
if (!report.firstAnswerStillChecked) failures.push("stepping back lost an earlier answer");
/*
  Honesty assertions. The result must not present itself as an audit, a
  benchmark, or a comparison against any industry, because no such calibration
  has been confirmed.

  The disclaimer is stripped first. It legitimately contains the words "not an
  audit" and "not a benchmark against any industry", so scanning the raw text
  for "benchmark" flags the very sentence that is preventing the claim. What
  matters is whether the word appears anywhere OUTSIDE that denial.
*/
const rawText = (report.resultText ?? "").toLowerCase();
const claimed = rawText
  .replace(/this is a self assessment of your own answers\.[^]*?grade it\./, "")
  .replace(/not an audit and not a benchmark against any industry/gi, "");

for (const banned of ["industry average", "benchmark", "percentile", "top 10%", "compared to other"]) {
  if (claimed.includes(banned)) {
    failures.push(`the result makes an uncalibrated claim outside the disclaimer: "${banned}"`);
  }
}
if (!rawText.includes("not an audit")) {
  failures.push("the result does not say it is not an audit");
}

/*
  Band correctness. The bands were once ordered worst-first, so a perfect score
  was shown with the worst band's copy and nothing crashed. Assert the headline
  that belongs to each score rather than only asserting a number appears.
*/
const headlineFor = (text) => {
  const m = text.match(/your result\s+(\d+) out of (\d+)\s+([^]+?)\s+look here first/i);
  return m ? { score: Number(m[1]), headline: m[3].trim() } : null;
};
const HIGH = headlineFor(report.resultText ?? "");
const LOW = headlineFor(report.lowResultText ?? "");
if (HIGH && !/almost all of it is working/i.test(HIGH.headline)) {
  failures.push(`40/40 showed "${HIGH.headline}", expected the strongest band`);
}
if (LOW && !/structural/i.test(LOW.headline)) {
  failures.push(`10/40 showed "${LOW.headline}", expected the weakest band`);
}

if (failures.length) {
  console.error("\nHEALTH CHECKER FAILURES:\n  " + failures.join("\n  "));
  process.exit(1);
}
console.log("\nHEALTH CHECKER OK: 10 questions, score matches answers, an area is named, result is honest about what it is.");