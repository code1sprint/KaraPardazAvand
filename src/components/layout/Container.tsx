import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Prose variant (760px, centered) for articles and legal pages only. */
  prose?: boolean;
  /** @deprecated use `prose` for articles/legal, standard container everywhere else */
  narrow?: boolean;
};

export function Container({
  children,
  className,
  prose = false,
  narrow = false,
  ...props
}: ContainerProps) {
  const isProse = prose || narrow;
  return (
    <div
      className={cn(
        "relative mx-auto w-full px-6",
        isProse
          ? "max-w-[var(--container-prose,760px)]"
          : "max-w-[var(--container-max,1180px)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
