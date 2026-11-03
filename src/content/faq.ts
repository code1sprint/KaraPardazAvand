/**
 * FAQ content for home preview + /faq index + FAQPage JSON-LD.
 * All answers are shipping drafts — needs_business_confirmation until Biz confirms.
 * Validated at module load — invalid data fails `next build`.
 */

import {
  faqSchema,
  faqTopicSchema,
  parseContentList,
  type Faq,
  type FaqTopic,
  type FaqTopicId,
} from "@/lib/content";
import type { AppLocale } from "@/i18n/routing";
import { pickLocalized } from "@/content/services";

export type FaqItem = Faq;

const faqTopicsRaw = [
  {
    id: "project-schedule" as const,
    title: {
      fa: "پروژه و زمان‌بندی",
      en: "Project and schedule",
    },
  },
  {
    id: "cost-contract" as const,
    title: {
      fa: "هزینه و قرارداد",
      en: "Cost and contract",
    },
  },
  {
    id: "tech-security" as const,
    title: {
      fa: "فنی و امنیت",
      en: "Technical and security",
    },
  },
  {
    id: "support" as const,
    title: {
      fa: "پشتیبانی",
      en: "Support",
    },
  },
];

export const faqTopics: FaqTopic[] = parseContentList(
  faqTopicSchema,
  faqTopicsRaw,
  "faqTopics",
);

