import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { TriMarker } from "./TriMarker";

export type PillProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  /** Show the orange triangle marker before the label. */
  marker?: boolean;
};

/** Eyebrow chip — glass-ish pill with optional TriMarker. */
export function Pill({
  children,
  marker = true,
  className,
  ...props
}: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-pill border border-line bg-panel/80 px-4 py-1.5 text-[13px] text-muted",
        className,
      )}
      {...props}
    >
      {marker ? <TriMarker /> : null}
      {children}
    </span>
  );
}
