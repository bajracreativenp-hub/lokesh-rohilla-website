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

export function SellingBriefcaseIcon() {
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex size-12 cursor-pointer items-center justify-center rounded-xl border border-hairline bg-sunk text-accent transition-transform duration-200 ease-brand hover:scale-105"
    >
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
        initial={false}
        animate={
          hovered && !reduce
            ? { y: [0, -2, 0], rotate: [0, -5, 5, -2, 0] }
            : { y: 0, rotate: 0 }
        }
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Top handle */}
        <motion.path
          d="M8 7V4.8C8 3.8 8.8 3 9.8 3h4.4C15.2 3 16 3.8 16 4.8V7"
          initial={false}
          animate={hovered && !reduce ? { y: [0, -1.5, 0] } : { y: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        {/* Briefcase body */}
        <rect x="3" y="7" width="18" height="13" rx="2" />
        {/* Middle horizontal belt */}
        <motion.path
          d="M3 12h18"
          initial={false}
          animate={
            hovered && !reduce
              ? { pathLength: [0, 1], opacity: [0.4, 1] }
              : { pathLength: 1, opacity: 1 }
          }
          transition={{ duration: 0.35, ease: "easeInOut" }}
        />
        {/* Two vertical clasp straps */}
        <motion.path
          d="M9 12v3M15 12v3"
          initial={false}
          animate={
            hovered && !reduce
              ? { y: [-2, 1, 0], opacity: [0.3, 1, 1] }
              : { y: 0, opacity: 1 }
          }
          transition={{ duration: 0.4, delay: hovered && !reduce ? 0.1 : 0, ease: "easeOut" }}
        />
      </motion.svg>
    </div>
  );
}

export function CompetitiveMedalIcon() {
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex size-12 cursor-pointer items-center justify-center rounded-xl border border-hairline bg-sunk text-accent transition-transform duration-200 ease-brand hover:scale-105"
    >
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
        style={{ originX: "50%", originY: "15%" }}
        initial={false}
        animate={
          hovered && !reduce
            ? { rotate: [0, -8, 8, -4, 0], y: [0, -1.5, 0] }
            : { rotate: 0, y: 0 }
        }
        transition={{ duration: 0.55, ease: "easeInOut" }}
      >
        {/* Left & right V-ribbons */}
        <motion.path
          d="M6.4 11 2.6 5.2A1 1 0 0 1 3.45 3.6h4.8a1 1 0 0 1 .85.48L12 8.6"
          initial={false}
          animate={
            hovered && !reduce
              ? { pathLength: [0.3, 1], opacity: [0.5, 1] }
              : { pathLength: 1, opacity: 1 }
          }
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
        <motion.path
          d="m17.6 11 3.8-5.8a1 1 0 0 0-.85-1.6h-4.8a1 1 0 0 0-.85.48L12 8.6"
          initial={false}
          animate={
            hovered && !reduce
              ? { pathLength: [0.3, 1], opacity: [0.5, 1] }
              : { pathLength: 1, opacity: 1 }
          }
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
        {/* Medallion circle */}
        <motion.circle
          cx="12"
          cy="14.5"
          r="6.5"
          initial={false}
          animate={
            hovered && !reduce
              ? { scale: [0.88, 1.06, 1] }
              : { scale: 1 }
          }
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        {/* Number 1 inside medallion */}
        <motion.path
          d="M10.3 13.5 12.3 11.9v5.5"
          initial={false}
          animate={
            hovered && !reduce
              ? { pathLength: [0, 1], opacity: [0, 1], scale: [0.8, 1.1, 1] }
              : { pathLength: 1, opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.35, delay: hovered && !reduce ? 0.12 : 0, ease: "easeOut" }}
        />
      </motion.svg>
    </div>
  );
}
