"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { TiptapEditor } from "@/components/admin/editor/TiptapEditor";
import { cn } from "@/lib/cn";
import type { IService } from "@/lib/db/models/Service";

type ServiceFormData = {
  slug: string;
  title: { fa: string; en: string };
  outcome: { fa: string; en: string };
  audience: Array<{ fa: string; en: string }>;
  deliverables: Array<{
    title: { fa: string; en: string };
    description: { fa: string; en: string };
  }>;
  steps: Array<{
    title: { fa: string; en: string };
    description: { fa: string; en: string };
  }>;
  stack: Array<{
    label: { fa: string; en: string };
    items: string[];
  }>;
  systemMap: {
    windowTitle: string;
    layout: "hub" | "funnel" | "modules" | "pipeline" | "etl" | "stack";
    descriptionLead: { fa: string; en: string };
    description: { fa: string; en: string };
    nodes: {
      inputTop: { fa: string; en: string };
      inputBottom: { fa: string; en: string };
      core: { fa: string; en: string };
      outputTop: { fa: string; en: string };
      outputBottom: { fa: string; en: string };
    };
    logs: [
      { fa: string; en: string },
      { fa: string; en: string },
      { fa: string; en: string },
    ];
  };
  faqs: Array<{
    id: string;
    question: { fa: string; en: string };
    answer: { fa: string; en: string };
  }>;
  relatedProjects: string[];
  bento: {
    order: number;
    span: 2 | 4 | 6;
    image: string;
    shortTitle: { fa: string; en: string };
  };
  deepDiveJson?: Record<string, unknown>;
  deepDiveHtml?: string;
  status: "published" | "draft";
};

interface ServiceFormProps {
  initialData?: Partial<IService> & { _id?: string };
  isNew?: boolean;
}

const DEFAULT_STEPS: ServiceFormData["steps"] = [
  {
    title: { fa: "تحلیل و معماری اولیه", en: "Discovery & Architecture" },
    description: {
      fa: "بررسی جریان داده‌های موجود، شناخت ذی‌نفعان و تعیین شاخص‌های موفقیت سیستم.",
      en: "Analyzing current data pipelines, identifying stakeholders, and setting success metrics.",
    },
  },
  {
    title: { fa: "توسعه چابک و اعتبارسنجی", en: "Agile Development & Validation" },
    description: {
      fa: "پیاده‌سازی ماژول‌ها در اسپرینت‌های دوهفته‌ای همراه با تست خودکار و بررسی مستمر.",
      en: "Iterative module development in 2-week sprints with automated test coverage.",
    },
  },
  {
    title: { fa: "استقرار و مهاجرت داده", en: "Deployment & Data Migration" },
    description: {
      fa: "مهاجرت امن داده‌های قدیمی، راه‌اندازی پایپ‌لاین‌های پشتیبان و پایش عملکرد.",
      en: "Safe historical data migration, automated backups setup, and real-time observability.",
    },
  },
  {
    title: { fa: "پشتیبانی و بهبود مستمر", en: "SLA Support & Continuous Evolution" },
    description: {
      fa: "پشتیبانی عملیاتی با تعهد سطح خدمت (SLA) و پاسخ‌گویی سریع به گلوگاه‌ها.",
      en: "Operational SLA support, bottleneck mitigation, and continuous performance tuning.",
    },
  },
];

