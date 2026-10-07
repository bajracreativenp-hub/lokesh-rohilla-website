/**
 * Progress bar.
 *
 * A server component: it has no handlers and reads no browser state, so there
 * is no reason for it to ship JavaScript.
 *
 * The width transition is declared in CSS rather than JS so that
 * `prefers-reduced-motion` can switch it off without any of the measuring,
 * state or effect that a JS hook would need.
 */
export function Progress({
  value,
  label,
}: {
  /** 0 to 100. Clamped, because a bar can overflow its track if fed a bad number. */
  value: number;
  label: string;
}) {
  const safe = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={safe}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 w-full overflow-hidden rounded-pill bg-ink/15"
    >
      <div
        className="h-full rounded-pill bg-accent transition-[width] duration-500 ease-brand motion-reduce:transition-none"
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}