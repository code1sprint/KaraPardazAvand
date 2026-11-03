import type { AppLocale } from "@/i18n/routing";
import {
  parseContentList,
  serviceSchema,
  type LocalizedString,
  type Service,
} from "@/lib/content";
import { crmService } from "./crm";
import { customSoftwareService } from "./custom-software";
import { dataScienceService } from "./data-science";
import { erpService } from "./erp";
import { ragAiService } from "./rag-ai";
import { webPlatformsService } from "./web-platforms";

export type { LocalizedString, Service };
export type {
  ServiceBento,
  ServiceDeliverable,
  ServiceFaq,
  ServiceStackGroup,
  ServiceStep,
  ServiceSystemMap,
} from "@/lib/content";

/**
 * Service catalog — add a file under this folder and register it here.
 * Nav dropdown, bento tiles, sitemap and `/services/[slug]` all read from this list.
 */
const servicesRaw = [
  crmService,
  ragAiService,
  dataScienceService,
  erpService,
  webPlatformsService,
  customSoftwareService,
];

export const services: readonly Service[] = parseContentList(
  serviceSchema,
  [...servicesRaw],
  "services",
);

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getServiceSlugs(): string[] {
  return services.map((service) => service.slug);
}

/** Bento layout derived from each service's `bento` field (sorted by order). */
export function getHomeBentoTiles() {
  return [...services]
    .sort((a, b) => a.bento.order - b.bento.order)
    .map((service) => ({
      slug: service.slug,
      span: service.bento.span,
      image: service.bento.image,
      dark: service.bento.dark,
      title: service.bento.shortTitle,
    }));
}

export function pickLocalized(
  value: LocalizedString,
  locale: AppLocale,
): string {
  return value[locale] ?? value.fa;
}
