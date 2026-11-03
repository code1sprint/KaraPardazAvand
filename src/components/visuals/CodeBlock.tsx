import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CodeBlockProps = HTMLAttributes<HTMLPreElement> & {
  children?: ReactNode;
  /** Accessible label for the code region. */
  label?: string;
};

/** Dark mono code surface — always LTR. */
export function CodeBlock({
  children,
  className,
  label,
  ...props
}: CodeBlockProps) {
  return (
    <pre
      aria-label={label}
      className={cn(
        "overflow-x-auto rounded-code border border-win-line bg-win-bg p-4 font-mono text-[12.5px] leading-[1.8] text-band-muted [direction:ltr] text-start",
        className,
      )}
      {...props}
    >
      {typeof children === "string" ? <code>{children}</code> : children}
    </pre>
  );
}
