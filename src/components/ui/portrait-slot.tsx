/**
 * Image placeholder slot.
 *
 * No photography has been supplied for this project yet. Rather than ship fake
 * stock imagery or a hand built fake screenshot, each image position on the
 * site reserves its exact aspect ratio inside a visibly labelled rounded slot.
 *
 * When a real asset arrives, replace the inner element with next/image using the
 * dimensions in `spec`. The reserved ratio means zero layout shift on swap.
 *
 * Note for Next.js 16: the `priority` prop on next/image is deprecated in favour
 * of `preload`, or `loading="eager"` / `fetchPriority="high"` for above the
 * fold imagery. Use one of those on the hero portrait.
 */

export type ImageSlotProps = {
  /**
   * CSS aspect ratio value, for example "4 / 5".
   * Omit when the caller controls the box size with a height instead.
   */
  ratio?: string;
  /** Human readable spec shown to the client, for example "16:9, 1920x1080". */
  spec: string;
  /** Short label describing the shot. */
  label: string;
  /** Art direction note, surfaced as a data attribute for the asset manifest. */
  direction?: string;
  className?: string;
  /** Adds the soft navy shadow used on media cards. */
  elevated?: boolean;
};

export function ImageSlot({
  ratio,
  spec,
  label,
  direction,
  className = "",
  elevated = true,
}: ImageSlotProps) {
  return (
    <div
      className={`slot ${elevated ? "shadow-card" : ""} ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
      role="img"
      aria-label={`${label}. Photography pending.`}
      /*
        The data attributes turn every placeholder into a machine readable asset
        manifest, so the full list of required images and their art direction
        can be scraped straight off the rendered page.
      */
      data-asset-slot={label}
      data-asset-spec={spec}
      data-art-direction={direction}
    >
      <span className="slot-label">
        <span className="block text-ink">Photography pending</span>
        <span className="mt-2 block normal-case font-medium tracking-normal text-ink-muted">
          {label} / {spec}
        </span>
      </span>
    </div>
  );
}

/**
 * Video frame placeholder. Reserves 16:9 and marks where the eventual
 * testimonial component will live.
 *
 * The play glyph is DECORATIVE and is deliberately not a button.
 *
 * It would be easy to make this a real play control, and that would be a lie: there
 * is no video, so pressing it would do nothing while promising that something would.
 * A control that cannot be pressed is worse than no control, because a reader who
 * tries it concludes the site is broken rather than that the content is pending.
 *
 * What the glyph does do is name the medium. Three identical grey rectangles read
 * as three empty boxes; three frames with a play mark on them read as three videos
 * that have not arrived yet, which is what they are.
 */
export function VideoSlot({
  spec = "16:9, 1920x1080",
  label = "Video testimonial",
  index,
}: {
  spec?: string;
  label?: string;
  /** One based position, shown as a small index in the corner of the frame. */
  index?: number;
}) {
  return (
    <figure className="flex h-full flex-col gap-4">
      <div
        className="slot shadow-card"
        style={{ aspectRatio: "16 / 9" }}
        role="img"
        aria-label={`${label}. Video pending.`}
        data-asset-slot={label}
        data-asset-spec={spec}
      >
        {/*
          Decorative, and in normal flow rather than absolutely positioned.

          An absolutely centred glyph would sit directly on top of the slot label,
          which is also centred, and the two would overlap into an unreadable smudge.
          Stacked in flow they read as one composition: the mark above, the words
          below.

          `aria-hidden` because the frame's own accessible name already says a video
          is pending. A play glyph announced before that would be "play button"
          followed immediately by "nothing to play".
        */}
        <span
          aria-hidden="true"
          className="grid size-14 place-items-center rounded-full border-2 border-hairline-strong text-placeholder-ink"
        >
          <svg aria-hidden="true" className="size-5 translate-x-px" viewBox="0 0 256 256" fill="currentColor">
            <path d="M136 44.6 240.4 179a12.7 12.7 0 0 1-8.5 21.8H120.8a12.7 12.7 0 0 1-8.5-21.8L216.7 44.6a12.7 12.7 0 0 1 17 0Z" />
          </svg>
        </span>

        <span className="slot-label">
          <span className="block text-ink">Video pending</span>
          <span className="mt-2 block normal-case font-medium tracking-normal text-ink-muted">
            {label} / {spec}
          </span>
        </span>
      </div>

      {index ? (
        <figcaption className="meta-label tabular-nums">
          {String(index).padStart(2, "0")}
        </figcaption>
      ) : null}
    </figure>
  );

}

/**
 * One line per service, kept beside `QuoteCard` so a service can never appear as a
 * card title with a body that belongs to a different service.
 *
 * Every line restates something already published in the services sections. None of
 * it promises an outcome, quotes anyone, or claims a result.
 */
const SERVICE_CARD_BODIES: Record<string, string> = {
  "Business Consultation":
    "Diagnosis first, then the systems that make the change hold.",
  "Self-Development Programs":
    "Training days and workshops for people working on their own patterns.",
  "Leaders & Team Development":
    "One to one mentoring and group programs for teams under pressure.",
};

/**
 * Service card, floated over the hero portrait.
 *
 * WAS a quote card reading "Confirmed words from the people Lokesh has worked with
 * will sit here", and both of them rendered the identical string, so the hero
 * carried two identical placeholder testimonials in its most prominent position.
 *
 * It now names a documented service area. A floating card beside a portrait reads
 * as something the subject is associated with, so naming what he does is both
 * better copy and true, where naming a quote that does not exist is neither.
 *
 * `source` is the service name. The body is looked up rather than passed in so the
 * two cannot drift apart, and an unknown name renders nothing rather than a
 * placeholder, because a card with a heading and no body is a legitimate shape
 * whereas "pending" is not.
 */
export function QuoteCard({
  source,
  tone = "light",
  className = "",
}: {
  source: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const tones = {
    light: "bg-white text-ink",
    dark: "bg-ink text-white",
  } as const;

  const body = SERVICE_CARD_BODIES[source];

  return (
    <div
      className={`max-w-[15rem] rounded-card p-4 shadow-lift ${tones[tone]} ${className}`}
    >
      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] opacity-70">
        {source}
      </p>
      {body ? <p className="mt-2 text-sm font-semibold leading-snug">{body}</p> : null}
    </div>
  );
}
