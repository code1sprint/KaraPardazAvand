"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { ApiButton } from "@/components/admin/api-drawer/ApiButton";
import { TiptapEditor } from "@/components/admin/editor/TiptapEditor";
import {
  IconFileText,
  IconLightbulb,
  IconBarChart,
  IconImage,
  IconPencil,
  IconAlertTriangle,
  IconCheckCircle,
  IconExternalLink,
  IconArrowRight,
  IconCheck,
  IconPlus,
} from "@/components/admin/editor/EditorIcons";
import { cn } from "@/lib/cn";
import type { IProject } from "@/lib/db/models/Project";
import { ProjectCoverPicker } from "./ProjectCoverPicker";

type ProjectFormData = {
  slug: string;
  title: string;
  sector: string;
  year: string;
  services: string[];
  role: string;
  problem: string;
  solution: string;
  results: Array<{ label: string; value: string; source: string }>;
  stack: string[];
  cover: string;
  gallery: Array<{ src: string; caption: string; alt: string }>;
  systemMap: {
    windowTitle: string;
    layout: "hub" | "funnel" | "modules" | "pipeline" | "etl" | "stack";
    descriptionLead: string;
    description: string;
    nodes: {
      inputTop: string;
      inputBottom: string;
      core: string;
      outputTop: string;
      outputBottom: string;
    };
    logs: [string, string, string];
  };
  featured: boolean;
  status: "published" | "draft";
  contentJson?: Record<string, unknown>;
  contentHtml?: string;
};

interface ProjectFormProps {
  initialData?: Partial<IProject> & { _id?: string };
  isNew?: boolean;
}

const AVAILABLE_SERVICES = [
  { slug: "crm", label: "سیستم‌های CRM سازمانی" },
  { slug: "rag-ai", label: "سامانه‌های هوش مصنوعی و RAG" },
  { slug: "data-science", label: "علم داده و داشبوردهای تحلیلی" },
  { slug: "erp", label: "سیستم‌های یکپارچه ERP" },
  { slug: "web-platforms", label: "پلتفرم‌های تحت وب مقیاس‌پذیر" },
  { slug: "custom-software", label: "نرم‌افزارهای سفارشی عملیاتی" },
];

