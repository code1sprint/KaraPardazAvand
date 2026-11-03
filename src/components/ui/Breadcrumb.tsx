import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Link } from "./Link";

export type BreadcrumbCrumb = {
  label: string;
  /** When omitted, item is treated as the current page. */
  href?: string;
};

export type BreadcrumbProps = {
  items: readonly BreadcrumbCrumb[];
  label: string;
  className?: string;
  separator?: ReactNode;
};

/** Presentational breadcrumb trail (client-safe). JSON-LD lives in layout/Breadcrumbs. */
export function Breadcrumb({
  items,
  label,
  className,
  separator = "/",
}: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label={label} className={cn(className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden className="text-line">
                  {separator}
                </span>
              ) : null}
              {item.href && !isLast ? (
                <Link href={item.href} variant="quiet" className="text-sm">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? "font-medium text-text" : undefined}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
