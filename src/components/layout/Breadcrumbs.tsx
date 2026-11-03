import { getLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/components/ui/Link";
import { getSiteUrl } from "@/content/site";
import { cn } from "@/lib/cn";

export type BreadcrumbItem = {
  label: string;
  /** Locale-agnostic path for next-intl Link. Omit on the current page. */
  href?: string;
};

export type BreadcrumbsProps = {
  items: readonly BreadcrumbItem[];
  className?: string;
  /** Accessible name for the nav landmark. */
  label: string;
};

/**
 * Inner-page trail with BreadcrumbList JSON-LD.
 * Last item is the current page (no link).
 */
export async function Breadcrumbs({
  items,
  className,
  label,
}: BreadcrumbsProps) {
  if (items.length === 0) return null;

  const locale = await getLocale();
  const siteUrl = getSiteUrl().replace(/\/$/, "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const entry: {
        "@type": "ListItem";
        position: number;
        name: string;
        item?: string;
      } = {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
      };
      if (item.href) {
        entry.item = `${siteUrl}/${locale}${item.href === "/" ? "" : item.href}`;
      }
      return entry;
    }),
  };

  return (
    <nav aria-label={label} className={cn("mb-8", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden className="text-line">
                  /
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
      <JsonLd data={jsonLd} />
    </nav>
  );
}
