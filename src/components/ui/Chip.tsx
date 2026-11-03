import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  soft: "bg-blue-soft text-blue",
  panel: "border border-line bg-panel text-text",
  ok: "bg-blue-soft text-ok",
  muted: "bg-blue-soft text-muted",
} as const;

export type ChipTone = keyof typeof tones;

export type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: ChipTone;
  children: ReactNode;
};

export function Chip({
  tone = "soft",
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3.5 py-1.5 text-[12.5px] font-medium",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
