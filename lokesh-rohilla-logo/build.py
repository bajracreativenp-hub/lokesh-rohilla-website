#!/usr/bin/env python3
"""Build Lokesh Rohilla wordmark concepts (v3).

  A "Shared Stem"  Inter 600 Title Case. L and R share one stem; the L's foot
                   stops short of the R's leg so both letters stay legible.
  B "The Ground"   Jost 500 caps. The L's foot runs out into a full-width rule
                   the name stands on.
  C "The Measure"  Instrument Serif caps, stacked. A fine rule between the two
                   lines is set to the width of LOKESH - the first name sets
                   the measure, and the surname breaks it.

Letterforms are real outlines pulled from the fonts; nothing here is live text.
"""
import os

from fontTools.misc.transform import Transform
from fontTools.pens.boundsPen import ControlBoundsPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

from mkwordmark import load_font, font_metrics

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")
OUT = os.path.join(HERE, "concepts")


# ---------------------------------------------------------------- primitives
def glyphs(font, text, cap, tracking=0.0):
    """-> (list of (char, path_d), total_width). Cap-top = y0, baseline = y cap."""
    upem, cap_units, _ = font_metrics(font)
    s = cap / cap_units
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    track = tracking * upem
    out, x = [], 0.0
    for ch in text:
        gname = cmap[ord(ch)]
        pen = SVGPathPen(gs, ntos=lambda v: str(int(round(v * 100)) / 100))
        gs[gname].draw(TransformPen(pen, Transform(s, 0, 0, -s, x * s, cap)))
        out.append((ch, pen.getCommands()))
        x += hmtx[gname][0] + track
    return out, (x - track) * s


def ink_width(font, text, cap, tracking=0.0):
    upem, cap_units, _ = font_metrics(font)
    s = cap / cap_units
    gs = font.getGlyphSet()
    cmap, hmtx = font.getBestCmap(), font["hmtx"]
    track = tracking * upem
    x, lo, hi = 0.0, 1e9, -1e9
    for ch in text:
        bp = ControlBoundsPen(gs)
        gs[cmap[ord(ch)]].draw(bp)
        if bp.bounds:
            lo = min(lo, (x + bp.bounds[0]) * s)
            hi = max(hi, (x + bp.bounds[2]) * s)
        x += hmtx[cmap[ord(ch)]][0] + track
    return lo, hi


def _cubic(p0, c1, c2, p1, t):
    mt = 1 - t
    a, b = mt * mt * mt, 3 * mt * mt * t
    c, d = 3 * mt * t * t, t * t * t
    return (a * p0[0] + b * c1[0] + c * c2[0] + d * p1[0],
            a * p0[1] + b * c1[1] + c * c2[1] + d * p1[1])


def _quad(p0, c1, p1, t):
    mt = 1 - t
    a, b, c = mt * mt, 2 * mt * t, t * t
    return (a * p0[0] + b * c1[0] + c * p1[0],
            a * p0[1] + b * c1[1] + c * p1[1])


def ink_height(font, text, cap):
    """(top, bottom) of ink in the drawn space, where baseline = cap and the
    cap line = 0. bottom > cap means descenders or swashes hang below."""
    upem, cap_units, _ = font_metrics(font)
    s = cap / cap_units
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    lo, hi = 1e9, -1e9
    for ch in text:
        bp = ControlBoundsPen(gs)
        gs[cmap[ord(ch)]].draw(bp)
        if bp.bounds:
            lo = min(lo, bp.bounds[1] * s)
            hi = max(hi, bp.bounds[3] * s)
    return (lo, hi) if lo < 1e8 else (0.0, cap)


def baseline_span_removed_placeholder():
    pass


