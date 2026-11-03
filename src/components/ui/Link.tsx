import type { ComponentProps, ReactNode } from "react";
import { Link as IntlLink } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const variants = {
  default:
    "text-blue underline-offset-4 hover:underline focus-visible:rounded-sm",
  quiet: "text-muted hover:text-text focus-visible:rounded-sm",
  nav: "text-text hover:text-blue focus-visible:rounded-sm",
} as const;

export type LinkVariant = keyof typeof variants;

type IntlHref = ComponentProps<typeof IntlLink>["href"];

export type LinkProps = Omit<ComponentProps<typeof IntlLink>, "href"> & {
  href: IntlHref;
  variant?: LinkVariant;
  children: ReactNode;
};

export function Link({
  href,
  variant = "default",
  className,
  children,
  ...props
}: LinkProps) {
  return (
    <IntlLink
      href={href}
      className={cn(
        "inline-flex items-center transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </IntlLink>
  );
}
