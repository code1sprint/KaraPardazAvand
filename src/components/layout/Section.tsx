import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

/**
 * Page section with v3 vertical rhythm.
 * Spacing between sections is owned strictly by <main> flex gap.
 * Sections carry no vertical padding or margin of their own.
 */
export function Section({ children, className, ...props }: SectionProps) {
  return (
    <section className={cn("w-full", className)} {...props}>
      {children}
    </section>
  );
}
