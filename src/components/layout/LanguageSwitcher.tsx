"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  /** Called after choosing a locale (e.g. close mobile drawer). */
  onNavigate?: () => void;
};

export function LanguageSwitcher({ className, onNavigate }: Props) {
  const t = useTranslations("Layout");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-pill border border-line bg-panel p-1",
        className,
      )}
      role="group"
      aria-label={t("language.label")}
    >
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <Link
            key={loc}
            href={pathname}
            locale={loc}
            hrefLang={loc}
            onClick={onNavigate}
            className={cn(
              "inline-flex h-11 min-w-11 shrink-0 items-center justify-center whitespace-nowrap rounded-pill px-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-blue-soft font-semibold text-text"
                : "text-muted hover:bg-blue-soft hover:text-text",
            )}
            aria-current={active ? "true" : undefined}
            aria-label={`${loc.toUpperCase()} (${t(`language.${loc}`)})`}
            title={t(`language.${loc}`)}
          >
            {loc.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
