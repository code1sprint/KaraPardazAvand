import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type FloatingShapesProps = HTMLAttributes<HTMLDivElement> & {
  /** Hide on small screens (preview behavior). */
  hideOnMobile?: boolean;
};

/**
 * Decorative ribbon + orange triangle near the hero.
 * pointer-events: none — never intercepts focus or clicks.
 */
export function FloatingShapes({
  className,
  hideOnMobile = true,
  ...props
}: FloatingShapesProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        hideOnMobile && "hidden md:block",
        className,
      )}
      {...props}
    >
      <svg
        className="absolute start-[-30px] top-[520px] w-[210px] animate-[kara-float_var(--motion-float)_ease-in-out_infinite]"
        viewBox="0 0 210 210"
      >
        <defs>
          <linearGradient
            id="kara-float-ribbon"
            x1="0"
            y1="1"
            x2="1"
            y2="0"
          >
            <stop offset="0" stopColor="var(--navy)" />
            <stop offset="1" stopColor="var(--sky)" />
          </linearGradient>
        </defs>
        <path
          d="M20 190 L120 90 L120 30 L190 30 L190 100 L90 190Z"
          fill="url(#kara-float-ribbon)"
          stroke="url(#kara-float-ribbon)"
          strokeWidth="14"
          strokeLinejoin="round"
          opacity="0.85"
        />
      </svg>

      <svg
        className="absolute end-[-20px] top-[720px] w-[130px] animate-[kara-float_var(--motion-float)_ease-in-out_infinite] [animation-delay:-4s]"
        viewBox="0 0 100 90"
      >
        <path
          d="M50 8 L92 82 L8 82Z"
          fill="var(--orange)"
          stroke="var(--amber)"
          strokeWidth="10"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
