import { z } from "zod";
import type { AppLocale } from "@/i18n/routing";
import {
  parseContent,
  parseContentList,
  aboutPrincipleSchema,
  aboutBrandNodeSchema,
  aboutTeamMemberSchema,
  aboutCultureItemSchema,
  localizedStringSchema,
  type LocalizedString,
  type AboutPrinciple,
  type AboutBrandNode,
  type AboutTeamMember,
  type AboutCultureItem,
} from "@/lib/content";
import { TODO_REAL_DATA } from "@/content/site";

export type {
  LocalizedString,
  AboutPrinciple,
  AboutBrandNode,
  AboutTeamMember,
  AboutCultureItem,
};

export type ResolvedAboutPrinciple = {
  id: string;
  title: string;
  body: string;
};

export type ResolvedAboutBrandNode = {
  id: "code1sprint" | "kara";
  name: string;
  focus: string;
};

export type ResolvedAboutTeamMember = {
  id: string;
  name: string;
  role: string;
  /** Null when photo is still TODO_REAL_DATA. */
  photo: string | null;
};

export type ResolvedAboutCultureItem = {
  id: string;
  title: string;
  body: string;
  needs_business_confirmation: true;
};

/**
 * About page copy.
 * Optional fields use TODO_REAL_DATA and are omitted from the UI until filled.
 * Items marked needs_business_confirmation are shipping drafts.
 */

const aboutIntroSchema = z.object({
  title: localizedStringSchema,
  lead: localizedStringSchema,
});

export const aboutIntro = parseContent(
  aboutIntroSchema,
  {
    title: {
      fa: "نرم‌افزاری می‌سازیم که با کار واقعی سازمان هم‌خوان باشد",
      en: "We build software that fits how organizations actually work",
    },
    lead: {
      fa: "کارا پرداز اوند سامانه‌های سفارشی، وب، CRM، ERP، RAG و داشبورد داده را با تمرکز بر نتیجهٔ عملیاتی طراحی و تحویل می‌دهد.",
      en: "Kara Pardaz Oond designs and delivers custom systems, web, CRM, ERP, RAG, and data dashboards—focused on operational outcomes.",
    },
  },
  "aboutIntro",
);

const aboutStorySchema = z.object({
  title: localizedStringSchema,
  body: z.union([localizedStringSchema, z.literal("TODO_REAL_DATA")]),
});

/** Story prose — hidden while TODO_REAL_DATA. */
export const aboutStory = parseContent(
  aboutStorySchema,
  {
    title: {
      fa: "داستان",
      en: "Story",
    },
    body: TODO_REAL_DATA,
  },
  "aboutStory",
);

const principlesRaw = [
  {
    id: "clarity",
    title: {
      fa: "شفافیت از روز اول",
      en: "Clarity from day one",
    },
    body: {
      fa: "محدوده، فرضیات و معیار موفقیت را پیش از ساخت می‌نویسیم تا مسیر قابل بررسی بماند.",
      en: "We write scope, assumptions, and success criteria before building so the path stays reviewable.",
    },
  },
  {
    id: "fit",
    title: {
      fa: "هم‌خوانی با فرایند واقعی",
      en: "Fit to real process",
    },
    body: {
      fa: "سیستم را با کار روزمرهٔ تیم شما هم‌راستا می‌کنیم؛ نه با قالب‌های کلی و ادعای همه‌کاره.",
      en: "We align the system with how your team actually works—not one-size-fits-all templates.",
    },
  },
  {
    id: "ownership",
    title: {
      fa: "تحویل قابل نگهداری",
      en: "Maintainable delivery",
    },
    body: {
      fa: "کد، مستندات و دسترسی‌ها طوری تحویل می‌شوند که تیم شما بتواند ادامه دهد.",
      en: "Code, docs, and access are handed over so your team can keep going.",
    },
  },
  {
    id: "evidence",
    title: {
      fa: "ادعا فقط با شواهد",
      en: "Claims only with evidence",
    },
    body: {
      fa: "آمار، نام مشتری و تعهد قراردادی را فقط وقتی منتشر می‌کنیم که تأیید شده باشد.",
      en: "We publish stats, client names, and contractual claims only when confirmed.",
    },
  },
];

