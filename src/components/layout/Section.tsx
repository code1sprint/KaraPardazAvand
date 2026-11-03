import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

/** Page section with v3 vertical rhythm (72/110 default; pages may densify via --section-pad-y). */
export function Section({ children, className, ...props }: SectionProps) {
  return (
    <section
      className={cn("py-[length:var(--section-pad-y)]", className)}
      {...props}
    >
      {children}
    </section>
  );
}
