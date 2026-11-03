import type { LocalizedString } from "@/content/services";

export type WhyStatement = {
  id: "staged-delivery" | "code-ownership" | "post-launch-support";
  title: LocalizedString;
  body: LocalizedString;
  /** Draft copy — confirm with the business before treating as final claims. */
  needs_business_confirmation: true;
};

/**
 * Quiet “why us” statements for the home page.
 * Each item is marked for business confirmation before launch claims harden.
 */
export const whyStatements: readonly WhyStatement[] = [
  {
    id: "staged-delivery",
    title: {
      fa: "تحویل مرحله‌ای",
      en: "Staged delivery",
    },
    body: {
      fa: "کار را در گام‌های قابل بررسی پیش می‌بریم تا اولویت‌ها زود دیده شوند.",
      en: "We move in reviewable stages so priorities surface early.",
    },
    needs_business_confirmation: true,
  },
  {
    id: "code-ownership",
    title: {
      fa: "مالکیت کامل کد",
      en: "Full code ownership",
    },
    body: {
      fa: "کد، مستندات و دسترسی‌ها در اختیار شماست؛ بدون قفل فروشنده.",
      en: "Code, docs, and access stay with you—no vendor lock-in.",
    },
    needs_business_confirmation: true,
  },
  {
    id: "post-launch-support",
    title: {
      fa: "پشتیبانی پس از انتشار",
      en: "Post-launch support",
    },
    body: {
      fa: "بعد از انتشار برای پایداری، رفع اشکال و بهبودهای کوتاه‌مدت کنار شما می‌مانیم.",
      en: "After launch we stay for stability, fixes, and short-cycle improvements.",
    },
    needs_business_confirmation: true,
  },
];
