"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { TiptapEditor } from "@/components/admin/editor/TiptapEditor";
import { cn } from "@/lib/cn";
import type { ProcessFormData } from "@/lib/validations/process";

interface ProcessFormProps {
  initialData: ProcessFormData;
}

export function ProcessForm({ initialData }: ProcessFormProps) {
  const [formData, setFormData] = useState<ProcessFormData>(initialData);
  const [activeTab, setActiveTab] = useState<
    "hero" | "steps" | "engagement" | "guide"
  >("hero");
  const [guideLang, setGuideLang] = useState<"fa" | "en">("fa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/process", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "خطا در ذخیره‌سازی اطلاعات فرایند همکاری.");
      }

      setSuccessMessage(data.message || "اطلاعات با موفقیت ذخیره شد.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "خطای غیرمنتظره در ارسال اطلاعات.",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs: Array<{
    id: "hero" | "steps" | "engagement" | "guide";
    label: string;
    icon: string;
    badge?: string;
  }> = [
    { id: "hero", label: "۱. مشخصات و سربرگ", icon: "📋" },
    {
      id: "steps",
      label: "۲. گام‌های متدولوژی مهندسی",
      icon: "📦",
      badge: `${formData.steps.length} گام`,
    },
    {
      id: "engagement",
      label: "۳. الگوهای همکاری و تعهدات ارتباطی",
      icon: "🤝",
    },
    {
      id: "guide",
      label: "۴. راهنمای تفصیلی تحویل (Tiptap Rich-Text)",
      icon: "✍️",
      badge: "ادیتور آزاد",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-xs text-muted hover:text-blue transition-colors font-medium"
            >
              ← بازگشت به پیشخوان
            </Link>
            <span className="text-muted">/</span>
            <span className="text-xs font-bold text-text">
              مدیریت فرایند همکاری و متدولوژی
            </span>
          </div>
          <h1 className="text-xl font-black text-text sm:text-2xl mt-1">
            فرایند همکاری و متدولوژی
          </h1>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            مدیریت گام‌های متدولوژی مهندسی، خروجی‌های ملموس (Deliverables)، الگوهای قرارداد و راهنمای تحویل نرم‌افزار
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/process"
            target="_blank"
            className="rounded-xl border border-line bg-panel px-4 py-2.5 text-xs font-bold text-text hover:border-blue transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <span>مشاهده زنده در سایت</span>
            <span className="text-muted">↗</span>
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-blue text-white px-6 py-2.5 text-xs font-bold shadow hover:bg-navy-2 transition-all disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isSubmitting && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            <span>ذخیره تمام تغییرات</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-600">
          ⚠️ {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="rounded-2xl border border-ok/30 bg-ok/10 p-4 text-xs font-semibold text-ok">
          ✓ {successMessage}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-2">
        {tabs.map((tab) => (
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

      {/* Tab 1: Hero */}
      {activeTab === "hero" && (
        <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-6">
          <div className="border-b border-line pb-3">
            <h3 className="text-sm font-bold text-text">
              سربرگ و تیتر صفحه فرایند همکاری (Hero Section)
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              متن عنوان اصلی به صورت ۳ بخشی طراحی شده که بخش میانی با افکت گرادیان امضای برند نمایش داده می‌شود.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-text border-s-2 border-blue ps-2">
              عنوان سه‌بخشی هیرو (فارسی)
            </h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  بخش اول تیتر (فارسی)
                </label>
                <input
                  type="text"
                  value={formData.hero?.titleBefore?.fa || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        titleBefore: {
                          fa: e.target.value,
                          en: prev.hero?.titleBefore?.en || "",
                        },
                      },
                    }))
                  }
                  placeholder="از کشف مسئله تا"
                  className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  بخش گرادیان (فارسی) *
                </label>
                <input
                  type="text"
                  value={formData.hero?.titleGradient?.fa || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        titleGradient: {
                          fa: e.target.value,
                          en: prev.hero?.titleGradient?.en || "",
                        },
                      },
                    }))
                  }
                  placeholder="تحویل سیستم پایدار"
                  className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-blue font-bold focus:border-blue focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  بخش پایانی تیتر (فارسی)
                </label>
                <input
                  type="text"
                  value={formData.hero?.titleAfter?.fa || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        titleAfter: {
                          fa: e.target.value,
                          en: prev.hero?.titleAfter?.en || "",
                        },
                      },
                    }))
                  }
                  placeholder="با شفافیت کامل"
                  className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-line pt-4">
            <h4 className="text-xs font-bold text-text border-s-2 border-blue ps-2">
              Three-Part Hero Headline (English)
            </h4>
            <div className="grid gap-4 sm:grid-cols-3" dir="ltr">
              <div>
                <label className="block text-xs font-bold text-text mb-1.5 text-start">
                  Title Prefix (English)
                </label>
                <input
                  type="text"
                  value={formData.hero?.titleBefore?.en || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        titleBefore: {
                          fa: prev.hero?.titleBefore?.fa || "",
                          en: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="From Discovery to"
                  className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none transition-colors text-start"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1.5 text-start">
                  Gradient Phrase (English) *
                </label>
                <input
                  type="text"
                  value={formData.hero?.titleGradient?.en || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        titleGradient: {
                          fa: prev.hero?.titleGradient?.fa || "",
                          en: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="Production-Ready Delivery"
                  className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-blue font-bold focus:border-blue focus:outline-none transition-colors text-start"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1.5 text-start">
                  Title Suffix (English)
                </label>
                <input
                  type="text"
                  value={formData.hero?.titleAfter?.en || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        titleAfter: {
                          fa: prev.hero?.titleAfter?.fa || "",
                          en: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="with SLA Guarantees"
                  className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none transition-colors text-start"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-line pt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-text mb-1.5">
                لید معرفی فرایند (فارسی)
              </label>
              <textarea
                rows={3}
                value={formData.hero?.lead?.fa || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      lead: {
                        fa: e.target.value,
                        en: prev.hero?.lead?.en || "",
                      },
                    },
                  }))
                }
                placeholder="توضیح کوتاه رویکرد مهندسی و ارزش فرایند همکاری..."
                className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text mb-1.5 text-start">
                Hero Lead Paragraph (English)
              </label>
              <textarea
                rows={3}
                dir="ltr"
                value={formData.hero?.lead?.en || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      lead: {
                        fa: prev.hero?.lead?.fa || "",
                        en: e.target.value,
                      },
                    },
                  }))
                }
                placeholder="Brief summary of engineering methodology and delivery commitments..."
                className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none transition-colors text-start"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Steps Track */}
      {activeTab === "steps" && (
        <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <h3 className="text-sm font-bold text-text">
                گام‌های متدولوژی مهندسی (Process Steps Track)
              </h3>
              <p className="text-xs text-muted">
                هر گام شامل هدف شفاف، خروجی‌های ملموس (Deliverables) و میزان مشارکت کارفرما است.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  steps: [
                    ...prev.steps,
                    {
                      id: `step-${Date.now()}`,
                      number: prev.steps.length + 1,
                      title: {
                        fa: `گام ${prev.steps.length + 1}`,
                        en: `Step ${prev.steps.length + 1}`,
                      },
                      purpose: {
                        fa: "هدف این مرحله...",
                        en: "Purpose of this phase...",
                      },
                      deliverables: [{ fa: "خروجی اول", en: "First deliverable" }],
                      clientInvolvement: {
                        fa: "نقش و مشارکت کارفرما...",
                        en: "Client involvement...",
                      },
                      duration: null,
                    },
                  ],
                }))
              }
              className="rounded-xl bg-blue/10 border border-blue/30 px-3 py-1.5 text-xs font-bold text-blue hover:bg-blue/20 transition-colors"
            >
              + افزودن گام متدولوژی
            </button>
          </div>

          <div className="space-y-5">
            {formData.steps.map((step, index) => (
              <div
                key={step.id || index}
                className="rounded-2xl border border-line bg-bg/50 p-5 space-y-4 relative group"
              >
                {/* Step Top Bar */}
                <div className="flex items-center justify-between border-b border-line/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue text-white text-xs font-bold font-mono">
                      {step.number || index + 1}
                    </span>
                    <span className="text-xs font-bold text-text">
                      گام {step.number || index + 1}: {step.title.fa || "بدون عنوان"}
                    </span>
                    <span className="text-[10px] font-mono text-muted bg-panel px-2 py-0.5 rounded border border-line">
                      id: {step.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        steps: prev.steps.filter((_, i) => i !== index),
                      }))
                    }
                    className="text-red-500 hover:bg-red-500/10 px-2 py-0.5 rounded text-xs transition-colors"
                    title="حذف این گام"
                  >
                    حذف
                  </button>
                </div>

                {/* Number & Titles */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-text mb-1.5">
                      شماره ترتیب
                    </label>
                    <input
                      type="number"
                      value={step.number}
                      onChange={(e) => {
                        const updated = [...formData.steps];
                        updated[index].number = Number(e.target.value);
                        setFormData((prev) => ({ ...prev, steps: updated }));
                      }}
                      className="w-full rounded-xl border border-line bg-panel px-3.5 py-2.5 text-xs font-mono text-text focus:border-blue focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="block text-xs font-bold text-text mb-1.5">
                      عنوان گام (فارسی) *
                    </label>
                    <input
                      type="text"
                      value={step.title.fa}
                      onChange={(e) => {
                        const updated = [...formData.steps];
                        updated[index].title.fa = e.target.value;
                        setFormData((prev) => ({ ...prev, steps: updated }));
                      }}
                      placeholder="تحلیل نیاز..."
                      className="w-full rounded-xl border border-line bg-panel px-3.5 py-2.5 text-xs font-bold text-text focus:border-blue focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="block text-xs font-bold text-text mb-1.5 text-start">
                      Step Title (English)
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={step.title.en || ""}
                      onChange={(e) => {
                        const updated = [...formData.steps];
                        updated[index].title.en = e.target.value;
                        setFormData((prev) => ({ ...prev, steps: updated }));
                      }}
                      placeholder="Needs analysis..."
                      className="w-full rounded-xl border border-line bg-panel px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none text-start"
                    />
                  </div>
                </div>

                {/* Purpose */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">
                      هدف مرحله (فارسی)
                    </label>
                    <textarea
                      rows={2}
                      value={step.purpose.fa}
                      onChange={(e) => {
                        const updated = [...formData.steps];
                        updated[index].purpose.fa = e.target.value;
                        setFormData((prev) => ({ ...prev, steps: updated }));
                      }}
                      placeholder="مسئله، محدودیت‌ها و معیارهای موفقیت را پیش از هر طراحی روشن می‌کنیم."
                      className="w-full rounded-xl border border-line bg-panel px-3.5 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5 text-start">
                      Step Purpose (English)
                    </label>
                    <textarea
                      rows={2}
                      dir="ltr"
                      value={step.purpose.en || ""}
                      onChange={(e) => {
                        const updated = [...formData.steps];
                        updated[index].purpose.en = e.target.value;
                        setFormData((prev) => ({ ...prev, steps: updated }));
                      }}
                      placeholder="We clarify the problem, constraints, and success criteria before design."
                      className="w-full rounded-xl border border-line bg-panel px-3.5 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none text-start"
                    />
                  </div>
                </div>

                {/* Deliverables Sub-list */}
                <div className="rounded-2xl border border-line bg-panel p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-line/60 pb-2">
                    <span className="text-xs font-bold text-text">
                      خروجی‌های ملموس این گام (Deliverables)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...formData.steps];
                        updated[index].deliverables.push({
                          fa: "خروجی جدید",
                          en: "New deliverable",
                        });
                        setFormData((prev) => ({ ...prev, steps: updated }));
                      }}
                      className="text-xs text-blue hover:underline font-bold"
                    >
                      + افزودن خروجی
                    </button>
                  </div>

                  <div className="space-y-2">
                    {step.deliverables.map((del, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={del.fa}
                          placeholder="خلاصه مسئله و اهداف قابل اندازه‌گیری..."
                          onChange={(e) => {
                            const updated = [...formData.steps];
                            updated[index].deliverables[dIdx].fa = e.target.value;
                            setFormData((prev) => ({ ...prev, steps: updated }));
                          }}
                          className="flex-1 rounded-xl border border-line bg-bg px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
                        />
                        <input
                          type="text"
                          dir="ltr"
                          value={del.en || ""}
                          placeholder="Problem brief and measurable goals..."
                          onChange={(e) => {
                            const updated = [...formData.steps];
                            updated[index].deliverables[dIdx].en = e.target.value;
                            setFormData((prev) => ({ ...prev, steps: updated }));
                          }}
                          className="flex-1 rounded-xl border border-line bg-bg px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.steps];
                            updated[index].deliverables = updated[index].deliverables.filter(
                              (_, i) => i !== dIdx,
                            );
                            setFormData((prev) => ({ ...prev, steps: updated }));
                          }}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg text-xs transition-colors"
                          title="حذف"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Client Involvement */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">
                      نقش و مشارکت کارفرما (فارسی)
                    </label>
                    <textarea
                      rows={2}
                      value={step.clientInvolvement.fa}
                      onChange={(e) => {
                        const updated = [...formData.steps];
                        updated[index].clientInvolvement.fa = e.target.value;
                        setFormData((prev) => ({ ...prev, steps: updated }));
                      }}
                      placeholder="دسترسی به تصمیم‌گیر و نمونه‌هایی از فرایند یا داده‌های فعلی لازم است."
                      className="w-full rounded-xl border border-line bg-panel px-3.5 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5 text-start">
                      Client Involvement (English)
                    </label>
                    <textarea
                      rows={2}
                      dir="ltr"
                      value={step.clientInvolvement.en || ""}
                      onChange={(e) => {
                        const updated = [...formData.steps];
                        updated[index].clientInvolvement.en = e.target.value;
                        setFormData((prev) => ({ ...prev, steps: updated }));
                      }}
                      placeholder="Access to a decision-maker and samples of current process or data is required."
                      className="w-full rounded-xl border border-line bg-panel px-3.5 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none text-start"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Engagement & Communication */}
      {activeTab === "engagement" && (
        <div className="space-y-6">
          {/* Engagement Models */}
          <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-sm font-bold text-text">
                  الگوهای همکاری تجاری (Engagement Models)
                </h3>
                <p className="text-xs text-muted">
                  مدل‌های تعریف قرارداد (پروژه‌ای با دامنه مشخص، تیم اختصاصی، پشتیبانی ماهانه)
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    engagementModels: [
                      ...prev.engagementModels,
                      {
                        id: `model-${Date.now()}`,
                        title: { fa: "مدل جدید", en: "New model" },
                        description: { fa: "توضیحات مدل...", en: "Model description..." },
                        needs_business_confirmation: true,
                      },
                    ],
                  }))
                }
                className="rounded-xl bg-blue/10 border border-blue/30 px-3 py-1.5 text-xs font-bold text-blue hover:bg-blue/20 transition-colors"
              >
                + افزودن مدل همکاری
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.engagementModels.map((model, index) => (
                <div
                  key={model.id || index}
                  className="rounded-2xl border border-line bg-bg/50 p-4 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between border-b border-line/60 pb-2">
                    <span className="text-[11px] font-bold text-muted">
                      مدل #{index + 1} ({model.id})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          engagementModels: prev.engagementModels.filter(
                            (_, i) => i !== index,
                          ),
                        }))
                      }
                      className="text-red-500 hover:bg-red-500/10 px-2 py-0.5 rounded text-xs transition-colors"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">
                        عنوان مدل (فارسی)
                      </label>
                      <input
                        type="text"
                        value={model.title.fa}
                        onChange={(e) => {
                          const updated = [...formData.engagementModels];
                          updated[index].title.fa = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            engagementModels: updated,
                          }));
                        }}
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs font-bold text-text focus:border-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5 text-start">
                        Model Title (English)
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={model.title.en || ""}
                        onChange={(e) => {
                          const updated = [...formData.engagementModels];
                          updated[index].title.en = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            engagementModels: updated,
                          }));
                        }}
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none text-start"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">
                        توضیحات مدل (فارسی)
                      </label>
                      <textarea
                        rows={2}
                        value={model.description.fa}
                        onChange={(e) => {
                          const updated = [...formData.engagementModels];
                          updated[index].description.fa = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            engagementModels: updated,
                          }));
                        }}
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text leading-relaxed focus:border-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5 text-start">
                        Model Description (English)
                      </label>
                      <textarea
                        rows={2}
                        dir="ltr"
                        value={model.description.en || ""}
                        onChange={(e) => {
                          const updated = [...formData.engagementModels];
                          updated[index].description.en = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            engagementModels: updated,
                          }));
                        }}
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text leading-relaxed focus:border-blue focus:outline-none text-start"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Communication SLAs */}
          <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-sm font-bold text-text">
                  ردیف‌های تعامل و کانال‌های ارتباطی (Communication SLAs)
                </h3>
                <p className="text-xs text-muted">
                  شفاف‌سازی نحوه ارتباط، جلسات دمو، گزارش‌دهی و ابزارهای مورد استفاده
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    communicationRows: [
                      ...prev.communicationRows,
                      {
                        id: `comm-${Date.now()}`,
                        label: { fa: "مورد جدید", en: "New item" },
                        value: { fa: "توضیحات...", en: "Details..." },
                        needs_business_confirmation: true,
                      },
                    ],
                  }))
                }
                className="rounded-xl bg-blue/10 border border-blue/30 px-3 py-1.5 text-xs font-bold text-blue hover:bg-blue/20 transition-colors"
              >
                + افزودن کانال ارتباطی
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.communicationRows.map((row, index) => (
                <div
                  key={row.id || index}
                  className="rounded-2xl border border-line bg-bg/50 p-4 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between border-b border-line/60 pb-2">
                    <span className="text-[11px] font-bold text-muted">
                      کانال #{index + 1} ({row.id})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          communicationRows: prev.communicationRows.filter(
                            (_, i) => i !== index,
                          ),
                        }))
                      }
                      className="text-red-500 hover:bg-red-500/10 px-2 py-0.5 rounded text-xs transition-colors"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">
                        عنوان تعهد (فارسی)
                      </label>
                      <input
                        type="text"
                        value={row.label.fa}
                        onChange={(e) => {
                          const updated = [...formData.communicationRows];
                          updated[index].label.fa = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            communicationRows: updated,
                          }));
                        }}
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs font-bold text-text focus:border-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5 text-start">
                        Commitment Label (English)
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={row.label.en || ""}
                        onChange={(e) => {
                          const updated = [...formData.communicationRows];
                          updated[index].label.en = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            communicationRows: updated,
                          }));
                        }}
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none text-start"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">
                        نحوه اجرا و تعهد (فارسی)
                      </label>
                      <textarea
                        rows={2}
                        value={row.value?.fa || ""}
                        onChange={(e) => {
                          const updated = [...formData.communicationRows];
                          updated[index].value = {
                            fa: e.target.value,
                            en: updated[index].value?.en || "",
                          };
                          setFormData((prev) => ({
                            ...prev,
                            communicationRows: updated,
                          }));
                        }}
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text leading-relaxed focus:border-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5 text-start">
                        Execution & Commitment (English)
                      </label>
                      <textarea
                        rows={2}
                        dir="ltr"
                        value={row.value?.en || ""}
                        onChange={(e) => {
                          const updated = [...formData.communicationRows];
                          updated[index].value = {
                            fa: updated[index].value?.fa || "",
                            en: e.target.value,
                          };
                          setFormData((prev) => ({
                            ...prev,
                            communicationRows: updated,
                          }));
                        }}
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text leading-relaxed focus:border-blue focus:outline-none text-start"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Guide with Tiptap */}
      {activeTab === "guide" && (
        <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-text">
                  راهنمای تفصیلی تعامل و استانداردهای تحویل (Tiptap Guide)
                </h3>
                <span className="rounded-full bg-blue/10 px-2 py-0.5 text-[10px] font-bold text-blue">
                  ادیتور هوشمند Tiptap
                </span>
              </div>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                نگارش شفاف استانداردهای کدنویسی، مالکیت سورس‌ها و متدولوژی پیاده‌سازی همراه با بلوک‌های کد LTR، هشدارها و جدول.
              </p>
            </div>

            {/* Language toggle for Tiptap */}
            <div className="flex items-center gap-1 rounded-xl border border-line bg-bg p-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setGuideLang("fa")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-bold transition",
                  guideLang === "fa"
                    ? "bg-blue/15 border border-blue text-blue shadow-sm"
                    : "text-muted hover:text-text",
                )}
              >
                محتوای فارسی
              </button>
              <button
                type="button"
                onClick={() => setGuideLang("en")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-bold transition",
                  guideLang === "en"
                    ? "bg-blue/15 border border-blue text-blue shadow-sm"
                    : "text-muted hover:text-text",
                )}
              >
                English Content
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-text mb-1.5">
                عنوان بخش راهنما (فارسی)
              </label>
              <input
                type="text"
                value={formData.guide?.title?.fa || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    guide: {
                      title: {
                        fa: e.target.value,
                        en: prev.guide?.title?.en || "",
                      },
                      tiptapBody: prev.guide?.tiptapBody || {},
                    },
                  }))
                }
                placeholder="استانداردهای مهندسی و متدولوژی تحویل"
                className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text mb-1.5 text-start">
                Guide Title (English)
              </label>
              <input
                type="text"
                dir="ltr"
                value={formData.guide?.title?.en || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    guide: {
                      title: {
                        fa: prev.guide?.title?.fa || "",
                        en: e.target.value,
                      },
                      tiptapBody: prev.guide?.tiptapBody || {},
                    },
                  }))
                }
                placeholder="Engineering Standards & Delivery Methodology"
                className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none transition-colors text-start"
              />
            </div>
          </div>

          {/* Tiptap Editor */}
          {guideLang === "fa" ? (
            <div className="space-y-2 mt-2">
              <label className="block text-xs font-bold text-text">
                ویرایشگر راهنمای همکاری به زبان فارسی:
              </label>
              <TiptapEditor
                contentHtml={formData.guide?.tiptapBody?.fa?.html || ""}
                contentJson={
                  formData.guide?.tiptapBody?.fa?.json as
                    | Record<string, unknown>
                    | undefined
                }
                locale="fa"
                onChange={(json, html) => {
                  setFormData((prev) => ({
                    ...prev,
                    guide: {
                      title: prev.guide?.title || { fa: "", en: "" },
                      tiptapBody: {
                        ...prev.guide?.tiptapBody,
                        fa: { html, json },
                      },
                    },
                  }));
                }}
                placeholder="استانداردهای مهندسی، نحوه انتقال مالکیت سورس‌ها و جزئیات فرایند تحویل را بنویسید (برای دستورات سریع / را تایپ کنید)..."
              />
            </div>
          ) : (
            <div className="space-y-2 mt-2" dir="ltr">
              <label className="block text-xs font-bold text-text text-start">
                Delivery Standards in English:
              </label>
              <TiptapEditor
                contentHtml={formData.guide?.tiptapBody?.en?.html || ""}
                contentJson={
                  formData.guide?.tiptapBody?.en?.json as
                    | Record<string, unknown>
                    | undefined
                }
                locale="en"
                onChange={(json, html) => {
                  setFormData((prev) => ({
                    ...prev,
                    guide: {
                      title: prev.guide?.title || { fa: "", en: "" },
                      tiptapBody: {
                        ...prev.guide?.tiptapBody,
                        en: { html, json },
                      },
                    },
                  }));
                }}
                placeholder="Write delivery standards, code handoff procedures, and CI/CD expectations in English..."
              />
            </div>
          )}
        </div>
      )}

      {/* Form Bottom Actions */}
      <div className="flex items-center justify-between border-t border-line pt-6">
        <span className="text-xs text-muted">
          تغییرات پس از ذخیره مستقیماً در صفحه عمومی «فرایند همکاری» اعمال خواهند شد.
        </span>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-blue text-white px-6 py-2.5 text-xs font-bold shadow hover:bg-navy-2 transition-all disabled:opacity-50 inline-flex items-center gap-2"
        >
          {isSubmitting && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          <span>ذخیره تمام تغییرات</span>
        </button>
      </div>
    </form>
  );
}