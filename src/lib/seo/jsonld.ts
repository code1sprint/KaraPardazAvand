import { entityConfig, getActiveContact } from "./entity";

export const ORGANIZATION_ID = `${entityConfig.url}/#organization`;
export const WEBSITE_ID = `${entityConfig.url}/#website`;

export interface JsonLdNode {
  "@context"?: string;
  "@type": string;
  "@id"?: string;
  [key: string]: any;
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");
}

export function buildOrganizationJsonLd(locale: string): JsonLdNode {
  const isEn = locale === "en";
  const name = isEn ? entityConfig.canonicalName.en : entityConfig.canonicalName.fa;
  const description = isEn ? entityConfig.definition.en : entityConfig.definition.fa;

  const email = getActiveContact("email");
  const phone = getActiveContact("phone");
  const address = getActiveContact("address");

  const org: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name,
    alternateName: entityConfig.alternateNames,
    url: entityConfig.url,
    logo: {
      "@type": "ImageObject",
      url: entityConfig.logo.wide,
      caption: name,
    },
    description,
    sameAs: entityConfig.sameAs,
    parentOrganization: {
      "@type": "Organization",
      name: entityConfig.parentOrganization.name,
      url: entityConfig.parentOrganization.url,
    },
    areaServed: entityConfig.areaServed,
    knowsAbout: entityConfig.knowsAbout,
  };

  if (email || phone) {
    org.contactPoint = {
      "@type": "ContactPoint",
      contactType: "customer service",
      ...(email && { email }),
      ...(phone && { telephone: phone }),
    };
  }

  if (address) {
    org.address = {
      "@type": "PostalAddress",
      streetAddress: address,
      addressCountry: "IR",
    };
  }

  return org;
}

export function buildWebSiteJsonLd(locale: string): JsonLdNode {
  const isEn = locale === "en";
  const name = isEn ? entityConfig.canonicalName.en : entityConfig.canonicalName.fa;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: entityConfig.url,
    name,
    inLanguage: isEn ? "en-US" : "fa-IR",
    publisher: {
      "@id": ORGANIZATION_ID,
    },
  };
}

export interface WebPageOptions {
  locale: string;
  path: string;
  title: string;
  description: string;
}

export function buildWebPageJsonLd({
  locale,
  path,
  title,
  description,
}: WebPageOptions): JsonLdNode {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${entityConfig.url}/${locale}${cleanPath === "/" ? "" : cleanPath}`;
  const isEn = locale === "en";

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: isEn ? "en-US" : "fa-IR",
    isPartOf: {
      "@id": WEBSITE_ID,
    },
    publisher: {
      "@id": ORGANIZATION_ID,
    },
  };
}

export interface ServiceJsonLdOptions {
  locale: string;
  slug: string;
  name: string;
  description: string;
  url: string;
  serviceType?: string;
}

export function buildServiceJsonLd({
  locale,
  name,
  description,
  url,
  serviceType,
}: ServiceJsonLdOptions): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    serviceType: serviceType || name,
    provider: {
      "@id": ORGANIZATION_ID,
    },
    areaServed: entityConfig.areaServed,
    url,
  };
}

export interface ArticleJsonLdOptions {
  locale: string;
  path: string;
  headline: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  imageUrl?: string;
}

export function buildArticleJsonLd({
  locale,
  path,
  headline,
  description,
  datePublished,
  dateModified,
  authorName,
  imageUrl,
}: ArticleJsonLdOptions): JsonLdNode {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${entityConfig.url}/${locale}${cleanPath}`;
  const isEn = locale === "en";

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline,
    description,
    mainEntityOfPage: url,
    inLanguage: isEn ? "en-US" : "fa-IR",
    publisher: {
      "@id": ORGANIZATION_ID,
    },
    author: {
      "@type": "Organization",
      name: authorName || (isEn ? entityConfig.canonicalName.en : entityConfig.canonicalName.fa),
    },
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(imageUrl && {
      image: {
        "@type": "ImageObject",
        url: imageUrl,
      },
    }),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqJsonLd(items: FaqItem[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
