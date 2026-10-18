#!/usr/bin/env python3
"""Stack several SVGs vertically (or in a grid) into one contact sheet SVG.

Reads each input SVG, strips its <svg> wrapper, and re-emits the contents inside
a <g transform="translate(...)"> on a shared canvas. Useful for comparing wordmark
directions side by side before rendering.

Usage:
    python stack.py --out sheet.svg --gap 60 a.svg b.svg c.svg
    python stack.py --out sheet.svg --cols 2 --gap 40 a.svg b.svg c.svg
"""
import argparse
import re
import xml.etree.ElementTree as ET

SVG_NS = "http://www.w3.org/2000/svg"


def read_svg(path):
    tree = ET.parse(path)
    root = tree.getroot()
    vb = root.get("viewBox", "0 0 100 100").split()
    w, h = float(vb[2]), float(vb[3])
    inner = []
    for child in root:
        tag = child.tag.split("}")[-1]
        if tag == "title":
            continue
        inner.append(ET.tostring(child, encoding="unicode").strip())
    return w, h, inner


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("inputs", nargs="+")
    ap.add_argument("--out", required=True)
    ap.add_argument("--gap", type=float, default=60)
    ap.add_argument("--cols", type=int, default=1)
    ap.add_argument("--pad", type=float, default=40)
    ap.add_argument("--fill", default="#111111")
    ap.add_argument("--target-width", type=float, default=1600,
                    help="scale each input to this width before placing")
    a = ap.parse_args()

    items = []
    for p in a.inputs:
        w, h, inner = read_svg(p)
        s = a.target_width / w
        items.append((w * s, h * s, inner, s))

    cols = min(a.cols, len(items))
    rows = (len(items) + cols - 1) // cols
    col_w = max(i[0] for i in items)
    row_h = []
    for r in range(rows):
        row_h.append(max(items[k][1] for k in range(r * cols, min((r + 1) * cols, len(items)))))

    total_w = cols * col_w + (cols - 1) * a.gap + 2 * a.pad
    total_h = sum(row_h) + (rows - 1) * a.gap + 2 * a.pad

    out = [
        '<svg xmlns="%s" viewBox="0 0 %g %g" width="%g" height="%g">' % (
            SVG_NS, total_w, total_h, total_w, total_h),
        '  <rect width="%g" height="%g" fill="#ffffff"/>' % (total_w, total_h),
    ]
    y = a.pad
    idx = 0
    for r in range(rows):
        x = a.pad
        for c in range(cols):
            if idx >= len(items):
                break
            w, h, inner, s = items[idx]
            # Undo each SVG's own viewBox scaling by normalising to its own box.
            out.append('  <g transform="translate(%g %g) scale(%g)">' % (x, y, s))
            for frag in inner:
                out.append("    " + frag)
            out.append("  </g>")
            x += col_w + a.gap
            idx += 1
        y += row_h[r] + a.gap
    out.append("</svg>")

    with open(a.out, "w", encoding="utf-8") as fh:
        fh.write("\n".join(out) + "\n")
    print("wrote %s (%g x %g, %d items)" % (a.out, total_w, total_h, len(items)))


if __name__ == "__main__":
    main()