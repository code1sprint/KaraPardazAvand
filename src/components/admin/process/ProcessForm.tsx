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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-xs font-bold text-muted hover:text-blue transition"
            >
              پیشخوان
            </Link>
            <span className="text-xs text-muted">/</span>
            <span className="text-xs font-bold text-text">مدیریت فرایند همکاری</span>
          </div>
          <h1 className="mt-2 text-2xl font-black text-text">
            تنظیمات صفحه «فرایند همکاری»
          </h1>
          <p className="mt-1 text-xs text-muted">
            مدیریت گام‌های متدولوژی مهندسی، خروجی‌های ملموس، الگوهای تعامل و راهنمای تفصیلی تحویل در ادیتور پیشرفته
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/process"
            target="_blank"
            className="rounded-full border border-line bg-panel px-4 py-2 text-xs font-bold text-text transition hover:border-blue"
          >
            مشاهده صفحه زنده
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-full bg-blue px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-sky disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>در حال ذخیره...</span>
              </>
            ) : (
              <span>ذخیره تغییرات فرایند</span>
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-bold text-red-600">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="rounded-2xl border border-ok/20 bg-ok/10 p-4 text-xs font-bold text-ok">
          {successMessage}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-line pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={cn(
            "rounded-xl px-4 py-2 text-xs font-black transition",
            activeTab === "hero"
              ? "bg-navy text-white shadow-sm"
              : "bg-panel text-muted hover:bg-bg hover:text-text",
          )}
        >
          ۱. سربرگ و تیتر اصلی
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("steps")}
          className={cn(
            "rounded-xl px-4 py-2 text-xs font-black transition",
            activeTab === "steps"
              ? "bg-navy text-white shadow-sm"
              : "bg-panel text-muted hover:bg-bg hover:text-text",
          )}
        >
          ۲. گام‌های متدولوژی ({formData.steps.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("engagement")}
          className={cn(
            "rounded-xl px-4 py-2 text-xs font-black transition",
            activeTab === "engagement"
              ? "bg-navy text-white shadow-sm"
              : "bg-panel text-muted hover:bg-bg hover:text-text",
          )}
        >
          ۳. مدل‌های همکاری و تعهدات ارتباطی
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("guide")}
          className={cn(
            "rounded-xl px-4 py-2 text-xs font-black transition",
            activeTab === "guide"
              ? "bg-navy text-white shadow-sm"
              : "bg-panel text-muted hover:bg-bg hover:text-text",
          )}
        >
          ۴. راهنمای تفصیلی تحویل (Tiptap)
        </button>
      </div>

      {/* Tab 1: Hero */}
      {activeTab === "hero" && (
        <div className="rounded-2xl border border-line bg-panel p-6 space-y-6">
          <h2 className="text-base font-black text-text">
            سربرگ صفحه فرایند همکاری (Process Hero)
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-bold text-text">
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
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text focus:border-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-text">
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
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text font-bold text-blue focus:border-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-text">
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
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text focus:border-blue focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                لید معرفی (فارسی)
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
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                Hero Lead (English)
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
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Steps */}
      {activeTab === "steps" && (
        <div className="rounded-2xl border border-line bg-panel p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-text">
                گام‌های متدولوژی مهندسی (Process Steps Track)
              </h2>
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
                      title: { fa: `گام ${prev.steps.length + 1}`, en: `Step ${prev.steps.length + 1}` },
                      purpose: { fa: "هدف این مرحله...", en: "Purpose..." },
                      deliverables: [{ fa: "خروجی اول", en: "First deliverable" }],
                      clientInvolvement: { fa: "نقش و مشارکت کارفرما...", en: "Client involvement..." },
                      duration: null,
                    },
                  ],
                }))
              }
              className="rounded-full border border-blue bg-blue/10 px-4 py-1.5 text-xs font-bold text-blue hover:bg-blue hover:text-white transition"
            >
              + افزودن گام متدولوژی
            </button>
          </div>

          <div className="space-y-6">
            {formData.steps.map((step, index) => (
              <div
                key={step.id || index}
                className="rounded-xl border border-line bg-bg p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                      {step.number}
                    </span>
                    <span className="text-xs font-black text-text">
                      گام: {step.title.fa} ({step.id})
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
                    className="text-xs font-bold text-red-500 hover:text-red-700"
                  >
                    حذف گام
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-text">
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
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-text">
                      عنوان گام (فارسی)
                    </label>
                    <input
                      type="text"
                      value={step.title.fa}
                      onChange={(e) => {
                        const updated = [...formData.steps];
                        updated[index].title.fa = e.target.value;
                        setFormData((prev) => ({ ...prev, steps: updated }));
                      }}
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-text">
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
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-text">
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
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-text">
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
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                    />
                  </div>
                </div>

                {/* Deliverables */}
                <div className="rounded-xl border border-line/60 bg-panel/50 p-3 space-y-2">
                  <div className="flex items-center justify-between">
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
                      className="text-xs font-bold text-blue hover:underline"
                    >
                      + افزودن خروجی
                    </button>
                  </div>

                  {step.deliverables.map((del, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={del.fa}
                        placeholder="خروجی به فارسی..."
                        onChange={(e) => {
                          const updated = [...formData.steps];
                          updated[index].deliverables[dIdx].fa = e.target.value;
                          setFormData((prev) => ({ ...prev, steps: updated }));
                        }}
                        className="flex-1 rounded-lg border border-line bg-bg px-3 py-1 text-xs text-text"
                      />
                      <input
                        type="text"
                        dir="ltr"
                        value={del.en || ""}
                        placeholder="Deliverable in English..."
                        onChange={(e) => {
                          const updated = [...formData.steps];
                          updated[index].deliverables[dIdx].en = e.target.value;
                          setFormData((prev) => ({ ...prev, steps: updated }));
                        }}
                        className="flex-1 rounded-lg border border-line bg-bg px-3 py-1 text-xs text-text"
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
                        className="text-xs font-bold text-red-500 hover:text-red-700 px-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-text">
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
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-text">
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
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
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
          <div className="rounded-2xl border border-line bg-panel p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-text">
                  الگوهای همکاری تجاری (Engagement Models)
                </h2>
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
                        description: { fa: "توضیحات مدل...", en: "Description..." },
                        needs_business_confirmation: true,
                      },
                    ],
                  }))
                }
                className="rounded-full border border-blue bg-blue/10 px-4 py-1.5 text-xs font-bold text-blue hover:bg-blue hover:text-white transition"
              >
                + افزودن مدل همکاری
              </button>
            </div>

            <div className="space-y-4">
              {formData.engagementModels.map((model, index) => (
                <div
                  key={model.id || index}
                  className="rounded-xl border border-line bg-bg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted">
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
                      className="text-xs font-bold text-red-500 hover:text-red-700"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-text">
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
                        className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-text">
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
                        className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-text">
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
                        className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-text">
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
                        className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Communication Rows */}
          <div className="rounded-2xl border border-line bg-panel p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-text">
                  ردیف‌های تعامل و کانال‌های ارتباطی (Communication SLAs)
                </h2>
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
                className="rounded-full border border-blue bg-blue/10 px-4 py-1.5 text-xs font-bold text-blue hover:bg-blue hover:text-white transition"
              >
                + افزودن کانال ارتباطی
              </button>
            </div>

            <div className="space-y-4">
              {formData.communicationRows.map((row, index) => (
                <div
                  key={row.id || index}
                  className="rounded-xl border border-line bg-bg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted">
                      مورد #{index + 1} ({row.id})
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
                      className="text-xs font-bold text-red-500 hover:text-red-700"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-text">
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
                        className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-text">
                        Label (English)
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
                        className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-text">
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
                        className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-text">
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
                        className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
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
        <div className="rounded-2xl border border-line bg-panel p-6 space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-black text-text">
                راهنمای تفصیلی تعامل و استانداردهای تحویل (Tiptap Guide)
              </h2>
              <p className="text-xs text-muted">
                نگارش شفاف استانداردهای کدنویسی، مالکیت سورس‌ها و متدولوژی پیاده‌سازی
              </p>
            </div>

            {/* Language toggle for Tiptap */}
            <div className="flex items-center gap-1 rounded-xl border border-line bg-bg p-1">
              <button
                type="button"
                onClick={() => setGuideLang("fa")}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-black transition",
                  guideLang === "fa"
                    ? "bg-navy text-white shadow-sm"
                    : "text-muted hover:text-text",
                )}
              >
                محتوای فارسی
              </button>
              <button
                type="button"
                onClick={() => setGuideLang("en")}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-black transition",
                  guideLang === "en"
                    ? "bg-navy text-white shadow-sm"
                    : "text-muted hover:text-text",
                )}
              >
                English Content
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold text-text">
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
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text focus:border-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold text-text">
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
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text focus:border-blue focus:outline-none"
              />
            </div>
          </div>

          {/* Tiptap Editor */}
          {guideLang === "fa" ? (
            <div className="space-y-2">
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
                placeholder="استانداردهای مهندسی، نحوه انتقال مالکیت سورس‌ها و جزئیات فرایند تحویل را بنویسید..."
              />
            </div>
          ) : (
            <div className="space-y-2" dir="ltr">
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

      {/* Floating Save Bar on Bottom */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-line bg-panel/90 p-4 shadow-lg backdrop-blur-md">
        <span className="text-xs font-bold text-muted">
          تغییرات پس از ذخیره مستقیماً در صفحه عمومی اعمال می‌شوند.
        </span>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-blue px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-sky disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>در حال ذخیره...</span>
            </>
          ) : (
            <span>ذخیره تغییرات فرایند همکاری</span>
          )}
        </button>
      </div>
    </form>
  );
}
