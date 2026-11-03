import type { ComponentProps, ReactNode } from "react";
import { Link as IntlLink } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { type ButtonSize, type ButtonVariant } from "./Button";

const variants = {
  primary:
    "border-transparent bg-gradient-brand text-on-brand shadow-[var(--shadow-btn-primary)] hover:-translate-y-0.5",
  secondary:
    "border-line bg-panel text-text hover:-translate-y-0.5 hover:border-tile-hover-line",
  ghost: "border-transparent bg-transparent text-text hover:bg-blue-soft",
} as const satisfies Record<ButtonVariant, string>;

const sizes = {
  md: "h-[length:var(--control-height)] px-7 text-[15px]",
  sm: "h-[length:var(--control-height-sm)] px-5 text-sm",
} as const satisfies Record<ButtonSize, string>;

type IntlHref = ComponentProps<typeof IntlLink>["href"];

export type ButtonLinkProps = Omit<
  ComponentProps<typeof IntlLink>,
  "href" | "className"
> & {
  href: IntlHref;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

/** next-intl Link styled like Button (for CTAs in nav/footer). */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <IntlLink
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-pill border font-bold no-underline transition-[transform,box-shadow,background-color,border-color] duration-[var(--motion-hover)]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </IntlLink>
  );
}
