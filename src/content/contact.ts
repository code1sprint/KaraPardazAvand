/**
 * Contact form options + side-panel details.
 * Channels / booking / hours marked TODO_REAL_DATA are omitted from the UI.
 */

import type { LocalizedString } from "@/lib/content";
import { TODO_REAL_DATA } from "@/content/site";

export type ContactServiceOption = {
  id: string;
  /** Message key under Contact.services.* */
  messageKey: string;
};

export const contactServiceOptions: ContactServiceOption[] = [
  { id: "custom-software", messageKey: "customSoftware" },
  { id: "web-platforms", messageKey: "webPlatforms" },
  { id: "crm", messageKey: "crm" },
  { id: "erp", messageKey: "erp" },
  { id: "rag-ai", messageKey: "ragAi" },
  { id: "data-science", messageKey: "dataScience" },
  { id: "other", messageKey: "other" },
];

export const CONTACT_SERVICE_IDS = contactServiceOptions.map((o) => o.id);

export type ContactStageOption = {
  id: string;
  /** Message key under Contact.stages.* */
  messageKey: string;
};

export const contactStageOptions: ContactStageOption[] = [
  { id: "discovery", messageKey: "discovery" },
  { id: "ready", messageKey: "ready" },
  { id: "existing", messageKey: "existing" },
  { id: "support", messageKey: "support" },
  { id: "other", messageKey: "other" },
];

export const CONTACT_STAGE_IDS = contactStageOptions.map((o) => o.id);

/** Expected response time — shown as draft until Biz confirms. */
export const contactResponseTime = {
  text: {
    fa: "معمولاً در یک تا دو روز کاری پاسخ می‌دهیم.",
    en: "We typically reply within one to two business days.",
  } satisfies LocalizedString,
  needs_business_confirmation: true as const,
};

/** Working hours — hidden while TODO_REAL_DATA. */
export const contactWorkingHours = {
  value: TODO_REAL_DATA,
} as const;

/** Optional booking calendar — hidden while TODO_REAL_DATA. */
export const contactBooking = {
  href: TODO_REAL_DATA,
  label: {
    fa: "رزرو جلسه کوتاه",
    en: "Book a short call",
  } satisfies LocalizedString,
} as const;

export function isResolvedWorkingHours(): boolean {
  return contactWorkingHours.value !== TODO_REAL_DATA;
}

export function isResolvedBooking(): boolean {
  return contactBooking.href !== TODO_REAL_DATA;
}
