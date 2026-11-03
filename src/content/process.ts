import type { AppLocale } from "@/i18n/routing";
import {
  parseContentList,
  processStepSchema,
  engagementModelSchema,
  communicationRowSchema,
  type LocalizedString,
  type ProcessStep,
  type EngagementModel,
  type CommunicationRow,
} from "@/lib/content";
import { TODO_REAL_DATA } from "@/content/site";

export type { LocalizedString, ProcessStep, EngagementModel, CommunicationRow };

export type ResolvedProcessStep = {
  id: string;
  number: number;
  title: string;
  purpose: string;
  deliverables: string[];
  clientInvolvement: string;
  /** Null when still TODO_REAL_DATA — do not render. */
  duration: string | null;
};

export type ResolvedEngagementModel = {
  id: string;
  title: string;
  description: string;
  needs_business_confirmation: true;
};

export type ResolvedCommunicationRow = {
  id: string;
  label: string;
  value: string;
  needs_business_confirmation?: true;
};

/** Validated at module load — invalid data fails `next build`. */
const processStepsRaw = [
  {
    id: "discover",
    number: 1,
    title: {
      fa: "تحلیل نیاز",
      en: "Needs analysis",
    },
    purpose: {
      fa: "مسئله، محدودیت‌ها و معیارهای موفقیت را پیش از هر طراحی روشن می‌کنیم.",
      en: "We clarify the problem, constraints, and success criteria before any design work.",
    },
    deliverables: [
      {
        fa: "خلاصهٔ مسئله و اهداف قابل اندازه‌گیری",
        en: "Problem brief and measurable goals",
      },
      {
        fa: "فهرست ذی‌نفعان و نقش‌ها",
        en: "Stakeholder and role map",
      },
      {
        fa: "محدودهٔ اولیه و فرضیات باز",
        en: "Initial scope and open assumptions",
      },
    ],
    clientInvolvement: {
      fa: "دسترسی به تصمیم‌گیر و نمونه‌هایی از فرایند یا دادهٔ فعلی لازم است.",
      en: "Access to a decision-maker and samples of current process or data is required.",
    },
    duration: TODO_REAL_DATA,
  },
  {
    id: "design",
    number: 2,
    title: {
      fa: "طراحی راه‌حل",
      en: "Solution design",
    },
    purpose: {
      fa: "معماری، جریان‌ها و مرزهای سیستم را طوری می‌چینیم که قابل ساخت و نگهداری باشد.",
      en: "We shape architecture, flows, and system boundaries so the solution is buildable and maintainable.",
    },
    deliverables: [
      {
        fa: "نقشهٔ سیستم و جریان‌های اصلی",
        en: "System map and primary flows",
      },
      {
        fa: "پیشنهاد استک و یکپارچه‌سازی‌ها",
        en: "Stack proposal and integrations",
      },
      {
        fa: "برنامهٔ فازبندی تحویل",
        en: "Phased delivery plan",
      },
    ],
    clientInvolvement: {
      fa: "بازبینی و تایید نقشهٔ راه‌حل و اولویت فازها با شما انجام می‌شود.",
      en: "You review and approve the solution map and phase priorities.",
    },
    duration: TODO_REAL_DATA,
  },
  {
    id: "build",
    number: 3,
    title: {
      fa: "توسعه مرحله‌ای",
      en: "Incremental development",
    },
    purpose: {
      fa: "قابلیت‌ها را در تکرارهای کوتاه می‌سازیم تا ریسک زود دیده شود و مسیر قابل اصلاح بماند.",
      en: "We ship capabilities in short iterations so risk surfaces early and the path stays adjustable.",
    },
    deliverables: [
      {
        fa: "نسخه‌های قابل استفاده در محیط آزمایش",
        en: "Usable staging releases",
      },
      {
        fa: "گزارش پیشرفت و تصمیم‌های باز",
        en: "Progress notes and open decisions",
      },
      {
        fa: "آزمون‌های پایه روی مسیرهای حیاتی",
        en: "Baseline tests on critical paths",
      },
    ],
    clientInvolvement: {
      fa: "بازخورد منظم روی هر نسخه و اولویت‌بندی بک‌لاگ با تیم شما هماهنگ می‌شود.",
      en: "Regular feedback on each release and backlog priorities are coordinated with your team.",
    },
    duration: TODO_REAL_DATA,
  },
  {
    id: "handoff",
    number: 4,
    title: {
      fa: "تحویل و آموزش",
      en: "Handoff and training",
    },
    purpose: {
      fa: "سیستم را به‌صورت پایدار به بهره‌برداری می‌رسانیم و تیم شما را برای استفاده و نگهداری آماده می‌کنیم.",
      en: "We bring the system into stable operation and prepare your team to use and maintain it.",
    },
    deliverables: [
      {
        fa: "استقرار تولید و چک‌لیست راه‌اندازی",
        en: "Production deploy and launch checklist",
      },
      {
        fa: "مستندات عملیاتی و دسترسی‌ها",
        en: "Operational docs and access map",
      },
      {
        fa: "جلسهٔ آموزش نقش‌محور",
        en: "Role-based training session",
      },
    ],
    clientInvolvement: {
      fa: "مالکان سیستم و کاربران کلیدی در آموزش و تایید نهایی حضور دارند.",
      en: "System owners and key users join training and final acceptance.",
    },
    duration: TODO_REAL_DATA,
  },
  {
    id: "support",
    number: 5,
    title: {
      fa: "پشتیبانی و بهبود",
      en: "Support and improvement",
    },
    purpose: {
      fa: "پس از راه‌اندازی، پایداری را نگه می‌داریم و بر اساس دادهٔ واقعی مسیر بهبود را ادامه می‌دهیم.",
      en: "After launch we keep the system stable and continue improvement from real usage data.",
    },
    deliverables: [
      {
        fa: "پایش سلامت و پاسخ به رخدادها",
        en: "Health monitoring and incident response",
      },
      {
        fa: "بک‌لاگ بهبود اولویت‌بندی‌شده",
        en: "Prioritized improvement backlog",
      },
    ],
    clientInvolvement: {
      fa: "کانال ارتباط و زمان پاسخ توافق‌شده برای گزارش مشکل و درخواست تغییر لازم است.",
      en: "An agreed channel and response window for issues and change requests is required.",
    },
    duration: TODO_REAL_DATA,
  },
];

