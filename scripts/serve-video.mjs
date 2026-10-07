/**
 * Tiny static file server, used only to read a local video in the browser.
 *
 * Exists because Chrome will not seek a video over `file://`, and the read tool
 * cannot interpret video frames. Serving over HTTP lets a `<video>` element
 * seek to a timestamp and screenshot it, which is the only way to see what a
 * recording actually shows.
 *
 * Range requests are supported because Chrome's media stack uses them to seek.
 *
 * Usage: node scripts/serve-video.mjs <directory> <port>
 */
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";

const ROOT = path.resolve(process.argv[2] ?? ".");
const PORT = Number(process.argv[3] ?? 8099);

const TYPES = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".html": "text/html; charset=utf-8",
};

createServer((req, res) => {
  const name = decodeURIComponent((req.url ?? "/").split("?")[0]).replace(/^\/+/, "") || "index.html";
  const file = path.join(ROOT, name);

  // Refuse to serve anything outside the root directory.
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end("forbidden");
    return;
  }

  let stat;
  try {
    stat = statSync(file);
  } catch {
    res.writeHead(404).end("not found");
    return;
  }
  if (!stat.isFile()) {
    res.writeHead(404).end("not found");
    return;
  }

  const type = TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";
  const range = req.headers.range;

  if (range) {
    const match = /bytes=(\d*)-(\d*)/.exec(range);
    const start = match && match[1] ? Number(match[1]) : 0;
    const end = match && match[2] ? Number(match[2]) : stat.size - 1;
    res.writeHead(206, {
      "Content-Type": type,
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
    });
    createReadStream(file, { start, end }).pipe(res);
    return;
  }

  res.writeHead(200, {
    "Content-Type": type,
    "Content-Length": stat.size,
    "Accept-Ranges": "bytes",
  });
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`serving ${ROOT} on http://localhost:${PORT}`));