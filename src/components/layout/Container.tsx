import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  narrow?: boolean;
};

export function Container({
  children,
  className,
  narrow = false,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full px-6",
        narrow
          ? "max-w-[var(--container-narrow)]"
          : "max-w-[var(--container-max)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
