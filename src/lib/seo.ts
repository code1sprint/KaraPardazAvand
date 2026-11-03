import type { Metadata } from "next";
import { getSiteUrl } from "@/content/site";
import { routing, type AppLocale } from "@/i18n/routing";

/** Locale-agnostic app path → absolute URL for a locale (`/fa`, `/en/...`). */
export function absoluteUrl(locale: string, path = "/"): string {
  const base = getSiteUrl().replace(/\/$/, "");
  const normalized =
    !path || path === "/"
      ? ""
      : path.startsWith("/")
        ? path
        : `/${path}`;
  return `${base}/${locale}${normalized}`;
}

/** Locale-agnostic path used in next-intl Link hrefs. */
export function normalizePath(path = "/"): string {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export type BuildPageMetadataInput = {
  locale: string;
  /** Locale-agnostic path, e.g. `/services` or `/`. */
  path?: string;
  title: string;
  description: string;
  siteName: string;
  /** Absolute or site-relative OG image URL. Defaults to `/og?...`. */
  imageUrl?: string;
  imageAlt?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  /** Skip layout title template (use for home brand title). */
  absoluteTitle?: boolean;
};

/**
 * Shared Metadata API builder: canonical, hreflang, Open Graph, Twitter.
 * Use from every route's `generateMetadata`.
 */
export function buildPageMetadata({
  locale,
  path = "/",
  title,
  description,
  siteName,
  imageUrl,
  imageAlt,
  noIndex = false,
  type = "website",
  absoluteTitle = false,
}: BuildPageMetadataInput): Metadata {
  const pathname = normalizePath(path);
  const canonical = absoluteUrl(locale, pathname);

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = absoluteUrl(loc, pathname);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, pathname);

  const ogImagePath =
    imageUrl ??
    `/api/og?locale=${encodeURIComponent(locale)}&title=${encodeURIComponent(title)}`;

  const images = [
    {
      url: ogImagePath,
      width: 1200,
      height: 630,
      alt: imageAlt ?? title,
    },
  ];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      alternateLocale: routing.locales
        .filter((loc) => loc !== locale)
        .map((loc) => (loc === "fa" ? "fa_IR" : "en_US")),
      url: canonical,
      siteName,
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImagePath],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function isAppLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value);
}