def ink_span_at_y(font, ch, cap, y_frac):
    """x-extent of ink where the glyph crosses the horizontal line
    y_frac of cap height below the cap line (0 = cap line, 1 = baseline).
    Works for serif and sans; measuring a glyph's ink bbox cannot, because
    serifs inflate the width of letters like I or H.
    """
    upem, cap_units, _ = font_metrics(font)
    s = cap / cap_units
    gs = font.getGlyphSet()
    rp = RecordingPen()
    gs[font.getBestCmap()[ord(ch)]].draw(rp)
    Y = cap_units * (1.0 - y_frac)
    xs, cur, start = [], (0.0, 0.0), None

    def sweep(p0, p1):
        if (p0[1] - Y) * (p1[1] - Y) < 0:
            t = (Y - p0[1]) / (p1[1] - p0[1])
            xs.append(p0[0] + (p1[0] - p0[0]) * t)

    def sweep_curve(p0, p1, fn):
        prev_y, N = p0[1], 48
        for i in range(1, N + 1):
            x, y = fn(i / N)
            if (prev_y - Y) * (y - Y) < 0:
                t = (Y - prev_y) / (y - prev_y)
                xs.append(p0[0] + (x - p0[0]) * t)
            prev_y = y

    for op, args in rp.value:
        if op == "moveTo":
            cur = start = args[0]
        elif op == "lineTo":
            sweep(cur, args[0]); cur = args[0]
        elif op == "curveTo":
            c1, c2, p1 = args
            sweep_curve(cur, p1, lambda t, a=cur, b=c1, c=c2, d=p1: _cubic(a, b, c, d, t))
            cur = p1
        elif op == "qCurveTo":
            off = args[:-1] if args[-1] is None else args
            p1 = args[-1]
            if len(off) == 1:
                sweep_curve(cur, p1, lambda t, a=cur, b=off[0], c=p1: _quad(a, b, c, t))
            else:  # implied on-curve midpoints (TrueType)
                pts, prev = [], cur
                for o in off:
                    mid = ((prev[0] + o[0]) / 2.0, (prev[1] + o[1]) / 2.0)
                    sweep_curve(prev, mid, lambda t, a=prev, b=o, c=mid: _quad(a, b, c, t))
                    prev = o
            cur = p1
        elif op == "closePath" and start is not None:
            sweep(cur, start)
            cur = start
    if not xs:
        return None
    return (min(xs) * s, max(xs) * s)


def stem_width(font, cap):
    """Stem of the L at mid cap height - clear of both the cap and the foot."""
    span = ink_span_at_y(font, "L", cap, 0.5)
    return (span[1] - span[0]) if span else cap * 0.06


def shared_stem_lr(font, cap):
    """LR ligature on one stem: both letters drawn from x=0 so the stems coincide.

    Uses the real L and R outlines rather than a drawn foot, so serif terminals
    survive. The R's ink is wider than the L's, so width comes from the R.
    """
    lg, _ = glyphs(font, "L", cap, 0.0)
    rg, _ = glyphs(font, "R", cap, 0.0)
    l_lo, l_hi = ink_width(font, "L", cap)
    r_lo, r_hi = ink_width(font, "R", cap)
    lo, hi = min(l_lo, r_lo), max(l_hi, r_hi)
    body = ['    <path fill="#111111" data-ch="L" d="%s"/>' % lg[0][1],
            '    <path fill="#111111" data-ch="R" d="%s"/>' % rg[0][1]]
    return body, lo, hi - lo


def emit(name, width, height, body, title):
    os.makedirs(OUT, exist_ok=True)
    lines = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %s %s" width="%s" height="%s" '
        'role="img" aria-labelledby="title">' % (width, height, width, height),
        '  <title id="title">%s</title>' % title,
        '  <rect width="%s" height="%s" fill="#ffffff"/>' % (width, height),
        '  <g id="lockup">',
    ] + body + ["  </g>", "</svg>", ""]
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))
    print("wrote %-22s %s x %s" % (name, width, height))


def horizontal_lockup(mono, mono_w, word_items, word_lo, word_hi, word_cap,
                      mono_cap, pad, gap=None):
    """Monogram left, wordmark right, optically centred on the cap line."""
    gap = mono_cap * 0.30 if gap is None else gap
    word_w = word_hi - word_lo
    word_x = mono_w + gap - word_lo
    word_y = (mono_cap - word_cap) * 0.5
    total_w = word_x + word_w + pad * 2
    body = ['  <g transform="translate(%s %s)">' % (pad, pad)]
    body += mono
    for ch, d in word_items:
        body.append('    <path fill="#111111" data-ch="%s" transform="translate(%s %s)" d="%s"/>'
                    % (ch, round(word_x, 2), round(word_y, 2), d))
    body.append("  </g>")
    return total_w, mono_cap + pad * 2, body


