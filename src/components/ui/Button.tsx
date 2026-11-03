import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "border-transparent bg-gradient-brand text-on-brand shadow-[var(--shadow-btn-primary)] hover:-translate-y-0.5",
  secondary:
    "border-line bg-panel text-text hover:-translate-y-0.5 hover:border-tile-hover-line",
  ghost: "border-transparent bg-transparent text-text hover:bg-blue-soft",
} as const;

const sizes = {
  md: "h-[length:var(--control-height)] px-7 text-[15px]",
  sm: "h-[length:var(--control-height-sm)] px-5 text-sm",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  /** `sm` maps to the package “small” pill (40px). */
  size?: ButtonSize;
  children: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      className,
      type = "button",
      children,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-pill border font-bold transition-[transform,box-shadow,background-color,border-color] duration-[var(--motion-hover)] disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