export function ProjectForm({ initialData, isNew = false }: ProjectFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "general" | "problem" | "results" | "systemMap" | "narrative"
  >("general");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProjectFormData>({
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    sector: initialData?.sector || "خدمات سازمانی و B2B",
    year: initialData?.year || "1403",
    services: initialData?.services || ["crm"],
    role: initialData?.role || "طراحی محصول و معماری هسته سیستم",
    problem: initialData?.problem || "",
    solution: initialData?.solution || "",
    results: (initialData?.results || []).map((r) => ({
      label: r.label,
      value: r.value,
      source: r.source || "",
    })),
    stack: initialData?.stack || ["TypeScript", "PostgreSQL", "Next.js"],
    cover: initialData?.cover || "",
    gallery: (initialData?.gallery || []).map((g) => ({
      src: g.src,
      caption: g.caption,
      alt: g.alt || "",
    })),
    systemMap: {
      windowTitle: initialData?.systemMap?.windowTitle || "kara://pilot",
      layout: initialData?.systemMap?.layout || "hub",
      descriptionLead: initialData?.systemMap?.descriptionLead || "جریان داده یکپارچه",
      description:
        initialData?.systemMap?.description ||
        "ورودی کانال‌ها به هسته متمرکز؛ خروجی داشبورد و اعلان‌ها.",
      nodes: initialData?.systemMap?.nodes || {
        inputTop: "کانال وب و ورودی لید",
        inputBottom: "سیستم‌های مالی موجود",
        core: "هسته پردازشی متمرکز",
        outputTop: "داشبورد تحلیلی قیف",
        outputBottom: "دسترسی‌ها و اعلان‌ها",
      },
      logs: initialData?.systemMap?.logs || [
        "channel.ingest  ok",
        "funnel.synced  ok",
        "roles.applied  ok",
      ],
    },
    featured: initialData?.featured ?? false,
    status: initialData?.status || "published",
    contentJson: (initialData?.contentJson as Record<string, unknown>) || {
      type: "doc",
      content: [],
    },
    contentHtml: initialData?.contentHtml || "",
  });

  // Synchronize form if updated via API Drawer or background event
  useEffect(() => {
    const projectTarget = initialData?._id || formData.slug;
    if (!projectTarget || isNew) return;

    const handleRemoteUpdate = async (e: Event) => {
      const customEvent = e as CustomEvent<{ resource?: string; path?: string }>;
      const isProjectResource =
        customEvent.detail?.resource === "projects" || customEvent.detail?.path?.includes("/projects");
      const pathMatches =
        customEvent.detail?.path?.includes(String(initialData?._id)) ||
        customEvent.detail?.path?.includes(formData.slug);

      if (isProjectResource && (pathMatches || !isNew)) {
        try {
          const res = await fetch(`/api/admin/projects/${projectTarget}`);
          const json = await res.json();
          if (json.ok && json.project) {
            const p = json.project;
            setFormData((prev) => ({
              ...prev,
              slug: p.slug ?? prev.slug,
              title: p.title ?? prev.title,
              sector: p.sector ?? prev.sector,
              year: p.year ?? prev.year,
              services: p.services ?? prev.services,
              role: p.role ?? prev.role,
              problem: p.problem ?? prev.problem,
              solution: p.solution ?? prev.solution,
              results: p.results ?? prev.results,
              stack: p.stack ?? prev.stack,
              cover: p.cover ?? prev.cover,
              gallery: p.gallery ?? prev.gallery,
              systemMap: p.systemMap ?? prev.systemMap,
              featured: p.featured ?? prev.featured,
              status: p.status ?? prev.status,
              contentJson: p.contentJson ?? prev.contentJson,
              contentHtml: p.contentHtml ?? prev.contentHtml,
            }));
            setSuccessMsg("محتوای پروژه و ادیتور با موفقیت از طریق API به‌روزرسانی شد.");
          }
        } catch {
          // Ignore
        }
      }
    };

    window.addEventListener("kara-content-updated", handleRemoteUpdate);
    return () => {
      window.removeEventListener("kara-content-updated", handleRemoteUpdate);
    };
  }, [initialData?._id, formData.slug, isNew]);

  const toggleService = (slug: string) => {
    setFormData((prev) => {
      const exists = prev.services.includes(slug);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== slug)
          : [...prev.services, slug],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!formData.cover?.trim()) {
      setErrorMsg("لطفاً تصویر کاور اصلی پروژه را از مرورگر انتخاب و بارگذاری کنید.");
      return;
    }

    setSubmitting(true);

    try {
      const url = isNew
        ? "/api/admin/projects"
        : `/api/admin/projects/${initialData?._id || formData.slug}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "خطا در ذخیره پروژه");
      }

      setSuccessMsg(
        isNew ? "مطالعه موردی جدید با موفقیت ثبت شد." : "تغییرات پروژه با موفقیت ذخیره شد.",
      );

      if (isNew && data.project?._id) {
        setTimeout(() => {
          router.push(`/admin/projects/${data.project._id}/edit`);
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
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/projects"
              className="text-xs text-muted hover:text-blue transition-colors font-medium inline-flex items-center gap-1"
            >
              <IconArrowRight className="size-3.5" />
              <span>بازگشت به لیست پروژه‌ها</span>
            </Link>
            <span className="text-muted">/</span>
            <span className="text-xs font-bold text-text">
              {isNew ? "ثبت پروژه جدید" : formData.title || "ویرایش پروژه"}
            </span>
          </div>
          <h1 className="text-xl font-black text-text sm:text-2xl mt-1">
            {isNew ? "افزودن مطالعه موردی جدید" : `ویرایش: ${formData.title}`}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ApiButton variant="secondary" label="API این سند" />
          {!isNew && (
            <Link
              href={`/portfolio/${formData.slug}`}
              target="_blank"
              className="rounded-xl border border-line bg-panel px-4 py-2.5 text-xs font-bold text-text hover:border-blue transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>مشاهده زنده در سایت</span>
              <IconExternalLink className="size-3.5 text-muted" />
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
            <span>{isNew ? "ایجاد و انتشار مطالعه موردی" : "ذخیره تمام تغییرات"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-600">
          <IconAlertTriangle className="size-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-ok/30 bg-ok/10 p-4 text-xs font-semibold text-ok">
          <IconCheckCircle className="size-4 shrink-0 text-ok" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-2">
        {[
          { id: "general", label: "۱. مشخصات و دسته‌بندی", icon: <IconFileText className="size-4" /> },
          { id: "problem", label: "۲. صورت مسئله و راهکار", icon: <IconLightbulb className="size-4" /> },
          { id: "results", label: "۳. دستاوردهای عددی و استک", icon: <IconBarChart className="size-4" /> },
          { id: "systemMap", label: "۴. گالری و نقشه سیستم", icon: <IconImage className="size-4" /> },
          {
            id: "narrative",
            label: "۵. روایت تفصیلی پروژه (Tiptap)",
            icon: <IconPencil className="size-4" />,
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

      {/* Tab 1: General & Metadata */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-panel p-6 rounded-3xl border border-line shadow-sm">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-text mb-1.5">
              عنوان مطالعه موردی *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="مثال: پایلوت CRM عملیات فروش در زنجیره توزیع B2B"
              className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs font-bold text-text focus:border-blue focus:outline-none"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-bold text-text mb-1.5">
              اسلاگ یکتا (URL Slug) *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted" dir="ltr">
                /portfolio/
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
                placeholder="ops-crm-pilot"
                className="flex-1 rounded-xl border border-line bg-bg px-3.5 py-2 text-xs font-mono text-text focus:border-blue focus:outline-none"
              />
            </div>
          </div>

          {/* Sector */}
          <div>
            <label className="block text-xs font-bold text-text mb-1.5">
              حوزه و صنعت (Sector) *
            </label>
            <input
              type="text"
              required
              value={formData.sector}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, sector: e.target.value }))
              }
              placeholder="مثال: توزیع و فروش B2B، فین‌تک، سلامت..."
              className="w-full rounded-xl border border-line bg-bg px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
            />
          </div>

          {/* Year & Role */}
          <div>
            <label className="block text-xs font-bold text-text mb-1.5">
              سال اجرا / تحویل *
            </label>
            <input
              type="text"
              required
              value={formData.year}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, year: e.target.value }))
              }
              placeholder="۱۴۰۳ یا 2024"
              className="w-full rounded-xl border border-line bg-bg px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text mb-1.5">
              نقش شرکت در پروژه (Role) *
            </label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
              placeholder="طراحی محصول و پیاده‌سازی هسته CRM"
              className="w-full rounded-xl border border-line bg-bg px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
            />
          </div>

          {/* Connected Services */}
          <div className="md:col-span-2 border-t border-line pt-4">
            <label className="block text-xs font-bold text-text mb-2">
              خدمات متصل به این پروژه (خدمات ارائه‌شده):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_SERVICES.map((svc) => {
                const checked = formData.services.includes(svc.slug);
                return (
                  <button
                    key={svc.slug}
                    type="button"
                    onClick={() => toggleService(svc.slug)}
                    className={cn(
                      "flex items-center gap-2 p-2.5 rounded-xl border text-xs text-start transition-all",
                      checked
                        ? "bg-blue/15 border-blue text-blue font-bold shadow-sm"
                        : "bg-bg border-line text-muted hover:text-text",
                    )}
                  >
                    {checked ? (
                      <IconCheck className="size-3.5 shrink-0" />
                    ) : (
                      <IconPlus className="size-3.5 shrink-0" />
                    )}
                    <span>{svc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cover & Status */}
          <div className="md:col-span-2 border-t border-line pt-5 space-y-4">
            <ProjectCoverPicker
              value={formData.cover}
              onChange={(url) => setFormData((prev) => ({ ...prev, cover: url }))}
              label="تصویر کاور اصلی پروژه"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
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
                  <option value="published">منتشرشده (فعال در سایت)</option>
                  <option value="draft">پیش‌نویس (غیرفعال)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 sm:pt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-line text-blue focus:ring-blue"
                />
                <label htmlFor="featured" className="text-xs font-bold text-text cursor-pointer">
                  نمایش به عنوان پروژه برگزیده در صفحه اصلی و پیشخوان
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Problem & Solution */}
      {activeTab === "problem" && (
        <div className="space-y-6 bg-panel p-6 rounded-3xl border border-line shadow-sm">
          <div>
            <label className="block text-xs font-bold text-text mb-1.5">
              صورت مسئله و چالش کارفرما (Problem Statement) *
            </label>
            <textarea
              rows={4}
              required
              value={formData.problem}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, problem: e.target.value }))
              }
              placeholder="شرح چالش عملیاتی، اتلاف زمان و مسائلی که قبل از شروع پروژه وجود داشت..."
              className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text mb-1.5">
              راه‌حل پیاده‌سازی شده (Engineered Solution) *
            </label>
            <textarea
              rows={4}
              required
              value={formData.solution}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, solution: e.target.value }))
              }
              placeholder="شرح معماری، رویکرد مهندسی و راهکاری که توسط کارا پرداز آوند پیاده‌سازی شد..."
              className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Metrics & Tech Stack */}
      {activeTab === "results" && (
        <div className="space-y-6">
          {/* Sourced Results */}
          <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-sm font-bold text-text">
                  دستاوردهای سنجش‌پذیر (Sourced Results)
                </h3>
                <p className="text-xs text-muted">
                  شاخص‌های عملکردی مستند (طبق اصول برند، شاخص‌های بدون منبع در سایت مخفی می‌مانند).
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    results: [
                      ...prev.results,
                      {
                        label: "شاخص جدید",
                        value: "۳۰٪",
                        source: "گزارش سه‌ماهه پایلوت",
                      },
                    ],
                  }))
                }
                className="rounded-xl bg-blue/10 border border-blue/30 px-3 py-1.5 text-xs font-bold text-blue hover:bg-blue/20 transition-colors"
              >
                + افزودن شاخص نتیجه
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.results.map((r, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-line bg-bg/50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted">
                      شاخص #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.results.filter((_, i) => i !== idx);
                        setFormData((prev) => ({ ...prev, results: updated }));
                      }}
                      className="text-red-500 hover:bg-red-500/10 px-2 py-0.5 rounded text-xs"
                    >
                      حذف
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-muted mb-1">
                      مقدار عددی یا درصد (Value):
                    </label>
                    <input
                      type="text"
                      value={r.value}
                      onChange={(e) => {
                        const updated = [...formData.results];
                        updated[idx].value = e.target.value;
                        setFormData((prev) => ({ ...prev, results: updated }));
                      }}
                      placeholder="مثال: ۴۵٪ یا ۲.۵ برابر"
                      className="w-full rounded-xl border border-line bg-panel px-3 py-2 text-xs font-black text-text"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-muted mb-1">
                      عنوان شاخص (Label):
                    </label>
                    <input
                      type="text"
                      value={r.label}
                      onChange={(e) => {
                        const updated = [...formData.results];
                        updated[idx].label = e.target.value;
                        setFormData((prev) => ({ ...prev, results: updated }));
                      }}
                      placeholder="کاهش زمان گزارش‌گیری هفتگی"
                      className="w-full rounded-xl border border-line bg-panel px-3 py-2 text-xs text-text"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-muted mb-1">
                      منبع استناد (Source - جهت جلوگیری از آمار فیک):
                    </label>
                    <input
                      type="text"
                      value={r.source}
                      onChange={(e) => {
                        const updated = [...formData.results];
                        updated[idx].source = e.target.value;
                        setFormData((prev) => ({ ...prev, results: updated }));
                      }}
                      placeholder="گزارش ارزیابی داخلی واحد عملیات"
                      className="w-full rounded-xl border border-line bg-panel px-3 py-2 text-xs text-text"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-text">پشته فناوری (Tech Stack)</h3>
            <p className="text-xs text-muted">
              ابزارها و زبان‌های به کار رفته در پروژه (با کاما انگلیسی , جدا کنید):
            </p>
            <input
              type="text"
              dir="ltr"
              value={formData.stack.join(", ")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stack: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="TypeScript, PostgreSQL, Next.js, Docker, Redis"
              className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs font-mono text-text focus:border-blue focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Tab 4: Gallery & System Map */}
      {activeTab === "systemMap" && (
        <div className="space-y-6">
          {/* Gallery Repeater */}
          <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-sm font-bold text-text">گالری تصاویر پروژه</h3>
                <p className="text-xs text-muted">
                  اسکرین‌شات‌ها و نماهای شماتیک بخش‌های مختلف سیستم همراه با کپشن.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    gallery: [
                      ...prev.gallery,
                      {
                        src: "/projects/ops-crm-cover.svg",
                        caption: "نمای شماتیک داشبورد",
                        alt: "اسکرین‌شات",
                      },
                    ],
                  }))
                }
                className="rounded-xl bg-blue/10 border border-blue/30 px-3 py-1.5 text-xs font-bold text-blue hover:bg-blue/20 transition-colors"
              >
                + افزودن تصویر به گالری
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.gallery.map((g, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-line bg-bg/50 p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted">
                      تصویر #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.gallery.filter((_, i) => i !== idx);
                        setFormData((prev) => ({ ...prev, gallery: updated }));
                      }}
                      className="text-red-500 hover:bg-red-500/10 px-2 py-0.5 rounded text-xs"
                    >
                      حذف
                    </button>
                  </div>

                  <input
                    type="text"
                    dir="ltr"
                    value={g.src}
                    onChange={(e) => {
                      const updated = [...formData.gallery];
                      updated[idx].src = e.target.value;
                      setFormData((prev) => ({ ...prev, gallery: updated }));
                    }}
                    placeholder="/projects/example.svg"
                    className="w-full rounded-xl border border-line bg-panel px-3 py-2 text-xs font-mono text-text"
                  />
                  <input
                    type="text"
                    value={g.caption}
                    onChange={(e) => {
                      const updated = [...formData.gallery];
                      updated[idx].caption = e.target.value;
                      setFormData((prev) => ({ ...prev, gallery: updated }));
                    }}
                    placeholder="کپشن و توضیح تصویر..."
                    className="w-full rounded-xl border border-line bg-panel px-3 py-2 text-xs text-text"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Project System Map */}
          <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-text">
                دیاگرام نقشه سیستم پروژه (Project System Map)
              </h3>
              <p className="text-xs text-muted">
                طراحی جریان معماری سیستم در این مطالعه موردی.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  عنوان کنسول (Window Title)
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
                  توپولوژی هندسی دیاگرام
                </label>
                <select
                  value={formData.systemMap.layout}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      systemMap: {
                        ...prev.systemMap,
                        layout: e.target.value as ProjectFormData["systemMap"]["layout"],
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

              <div className="sm:col-span-2 border-t border-line pt-3 space-y-3">
                <span className="text-xs font-bold text-text block">
                  عناوین نودهای دیاگرام:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    [
                      { key: "inputTop", label: "ورودی بالا" },
                      { key: "inputBottom", label: "ورودی پایین" },
                      { key: "core", label: "هسته پردازش مرکزی" },
                      { key: "outputTop", label: "خروجی بالا" },
                      { key: "outputBottom", label: "خروجی پایین" },
                    ] as const
                  ).map((node) => (
                    <div key={node.key} className="space-y-1">
                      <span className="text-[10px] font-bold text-muted">
                        {node.label}
                      </span>
                      <input
                        type="text"
                        value={formData.systemMap.nodes[node.key]}
                        onChange={(e) => {
                          const nodes = { ...formData.systemMap.nodes };
                          nodes[node.key] = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            systemMap: { ...prev.systemMap, nodes },
                          }));
                        }}
                        className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs text-text"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Deep-Dive Tiptap Case Study Narrative */}
      {activeTab === "narrative" && (
        <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-4">
          <div className="flex flex-col gap-1 border-b border-line pb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text">
                روایت تفصیلی مطالعه موردی (Case Study Deep Dive)
              </span>
              <span className="rounded-full bg-blue/10 px-2 py-0.5 text-[10px] font-bold text-blue">
                ادیتور Tiptap
              </span>
            </div>
            <p className="text-xs text-muted">
              این بخش بدنهٔ نهایی مطالعه موردی است و می‌تواند شامل کدهای فنی، جداول، کادرهای
              هشدار و دکمه‌های اقدام ارتباطی باشد.
            </p>
          </div>

          <div className="mt-4">
            <TiptapEditor
              contentJson={formData.contentJson}
              contentHtml={formData.contentHtml}
              locale="fa"
              placeholder="روایت فنی پروژه، تصمیمات کلیدی معماری و چالش‌های حل‌شده را اینجا بنویسید..."
              onChange={(json, html) => {
                setFormData((prev) => ({
                  ...prev,
                  contentJson: json,
                  contentHtml: html,
                }));
              }}
            />
          </div>
        </div>
      )}
    </form>
  );
}
