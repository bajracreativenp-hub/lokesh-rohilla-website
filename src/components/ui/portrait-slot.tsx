import Image from "next/image";

/**
 * Image slot. Renders a photograph when one is supplied, and reserves the box
 * when one is not.
 *
 * THE DEFAULT IS STILL "NO PHOTOGRAPHY".
 *
 * No photography of Lokesh has been supplied and none may be invented, so every
 * image position on this site reserves its exact aspect ratio inside a visibly
 * labelled slot. That is the correct state for a live personal brand site: a
 * stock photograph of a stranger would assert that the stranger is Lokesh.
 *
 * A slot with no `src` therefore renders exactly as it always has. The pending
 * label is not a fallback that was tolerated, it is the primary state.
 *
 * WHAT `src` IS FOR
 *
 * Demo only. Passing `src` swaps the inner label for a real image so the layout
 * can be judged with pictures in it, which a wireframe of grey boxes cannot tell
 * you. The `spec` and `direction` stay in the content layer either way, because
 * they remain the art direction whoever eventually supplies the real file.
 *
 * TO GO LIVE: remove every `src` from the content layer. Nothing else changes
 * and the site returns to pending. There is no build flag and no runtime branch
 * to remember, which is deliberate: a demo-only flag is one toggle away from
 * shipping stock portraits of strangers on a personal brand site.
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
  /**
   * Demo photograph. Absolute Unsplash CDN URL, allowlisted in `next.config.ts`.
   * Absent means pending, which is the live state.
   */
  src?: string;
  /**
   * Alt text for the photograph. Required whenever `src` is, because an
   * `ImageSlot` with no image describes itself through `aria-label` while a
   * filled one hands naming to the image element.
   */
  alt?: string;
  /** Above the fold imagery only. Passes `preload` rather than the deprecated `priority`. */
  preload?: boolean;
};

export function ImageSlot({
  ratio,
  spec,
  label,
  direction,
  className = "",
  elevated = true,
  src,
  alt,
  preload = false,
}: ImageSlotProps) {
  /*
    THE DATA ATTRIBUTES SURVIVE BOTH STATES.

    They turn every slot into a machine readable asset manifest, so the list of
    required images and their art direction can be scraped off the rendered page
    whether or not a placeholder image is currently standing in. Removing them
    when `src` is present would make the manifest disappear exactly when a
    future contributor most needs it: when swapping the demo file for the real
    one.
  */
  const manifest = {
    "data-asset-slot": label,
    "data-asset-spec": spec,
    "data-art-direction": direction,
  } as const;

  if (src) {
    return (
      <div
        className={`slot relative overflow-hidden ${elevated ? "shadow-card" : ""} ${className}`}
        style={ratio ? { aspectRatio: ratio } : undefined}
        {...manifest}
      >
        {/*
          `fill` rather than width/height. The box is sized by `aspect-ratio` or
          by its parent, and `fill` makes the image exactly that box with no
          second source of dimensions to drift out of sync with it.

          `sizes` is what stops the browser downloading a 1920px file into a
          320px slot. It is the real rendered width at each breakpoint, which is
          not the nominal asset width in `spec` and was measured rather than
          guessed.
        */}
        <Image
          src={src}
          alt={alt ?? label}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          {...(preload ? { preload: true } : {})}
        />
      </div>
    );
  }

  return (
    <div
      className={`slot ${elevated ? "shadow-card" : ""} ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
      role="img"
      aria-label={`${label}. Photography pending.`}
      {...manifest}
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
  src,
  alt,
}: {
  spec?: string;
  label?: string;
  /** One based position, shown as a small index in the corner of the frame. */
  index?: number;
  /*
    DEMO ONLY. A POSTER FRAME, not the video.

    Deliberately no face. This slot sits under a heading about client
    testimonials, so a photograph of a person in it reads as that person giving
    a testimonial they never gave. A room, a stage or a workshop fills the frame
    honestly: it shows the kind of footage that will go here without claiming
    who is in it.

    The play glyph stays and the frame still reads as pending, because it is.
  */
  src?: string;
  /** Describes the poster photograph. Never implies who is speaking. */
  alt?: string;
}) {
  return (
    <figure className="flex h-full flex-col gap-4">
      <div
        className={`slot relative shadow-card ${src ? "overflow-hidden" : ""}`}
        style={{ aspectRatio: "16 / 9" }}
        role="img"
        aria-label={`${label}. Video pending.`}
        data-asset-slot={label}
        data-asset-spec={spec}
      >
        {src ? (
          <Image
            src={src}
            alt={alt ?? label}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            /*
              Dimmed to 45% so the white play glyph and the pending label keep
              their contrast against a photograph whose content is unknown. The
              same reason probe-contrast measures the hero against its scrim's
              worst case rather than against a real image.
            */
            className="object-cover opacity-45 z-[var(--z-base)]"
          />
        ) : null}
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
          className="relative z-[var(--z-raised)] grid size-14 place-items-center rounded-full border-2 border-hairline-strong text-placeholder-ink"
        >
          <svg aria-hidden="true" className="size-5 translate-x-px" viewBox="0 0 256 256" fill="currentColor">
            <path d="M136 44.6 240.4 179a12.7 12.7 0 0 1-8.5 21.8H120.8a12.7 12.7 0 0 1-8.5-21.8L216.7 44.6a12.7 12.7 0 0 1 17 0Z" />
          </svg>
        </span>

        <span className={`relative z-[var(--z-raised)] slot-label ${src ? "slot-label-panel" : ""}`}>
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
