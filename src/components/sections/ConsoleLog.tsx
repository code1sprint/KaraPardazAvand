"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

export type ConsoleLogProps = {
  lines: readonly string[];
  /** Remount / restart stagger when this changes (e.g. active system id). */
  animationKey: string;
  /** Dark product-surface styling inside AppWindow. */
  surface?: "page" | "window";
  className?: string;
};

export function ConsoleLog({
  lines,
  animationKey,
  surface = "page",
  className,
}: ConsoleLogProps) {
  const reduceMotion = useReducedMotion();
  const isWindow = surface === "window";

  return (
    <div
      dir="ltr"
      className={cn(
        "font-mono text-[12px] leading-[1.9] text-start",
        isWindow
          ? "min-h-[6.4em] border-t border-win-line bg-win-deep px-[22px] py-3.5 text-win-muted"
          : "rounded-[var(--radius-node)] border border-line bg-bg p-3 leading-relaxed text-text",
        className,
      )}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      <ul className="flex flex-col">
        {lines.map((line, index) => (
          <motion.li
            key={`${animationKey}-${index}-${line}`}
            className="flex items-start gap-2 text-start"
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    delay: 0.25 + index * 0.26,
                    duration: 0.35,
                    ease: "easeOut",
                  }
            }
          >
            <span aria-hidden className="text-ok">
              ●
            </span>
            <span
              className={cn(
                "min-w-0 break-words",
                isWindow ? "text-win-muted" : "text-muted",
              )}
            >
              {line}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
