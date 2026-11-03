import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type TriMarkerProps = HTMLAttributes<HTMLSpanElement> & {
  /** Hide visually but keep layout space (e.g. inactive tab slot). */
  invisible?: boolean;
};

/** Orange brand triangle — active tab, bullets, current step. */
export function TriMarker({
  className,
  invisible = false,
  ...props
}: TriMarkerProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-[10px] h-[9px] w-2.5 shrink-0 bg-gradient-to-b from-amber to-orange [clip-path:polygon(50%_0,100%_100%,0_100%)]",
        invisible && "opacity-0",
        className,
      )}
      {...props}
    />
  );
}