const faqItemsRaw = [
  {
    id: "duration",
    topicId: "project-schedule" as const,
    question: {
      fa: "مدت‌زمان معمول یک پروژه چقدر است؟",
      en: "How long does a typical project take?",
    },
    answer: {
      fa: "بسته به دامنه کار، معمولاً از چند هفته برای وب‌سایت تا چند ماه برای سامانه‌های سازمانی متغیر است. بازه دقیق پس از تحلیل نیاز اعلام می‌شود.",
      en: "Depending on scope, timelines usually range from a few weeks for a website to several months for enterprise systems. An exact range is shared after discovery.",
    },
    needs_business_confirmation: true as const,
  },
  {
    id: "process",
    topicId: "project-schedule" as const,
    question: {
      fa: "فرایند همکاری شما چگونه پیش می‌رود؟",
      en: "How does collaboration with you progress?",
    },
    answer: {
      fa: "از تحلیل نیاز تا طراحی، توسعه مرحله‌ای، تحویل و آموزش، سپس پشتیبانی. شرح کامل در بخش فرایند آمده است.",
      en: "From discovery through design, staged delivery, handover and training, then support. The full path is on the Process page.",
    },
    needs_business_confirmation: true as const,
  },
  {
    id: "kickoff",
    topicId: "project-schedule" as const,
    question: {
      fa: "برای شروع به چه اطلاعاتی از ما نیاز دارید؟",
      en: "What do you need from us to start?",
    },
    answer: {
      fa: "اهداف کسب‌وکار، کاربران اصلی، محدودیت‌های زمانی و نمونه‌هایی از فرایند فعلی کافی است تا محدودهٔ اولیه شکل بگیرد. فهرست دقیق پس از تأیید کسب‌وکار تکمیل می‌شود.",
      en: "Business goals, primary users, timing constraints, and examples of the current process are enough to shape an initial scope. A precise intake list will be confirmed by the business.",
    },
    needs_business_confirmation: true as const,
  },
  {
    id: "pricing",
    topicId: "cost-contract" as const,
    question: {
      fa: "هزینه پروژه چگونه محاسبه می‌شود؟",
      en: "How is project cost calculated?",
    },
    answer: {
      fa: "پس از روشن شدن دامنه، برآورد بر اساس پیچیدگی، یکپارچه‌سازی‌ها و سطح پشتیبانی پیشنهاد می‌شود. اعداد و مدل قیمت‌گذاری پس از تأیید کسب‌وکار منتشر می‌شود.",
      en: "After scope is clear, an estimate reflects complexity, integrations, and support level. Figures and pricing models ship only after business confirmation.",
    },
    needs_business_confirmation: true as const,
  },
  {
    id: "contract",
    topicId: "cost-contract" as const,
    question: {
      fa: "قرارداد و مالکیت خروجی چگونه است؟",
      en: "How do contracts and output ownership work?",
    },
    answer: {
      fa: "محدوده، تحویل‌ها و شرایط مالکیت در قرارداد مکتوب می‌شود. جزئیات حقوقی استاندارد پس از تأیید کسب‌وکار در دسترس قرار می‌گیرد.",
      en: "Scope, deliverables, and ownership terms are written into the contract. Standard legal wording will be published after business confirmation.",
    },
    needs_business_confirmation: true as const,
  },
  {
    id: "payment",
    topicId: "cost-contract" as const,
    question: {
      fa: "نحوهٔ پرداخت و مراحل صورت‌حساب چگونه است؟",
      en: "How do payments and invoicing stages work?",
    },
    answer: {
      fa: "معمولاً پرداخت‌ها به مراحل تحویل گره می‌خورند. زمان‌بندی دقیق و شرایط پس از تأیید کسب‌وکار اعلام می‌شود.",
      en: "Payments are usually tied to delivery milestones. Exact timing and terms will be confirmed by the business.",
    },
    needs_business_confirmation: true as const,
  },
  {
    id: "modernize",
    topicId: "tech-security" as const,
    question: {
      fa: "آیا سامانه‌های موجود را هم نوسازی می‌کنید؟",
      en: "Do you modernize existing systems as well?",
    },
    answer: {
      fa: "بله؛ ارزیابی وضعیت فعلی، اولویت‌بندی ریسک‌ها و مهاجرت مرحله‌ای بخشی از مسیر همکاری است. جزئیات رویکرد پس از تأیید کسب‌وکار منتشر می‌شود.",
      en: "Yes—assessing the current state, prioritizing risks, and staged migration are part of the path. Approach details will be published after business confirmation.",
    },
    needs_business_confirmation: true as const,
  },
  {
    id: "ai",
    topicId: "tech-security" as const,
    question: {
      fa: "قابلیت‌های هوش مصنوعی و RAG شما چیست؟",
      en: "What are your AI and RAG capabilities?",
    },
    answer: {
      fa: "طراحی سامانه‌های RAG و هوش مصنوعی سازمانی روی داده‌های داخلی، با تمرکز بر دقت، کنترل دسترسی و یکپارچگی با فرایندهای موجود. دامنه خدمات تأییدشده به‌زودی تکمیل می‌شود.",
      en: "We design RAG and enterprise AI systems on internal data, with focus on accuracy, access control, and process fit. Confirmed service scope will be completed soon.",
    },
    needs_business_confirmation: true as const,
  },
  {
    id: "security",
    topicId: "tech-security" as const,
    question: {
      fa: "امنیت داده و دسترسی‌ها چگونه رعایت می‌شود؟",
      en: "How do you handle data security and access?",
    },
    answer: {
      fa: "حداقل دسترسی لازم، جداسازی محیط‌ها و هماهنگی با سیاست‌های امنیتی شما پایهٔ کار است. کنترل‌های دقیق و گواهی‌ها پس از تأیید کسب‌وکار فهرست می‌شوند.",
      en: "Least privilege, environment separation, and alignment with your security policy are the baseline. Exact controls and certifications will be listed after business confirmation.",
    },
    needs_business_confirmation: true as const,
  },
  {
    id: "industries",
    topicId: "tech-security" as const,
    question: {
      fa: "در چه صنایع یا حوزه‌هایی کار می‌کنید؟",
      en: "Which industries or domains do you work in?",
    },
    answer: {
      fa: "تمرکز ما روی کسب‌وکارها و سازمان‌هایی است که به نرم‌افزار سفارشی، یکپارچه‌سازی و داده نیاز دارند. فهرست صنایع تأییدشده به‌زودی تکمیل می‌شود.",
      en: "We focus on businesses and organizations that need custom software, integration, and data. A confirmed industry list will be completed soon.",
    },
    needs_business_confirmation: true as const,
  },
  {
    id: "support",
    topicId: "support" as const,
    question: {
      fa: "پشتیبانی پس از تحویل چگونه است؟",
      en: "What does post-delivery support look like?",
    },
    answer: {
      fa: "پس از تحویل، پشتیبانی و بهبود مستمر قابل تعریف است. سطح و شرایط دقیق قرارداد پس از تأیید کسب‌وکار مشخص می‌شود.",
      en: "After delivery, support and ongoing improvement can be defined. Exact levels and contract terms will be confirmed by the business.",
    },
    needs_business_confirmation: true as const,
  },
  {
    id: "sla",
    topicId: "support" as const,
    question: {
      fa: "زمان پاسخ‌گویی پشتیبانی چقدر است؟",
      en: "What is the support response time?",
    },
    answer: {
      fa: "بازهٔ پاسخ بسته به سطح قرارداد متفاوت است. اعداد قطعی پس از تأیید کسب‌وکار اعلام می‌شود.",
      en: "Response windows vary by support tier. Confirmed figures will be published after business confirmation.",
    },
    needs_business_confirmation: true as const,
  },
  {
    id: "handover",
    topicId: "support" as const,
    question: {
      fa: "آموزش و انتقال دانش چگونه انجام می‌شود؟",
      en: "How do training and knowledge transfer work?",
    },
    answer: {
      fa: "مستندات عملیاتی و جلسات آموزش برای تیم شما بخشی از تحویل است. قالب و مدت دقیق پس از تأیید کسب‌وکار مشخص می‌شود.",
      en: "Operational docs and training sessions for your team are part of handover. Exact format and duration will be confirmed by the business.",
    },
    needs_business_confirmation: true as const,
  },
];

export const faqItems: FaqItem[] = parseContentList(
  faqSchema,
  faqItemsRaw,
  "faq",
);

export type ResolvedFaqItem = {
  id: string;
  topicId: FaqTopicId;
  question: string;
  answer: string;
  needs_business_confirmation: true;
};

export type ResolvedFaqTopic = {
  id: FaqTopicId;
  title: string;
  items: ResolvedFaqItem[];
};

export function resolveFaqItems(locale: AppLocale): ResolvedFaqItem[] {
  return faqItems.map((item) => ({
    id: item.id,
    topicId: item.topicId,
    question: pickLocalized(item.question, locale),
    answer: pickLocalized(item.answer, locale),
    needs_business_confirmation: true as const,
  }));
}

export function resolveFaqTopics(locale: AppLocale): ResolvedFaqTopic[] {
  const items = resolveFaqItems(locale);
  return faqTopics.map((topic) => ({
    id: topic.id,
    title: pickLocalized(topic.title, locale),
    items: items.filter((item) => item.topicId === topic.id),
  }));
}

export function getFaqByIds(
  ids: readonly string[],
  locale: AppLocale,
): ResolvedFaqItem[] {
  const set = new Set(ids);
  return resolveFaqItems(locale).filter((item) => set.has(item.id));
}
