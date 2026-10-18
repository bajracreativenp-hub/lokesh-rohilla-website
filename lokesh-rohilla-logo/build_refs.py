#!/usr/bin/env python3
"""Three Lokesh Rohilla lockups built on the *structures* of the supplied
references. All artwork here is original - nothing is traced.

  ref1  script + oversized hero initial + tracked descriptor
  ref2  Didone LR monogram + divider rule + name + descriptor
  ref3  original gestural pen stroke + tall condensed caps

Typefaces are SIL OFL (Allura, Bodoni Moda, Oswald, Inter). Letters are emitted
as real outlines, never live <text>.
"""
import os

from build import (FONTS, OUT, glyphs, ink_width, stem_width, shared_stem_lr,
                   emit, ink_span_at_y)

HERE = os.path.dirname(os.path.abspath(__file__))
DESCRIPTOR = "BUSINESS CONSULTANT"


def font(name, weight=None):
    from mkwordmark import load_font
    return load_font(os.path.join(FONTS, name + ".ttf"), weight)


def place(items, dx, dy=0.0):
    return ['    <path fill="#111111" transform="translate(%s %s)" d="%s"/>'
            % (round(dx, 2), round(dy, 2), d) for _, d in items]


# ---------------------------------------------------------------- reference 1
def ref1():
    """Script name with the surname's initial pulled out as a hero mark."""
    f = font("Allura")
    body_font = font("Inter", 500)

    small = 200.0          # script body cap reference
    big = small * 2.25     # hero initial

    a_items, a_w = glyphs(f, "Lokesh", small)
    a_lo, a_hi = ink_width(f, "Lokesh", small)

    r_items, _ = glyphs(f, "R", big)
    r_lo, r_hi = ink_width(f, "R", big)
    r_dy = small - big     # pull the hero's baseline onto the script baseline

    c_items, c_w = glyphs(f, "ohilla", small)
    c_lo, c_hi = ink_width(f, "ohilla", small)

    # Horizontal rhythm: the hero tucks under the tail of "Lokesh".
    hero_x = a_hi - (r_hi - r_lo) * 0.34
    tail_x = hero_x + (r_hi - r_lo) + small * 0.03

    line_left = min(a_lo, hero_x + r_lo)
    line_right = max(tail_x + c_hi, a_hi)

    # descriptor, tracked out and optically centred under the name
    d_cap = 46.0
    d_items, _ = glyphs(body_font, DESCRIPTOR, d_cap, 0.42)
    d_lo, d_hi = ink_width(body_font, DESCRIPTOR, d_cap, 0.42)
    d_x = (line_left + line_right) * 0.5 - (d_lo + d_hi) * 0.5
    d_y = small + small * 0.62

    pad = 40
    width = (line_right - line_left) + pad * 2
    height = d_y + d_cap + pad

    body = ['  <g transform="translate(%s %s)">' % (pad - line_left, pad)]
    body += place(a_items, 0)
    body += place(r_items, hero_x, r_dy)
    body += place(c_items, tail_x)
    body += place(d_items, d_x, d_y)
    body.append("  </g>")

    emit("ref1-script.svg", round(width, 1), round(height, 1), body,
         "Lokesh Rohilla - script lockup")


# ---------------------------------------------------------------- reference 2
def ref2():
    """Didone monogram, hairline divider, name and tracked descriptor."""
    f = font("BodoniModa", 500)

    mono_cap = 300.0
    name_cap = 118.0
    desc_cap = 40.0

    mono, m_lo, m_w = shared_stem_lr(f, mono_cap)

    n_items, _ = glyphs(f, "LOKESH ROHILLA", name_cap, 0.085)
    n_lo, n_hi = ink_width(f, "LOKESH ROHILLA", name_cap, 0.085)

    d_items, _ = glyphs(f, DESCRIPTOR, desc_cap, 0.40)
    d_lo, d_hi = ink_width(f, DESCRIPTOR, desc_cap, 0.40)

    rule_gap = 46.0            # space either side of the divider
    rule_x = m_w + rule_gap
    rule_t = 2.4
    text_x = rule_x + rule_gap

    # vertical rhythm: name and descriptor sit as one block against the monogram
    desc_gap = name_cap * 0.72
    block_h = name_cap + desc_gap + desc_cap
    name_y = (mono_cap - block_h) * 0.5
    desc_y = name_y + name_cap + desc_gap
    rule_y0 = name_y - name_cap * 0.06
    rule_y1 = desc_y + desc_cap * 1.10

    right = max(text_x + n_hi, text_x + d_hi)
    pad = 42
    width = right + pad * 2
    height = mono_cap + pad * 2

    body = ['  <g transform="translate(%s %s)">' % (pad - m_lo, pad)]
    body.append('  <g>')
    body += mono
    body.append("  </g>")
    body.append('    <path fill="#111111" d="M%s %s H%s V%s H%s Z"/>'
                % (round(rule_x, 2), round(rule_y0, 2), round(rule_x + rule_t, 2),
                   round(rule_y1, 2), round(rule_x, 2)))
    body += place(n_items, text_x, name_y)
    body += place(d_items, text_x, desc_y)
    body.append("  </g>")

    emit("ref2-didone.svg", round(width, 1), round(height, 1), body,
         "Lokesh Rohilla - Didone monogram lockup")


# ---------------------------------------------------------------- reference 3
GESTURE = ("M 22 240 C 44 220, 48 158, 70 96 C 88 44, 130 30, 134 66 "
           "C 138 104, 98 126, 94 162 C 90 198, 128 204, 158 160 "
           "C 180 128, 196 104, 232 118")


def ref3():
    """An original pen flourish beside a tall condensed name."""
    f = font("Oswald", 500)
    name_cap = 230.0

    n_items, _ = glyphs(f, "LOKESH ROHILLA", name_cap, 0.035)
    n_lo, n_hi = ink_width(f, "LOKESH ROHILLA", name_cap, 0.035)

    mark_h = 300.0            # flourish box is 256 tall, scaled up
    scale = mark_h / 256.0
    gap = 58.0

    pad = 40
    width = gap + n_hi - n_lo + pad * 2
    height = mark_h + pad * 2

    body = ['  <g transform="translate(%s %s)">' % (pad - n_lo, pad)]
    body.append('    <g transform="scale(%s)">' % round(scale, 4))
    body.append('      <path fill="none" stroke="#111111" stroke-width="9" '
                'stroke-linecap="round" stroke-linejoin="round" d="%s"/>' % GESTURE)
    body.append("    </g>")
    body += place(n_items, gap, (mark_h - name_cap) * 0.5)
    body.append("  </g>")

    emit("ref3-gesture.svg", round(width, 1), round(height, 1), body,
         "Lokesh Rohilla - gestural lockup")


if __name__ == "__main__":
    ref1()
    ref2()
    ref3()