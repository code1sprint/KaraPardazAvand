import type { AppLocale } from "@/i18n/routing";
import type { SystemMapLayout } from "@/lib/content";

export type LocalizedString = Record<AppLocale, string>;

/** Fixed SVG node roles — geometry lives in SystemMapDiagram. */
export type SystemNodeRole =
  | "inputTop"
  | "inputBottom"
  | "core"
  | "outputTop"
  | "outputBottom";

export type SystemDefinition = {
  id: "crm" | "erp" | "rag-ai" | "data" | "website";
  /** Short tab label. */
  tabLabel: LocalizedString;
  /** SVG topology preset for SystemMapDiagram. */
  layout: SystemMapLayout;
  /** Bold lead phrase in the description. */
  descriptionLead: LocalizedString;
  /** Rest of the one-sentence description. */
  description: LocalizedString;
  /** Labels for the five fixed nodes (preview order). */
  nodes: Record<SystemNodeRole, LocalizedString>;
  /** Three console lines (rendered LTR). */
  logs: readonly [LocalizedString, LocalizedString, LocalizedString];
};

/**
 * Hero system-map tabs — values reused from
 * `کارا پرداز اوند — پیشنمایش نسخه ۳.html`.
 */
export const systems: readonly SystemDefinition[] = [
  {
    id: "crm",
    tabLabel: { fa: "CRM", en: "CRM" },
    layout: "funnel",
    descriptionLead: {
      fa: "مدیریت ارتباط با مشتری.",
      en: "Customer relationship management.",
    },
    description: {
      fa: "همه کانال‌ها در یک‌جا و هر سرنخ در مسیر درست.",
      en: "All channels in one place, every lead on the right path.",
    },
    nodes: {
      inputTop: { fa: "سایت و شبکه‌ها", en: "Site & networks" },
      inputBottom: { fa: "تماس و پیام‌رسان", en: "Calls & messengers" },
      core: { fa: "CRM", en: "CRM" },
      outputTop: { fa: "پیگیری و فروش", en: "Follow-up & sales" },
      outputBottom: { fa: "گزارش مدیریتی", en: "Management reports" },
    },
    logs: [
      { fa: "lead.created  source=website", en: "lead.created  source=website" },
      {
        fa: "lead.assigned  owner=sales/2",
        en: "lead.assigned  owner=sales/2",
      },
      { fa: "followup.scheduled  +24h", en: "followup.scheduled  +24h" },
    ],
  },
  {
    id: "erp",
    tabLabel: { fa: "ERP", en: "ERP" },
    layout: "modules",
    descriptionLead: {
      fa: "یکپارچگی فرایندها.",
      en: "Process integration.",
    },
    description: {
      fa: "انبار، خرید و مالی روی یک داده مشترک.",
      en: "Warehouse, purchasing, and finance on one shared dataset.",
    },
    nodes: {
      inputTop: { fa: "انبار و خرید", en: "Warehouse & purchasing" },
      inputBottom: { fa: "مالی و حسابداری", en: "Finance & accounting" },
      core: { fa: "ERP", en: "ERP" },
      outputTop: { fa: "گردش کار تأیید", en: "Approval workflow" },
      outputBottom: { fa: "داشبورد سازمانی", en: "Org dashboard" },
    },
    logs: [
      { fa: "stock.updated  sku=A-1042", en: "stock.updated  sku=A-1042" },
      { fa: "invoice.matched  po=3381", en: "invoice.matched  po=3381" },
      { fa: "approval.requested", en: "approval.requested" },
    ],
  },
  {
    id: "rag-ai",
    tabLabel: { fa: "RAG و AI", en: "RAG & AI" },
    layout: "pipeline",
    descriptionLead: {
      fa: "دستیار هوشمند روی دانش سازمان.",
      en: "A smart assistant on your organization knowledge.",
    },
    description: {
      fa: "پاسخ‌ها با ذکر منبع.",
      en: "Answers with citations.",
    },
    nodes: {
      inputTop: { fa: "اسناد و دانش", en: "Docs & knowledge" },
      inputBottom: { fa: "پرسش کاربر", en: "User query" },
      core: { fa: "RAG", en: "RAG" },
      outputTop: { fa: "پاسخ با منبع", en: "Answer with source" },
      outputBottom: { fa: "کیفیت پاسخ‌ها", en: "Answer quality" },
    },
    logs: [
      { fa: "docs.indexed  chunks=2,480", en: "docs.indexed  chunks=2,480" },
      { fa: "query.received  lang=fa", en: "query.received  lang=fa" },
      { fa: "answer.sent  sources=3", en: "answer.sent  sources=3" },
    ],
  },
  {
    id: "data",
    tabLabel: { fa: "داده", en: "Data" },
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
  {
    id: "website",
    tabLabel: { fa: "وب‌سایت", en: "Website" },
    layout: "stack",
    descriptionLead: {
      fa: "پلتفرم وب سریع و قابل مدیریت.",
      en: "A fast, manageable web platform.",
    },
    description: {
      fa: "سئو و پرداخت از ابتدا در معماری.",
      en: "SEO and payments built into the architecture from day one.",
    },
    nodes: {
      inputTop: { fa: "محتوا و سئو", en: "Content & SEO" },
      inputBottom: { fa: "پرداخت و سرویس‌ها", en: "Payments & services" },
      core: { fa: "پلتفرم وب", en: "Web platform" },
      outputTop: { fa: "وب‌سایت سریع", en: "Fast website" },
      outputBottom: { fa: "پنل مدیریت", en: "Admin panel" },
    },
    logs: [
      { fa: "build.passed  lcp=1.4s", en: "build.passed  lcp=1.4s" },
      { fa: "deploy.live", en: "deploy.live" },
      { fa: "admin.published", en: "admin.published" },
    ],
  },
] as const;

/** Tech names for the hero marquee (text only, preview order). */
export const heroTech = [
  "Next.js",
  "TypeScript",
  "Python",
  "PostgreSQL",
  "Docker",
  "Redis",
  "Tailwind",
  "Node.js",
  "Vector DB",
  "Linux",
] as const;

export function getSystemById(
  id: SystemDefinition["id"],
): SystemDefinition | undefined {
  return systems.find((system) => system.id === id);
}

export function pickLocalized(
  value: LocalizedString,
  locale: AppLocale,
): string {
  return value[locale] ?? value.fa;
}
