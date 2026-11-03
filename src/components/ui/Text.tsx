import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  body: "text-base leading-[var(--leading-body)] text-text sm:text-[length:var(--text-body-lg)]",
  muted:
    "text-base leading-[var(--leading-body)] text-muted sm:text-[length:var(--text-body-lg)]",
  mono: "font-mono text-sm leading-relaxed text-text",
  caption: "text-sm leading-normal text-muted",
} as const;

export type TextVariant = keyof typeof variants;

export type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  variant?: TextVariant;
  as?: "p" | "span" | "div";
  children: ReactNode;
};

export function Text({
  variant = "body",
  as: Tag = "p",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn("text-start", variants[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
