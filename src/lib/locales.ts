import type { AppLocale } from "@/i18n/routing";

export function getLocaleDirection(locale: string): "rtl" | "ltr" {
  return locale === "fa" ? "rtl" : "ltr";
}

export function isAppLocale(value: string): value is AppLocale {
  return value === "fa" || value === "en";
}