const DEFAULT_SYSTEM_MAP: ServiceFormData["systemMap"] = {
  windowTitle: "karapardaz-system-core",
  layout: "hub",
  descriptionLead: {
    fa: "معماری یکپارچه و مقیاس‌پذیر",
    en: "Scalable Integrated Architecture",
  },
  description: {
    fa: "ارتباط بلادرنگ سرویس‌ها با استفاده از واسط‌های امن و پایگاه داده مجزا.",
    en: "Real-time communication across microservices with dedicated databases and secure queues.",
  },
  nodes: {
    inputTop: { fa: "وب‌هوک و ورودی لید", en: "Webhooks & Inbound Leads" },
    inputBottom: { fa: "سامانه‌های مالی و ERP", en: "Legacy ERP & Accounting" },
    core: { fa: "موتور پردازش داده و صف", en: "Core Processing Engine & Queues" },
    outputTop: { fa: "داشبورد تحلیلی و گزارش", en: "Analytics Dashboard" },
    outputBottom: { fa: "اعلان‌ها و پیام‌رسان", en: "Notifications & Messaging" },
  },
  logs: [
    { fa: "دریافت رویداد و اعتبارسنجی توکن", en: "Incoming payload validated" },
    { fa: "پردازش صف پیام و ذخیره در دیتابیس", en: "Queue dispatched to primary DB" },
    { fa: "به‌روزرسانی داده‌های تحلیلی زنده", en: "Live metric aggregation complete" },
  ],
};

