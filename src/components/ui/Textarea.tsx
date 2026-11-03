import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export function Textarea({ className, invalid, id, ...props }: TextareaProps) {
  return (
    <textarea
      id={id}
      aria-invalid={invalid || undefined}
      className={cn(
        "min-h-28 w-full rounded-[var(--radius-control)] border border-line bg-panel px-4 py-3 text-base leading-[var(--leading-body)] text-text placeholder:text-muted",
        "disabled:cursor-not-allowed disabled:opacity-50",
        invalid && "border-orange",
        className,
      )}
      {...props}
    />
  );
}