export const aboutPrinciples: AboutPrinciple[] = parseContentList(
  aboutPrincipleSchema,
  principlesRaw,
  "aboutPrinciples",
);

const brandNodesRaw = [
  {
    id: "code1sprint" as const,
    name: {
      fa: "Code1Sprint",
      en: "Code1Sprint",
    },
    focus: {
      fa: "برند مادر؛ مسیر محصول و مهندسی در خانوادهٔ برند",
      en: "Parent brand; product and engineering direction across the family",
    },
  },
  {
    id: "kara" as const,
    name: {
      fa: "کارا پرداز اوند",
      en: "Kara Pardaz Oond",
    },
    focus: {
      fa: "تحویل نرم‌افزار سازمانی برای کسب‌وکارهای ایرانی",
      en: "Enterprise software delivery for Iranian businesses",
    },
  },
];

export const aboutBrandNodes: AboutBrandNode[] = parseContentList(
  aboutBrandNodeSchema,
  brandNodesRaw,
  "aboutBrandNodes",
);

/** Empty until real people are confirmed — entire team section hides. */
export const aboutTeam: AboutTeamMember[] = parseContentList(
  aboutTeamMemberSchema,
  [],
  "aboutTeam",
);

const cultureRaw = [
  {
    id: "code-ownership",
    title: {
      fa: "مالکیت کد",
      en: "Code ownership",
    },
    body: {
      fa: "خروجی مهندسی در اختیار شماست؛ بدون قفل فروشنده روی دسترسی و انتقال.",
      en: "Engineering output stays with you—no vendor lock on access or transfer.",
    },
    needs_business_confirmation: true as const,
  },
  {
    id: "documentation",
    title: {
      fa: "مستندسازی عملیاتی",
      en: "Operational documentation",
    },
    body: {
      fa: "مستندات استقرار، نقش‌ها و مسیر عیب‌یابی بخشی از تحویل است؛ نه پیوست اختیاری.",
      en: "Deploy docs, roles, and troubleshooting paths ship with delivery—not as an optional add-on.",
    },
    needs_business_confirmation: true as const,
  },
  {
    id: "staged-delivery",
    title: {
      fa: "تحویل مرحله‌ای",
      en: "Staged delivery",
    },
    body: {
      fa: "قابلیت‌ها در گام‌های قابل بررسی می‌رسند تا ریسک زود دیده شود و اولویت‌ها اصلاح‌پذیر بماند.",
      en: "Capabilities arrive in reviewable stages so risk surfaces early and priorities stay adjustable.",
    },
    needs_business_confirmation: true as const,
  },
];

export const aboutCulture: AboutCultureItem[] = parseContentList(
  aboutCultureItemSchema,
  cultureRaw,
  "aboutCulture",
);

export function getAboutIntro(locale: AppLocale): {
  title: string;
  lead: string;
} {
  return {
    title: aboutIntro.title[locale],
    lead: aboutIntro.lead[locale],
  };
}

export function getAboutStory(
  locale: AppLocale,
): { title: string; body: string } | null {
  if (aboutStory.body === TODO_REAL_DATA) return null;
  return {
    title: aboutStory.title[locale],
    body: aboutStory.body[locale],
  };
}

export function getAboutPrinciples(
  locale: AppLocale,
): ResolvedAboutPrinciple[] {
  return aboutPrinciples.map((item) => ({
    id: item.id,
    title: item.title[locale],
    body: item.body[locale],
  }));
}

export function getAboutBrandNodes(
  locale: AppLocale,
): ResolvedAboutBrandNode[] {
  return aboutBrandNodes.map((node) => ({
    id: node.id,
    name: node.name[locale],
    focus: node.focus[locale],
  }));
}

export function getAboutTeam(locale: AppLocale): ResolvedAboutTeamMember[] {
  return aboutTeam.map((member) => ({
    id: member.id,
    name: member.name[locale],
    role: member.role[locale],
    photo: member.photo === TODO_REAL_DATA ? null : member.photo,
  }));
}

export function getAboutCulture(
  locale: AppLocale,
): ResolvedAboutCultureItem[] {
  return aboutCulture.map((item) => ({
    id: item.id,
    title: item.title[locale],
    body: item.body[locale],
    needs_business_confirmation: true,
  }));
}
