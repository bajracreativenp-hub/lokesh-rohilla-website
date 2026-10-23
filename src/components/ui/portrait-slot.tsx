import Image from "next/image";

/**
 * Image slot. Renders a photograph when one is supplied, and reserves the box
 * when one is not.
 */

export type ImageSlotProps = {
  ratio?: string;
  spec: string;
  label: string;
  direction?: string;
  className?: string;
  elevated?: boolean;
  src?: string;
  alt?: string;
  preload?: boolean;
  bleed?: boolean;
  sizes?: string;
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
  bleed = false,
  sizes = "100vw",
}: ImageSlotProps) {
  const manifest = {
    "data-asset-slot": label,
    "data-asset-spec": spec,
    "data-art-direction": direction,
  } as const;

  if (src) {
    return (
      <div
        className={`slot relative overflow-hidden ${bleed ? "!rounded-none" : ""} ${elevated ? "shadow-card" : ""} ${className}`}
        style={ratio ? { aspectRatio: ratio } : undefined}
        {...manifest}
      >
        <Image
          src={src}
          alt={alt ?? label}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.03]"
          {...(preload ? { preload: true } : {})}
        />
      </div>
    );
  }

  return (
    <div
      className={`slot ${bleed ? "!rounded-none" : ""} ${elevated ? "shadow-card" : ""} ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
      role="img"
      aria-label={label}
      {...manifest}
    >
      <span className="slot-label">
        <span className="block text-ink">{label}</span>
        <span className="mt-2 block normal-case font-medium tracking-normal text-ink-muted">
          {spec}
        </span>
      </span>
    </div>
  );
}

/**
 * Video frame slot.
 */
export function VideoSlot({
  spec = "16:9, 1920x1080",
  label = "Featured session",
  index,
  src,
  alt,
}: {
  spec?: string;
  label?: string;
  index?: number;
  src?: string;
  alt?: string;
}) {
  return (
    <figure className="group flex h-full flex-col gap-4">
      <div
        className={`slot relative shadow-card transition-all duration-300 ease-brand group-hover:-translate-y-1 group-hover:shadow-lift ${src ? "overflow-hidden" : ""}`}
        style={{ aspectRatio: "16 / 9" }}
        role="img"
        aria-label={label}
        data-asset-slot={label}
        data-asset-spec={spec}
      >
        {src ? (
          <Image
            src={src}
            alt={alt ?? label}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-45 z-[var(--z-base)] transition-transform duration-500 ease-brand group-hover:scale-105"
          />
        ) : null}

        <span
          aria-hidden="true"
          className="relative z-[var(--z-raised)] grid size-14 place-items-center rounded-full border-2 border-hairline-strong text-placeholder-ink transition-transform duration-200 ease-brand group-hover:scale-105"
        >
          <svg aria-hidden="true" className="size-5 translate-x-px" viewBox="0 0 256 256" fill="currentColor">
            <path d="M240 128a15.74 15.74 0 0 1-7.6 13.71L88.32 229.65a16 16 0 0 1-16.2.3A15.86 15.86 0 0 1 64 216.13V39.87a15.86 15.86 0 0 1 8.12-13.82 16 16 0 0 1 16.2.3l144.08 87.94A15.74 15.74 0 0 1 240 128Z" />
          </svg>
        </span>

        <span className={`relative z-[var(--z-raised)] slot-label ${src ? "slot-label-panel" : ""}`}>
          <span className="block text-ink">Featured Session</span>
          <span className="mt-2 block normal-case font-medium tracking-normal text-ink-muted">
            {label}
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

const SERVICE_CARD_BODIES: Record<string, string> = {
  "Business Consultation":
    "Diagnosis first, then the systems that make the change hold.",
  "Self-Development Programs":
    "Training days and workshops for people working on their own patterns.",
  "Leaders & Team Development":
    "One to one mentoring and group programs for teams under pressure.",
};

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
