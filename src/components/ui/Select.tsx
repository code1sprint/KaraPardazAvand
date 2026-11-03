import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

export function Select({
  className,
  invalid,
  id,
  children,
  ...props
}: SelectProps) {
  return (
    <span className="relative block w-full">
      <select
        id={id}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-[length:var(--control-height)] w-full appearance-none rounded-[var(--radius-control)] border border-line bg-panel px-4 pe-10 text-base text-text",
          "disabled:cursor-not-allowed disabled:opacity-50",
          invalid && "border-orange",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 12 8"
        className="pointer-events-none absolute end-4 top-1/2 size-3 -translate-y-1/2 text-muted"
        fill="none"
      >
        <path
          d="M1 1.5 6 6.5 11 1.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