# ---------------------------------------------------------------- concepts
def concept_a():
    f = load_font(os.path.join(FONTS, "Inter.ttf"), 600)
    mono_cap, word_cap = 200.0, 112.0
    mono, m_lo, m_w = shared_stem_lr(f, mono_cap)
    word, _ = glyphs(f, "Lokesh Rohilla", word_cap, 0.0)
    w_lo, w_hi = ink_width(f, "Lokesh Rohilla", word_cap, 0.0)

    pad = 26
    gap = 62
    word_w = w_hi - w_lo
    word_x = -m_lo + m_w + gap - w_lo
    word_y = (mono_cap - word_cap) * 0.5
    body = ['  <g transform="translate(%s %s)">' % (pad - m_lo, pad), '  <g>']
    body += mono
    body.append("  </g>")
    for ch, d in word:
        body.append('    <path fill="#111111" data-ch="%s" transform="translate(%s %s)" d="%s"/>'
                    % (ch, round(word_x, 2), round(word_y, 2), d))
    body.append("  </g>")

    emit("a-shared-stem.svg", round(word_x + word_w + pad, 1), mono_cap + pad * 2, body,
         "Lokesh Rohilla - Shared Stem")


def concept_b():
    f = load_font(os.path.join(FONTS, "Jost.ttf"), 500)
    mono_cap, word_cap, tracking = 200.0, 132.0, 0.07
    text = "LOKESH ROHILLA"

    mono, m_lo, m_w = shared_stem_lr(f, mono_cap)
    word, _ = glyphs(f, text, word_cap, tracking)
    w_lo, w_hi = ink_width(f, text, word_cap, tracking)
    word_w = w_hi - w_lo

    pad, gap = 26, 58
    word_x = -m_lo + m_w + gap - w_lo
    word_y = (mono_cap - word_cap) * 0.5

    rule_h = stem_width(f, word_cap)   # match the rule to the stem weight
    total_w = word_x + word_w + pad
    body = ['  <g transform="translate(%s %s)">' % (pad - m_lo, pad), '  <g>']
    body += mono
    body.append("  </g>")
    body.append('  <g transform="translate(%s %s)">' % (round(word_x, 2), round(word_y, 2)))
    body.append('    <path fill="#111111" d="M0 %s H%s V%s H0 Z"/>'
                % (round(word_cap - rule_h, 2), round(word_w, 2), round(word_cap, 2)))
    for ch, d in word:
        body.append('    <path fill="#111111" data-ch="%s" d="%s"/>' % (ch, d))
    body.append("  </g>")
    body.append("  </g>")

    emit("b-ground.svg", round(total_w, 1), mono_cap + pad * 2, body,
         "Lokesh Rohilla - The Ground")


def concept_c():
    f = load_font(os.path.join(FONTS, "InstrumentSerif-Regular.ttf"), None)
    mono_cap, cap, tracking = 200.0, 124.0, 0.05

    mono, m_lo, m_w = shared_stem_lr(f, mono_cap)
    l1, _ = glyphs(f, "LOKESH", cap, tracking)
    l2, _ = glyphs(f, "ROHILLA", cap, tracking)
    l1_lo, l1_hi = ink_width(f, "LOKESH", cap, tracking)
    l2_lo, l2_hi = ink_width(f, "ROHILLA", cap, tracking)

    pad, gap = 26, 58
    leading = cap * 1.72
    rule_w = l1_hi - l1_lo
    rule_t = cap * 0.028
    rule_y = (cap + leading) * 0.5   # midway between LOKESH baseline and ROHILLA cap

    block_h = leading + cap
    mono_y = (block_h - mono_cap) * 0.5   # centre the monogram against the block
    word_x = -m_lo + m_w + gap - l1_lo
    total_w = word_x + max(l1_hi - l1_lo, l2_hi - l2_lo) + pad

    body = ['  <g transform="translate(%s %s)">' % (pad - m_lo, pad)]
    body.append('  <g transform="translate(0 %s)">' % round(mono_y, 2))
    body += mono
    body.append("  </g>")
    body.append('  <g transform="translate(%s %s)">' % (round(word_x, 2), 0))
    # the measure: a fine rule set to the width of LOKESH
    body.append('    <path fill="#111111" d="M0 %s H%s V%s H0 Z"/>'
                % (round(rule_y - rule_t / 2, 2), round(rule_w, 2), round(rule_y + rule_t / 2, 2)))
    for ch, d in l1:
        body.append('    <path fill="#111111" data-ch="%s" d="%s"/>' % (ch, d))
    body.append('  <g transform="translate(%s %s)">' % (round(l2_lo - l1_lo, 2), round(leading, 2)))
    for ch, d in l2:
        body.append('    <path fill="#111111" data-ch="%s" d="%s"/>' % (ch, d))
    body.append("  </g>")
    body.append("  </g>")
    body.append("  </g>")

    emit("c-measure.svg", round(total_w, 1), round(block_h + pad * 2, 1), body,
         "Lokesh Rohilla - The Measure")


if __name__ == "__main__":
    concept_a()
    concept_b()
    concept_c()