import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type MarqueeProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Extra pause label above the track. */
  caption?: string;
};

/**
 * LTR tech-name marquee with masked edges and a duplicated track.
 * Animation disabled under prefers-reduced-motion via globals.css.
 */
export function Marquee({
  children,
  caption,
  className,
  ...props
}: MarqueeProps) {
  return (
    <div className={cn(className)} {...props}>
      {caption ? (
        <p className="mb-4 text-center text-[13px] text-muted">{caption}</p>
      ) : null}
      <div
        className="overflow-hidden [direction:ltr] [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
        aria-hidden
      >
        <div className="flex w-max animate-[kara-marquee_var(--motion-marquee)_linear_infinite] gap-14 font-mono text-[15px] font-medium text-muted">
          <div className="flex shrink-0 gap-14">{children}</div>
          <div className="flex shrink-0 gap-14" aria-hidden>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
