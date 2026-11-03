import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function Input({ className, invalid, id, ...props }: InputProps) {
  return (
    <input
      id={id}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-[length:var(--control-height)] w-full rounded-[var(--radius-control)] border border-line bg-panel px-4 text-base text-text placeholder:text-muted",
        "disabled:cursor-not-allowed disabled:opacity-50",
        invalid && "border-orange",
        className,
      )}
      {...props}
    />
  );
}
