import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const levels = {
  1: "text-[length:var(--h1-size)] font-black leading-[var(--leading-heading)] tracking-[var(--h1-tracking)]",
  2: "text-[length:var(--h2-size)] font-black leading-[var(--leading-h2)] tracking-[var(--h2-tracking)]",
  3: "text-2xl font-extrabold leading-[var(--leading-h2)]",
  4: "text-xl font-bold leading-[var(--leading-h2)]",
} as const;

export type HeadingLevel = keyof typeof levels;

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: HeadingLevel;
  children: ReactNode;
};

export function Heading({
  as = 2,
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = `h${as}` as const;

  return (
    <Tag className={cn("text-start text-text", levels[as], className)} {...props}>
      {children}
    </Tag>
  );
}
