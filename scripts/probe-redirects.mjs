/**
 * Redirect check.
 *
 * The architecture went from seventy routes to ten pages with in-page sections,
 * so nearly every URL that ever existed now has to land somewhere real. A
 * redirect that points at a page which no longer has the anchor, or at a page
 * that 404s, is worse than no redirect at all: it is a silent dead end.
 *
 * Raw HTTP rather than fetch, because fetch follows redirects and reports the
 * destination's status. What needs checking is the redirect itself.
 *
 * Usage: node scripts/probe-redirects.mjs
 */
import net from "node:net";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

/*
  Read from routes.json directly rather than importing the TypeScript module.

  The probe runs under bare `node`, so importing `ia.ts` works only via Node's
  type stripping and emits a MODULE_TYPELESS_PACKAGE_JSON warning. Reading the
  JSON has the same single source of truth and no warning.
*/
const HERE = path.dirname(fileURLToPath(import.meta.url));
const routeData = JSON.parse(
  readFileSync(path.join(HERE, "..", "src", "lib", "routes.json"), "utf8"),
);
const ROUTES = routeData.routes;
const LEGACY_REDIRECTS = routeData.legacyRedirects;

const PORT = Number(process.env.PROBE_PORT ?? 3001);

/** One request, one response, no redirect following. */
function raw(path, { method = "GET" } = {}) {
  return new Promise((resolve) => {
    const sock = net.connect(PORT, "127.0.0.1", () => {
      sock.write(`${method} ${path} HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n`);
    });
    let buf = "";
    const done = (result) => {
      try {
        sock.destroy();
      } catch {
        /* already closed */
      }
      resolve(result);
    };
    sock.on("data", (chunk) => (buf += chunk));
    sock.on("end", () => {
      const head = buf.split("\r\n\r\n")[0];
      done({
        status: Number(head.split(" ")[1]) || 0,
        location: (head.match(/^location: (.*)$/im) || [])[1]?.trim() ?? null,
        body: buf,
      });
    });
    sock.on("error", (error) => done({ status: 0, location: null, body: "", error: error.message }));
    setTimeout(() => done({ status: 0, location: null, body: "", error: "timeout" }), 5000);
  });
}

/** True when the served HTML contains an element with this id. */
const hasAnchor = (html, id) => new RegExp(`id="${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(html);

const failures = [];
let checked = 0;

// Every route the site serves must answer 200 and must not itself redirect.
const bodyCache = new Map();
for (const route of ROUTES) {
  const res = await raw(route);
  checked++;
  bodyCache.set(route, res);
  if (res.status !== 200) {
    failures.push(`${route} returned ${res.status}${res.location ? ` -> ${res.location}` : ""}`);
  }
  if (res.location) failures.push(`${route} redirects to ${res.location}; it should be canonical`);
}

// Every legacy URL must 308 to a page that exists AND carries the anchor.
const lines = [];
for (const { from, to } of LEGACY_REDIRECTS) {
  const res = await raw(from);
  checked++;
  lines.push(`${from.padEnd(46)} -> ${res.status} ${res.location ?? "(none)"}`);

  if (res.status !== 308) {
    failures.push(`${from} returned ${res.status}, expected 308 to ${to}`);
    continue;
  }
  if (res.location !== to) {
    failures.push(`${from} redirects to ${res.location}, expected ${to}`);
    continue;
  }

  const [destPath, anchor] = to.split("#");

  /*
    The anchor matters as much as the path. A redirect to
    `/page#section` where the section was renamed lands the visitor mid page
    with nothing in view, which reads exactly like a broken link.
  */
  let dest = bodyCache.get(destPath);
  if (!dest) {
    dest = await raw(destPath);
    checked++;
    bodyCache.set(destPath, dest);
  }
  if (dest.status !== 200) {
    failures.push(`${from} points at ${destPath}, which returned ${dest.status}`);
    continue;
  }
  if (anchor && !hasAnchor(dest.body, anchor)) {
    failures.push(`${from} points at ${destPath}#${anchor}, but that anchor is not on the page`);
  }
}

// A URL that never existed must be a 404, not a redirect loop.
const missing = await raw("/definitely-not-a-page");
checked++;
if (missing.status !== 404) {
  failures.push(`/definitely-not-a-page returned ${missing.status}, expected 404`);
}

console.log(
  `Checked ${ROUTES.length} routes, ${LEGACY_REDIRECTS.length} redirects, 1 unknown URL (${checked} requests).\n`,
);
console.log(lines.slice(0, 8).join("\n"));
console.log(`... and ${lines.length - 8} more, all verified.`);

if (failures.length) {
  console.error("\nREDIRECT FAILURES:\n  " + failures.join("\n  "));
  process.exit(1);
}
console.log("\nREDIRECTS OK: every legacy URL resolves to a real anchor, and every route is canonical.");