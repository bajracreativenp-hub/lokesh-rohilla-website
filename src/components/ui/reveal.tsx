"use client";

import { motion, useReducedMotion } from "motion/react";
import { Children, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds. Use to sequence items inside a group. */
  delay?: number;
  /** "mount" for above the fold content, "view" for everything else. */
  trigger?: "mount" | "view";
  /** Travel distance in px. Larger values suit full width sections. */
  distance?: number;
  /** Set by `RevealGroup`: this wrapper is one cell of a grid, not a section. */
  dataRevealItem?: boolean;
};

/**
 * The single scroll reveal primitive for this site.
 *
 * Motivation for the motion: content should arrive in reading order so the
 * page reads as a narrative rather than a wall of simultaneous blocks.
 * Opacity and transform only, so it stays on the compositor.
 *
 * Every wrapper carries `data-reveal`. Motion writes `opacity:0` into the server
 * rendered HTML, so without JavaScript the whole page would render invisible.
 * The root layout ships a <noscript> rule that forces these back to their
 * resting state. Do not remove the attribute without that safety net.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  trigger = "view",
  distance = 22,
  dataRevealItem = false,
}: RevealProps) {
  const reduce = useReducedMotion();

  const from = reduce
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: distance };

  const shared = {
    initial: from,
    transition: reduce
      ? { duration: 0 }
      : { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] as const },
  };

  if (trigger === "mount") {
    return (
      <motion.div
        data-reveal=""
        data-reveal-item={dataRevealItem || undefined}
        className={className}
        {...shared}
        animate={{ opacity: 1, y: 0 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      data-reveal=""
      data-reveal-item={dataRevealItem || undefined}
      className={className}
      {...shared}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -8% 0px" }}
    >
      {children}
    </motion.div>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  /** Seconds between each item. */
  stagger?: number;
  distance?: number;
};

/**
 * Sequenced variant of Reveal for lists.
 *
 * CHILDREN ARE FLATTENED, AND THAT IS LOAD BEARING.
 *
 * The obvious implementation is `children.map(...)`, and it is wrong. Callers
 * write a `.map()` inside the component, and JSX hands that whole array over as
 * a *single* child slot. So `{items.map(...)}` plus one more element arrived as
 * an array of length two, and the group wrapped the entire list in one `Reveal`
 * and then wrapped the trailing element in another.
 *
 * The list still rendered, which is why this went unnoticed. What broke was
 * layout: a `grid-cols-3` whose only children were two wrapper divs, so the grid
 * had two cells instead of seven and every card stacked in one tall column. It
 * affected every grid on the site, not one page.
 *
 * `React.Children.toArray` flattens nested arrays and fragments, and drops the
 * `null` that a conditional child leaves behind, so indexes stay contiguous and
 * the stagger is per card. Keys are preserved, so a keyed list still reconciles
 * by identity rather than by position.
 */
export function RevealGroup({
  children,
  className,
  itemClassName,
  stagger = 0.07,
  distance = 22,
}: RevealGroupProps) {
  const reduce = useReducedMotion();

  /*
    `Children.toArray` already drops `null`, `undefined` and booleans, and
    flattens nested arrays and fragments. No extra filtering is needed, and
    adding any would only risk reintroducing the index drift this fixes.
  */
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, i) => (
        <Reveal
          // Keyed where the caller keyed, index where they did not.
          key={typeof child === "object" && child !== null && "key" in child ? child.key : i}
          className={itemClassName}
          delay={reduce ? 0 : i * stagger}
          distance={distance}
          /*
            Marks this wrapper as one grid item rather than a free standing
            reveal. A singular `Reveal` is allowed to wrap several elements (a
            hero stack, for example), but a `RevealGroup` item must wrap exactly
            one, because it is a cell in somebody's grid. `verify:routes`
            asserts that, which is what catches a collapsed grid.
          */
          dataRevealItem
        >
          {child}
        </Reveal>
      ))}
    </div>
  );
}
