/**
 * SHARED BROWSER ENVIRONMENT FOR THE PROBES
 * ===========================================================================
 * Every probe needs two things before it can run: a Chrome binary to drive, and
 * somewhere to write screenshots and the fetched axe bundle.
 *
 * Both used to be hardcoded absolute paths:
 *
 *   "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
 *   "C:/Users/thapa/AppData/Local/Temp/axe.min.js"
 *
 * The second one names a specific person's user profile. Every probe that
 * wrote a screenshot failed with ENOENT on any other machine, which meant the
 * entire verification suite was unrunnable for anyone but its original author.
 * A test suite that only runs on one machine is not a test suite, and the
 * failure mode is silent: the scripts exit 0 or report zeros rather than
 * explaining themselves, so a broken probe looks like a passing one.
 *
 * Both are resolved here, once, for all sixteen probes.
 */

import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

/**
 * Chrome, Edge or Chromium, in the order they are preferred.
 *
 * `PUPPETEER_EXECUTABLE_PATH` wins if set, which is what CI should pass and
 * what anyone running a non-standard build needs. Otherwise the list is
 * searched in order and the first one that exists is used.
 *
 * Edge is listed because it ships with Windows and is a Chromium browser, so
 * puppeteer drives it exactly as it drives Chrome. Listing it means a machine
 * without Chrome installed can still run the probes rather than failing with a
 * confusing launch error.
 *
 * The macOS and Linux paths are here so the suite runs on a contributor's
 * machine without edits. Only the first existing entry is ever used.
 */
const CANDIDATES = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

/**
 * The browser to drive. Throws with the list it tried rather than letting
 * puppeteer fail later with an opaque launch error.
 */
export const CHROME = (() => {
  const found = CANDIDATES.find((candidate) => existsSync(candidate));
  if (!found) {
    throw new Error(
      `No Chrome, Edge or Chromium binary found. Tried:\n  ${CANDIDATES.join(
        "\n  ",
      )}\nSet PUPPETEER_EXECUTABLE_PATH to point at one.`,
    );
  }
  return found;
})();

/**
 * Scratch directory for probe output.
 *
 * Every probe writes screenshots or a downloaded bundle here and deletes it
 * afterwards. `PROBE_OUT_DIR` overrides the whole directory; the subdirectory
 * name is appended to it so two probes given the same base cannot collide.
 *
 * Namespaced per project so probes from another checkout, or a different
 * project entirely, writing to the same machine-wide temp directory cannot
 * overwrite each other's screenshots.
 */
export const PROBE_OUT_ROOT =
  process.env.PROBE_OUT_DIR ?? path.join(os.tmpdir(), "lokesh-rohilla-probes");

/*
  Created here, once, on import.

  Every probe writes into this tree and none of them previously created it:
  they inherited a directory that only existed because the original author's
  temp folder already had it. A fresh machine therefore failed on the first
  writeFile with ENOENT, naming a path that had never been created.

  Creating it at module load means every probe gets a writable directory
  without each one having to remember to. `recursive` covers a nested
  PROBE_OUT_DIR, and it is a no-op when the directory is already there.
*/
await mkdir(PROBE_OUT_ROOT, { recursive: true });

/** Build a scratch directory for one probe. */
export const probeOut = (name) => path.join(PROBE_OUT_ROOT, name);

/**
 * Where the axe bundle is downloaded to. Shared by the two probes that inject
 * axe-core, so they cannot race each other over the same file.
 */
export const AXE_PATH = path.join(PROBE_OUT_ROOT, "axe.min.js");