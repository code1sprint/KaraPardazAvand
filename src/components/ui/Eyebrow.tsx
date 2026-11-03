import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { TriMarker } from "./TriMarker";

export type EyebrowProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
  /** Omit the triangle (rare). */
  marker?: boolean;
};

/** Section eyebrow: TriMarker + blue label. */
export function Eyebrow({
  children,
  marker = true,
  className,
  ...props
}: EyebrowProps) {
  return (
    <p
      className={cn(
        "mb-3.5 flex items-center gap-2.5 text-[13px] font-bold text-blue",
        className,
      )}
      {...props}
    >
      {marker ? <TriMarker /> : null}
      <span>{children}</span>
    </p>
  );
}
