import type { Metadata } from "next";
import { getSiteUrl } from "@/content/site";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  createPageMetadata,
  formatMetaTitle,
  clampDescription,
  HOME_METADATA,
  type CreatePageMetadataOptions,
} from "./seo/metadata";

export { createPageMetadata, formatMetaTitle, clampDescription, HOME_METADATA };
export type { CreatePageMetadataOptions };

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
  siteName?: string;
  /** Absolute or site-relative OG image URL. Defaults to `/og?...`. */
  imageUrl?: string;
  imageAlt?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  /** Skip layout title template (use for home brand title). */
  absoluteTitle?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

/**
 * Shared Metadata API builder: canonical, hreflang, Open Graph, Twitter.
 * Delegates to centralized createPageMetadata.
 */
export function buildPageMetadata({
  locale,
  path = "/",
  title,
  description,
  imageUrl,
  imageAlt,
  noIndex = false,
  type = "website",
  absoluteTitle = false,
  publishedTime,
  modifiedTime,
  authors,
}: BuildPageMetadataInput): Metadata {
  return createPageMetadata({
    locale,
    path,
    title,
    description,
    isHome: path === "/" || path === "" || (absoluteTitle && path === "/"),
    type,
    imageUrl,
    imageAlt,
    noIndex,
    publishedTime,
    modifiedTime,
    authors,
  });
}

export function isAppLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value);
}

