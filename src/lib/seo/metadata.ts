import type { Metadata } from "next";
import { entityConfig } from "./entity";

export interface CreatePageMetadataOptions {
  locale: string;
  path?: string;
  title?: string;
  description?: string;
  isHome?: boolean;
  type?: "website" | "article";
  imageUrl?: string;
  imageAlt?: string;
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

export const HOME_METADATA = {
  fa: {
    title: "کارا پرداز اوند | توسعه نرم‌افزار سازمانی، CRM، ERP و RAG",
    description:
      "کارا پرداز اوند: طراحی و توسعه نرم‌افزار سفارشی، CRM و ERP اختصاصی، هوش مصنوعی سازمانی (RAG) و داشبورد داده تحلیلی برای کسب‌وکارها و سازمان‌ها.",
  },
  en: {
    title: "Kara Pardaz Avand | Custom Software, CRM, ERP & RAG",
    description:
      "Kara Pardaz Avand designs and builds custom software, bespoke CRM and ERP systems, enterprise RAG AI and data dashboards for modern businesses and enterprises.",
  },
} as const;

export function formatMetaTitle(rawTitle: string, locale: string): string {
  const brand = locale === "en" ? entityConfig.canonicalName.en : entityConfig.canonicalName.fa;
  if (!rawTitle) return brand;

  // If title already contains brand, check length
  if (rawTitle.includes(brand)) {
    if (rawTitle.length <= 60) return rawTitle;
    return rawTitle.slice(0, 57) + "...";
  }

  const separator = " | ";
  const candidate = `${rawTitle}${separator}${brand}`;
  if (candidate.length <= 60) {
    return candidate;
  }

  // If candidate is too long, fit the rawTitle
  if (rawTitle.length <= 60) {
    return rawTitle;
  }

  return rawTitle.slice(0, 57) + "...";
}

export function clampDescription(desc?: string, fallback = ""): string {
  const text = (desc || fallback).trim().replace(/\s+/g, " ");
  if (!text) return "";

  if (text.length >= 140 && text.length <= 160) {
    return text;
  }

  if (text.length > 160) {
    // Truncate at last space before 157 chars to add ellipsis
    const truncated = text.slice(0, 157);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 130) {
      return truncated.slice(0, lastSpace) + "...";
    }
    return truncated + "...";
  }

  // If text is shorter than 140 characters, pad with informative enterprise copy
  const isPersian = /[\u0600-\u06FF]/.test(text);
  if (isPersian) {
    const pad = "؛ ارائه راه‌حل‌های یکپارچه و نرم‌افزارهای مقیاس‌پذیر سازمانی در کارا پرداز اوند.";
    const combined = `${text.replace(/[.؛]+$/, "")}${pad}`;
    if (combined.length <= 160) return combined;
    return combined.slice(0, 157) + "...";
  } else {
    const pad = " by Kara Pardaz Avand, delivering scalable enterprise software and verified AI systems.";
    const combined = `${text.replace(/[.]+$/, "")}${pad}`;
    if (combined.length <= 160) return combined;
    return combined.slice(0, 157) + "...";
  }
}

export function normalizePath(path = "/"): string {
  if (!path || path === "/") return "";
  let clean = path.startsWith("/") ? path : `/${path}`;
  // Strip trailing slashes
  clean = clean.replace(/\/+$/, "");
  // Strip query string for canonicals
  const queryIndex = clean.indexOf("?");
  if (queryIndex !== -1) {
    clean = clean.slice(0, queryIndex);
  }
  return clean;
}

export function absoluteUrl(locale: string, path = ""): string {
  const clean = normalizePath(path);
  return `${entityConfig.url}/${locale}${clean}`;
}

export function createPageMetadata({
  locale,
  path = "",
  title: rawTitle,
  description: rawDesc,
  isHome = false,
  type = "website",
  imageUrl,
  imageAlt,
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
}: CreatePageMetadataOptions): Metadata {
  const isEn = locale === "en";
  const brandName = isEn ? entityConfig.canonicalName.en : entityConfig.canonicalName.fa;
  const cleanPath = normalizePath(path);

  let finalTitle: string;
  let finalDescription: string;

  if (isHome || cleanPath === "") {
    finalTitle = isEn ? HOME_METADATA.en.title : HOME_METADATA.fa.title;
    finalDescription = isEn ? HOME_METADATA.en.description : HOME_METADATA.fa.description;
  } else {
    finalTitle = formatMetaTitle(rawTitle || brandName, locale);
    finalDescription = clampDescription(
      rawDesc,
      isEn ? entityConfig.definition.en : entityConfig.definition.fa,
    );
  }

  const canonical = absoluteUrl(locale, cleanPath);
  const languages: Record<string, string> = {
    fa: absoluteUrl("fa", cleanPath),
    en: absoluteUrl("en", cleanPath),
    "x-default": absoluteUrl("fa", cleanPath),
  };

  const ogImagePath =
    imageUrl ||
    `/api/og?locale=${encodeURIComponent(locale)}&title=${encodeURIComponent(finalTitle)}`;

  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;
  const bingVerification = process.env.BING_SITE_VERIFICATION;

  const verification: Metadata["verification"] = {};
  if (googleVerification) {
    verification.google = googleVerification;
  }
  if (bingVerification) {
    verification.other = {
      "msvalidate.01": bingVerification,
    };
  }

  return {
    metadataBase: new URL(entityConfig.url),
    title: {
      absolute: finalTitle,
    },
    description: finalDescription,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type,
      locale: isEn ? "en_US" : "fa_IR",
      alternateLocale: isEn ? ["fa_IR"] : ["en_US"],
      url: canonical,
      siteName: brandName,
      title: finalTitle,
      description: finalDescription,
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: imageAlt || finalTitle,
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: authors || [brandName],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [ogImagePath],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    ...(Object.keys(verification).length > 0 ? { verification } : {}),
  };
}
