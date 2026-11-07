"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export function GrowthTrendIcon() {
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex size-12 cursor-pointer items-center justify-center rounded-xl border border-hairline bg-sunk text-accent transition-transform duration-200 ease-brand hover:scale-105"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <motion.path
          d="M2 17L8.5 10.5L13.5 15.5L22 7"
          initial={false}
          animate={
            hovered && !reduce
              ? { pathLength: [0, 1], opacity: [0.35, 1] }
              : { pathLength: 1, opacity: 1 }
          }
          transition={{ duration: 0.45, ease: "easeInOut" }}
        />
        <motion.path
          d="M15 7H22V14"
          initial={false}
          animate={
            hovered && !reduce
              ? { pathLength: [0, 1], opacity: [0, 1], x: [-2, 0], y: [2, 0] }
              : { pathLength: 1, opacity: 1, x: 0, y: 0 }
          }
          transition={{ duration: 0.25, delay: hovered && !reduce ? 0.25 : 0, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}
