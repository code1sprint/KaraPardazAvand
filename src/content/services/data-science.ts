import type { Service } from "@/lib/content";

export const dataScienceService = {
  slug: "data-science",
  title: {
    fa: "علم داده و داشبورد",
    en: "Data science and dashboards",
  },
  outcome: {
    fa: "شاخص‌های عملیاتی قابل اتکا برای تصمیم‌گیری روزمره مدیران.",
    en: "Reliable operational metrics for day-to-day management decisions.",
  },
  audience: [
    {
      fa: "مدیرانی که گزارش‌ها دستی، دیرهنگام یا متناقض است.",
      en: "Managers stuck with manual, late, or conflicting reports.",
    },
    {
      fa: "تیم‌های داده که به خط لولهٔ پایدار و تعریف KPI نیاز دارند.",
      en: "Data teams that need a stable pipeline and clear KPI definitions.",
    },
    {
      fa: "سازمان‌هایی که می‌خواهند نقش‌های مختلف نمای متناسب خود را ببینند.",
      en: "Organizations that want role-appropriate views for different audiences.",
    },
  ],
  deliverables: [
    {
      title: {
        fa: "تعریف KPI و منبع داده",
        en: "KPI definition and data sources",
      },
      description: {
        fa: "فرمول شاخص، مالک داده و سطح اعتماد هر منبع.",
        en: "Metric formulas, data owners, and trust level per source.",
      },
    },
    {
      title: {
        fa: "خط لوله آماده‌سازی",
        en: "Preparation pipeline",
      },
      description: {
        fa: "استخراج، پاکسازی و زمان‌بندی به‌روزرسانی.",
        en: "Extract, clean, and schedule refreshes.",
      },
    },
    {
      title: {
        fa: "داشبورد نقش‌محور",
        en: "Role-based dashboards",
      },
      description: {
        fa: "نماهای تعاملی برای عملیات، مالی یا مدیریت.",
        en: "Interactive views for operations, finance, or leadership.",
      },
    },
    {
      title: {
        fa: "هشدار و پایش کیفیت",
        en: "Alerts and quality monitoring",
      },
      description: {
        fa: "اعلان انحراف شاخص و بررسی سلامت داده.",
        en: "Metric-deviation alerts and data-health checks.",
      },
      needs_business_confirmation: true,
    },
    {
      title: {
        fa: "مستند مدل داده",
        en: "Data model documentation",
      },
      description: {
        fa: "واژه‌نامهٔ فیلدها و مسیر ردیابی از منبع تا داشبورد.",
        en: "Field glossary and lineage from source to dashboard.",
      },
    },
  ],
  steps: [
    {
      title: { fa: "کشف شاخص‌ها", en: "Metric discovery" },
      description: {
        fa: "تصمیم‌های کلیدی و KPIهای لازم را با ذی‌نفعان اولویت‌بندی می‌کنیم.",
        en: "We prioritize key decisions and required KPIs with stakeholders.",
      },
    },
    {
      title: { fa: "منابع و کیفیت", en: "Sources and quality" },
      description: {
        fa: "دسترسی به منابع، شکاف‌های داده و قواعد پاکسازی را مشخص می‌کنیم.",
        en: "We map source access, data gaps, and cleaning rules.",
      },
    },
    {
      title: { fa: "خط لوله و داشبورد", en: "Pipeline and dashboard" },
      description: {
        fa: "جریان داده و نماهای نقش‌محور را مرحله‌به‌مرحله تحویل می‌دهیم.",
        en: "We deliver the data flow and role views in stages.",
      },
    },
    {
      title: { fa: "اتکا و انتقال", en: "Reliability and handoff" },
      description: {
        fa: "پایش، مستندات و آموزش تیم برای نگهداری روزمره.",
        en: "Monitoring, documentation, and team training for day-to-day upkeep.",
      },
      needs_business_confirmation: true,
    },
  ],
  stack: [
    {
      label: { fa: "داده", en: "Data" },
      items: ["SQL", "Python", "Scheduled jobs"],
    },
    {
      label: { fa: "نمایش", en: "Presentation" },
      items: ["BI / charts", "TypeScript UI", "Access control"],
    },
  ],
  systemMap: {
    windowTitle: "kara://data-science",
    layout: "etl",
    descriptionLead: {
      fa: "از داده خام تا تصمیم.",
      en: "From raw data to decisions.",
    },
    description: {
      fa: "خط‌لوله خودکار و گزارش‌های همیشه به‌روز.",
      en: "Automated pipelines and always-fresh reports.",
    },
    nodes: {
      inputTop: { fa: "منابع داده", en: "Data sources" },
      inputBottom: { fa: "فایل و API", en: "Files & APIs" },
      core: { fa: "خط‌لوله", en: "Pipeline" },
      outputTop: { fa: "مدل و تحلیل", en: "Models & analysis" },
      outputBottom: { fa: "داشبورد", en: "Dashboard" },
    },
    logs: [
      { fa: "pipeline.started  job=daily", en: "pipeline.started  job=daily" },
      { fa: "records.cleaned  rows=1.2M", en: "records.cleaned  rows=1.2M" },
      { fa: "dashboard.refreshed", en: "dashboard.refreshed" },
    ],
  },
  faqs: [
    {
      id: "data-bi",
      question: {
        fa: "از ابزار BI آماده استفاده می‌کنید یا داشبورد سفارشی؟",
        en: "Do you use off-the-shelf BI or custom dashboards?",
      },
      answer: {
        fa: "هر دو ممکن است؛ انتخاب به مهارت تیم، هزینهٔ مجوز و نیاز یکپارچگی بستگی دارد و در کشف مشخص می‌شود.",
        en: "Both are possible; the choice depends on team skills, license cost, and integration needs, decided in discovery.",
      },
    },
    {
      id: "data-realtime",
      question: {
        fa: "آیا داشبورد بلادرنگ است؟",
        en: "Are dashboards real-time?",
      },
      answer: {
        fa: "پیش‌فرض معمولاً به‌روزرسانی زمان‌بندی‌شده است. بلادرنگ فقط وقتی تأخیر تصمیم واقعاً حیاتی باشد و زیرساخت آن تعریف شود.",
        en: "Default is usually scheduled refresh. Real-time only when decision latency truly matters and infrastructure is scoped.",
      },
    },
    {
      id: "data-ml",
      question: {
        fa: "مدل‌های پیش‌بینی هم در محدوده است؟",
        en: "Are predictive models in scope?",
      },
      answer: {
        fa: "در صورت تعریف در دامنه بله؛ بسیاری از پروژه‌ها ابتدا با KPI و داشبورد قابل اتکا شروع می‌شوند.",
        en: "Yes if defined in scope; many projects start with reliable KPIs and dashboards first.",
      },
      needs_business_confirmation: true,
    },
  ],
  relatedProjects: [],
  bento: {
    order: 2,
    span: 2,
    image: "/brand/bento/data-science.svg",
    shortTitle: {
      fa: "علم داده و داشبورد",
      en: "Data science and dashboards",
    },
  },
} as const satisfies Service;
