#!/usr/bin/env python3
"""Compose a wordmark SVG from real font outlines (glyphs -> paths, no <text>).

Usage:
    python mkwordmark.py --font Inter.ttf --weight 600 --text "Lokesh Rohilla" \
        --cap 200 --tracking 0.02 --out wordmark.svg

Letterspacing is expressed in em (0.02 = 2% of the em, added after every glyph).
Output is a single <g> of <path> elements inside an SVG whose height is `cap`.
"""
import argparse
import os
import sys

from fontTools.ttLib import TTFont
from fontTools.misc.transform import Transform
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.varLib.instancer import instantiateVariableFont


def load_font(path, weight=None):
    font = TTFont(path)
    if "fvar" in font and weight is not None:
        font = instantiateVariableFont(font, {"wght": weight})
    return font


def font_metrics(font):
    upem = font["head"].unitsPerEm
    os2 = font["OS/2"]
    cap = getattr(os2, "sCapHeight", 0) or int(round(0.7 * upem))
    xh = getattr(os2, "sxHeight", 0) or int(round(0.52 * upem))
    return upem, cap, xh


def compose(font, text, cap_height, tracking_em, weight):
    upem, cap_units, _ = font_metrics(font)
    scale = cap_height / cap_units
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]

    track = tracking_em * upem
    paths = []
    x = 0.0
    for ch in text:
        if ch == " ":
            x += hmtx[cmap[ord(" ")]][0] + track
            continue
        gname = cmap.get(ord(ch))
        if gname is None:
            sys.exit("glyph missing for %r" % ch)
        pen = SVGPathPen(gs, ntos=lambda v: str(int(round(v * 100)) / 100))
        # SVG y grows downward: flip, then scale so cap height = cap_height.
        t = Transform(scale, 0, 0, -scale, x * scale, cap_height)
        gs[gname].draw(TransformPen(pen, t))
        d = pen.getCommands()
        if d:
            paths.append((ch, d))
        x += hmtx[gname][0] + track

    width = (x - track) * scale if text.strip() else 0.0
    return paths, width


def render(font_path, text, weight, cap_height, tracking, out, pad):
    font = load_font(font_path, weight)
    paths, width = compose(font, text, cap_height, tracking, weight)

    vb_w = width + pad * 2
    vb_h = cap_height + pad * 2
    lines = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %s %s" width="%s" height="%s" '
        'role="img" aria-labelledby="title">' % (vb_w, vb_h, vb_w, vb_h),
        "  <title id=\"title\">%s wordmark</title>" % text,
        '  <g id="wordmark" transform="translate(%s %s)" fill="#111111">' % (pad, pad),
    ]
    for ch, d in paths:
        lines.append('    <path data-ch="%s" d="%s"/>' % (ch, d))
    lines += ["  </g>", "</svg>", ""]

    with open(out, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))
    print("wrote %s  (cap=%s width=%s viewBox=%s %s) font=%s%s"
          % (out, cap_height, round(width, 1), vb_w, vb_h,
             os.path.basename(font_path), " @%s" % weight if weight else ""))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--font", required=True)
    ap.add_argument("--text", required=True)
    ap.add_argument("--weight", type=float, default=None)
    ap.add_argument("--cap", type=float, default=200.0)
    ap.add_argument("--tracking", type=float, default=0.0)
    ap.add_argument("--pad", type=float, default=8.0)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    render(a.font, a.text, a.weight, a.cap, a.tracking, a.out, a.pad)


if __name__ == "__main__":
    main()