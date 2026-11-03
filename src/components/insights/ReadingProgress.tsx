"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export type ReadingProgressProps = {
  /** Accessible name for the progress indicator. */
  label: string;
  /** CSS selector for the article body used to compute progress. */
  targetId?: string;
};

/**
 * Fixed reading-progress bar. Updates instantly under reduced motion;
 * uses scaleX from inline-start so RTL grows correctly.
 */
export function ReadingProgress({
  label,
  targetId = "insight-article",
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(media.matches);
    syncMotion();
    media.addEventListener("change", syncMotion);
    return () => media.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    const target = document.getElementById(targetId);

    const update = () => {
      if (!target) {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0);
        return;
      }

      const rect = target.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      const height = target.offsetHeight;
      const viewport = window.innerHeight;
      const start = absoluteTop;
      const end = absoluteTop + height - viewport;
      if (end <= start) {
        setProgress(window.scrollY >= start ? 1 : 0);
        return;
      }
      const next = (window.scrollY - start) / (end - start);
      setProgress(Math.min(1, Math.max(0, next)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden bg-transparent"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <div
        className={cn(
          "h-full w-full origin-inline-start bg-blue",
          !reduceMotion && "transition-transform duration-150 ease-out",
        )}
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
