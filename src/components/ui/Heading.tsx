import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const levels = {
  1: "text-[length:var(--h1-size)] font-black leading-[var(--lh-h1,1.25)] tracking-[var(--h1-tracking)] [text-wrap:balance]",
  2: "text-[length:var(--h2-size)] font-black leading-[var(--lh-h2,1.35)] tracking-[var(--h2-tracking)] [text-wrap:balance]",
  3: "text-2xl font-extrabold leading-[var(--lh-h3,1.4)] [text-wrap:balance]",
  4: "text-xl font-bold leading-[var(--lh-h3,1.4)] [text-wrap:balance]",
} as const;

export type HeadingLevel = keyof typeof levels;

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: HeadingLevel;
  /** Use inner-page H1 clamp(32px, 4.6vw, 56px) instead of home hero large scale */
  inner?: boolean;
  children: ReactNode;
};

export function Heading({
  as = 2,
  inner = false,
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = `h${as}` as const;
  const sizeClass =
    as === 1 && inner
      ? "text-[length:var(--h1-inner-size)] font-black leading-[var(--lh-h1,1.25)] tracking-[var(--h1-tracking)] [text-wrap:balance]"
      : levels[as];

  return (
    <Tag
      className={cn("text-start text-text", sizeClass, className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
