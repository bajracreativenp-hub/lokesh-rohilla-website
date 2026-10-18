#!/usr/bin/env python3
"""Build a labelled concept checkpoint sheet.

Stacks each lockup on a shared white canvas with a name and a one-line idea
beneath it. Labels use <text> on purpose - this is a presentation sheet, not a
logo master, so it does not need outlined letterforms.

    python sheet.py --out sheet.svg \
        "A - Shared Stem::L and R on one stem; the name set clean." \
        a.svg "B - The Ground::The L's foot runs out into the rule." b.svg ...
"""
import argparse
import xml.etree.ElementTree as ET

SVG_NS = "http://www.w3.org/2000/svg"


def read_svg(path):
    root = ET.parse(path).getroot()
    vb = root.get("viewBox", "0 0 100 100").split()
    inner = [ET.tostring(c, encoding="unicode").strip()
             for c in root if c.tag.split("}")[-1] not in ("title", "rect")]
    return float(vb[2]), float(vb[3]), inner


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("items", nargs="+", help="name::idea  path.svg  (repeating)")
    ap.add_argument("--out", required=True)
    ap.add_argument("--pad", type=float, default=64)
    ap.add_argument("--label-h", type=float, default=118)
    ap.add_argument("--target-width", type=float, default=1700)
    a = ap.parse_args()

    if len(a.items) % 2:
        ap.error("items must be pairs of label and file")

    parsed = []
    for i in range(0, len(a.items), 2):
        label, path = a.items[i], a.items[i + 1]
        name, _, idea = label.partition("::")
        w, h, inner = read_svg(path)
        parsed.append((name.strip(), idea.strip(), w, h, inner))

    scale = a.target_width / max(p[2] for p in parsed)

    ys, y = [], a.pad
    for name, idea, w, h, inner in parsed:
        ys.append(y)
        y += h * scale + a.label_h
    total_w = a.target_width + a.pad * 2
    total_h = y + a.pad

    out = ['<svg xmlns="%s" viewBox="0 0 %g %g" width="%g" height="%g">' % (
        SVG_NS, total_w, total_h, total_w, total_h),
        '  <rect width="%g" height="%g" fill="#ffffff"/>' % (total_w, total_h)]

    for (name, idea, w, h, inner), ry in zip(parsed, ys):
        out.append('  <g transform="translate(%g %g) scale(%g)">' % (a.pad, ry, scale))
        for frag in inner:
            out.append("    " + frag)
        out.append("  </g>")
        ty = ry + h * scale + 44
        out.append('  <text x="%g" y="%g" font-family="Arial, Helvetica, sans-serif" '
                   'font-size="30" font-weight="700" fill="#111111">%s</text>'
                   % (a.pad, ty, esc(name)))
        out.append('  <text x="%g" y="%g" font-family="Arial, Helvetica, sans-serif" '
                   'font-size="23" fill="#555555">%s</text>'
                   % (a.pad, ty + 34, esc(idea)))

    out.append("</svg>")
    with open(a.out, "w", encoding="utf-8") as fh:
        fh.write("\n".join(out) + "\n")
    print("wrote %s (%g x %g)" % (a.out, total_w, total_h))


if __name__ == "__main__":
    main()