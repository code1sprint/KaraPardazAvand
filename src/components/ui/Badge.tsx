import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  neutral: "bg-blue-soft text-text",
  accent: "bg-blue-soft text-blue",
  ok: "bg-blue-soft text-ok",
} as const;

export type BadgeTone = keyof typeof tones;

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  /** Shows a status dot before the label (ok = green, else blue). */
  status?: "ok" | "accent" | "muted";
  children: ReactNode;
};

const statusDot: Record<NonNullable<BadgeProps["status"]>, string> = {
  ok: "bg-ok",
  accent: "bg-blue",
  muted: "bg-muted",
};

export function Badge({
  tone = "neutral",
  status,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill px-3 py-1 text-sm font-medium",
        tones[tone],
        className,
      )}
      {...props}
    >
      {status ? (
        <span
          aria-hidden
          className={cn("size-2 shrink-0 rounded-full", statusDot[status])}
        />
      ) : null}
      {children}
    </span>
  );
}
