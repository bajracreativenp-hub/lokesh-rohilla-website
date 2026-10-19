"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

/**
 * COUNT-UP ANIMATION
 *
 * Smooth numeric counter that counts from `from` (default 1) to `to` (e.g. 18)
 * using fluid cubic-bezier deceleration easing once the element enters the viewport.
 *
 * SSR & Accessibility safe:
 * - Server renders `{prefix}{to}{suffix}` directly for SEO, crawlability, and instant paint.
 * - Suppresses hydration mismatches cleanly.
 * - Respects prefers-reduced-motion (skips straight to final value).
 */
export function CountUp({
  from = 1,
  to,
  duration = 1.4,
  delay = 0.1,
  suffix = "",
  prefix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!isInView || shouldReduceMotion || !ref.current || animatedRef.current) return;
    animatedRef.current = true;

    ref.current.textContent = `${prefix}${from}${suffix}`;

    const controls = animate(from, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${Math.round(latest)}${suffix}`;
        }
      },
    });

    return () => controls.stop();
  }, [isInView, from, to, duration, delay, prefix, suffix, shouldReduceMotion]);

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {prefix}{to}{suffix}
    </span>
  );
}