export const processSteps: ProcessStep[] = parseContentList(
  processStepSchema,
  processStepsRaw,
  "processSteps",
);

const engagementModelsRaw = [
  {
    id: "fixed-scope",
    title: {
      fa: "پروژه با دامنه‌ی مشخص",
      en: "Fixed-scope project",
    },
    description: {
      fa: "دامنه، خروجی‌ها و زمان‌بندی در ابتدای همکاری توافق می‌شود؛ مناسب وقتی مسئله و مرزها روشن است.",
      en: "Scope, deliverables, and timeline are agreed up front—best when the problem and boundaries are clear.",
    },
    needs_business_confirmation: true as const,
  },
  {
    id: "dedicated-team",
    title: {
      fa: "تیم اختصاصی",
      en: "Dedicated team",
    },
    description: {
      fa: "یک تیم پایدار روی بک‌لاگ شما کار می‌کند؛ ظرفیت و اولویت‌ها به‌صورت دوره‌ای بازبینی می‌شود.",
      en: "A steady team works your backlog; capacity and priorities are reviewed on a recurring cadence.",
    },
    needs_business_confirmation: true as const,
  },
  {
    id: "monthly-support",
    title: {
      fa: "پشتیبانی ماهانه",
      en: "Monthly support",
    },
    description: {
      fa: "پس از تحویل، پایش، رفع اشکال و بهبودهای کوتاه‌مدت در قالب قرارداد ماهانه تعریف می‌شود.",
      en: "After handoff, monitoring, fixes, and short-cycle improvements run under a monthly agreement.",
    },
    needs_business_confirmation: true as const,
  },
];

export const engagementModels: EngagementModel[] = parseContentList(
  engagementModelSchema,
  engagementModelsRaw,
  "engagementModels",
);

const communicationRowsRaw = [
  {
    id: "reporting",
    label: {
      fa: "ریتم گزارش‌دهی",
      en: "Reporting rhythm",
    },
    value: {
      fa: "خلاصهٔ پیشرفت و تصمیم‌های باز در بازه‌های توافق‌شده (معمولاً هفتگی) ارسال می‌شود.",
      en: "Progress summaries and open decisions are shared on an agreed cadence (typically weekly).",
    },
    needs_business_confirmation: true as const,
  },
  {
    id: "demo",
    label: {
      fa: "زمان‌بندی دمو",
      en: "Demo cadence",
    },
    value: {
      fa: "در پایان هر تکرار کوتاه، نسخهٔ قابل مشاهده برای بازخورد شما آماده می‌شود.",
      en: "At the end of each short iteration, a reviewable build is ready for your feedback.",
    },
    needs_business_confirmation: true as const,
  },
  {
    id: "tooling",
    label: {
      fa: "ابزار همکاری",
      en: "Collaboration tooling",
    },
    value: TODO_REAL_DATA,
    needs_business_confirmation: true as const,
  },
];

export const communicationRows: CommunicationRow[] = parseContentList(
  communicationRowSchema,
  communicationRowsRaw,
  "communicationRows",
);

export function getProcessSteps(locale: AppLocale): ResolvedProcessStep[] {
  return processSteps.map((step) => ({
    id: step.id,
    number: step.number,
    title: step.title[locale],
    purpose: step.purpose[locale],
    deliverables: step.deliverables.map((item) => item[locale]),
    clientInvolvement: step.clientInvolvement[locale],
    duration:
      step.duration === TODO_REAL_DATA ? null : step.duration[locale],
  }));
}

export function getEngagementModels(
  locale: AppLocale,
): ResolvedEngagementModel[] {
  return engagementModels.map((model) => ({
    id: model.id,
    title: model.title[locale],
    description: model.description[locale],
    needs_business_confirmation: true,
  }));
}

export function getCommunicationRows(
  locale: AppLocale,
): ResolvedCommunicationRow[] {
  return communicationRows.flatMap((row) => {
    if (row.value === TODO_REAL_DATA) return [];
    return [
      {
        id: row.id,
        label: row.label[locale],
        value: row.value[locale],
        ...(row.needs_business_confirmation
          ? { needs_business_confirmation: true as const }
          : {}),
      },
    ];
  });
}
