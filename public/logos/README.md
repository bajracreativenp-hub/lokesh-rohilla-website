# CLIENT LOGOS

Real marks for the "Worked with" strip on the landing page go here.

One file per organisation, named after it. Drop the file in and set the
organisation's `src` in `src/lib/content.ts`:

```ts
// src/lib/content.ts -> clientLogos
{ name: "Siddharth Hospitality", initials: "SH", spec: "320x120", src: "/logos/siddharth-hospitality.svg" },
```

A `null` `src` renders the monogram placeholder. A set `src` renders the mark.
They can be replaced one at a time; the strip does not change height either way.

## BEFORE A MARK GOES IN

**Get written permission.** Every other `src` on this site is a placeholder
because this exact rule was applied to it. Displaying an organisation's logo
asserts an association that has not been granted, and an implied endorsement is
not a granted one. A missing file is an oversight. An unpermissioned mark is a
claim about someone else's business.

## WHAT THE FILE SHOULD BE

- **SVG preferred.** It scales to any box and weighs nothing. A PNG is fine if
  that is all there is, but use one with a transparent background.
- **Horizontal lockup preferred** (symbol beside or above the wordmark), because
  the slot is wider than it is tall: 168px by 64px.
- **It will be shown greyscale.** The strip renders every mark desaturated at rest
  and in colour on hover, so a mark that only works in full colour will read as a
  grey blob.
- **Keep it simple.** At this size a detailed mark turns to mush. If the
  organisation has a simplified or stacked variant for small sizes, use that.

## SIZING

The slot reserves `h-16 w-[10.5rem]` and the image is `object-contain`, capped at
48px tall. There is no need to pre-size anything: the box is fixed and the mark is
letterboxed inside it, which is what keeps six organisations of different shapes
sitting on one baseline.

**Trim the padding off before adding a file.** The first mark supplied was
1275x594 of which the logo itself was 632x320 — 316px of empty space on the left,
327 on the right, 133 above and 141 below. In a 168px slot that renders the logo at
about half the size it should be, off centre, inside a frame that looks empty. The
bounding box can be found by scanning for the first and last pixel that is not
near-white or transparent, then cropping with a small margin.

`spec` records the intended source dimensions. It is shown as a tooltip and
published as a data attribute for the asset manifest, so it is documentation
rather than something the layout reads.