export function ServiceForm({ initialData, isNew = false }: ServiceFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "basics" | "deliverables" | "architecture" | "faqs" | "deepdive"
  >("basics");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<ServiceFormData>({
    slug: initialData?.slug || "",
    title: {
      fa: initialData?.title?.fa || "",
      en: initialData?.title?.en || "",
    },
    outcome: {
      fa: initialData?.outcome?.fa || "",
      en: initialData?.outcome?.en || "",
    },
    audience: initialData?.audience || [
      { fa: "مدیران ارشد عملیات و CTOها", en: "COOs and CTOs" },
      { fa: "تیم‌های توسعه در حال رشد", en: "Growing software engineering teams" },
    ],
    deliverables: initialData?.deliverables || [
      {
        title: { fa: "داشبورد متمرکز مدیریتی", en: "Central Management Dashboard" },
        description: {
          fa: "پایش بلادرنگ شاخص‌های کلیدی عملکرد با دسترسی بر پایه نقش.",
          en: "Real-time KPI monitoring with role-based access controls.",
        },
      },
      {
        title: { fa: "یکپارچه‌سازی پایپ‌لاین داده", en: "Unified Data Pipeline" },
        description: {
          fa: "حذف دوباره‌کاری‌ها و همگام‌سازی خودکار میان دیتابیس‌ها.",
          en: "Automated synchronization across internal and external data stores.",
        },
      },
    ],
    steps: initialData?.steps?.length === 4 ? initialData.steps : DEFAULT_STEPS,
    stack: initialData?.stack || [
      {
        label: { fa: "پایگاه داده و صف", en: "Database & Queues" },
        items: ["PostgreSQL", "Redis", "RabbitMQ"],
      },
      {
        label: { fa: "هسته و فریم‌ورک", en: "Core & Framework" },
        items: ["Next.js", "Node.js", "Docker"],
      },
    ],
    systemMap: initialData?.systemMap
      ? {
          ...DEFAULT_SYSTEM_MAP,
          ...initialData.systemMap,
          windowTitle: initialData.systemMap.windowTitle || DEFAULT_SYSTEM_MAP.windowTitle,
          layout: initialData.systemMap.layout || DEFAULT_SYSTEM_MAP.layout,
        }
      : DEFAULT_SYSTEM_MAP,
    faqs: initialData?.faqs || [
      {
        id: "faq-1",
        question: {
          fa: "مدت زمان پیاده‌سازی این خدمت چقدر است؟",
          en: "What is the typical delivery timeline?",
        },
        answer: {
          fa: "بسته به مقیاس سازمان و ابعاد سیستم، فاز پایلوت معمولاً بین ۲ الی ۴ هفته تحویل داده می‌شود.",
          en: "Depending on system scope, the initial pilot is typically delivered within 2-4 weeks.",
        },
      },
    ],
    relatedProjects: initialData?.relatedProjects || ["ops-crm-pilot"],
    bento: {
      order: initialData?.bento?.order ?? 1,
      span: (initialData?.bento?.span as 2 | 4 | 6) ?? 4,
      image: initialData?.bento?.image || "/brand/bento/crm.svg",
      shortTitle: {
        fa: initialData?.bento?.shortTitle?.fa || "",
        en: initialData?.bento?.shortTitle?.en || "",
      },
    },
    deepDiveJson: (initialData?.deepDiveJson as Record<string, unknown>) || {
      type: "doc",
      content: [],
    },
    deepDiveHtml: initialData?.deepDiveHtml || "",
    status: initialData?.status || "published",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const url = isNew
        ? "/api/admin/services"
        : `/api/admin/services/${initialData?._id || formData.slug}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "خطا در ذخیره اطلاعات خدمت");
      }

      setSuccessMsg(
        isNew ? "خدمت جدید با موفقیت ایجاد شد." : "تغییرات خدمت با موفقیت ذخیره شد.",
      );

      if (isNew && data.service?._id) {
        setTimeout(() => {
          router.push(`/admin/services/${data.service._id}/edit`);
        }, 1000);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "خطای ناشناخته رخ داد.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/services"
              className="text-xs text-muted hover:text-blue transition-colors font-medium"
            >
              ← بازگشت به لیست خدمات
            </Link>
            <span className="text-muted">/</span>
            <span className="text-xs font-bold text-text">
              {isNew ? "تعریف خدمت جدید" : formData.title.fa || "ویرایش خدمت"}
            </span>
          </div>
          <h1 className="text-xl font-black text-text sm:text-2xl mt-1">
            {isNew ? "افزودن خدمت جدید به کاتالوگ" : `ویرایش: ${formData.title.fa}`}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isNew && (
            <Link
              href={`/services/${formData.slug}`}
              target="_blank"
              className="rounded-xl border border-line bg-panel px-4 py-2.5 text-xs font-bold text-text hover:border-blue transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>مشاهده زنده در سایت</span>
              <span className="text-muted">↗</span>
            </Link>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-blue text-white px-6 py-2.5 text-xs font-bold shadow hover:bg-navy-2 transition-all disabled:opacity-50 inline-flex items-center gap-2"
          >
            {submitting && (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            <span>{isNew ? "ایجاد و انتشار خدمت" : "ذخیره تمام تغییرات"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-600">
          ⚠️ {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="rounded-2xl border border-ok/30 bg-ok/10 p-4 text-xs font-semibold text-ok">
          ✓ {successMsg}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-2">
        {[
          { id: "basics", label: "۱. اطلاعات پایه و هیرو", icon: "🏢" },
          { id: "deliverables", label: "۲. خروجی‌ها و مراحل تحویل", icon: "📦" },
          { id: "architecture", label: "۳. استک فنی و نقشه سیستم", icon: "🗺️" },
          { id: "faqs", label: "۴. سوالات متداول و پروژه‌ها", icon: "❓" },
          {
            id: "deepdive",
            label: "۵. جزییات عمیق معماری (Tiptap Rich-Text)",
            icon: "✍️",
            badge: "ادیتور آزاد",
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border",
              activeTab === tab.id
                ? "bg-blue/15 border-blue text-blue shadow-sm"
                : "bg-panel border-line text-muted hover:text-text hover:border-blue/40",
            )}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="bg-orange/15 text-orange px-1.5 py-0.5 rounded text-[10px] font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Basics & Hero */}
      {activeTab === "basics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-panel p-6 rounded-3xl border border-line shadow-sm">
          {/* Slug */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-text mb-1.5">
              اسلاگ یکتا (URL Slug) *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted" dir="ltr">
                /services/
              </span>
              <input
                type="text"
                dir="ltr"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                  }))
                }
                placeholder="crm"
                className="flex-1 rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs font-mono text-text focus:border-blue focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-muted mt-1">
              تنها از حروف کوچک انگلیسی، ارقام و خط تیره (-) استفاده کنید.
            </p>
          </div>

          {/* Titles */}
          <div>
            <label className="block text-xs font-bold text-text mb-1.5">
              عنوان خدمت (فارسی) *
            </label>
            <input
              type="text"
              required
              value={formData.title.fa}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: { ...prev.title, fa: e.target.value },
                }))
              }
              placeholder="مثال: سیستم‌های سازمانی و CRM سفارشی"
              className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text mb-1.5">
              عنوان خدمت (انگلیسی) *
            </label>
            <input
              type="text"
              dir="ltr"
              required
              value={formData.title.en}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: { ...prev.title, en: e.target.value },
                }))
              }
              placeholder="e.g. Enterprise Systems & Custom CRM"
              className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none"
            />
          </div>

          {/* Outcome / Lead */}
          <div>
            <label className="block text-xs font-bold text-text mb-1.5">
              خلاصه بازدهی و ارزش اصلی (فارسی - Lead) *
            </label>
            <textarea
              rows={3}
              required
              value={formData.outcome.fa}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  outcome: { ...prev.outcome, fa: e.target.value },
                }))
              }
              placeholder="شرح کوتاه ارزش ملموس تجاری خدمت..."
              className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text mb-1.5">
              خلاصه بازدهی (انگلیسی - Lead) *
            </label>
            <textarea
              rows={3}
              dir="ltr"
              required
              value={formData.outcome.en}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  outcome: { ...prev.outcome, en: e.target.value },
                }))
              }
              placeholder="Concise business outcome in English..."
              className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none leading-relaxed"
            />
          </div>

          {/* Audience List */}
          <div className="md:col-span-2 border-t border-line pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-text">
                مخاطبان هدف خدمت (Audience)
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    audience: [
                      ...prev.audience,
                      { fa: "عنوان مخاطب جدید", en: "New Audience target" },
                    ],
                  }))
                }
                className="text-xs text-blue hover:underline font-bold"
              >
                + افزودن مخاطب
              </button>
            </div>
            <div className="space-y-3">
              {formData.audience.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.fa}
                    onChange={(e) => {
                      const updated = [...formData.audience];
                      updated[idx].fa = e.target.value;
                      setFormData((prev) => ({ ...prev, audience: updated }));
                    }}
                    placeholder="مخاطب فارسی..."
                    className="flex-1 rounded-xl border border-line bg-bg px-3 py-2 text-xs text-text"
                  />
                  <input
                    type="text"
                    dir="ltr"
                    value={item.en}
                    onChange={(e) => {
                      const updated = [...formData.audience];
                      updated[idx].en = e.target.value;
                      setFormData((prev) => ({ ...prev, audience: updated }));
                    }}
                    placeholder="Audience in English..."
                    className="flex-1 rounded-xl border border-line bg-bg px-3 py-2 text-xs text-text"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.audience.filter((_, i) => i !== idx);
                      setFormData((prev) => ({ ...prev, audience: updated }));
                    }}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg text-xs"
                    title="حذف"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bento & Status */}
          <div className="md:col-span-2 border-t border-line pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-text mb-1.5">
                وضعیت انتشار
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as "published" | "draft",
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs text-text font-bold"
              >
                <option value="published">منتشرشده (فعال)</option>
                <option value="draft">پیش‌نویس (غیرفعال)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text mb-1.5">
                ترتیب نمایش (Bento Order)
              </label>
              <input
                type="number"
                value={formData.bento.order}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bento: { ...prev.bento, order: parseInt(e.target.value, 10) || 0 },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs font-mono text-text"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text mb-1.5">
                عرض تایل بنتو (Span)
              </label>
              <select
                value={formData.bento.span}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bento: {
                      ...prev.bento,
                      span: parseInt(e.target.value, 10) as 2 | 4 | 6,
                    },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs text-text font-mono"
              >
                <option value="2">ستون ۲ تایی (باریک)</option>
                <option value="4">ستون ۴ تایی (استاندارد)</option>
                <option value="6">ستون ۶ تایی (تمام‌عرض)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Deliverables & Steps */}
      {activeTab === "deliverables" && (
        <div className="space-y-6">
          {/* Deliverables Repeater */}
          <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-sm font-bold text-text">
                  خروجی‌های ملموس خدمت (Deliverables)
                </h3>
                <p className="text-xs text-muted">
                  کارت‌های بنتو که تحویل‌شدنی‌های واقعی و عملیاتی سیستم را نشان می‌دهند.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    deliverables: [
                      ...prev.deliverables,
                      {
                        title: { fa: "عنوان خروجی جدید", en: "New Deliverable Title" },
                        description: { fa: "شرح خروجی...", en: "Deliverable description..." },
                      },
                    ],
                  }))
                }
                className="rounded-xl bg-blue/10 border border-blue/30 px-3 py-1.5 text-xs font-bold text-blue hover:bg-blue/20 transition-colors"
              >
                + افزودن کارت خروجی
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-line bg-bg/50 p-4 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted">
                      خروجی #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.deliverables.filter((_, i) => i !== idx);
                        setFormData((prev) => ({ ...prev, deliverables: updated }));
                      }}
                      className="text-red-500 hover:bg-red-500/10 px-2 py-0.5 rounded text-xs"
                      title="حذف این خروجی"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={item.title.fa}
                      onChange={(e) => {
                        const updated = [...formData.deliverables];
                        updated[idx].title.fa = e.target.value;
                        setFormData((prev) => ({ ...prev, deliverables: updated }));
                      }}
                      placeholder="عنوان خروجی (فارسی)..."
                      className="w-full rounded-xl border border-line bg-panel px-3 py-2 text-xs font-bold text-text"
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={item.title.en}
                      onChange={(e) => {
                        const updated = [...formData.deliverables];
                        updated[idx].title.en = e.target.value;
                        setFormData((prev) => ({ ...prev, deliverables: updated }));
                      }}
                      placeholder="Deliverable Title (English)..."
                      className="w-full rounded-xl border border-line bg-panel px-3 py-2 text-xs text-text"
                    />
                    <textarea
                      rows={2}
                      value={item.description.fa}
                      onChange={(e) => {
                        const updated = [...formData.deliverables];
                        updated[idx].description.fa = e.target.value;
                        setFormData((prev) => ({ ...prev, deliverables: updated }));
                      }}
                      placeholder="توضیح کوتاه خروجی (فارسی)..."
                      className="w-full rounded-xl border border-line bg-panel px-3 py-2 text-xs text-text leading-relaxed"
                    />
                    <textarea
                      rows={2}
                      dir="ltr"
                      value={item.description.en}
                      onChange={(e) => {
                        const updated = [...formData.deliverables];
                        updated[idx].description.en = e.target.value;
                        setFormData((prev) => ({ ...prev, deliverables: updated }));
                      }}
                      placeholder="Deliverable Description (English)..."
                      className="w-full rounded-xl border border-line bg-panel px-3 py-2 text-xs text-text leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Steps */}
          <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-text">
                مراحل فرایند تحویل (۴ گام اجرایی)
              </h3>
              <p className="text-xs text-muted">
                گام‌های متوالی همکاری و پیاده‌سازی این خدمت از نیازسنجی تا تحویل.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-line bg-bg/50 p-4 space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue text-white text-xs font-bold font-mono">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-text">گام شماره {idx + 1}</span>
                  </div>

                  <input
                    type="text"
                    value={step.title.fa}
                    onChange={(e) => {
                      const updated = [...formData.steps];
                      updated[idx].title.fa = e.target.value;
                      setFormData((prev) => ({ ...prev, steps: updated }));
                    }}
                    placeholder="عنوان گام (فارسی)..."
                    className="w-full rounded-xl border border-line bg-panel px-3 py-2 text-xs font-bold text-text"
                  />
                  <input
                    type="text"
                    dir="ltr"
                    value={step.title.en}
                    onChange={(e) => {
                      const updated = [...formData.steps];
                      updated[idx].title.en = e.target.value;
                      setFormData((prev) => ({ ...prev, steps: updated }));
                    }}
                    placeholder="Step Title (English)..."
                    className="w-full rounded-xl border border-line bg-panel px-3 py-2 text-xs text-text"
                  />
                  <textarea
                    rows={2}
                    value={step.description.fa}
                    onChange={(e) => {
                      const updated = [...formData.steps];
                      updated[idx].description.fa = e.target.value;
                      setFormData((prev) => ({ ...prev, steps: updated }));
                    }}
                    placeholder="شرح گام..."
                    className="w-full rounded-xl border border-line bg-panel px-3 py-2 text-xs text-text leading-relaxed"
                  />
                  <textarea
                    rows={2}
                    dir="ltr"
                    value={step.description.en}
                    onChange={(e) => {
                      const updated = [...formData.steps];
                      updated[idx].description.en = e.target.value;
                      setFormData((prev) => ({ ...prev, steps: updated }));
                    }}
                    placeholder="Step Description (English)..."
                    className="w-full rounded-xl border border-line bg-panel px-3 py-2 text-xs text-text leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Tech Stack & System Map */}
      {activeTab === "architecture" && (
        <div className="space-y-6">
          {/* Tech Stack Groups */}
          <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-sm font-bold text-text">پشته فناوری (Tech Stack)</h3>
                <p className="text-xs text-muted">
                  دسته‌بندی‌های فناوری همراه با تگ‌های هر گروه (ابزارها، فریم‌ورک‌ها و دیتابیس‌ها).
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    stack: [
                      ...prev.stack,
                      {
                        label: { fa: "گروه فناوری جدید", en: "New Tech Group" },
                        items: ["Tool1", "Tool2"],
                      },
                    ],
                  }))
                }
                className="rounded-xl bg-blue/10 border border-blue/30 px-3 py-1.5 text-xs font-bold text-blue hover:bg-blue/20 transition-colors"
              >
                + افزودن گروه فناوری
              </button>
            </div>

            <div className="space-y-4">
              {formData.stack.map((group, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-line bg-bg/50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text">گروه #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.stack.filter((_, i) => i !== idx);
                        setFormData((prev) => ({ ...prev, stack: updated }));
                      }}
                      className="text-red-500 hover:bg-red-500/10 px-2 py-0.5 rounded text-xs"
                    >
                      حذف گروه
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={group.label.fa}
                      onChange={(e) => {
                        const updated = [...formData.stack];
                        updated[idx].label.fa = e.target.value;
                        setFormData((prev) => ({ ...prev, stack: updated }));
                      }}
                      placeholder="عنوان گروه (مثال: زیرساخت و پایگاه داده)..."
                      className="rounded-xl border border-line bg-panel px-3 py-2 text-xs font-bold text-text"
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={group.label.en}
                      onChange={(e) => {
                        const updated = [...formData.stack];
                        updated[idx].label.en = e.target.value;
                        setFormData((prev) => ({ ...prev, stack: updated }));
                      }}
                      placeholder="Group label in English..."
                      className="rounded-xl border border-line bg-panel px-3 py-2 text-xs text-text"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-muted mb-1">
                      ابزارها و فریم‌ورک‌ها (با کاما انگلیسی , جدا کنید):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={group.items.join(", ")}
                      onChange={(e) => {
                        const updated = [...formData.stack];
                        updated[idx].items = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setFormData((prev) => ({ ...prev, stack: updated }));
                      }}
                      placeholder="PostgreSQL, Redis, RabbitMQ"
                      className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs font-mono text-text"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Map Configuration */}
          <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-text">
                دیاگرام نقشه سیستم و معماری (System Map Diagram)
              </h3>
              <p className="text-xs text-muted">
                تنظیم نودهای معماری، نوع دیاگرام هندسی و متن ترمینال مانیتورینگ.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  عنوان پنجره اپلیکیشن (Window Title)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={formData.systemMap.windowTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      systemMap: { ...prev.systemMap, windowTitle: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs font-mono text-text"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  توپولوژی هندسی دیاگرام (Layout)
                </label>
                <select
                  value={formData.systemMap.layout}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      systemMap: {
                        ...prev.systemMap,
                        layout: e.target.value as ServiceFormData["systemMap"]["layout"],
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs text-text font-mono"
                >
                  <option value="hub">hub (ستاره‌ای / مرکزی)</option>
                  <option value="funnel">funnel (قیف پردازشی)</option>
                  <option value="modules">modules (چندماژولی)</option>
                  <option value="pipeline">pipeline (خط لوله داده)</option>
                  <option value="etl">etl (استخراج و تبدیل)</option>
                  <option value="stack">stack (پشته لایه‌ای)</option>
                </select>
              </div>

              <div className="sm:col-span-2 border-t border-line pt-3">
                <span className="text-xs font-bold text-text block mb-2">
                  عناوین نودهای دیاگرام (Nodes):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    [
                      { key: "inputTop", label: "ورودی بالا (Input Top)" },
                      { key: "inputBottom", label: "ورودی پایین (Input Bottom)" },
                      { key: "core", label: "هسته پردازش (Core)" },
                      { key: "outputTop", label: "خروجی بالا (Output Top)" },
                      { key: "outputBottom", label: "خروجی پایین (Output Bottom)" },
                    ] as const
                  ).map((node) => (
                    <div
                      key={node.key}
                      className="rounded-xl border border-line bg-bg/50 p-2.5 space-y-1.5"
                    >
                      <span className="text-[10px] font-bold text-muted">
                        {node.label}
                      </span>
                      <input
                        type="text"
                        value={formData.systemMap.nodes[node.key].fa}
                        onChange={(e) => {
                          const nodes = { ...formData.systemMap.nodes };
                          nodes[node.key] = {
                            ...nodes[node.key],
                            fa: e.target.value,
                          };
                          setFormData((prev) => ({
                            ...prev,
                            systemMap: { ...prev.systemMap, nodes },
                          }));
                        }}
                        placeholder="فارسی..."
                        className="w-full rounded-lg border border-line bg-panel px-2.5 py-1 text-xs text-text"
                      />
                      <input
                        type="text"
                        dir="ltr"
                        value={formData.systemMap.nodes[node.key].en}
                        onChange={(e) => {
                          const nodes = { ...formData.systemMap.nodes };
                          nodes[node.key] = {
                            ...nodes[node.key],
                            en: e.target.value,
                          };
                          setFormData((prev) => ({
                            ...prev,
                            systemMap: { ...prev.systemMap, nodes },
                          }));
                        }}
                        placeholder="English..."
                        className="w-full rounded-lg border border-line bg-panel px-2.5 py-1 text-xs text-text font-sans"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: FAQs & Related Projects */}
      {activeTab === "faqs" && (
        <div className="space-y-6">
          <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-sm font-bold text-text">
                  پرسش‌های متداول (Service FAQs)
                </h3>
                <p className="text-xs text-muted">
                  پاسخ به سوالات فنی، زمان‌بندی و شرایط قرارداد کارفرما در رابطه با این خدمت.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    faqs: [
                      ...prev.faqs,
                      {
                        id: `faq-${Date.now()}`,
                        question: { fa: "سوال متداول جدید؟", en: "New Question?" },
                        answer: { fa: "پاسخ تفصیلی...", en: "Detailed answer..." },
                      },
                    ],
                  }))
                }
                className="rounded-xl bg-blue/10 border border-blue/30 px-3 py-1.5 text-xs font-bold text-blue hover:bg-blue/20 transition-colors"
              >
                + افزودن پرسش و پاسخ
              </button>
            </div>

            <div className="space-y-4">
              {formData.faqs.map((faq, idx) => (
                <div
                  key={faq.id || idx}
                  className="rounded-2xl border border-line bg-bg/50 p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted">سوال #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.faqs.filter((_, i) => i !== idx);
                        setFormData((prev) => ({ ...prev, faqs: updated }));
                      }}
                      className="text-red-500 hover:bg-red-500/10 px-2 py-0.5 rounded text-xs"
                    >
                      حذف
                    </button>
                  </div>

                  <input
                    type="text"
                    value={faq.question.fa}
                    onChange={(e) => {
                      const updated = [...formData.faqs];
                      updated[idx].question.fa = e.target.value;
                      setFormData((prev) => ({ ...prev, faqs: updated }));
                    }}
                    placeholder="صورت سوال (فارسی)..."
                    className="w-full rounded-xl border border-line bg-panel px-3 py-2 text-xs font-bold text-text"
                  />
                  <input
                    type="text"
                    dir="ltr"
                    value={faq.question.en}
                    onChange={(e) => {
                      const updated = [...formData.faqs];
                      updated[idx].question.en = e.target.value;
                      setFormData((prev) => ({ ...prev, faqs: updated }));
                    }}
                    placeholder="Question in English..."
                    className="w-full rounded-xl border border-line bg-panel px-3 py-2 text-xs text-text"
                  />
                  <textarea
                    rows={2}
                    value={faq.answer.fa}
                    onChange={(e) => {
                      const updated = [...formData.faqs];
                      updated[idx].answer.fa = e.target.value;
                      setFormData((prev) => ({ ...prev, faqs: updated }));
                    }}
                    placeholder="پاسخ به سوال (فارسی)..."
                    className="w-full rounded-xl border border-line bg-panel px-3 py-2 text-xs text-text leading-relaxed"
                  />
                  <textarea
                    rows={2}
                    dir="ltr"
                    value={faq.answer.en}
                    onChange={(e) => {
                      const updated = [...formData.faqs];
                      updated[idx].answer.en = e.target.value;
                      setFormData((prev) => ({ ...prev, faqs: updated }));
                    }}
                    placeholder="Answer in English..."
                    className="w-full rounded-xl border border-line bg-panel px-3 py-2 text-xs text-text leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Deep-Dive Tiptap Rich-Text Editor */}
      {activeTab === "deepdive" && (
        <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-4">
          <div className="flex flex-col gap-1 border-b border-line pb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text">
                توضیحات تکمیلی و یادداشت‌های عمیق معماری (Deep-Dive)
              </span>
              <span className="rounded-full bg-blue/10 px-2 py-0.5 text-[10px] font-bold text-blue">
                ادیتور هوشمند Tiptap
              </span>
            </div>
            <p className="text-xs text-muted">
              این بخش در صورت تکمیل، به عنوان یک سکشن عمیق و تخصصی با دکمه‌های اقدام، جداول،
              بلوک‌های کد ترمینالی LTR و کادرهای تو در تو در صفحه خدمت نمایش داده می‌شود.
            </p>
          </div>

          <div className="mt-4">
            <TiptapEditor
              contentJson={formData.deepDiveJson}
              contentHtml={formData.deepDiveHtml}
              locale="fa"
              placeholder="توضیحات عمیق فنی، یادداشت‌های پیاده‌سازی و معماری سیستم را اینجا بنویسید (برای دستورات سریع / را تایپ کنید)..."
              onChange={(json, html) => {
                setFormData((prev) => ({
                  ...prev,
                  deepDiveJson: json,
                  deepDiveHtml: html,
                }));
              }}
            />
          </div>
        </div>
      )}
    </form>
  );
}
