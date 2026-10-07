/**
 * Removes the Next.js build directory.
 *
 * WHY THIS EXISTS
 *
 * Rebuilding into an existing `.next` leaves prerendered HTML behind that still
 * references the previous build's chunk hashes. `next start` then serves HTML
 * pointing at files that no longer exist, and every asset request 500s. The
 * page still renders its markup, so a DOM-only audit happily reports a clean
 * pass on a completely unstyled site.
 *
 * That happened repeatedly in this project before it was worth automating.
 * `npm run verify:build` is the supported way to produce something auditable:
 * clean, build, then restart the server before running any probe.
 *
 * It also refuses to run while a Next server is up, because deleting `.next`
 * under a running server is what caused the corruption in the first place.
 */
import { rm, writeFile } from "node:fs/promises";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import os from "node:os";
import path from "node:path";

const run = promisify(exec);

/*
  MATCHING A NEXT PROCESS

  The pattern has to tolerate the quoting Windows puts in the command line. A
  `next start` process actually reads as:

      node "E:\...\node_modules\.bin\..\next\dist\bin\next" start -p 3001

  so a literal `next start` never matches. An earlier version of this guard used
  exactly that, found nothing, deleted the build directory under a live server,
  and produced a corrupt build. The optional quote and the `\s+` are what make
  it work.
*/
const PATTERN = String.raw`next"?\s+(dev|start)\b`;

/**
 * The pattern is passed through the environment rather than inlined, because
 * embedding a regex in a PowerShell string that is itself inside a JS string
 * inside a shell argument is where the last version quietly broke.
 */
async function nextProcesses() {
  if (process.platform !== "win32") {
    try {
      const { stdout } = await run("ps -eo pid,args");
      return stdout
        .split("\n")
        .filter((l) => new RegExp(PATTERN).test(l) && !/grep/.test(l))
        .map((l) => l.trim());
    } catch {
      return [];
    }
  }

  /*
    Written to a temp file and run with -File rather than passed via -Command.

    Inline quoting through `exec` on Windows goes via cmd.exe, which mangles
    nested quotes: an earlier inline version silently returned nothing and the
    guard never fired. A file has exactly one layer of quoting, and -File does
    not re-parse the argument, so the regex arrives intact.
  */
  const scriptPath = path.join(os.tmpdir(), "lr-find-next-processes.ps1");
  await writeFile(
    scriptPath,
    [
      "$ErrorActionPreference = 'Stop'",
      "$pattern = $env:LR_PROC_PATTERN",
      "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" |",
      "  Where-Object { $_.CommandLine -and $_.CommandLine -match $pattern } |",
      "  Select-Object -ExpandProperty ProcessId",
      "",
    ].join("\r\n"),
    "utf8",
  );

  try {
    const { stdout } = await run(`powershell -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}"`, {
      env: { ...process.env, LR_PROC_PATTERN: PATTERN },
    });
    return stdout
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  } finally {
    await rm(scriptPath, { force: true }).catch(() => {});
  }
}

const running = await nextProcesses();
if (running.length) {
  console.error(
    "Refusing to clean while a Next server is running.\n" +
      "Kill it first, or the build directory will be corrupted mid-write.\n" +
      "  PIDs: " +
      running.join(", ") +
      "\n\n" +
      "  Stop-Process -Id " +
      running.join(",") +
      " -Force",
  );
  process.exit(1);
}

await rm(".next", { recursive: true, force: true });
console.log("Removed .next (no Next server was running)");