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

  const tabs = [
    { id: "hero", label: "۱. مشخصات و سربرگ", icon: "📋" },
    { id: "steps", label: `۲. گام‌های متدولوژی مهندسی (${formData.steps.length})`, icon: "🛤️" },
    { id: "engagement", label: "۳. مدل‌های همکاری و ارتباطات", icon: "🤝" },
    { id: "guide", label: "۴. راهنمای تفصیلی تحویل (Tiptap)", icon: "✍️" },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header Bar */}
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
            <span className="text-xs font-bold text-text">مدیریت فرایند همکاری و متدولوژی</span>
          </div>
          <h1 className="text-xl font-black text-text sm:text-2xl mt-1">
            تنظیمات صفحه «فرایند همکاری»
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
            <span>ذخیره تغییرات فرایند همکاری</span>
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

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-xl px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2",
              activeTab === tab.id
                ? "bg-navy text-white shadow-sm"
                : "bg-panel text-muted hover:bg-bg hover:text-text border border-line/60",
            )}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Hero */}
      {activeTab === "hero" && (
        <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-text flex items-center gap-2">
              <span>📋</span>
              <span>سربرگ و تیتر صفحه فرایند همکاری</span>
            </h2>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              متن عنوان اصلی به صورت ۳ بخشی طراحی شده که بخش میانی با افکت گرادیان امضای برند نمایش داده می‌شود.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold text-text mb-2">
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
                placeholder="فرایند همکاری؛ از تحلیل نیاز تا "
                className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text mb-2">
                بخش میانی (گرادیان برند) *
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
                placeholder="تحویل پایدار"
                className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text font-bold text-blue focus:border-blue focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text mb-2">
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
                placeholder=" نرم‌افزار"
                className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-text mb-2">
                لید معرفی فرایند (فارسی) *
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
                className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text mb-2">
                Process Lead (English)
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
                className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Steps */}
      {activeTab === "steps" && (
        <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-text flex items-center gap-2">
                <span>🛤️</span>
                <span>گام‌های متدولوژی مهندسی (Process Steps Track)</span>
              </h2>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                هر گام در قالب ترک عمودی تعاملی نمایش داده می‌شود و شامل هدف شفاف، خروجی‌های ملموس و نقش کارفرما است.
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
                      title: { fa: `گام جدید`, en: `New Step` },
                      purpose: { fa: "هدف این مرحله...", en: "Purpose..." },
                      deliverables: [{ fa: "خروجی اول", en: "First deliverable" }],
                      clientInvolvement: { fa: "نقش و مشارکت کارفرما...", en: "Client involvement..." },
                      duration: null,
                    },
                  ],
                }))
              }
              className="rounded-xl border border-blue bg-blue/10 px-4 py-2 text-xs font-bold text-blue hover:bg-blue hover:text-white transition-all shadow-sm"
            >
              + افزودن گام جدید
            </button>
          </div>

          <div className="space-y-6">
            {formData.steps.map((step, index) => (
              <div
                key={step.id || index}
                className="rounded-xl border border-line bg-bg p-5 space-y-5 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-xs font-black text-white">
                      {step.number}
                    </span>
                    <span className="text-sm font-bold text-text">
                      گام #{step.number}: {step.title.fa}
                    </span>
                    <span className="text-[11px] font-mono text-muted">
                      ({step.id})
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
                    className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                  >
                    حذف این گام
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
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
                      className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
                    />
                  </div>
                  <div>
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
                      className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">
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
                      className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">
                      هدف مرحله (فارسی) *
                    </label>
                    <textarea
                      rows={2}
                      value={step.purpose.fa}
                      onChange={(e) => {
                        const updated = [...formData.steps];
                        updated[index].purpose.fa = e.target.value;
                        setFormData((prev) => ({ ...prev, steps: updated }));
                      }}
                      className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">
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
                      className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
                    />
                  </div>
                </div>

                {/* Deliverables section inside card */}
                <div className="rounded-xl border border-line/80 bg-panel p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-text">
                        خروجی‌های ملموس این گام (Deliverables)
                      </span>
                      <p className="text-[11px] text-muted">
                        آیتم‌های مشخصی که در پایان این مرحله به کارفرما تحویل داده می‌شود.
                      </p>
                    </div>
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
                      className="text-xs font-bold text-blue hover:text-navy-2 transition-colors"
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
                          placeholder="عنوان خروجی (فارسی)..."
                          onChange={(e) => {
                            const updated = [...formData.steps];
                            updated[index].deliverables[dIdx].fa = e.target.value;
                            setFormData((prev) => ({ ...prev, steps: updated }));
                          }}
                          className="flex-1 rounded-lg border border-line bg-bg px-3 py-1.5 text-xs text-text focus:border-blue focus:outline-none"
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
                          className="flex-1 rounded-lg border border-line bg-bg px-3 py-1.5 text-xs text-text focus:border-blue focus:outline-none"
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
                          className="h-8 w-8 flex items-center justify-center rounded-lg border border-line text-xs font-bold text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors"
                          title="حذف خروجی"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
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
                      className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">
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
                      className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
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
        <div className="space-y-8">
          {/* Engagement Models */}
          <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-text flex items-center gap-2">
                  <span>🤝</span>
                  <span>الگوهای همکاری تجاری (Engagement Models)</span>
                </h2>
                <p className="text-xs text-muted mt-1 leading-relaxed">
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
                className="rounded-xl border border-blue bg-blue/10 px-4 py-2 text-xs font-bold text-blue hover:bg-blue hover:text-white transition-all shadow-sm"
              >
                + افزودن مدل همکاری
              </button>
            </div>

            <div className="space-y-4">
              {formData.engagementModels.map((model, index) => (
                <div
                  key={model.id || index}
                  className="rounded-xl border border-line bg-bg p-5 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-line pb-2.5">
                    <span className="text-xs font-bold text-text">
                      مدل همکاری #{index + 1}: {model.title.fa}
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
                      className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                    >
                      حذف مدل
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
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
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">
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
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
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
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">
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
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Communication Rows */}
          <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-text flex items-center gap-2">
                  <span>📡</span>
                  <span>کانال‌ها و تعهدات ارتباطی (Communication SLAs)</span>
                </h2>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  شفاف‌سازی نحوه ارتباط، جلسات دمو، گزارش‌دهی دوره‌ای و ابزارهای مورد استفاده
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
                className="rounded-xl border border-blue bg-blue/10 px-4 py-2 text-xs font-bold text-blue hover:bg-blue hover:text-white transition-all shadow-sm"
              >
                + افزودن کانال ارتباطی
              </button>
            </div>

            <div className="space-y-4">
              {formData.communicationRows.map((row, index) => (
                <div
                  key={row.id || index}
                  className="rounded-xl border border-line bg-bg p-5 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-line pb-2.5">
                    <span className="text-xs font-bold text-text">
                      تعهد ارتباطی #{index + 1}: {row.label.fa}
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
                      className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
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
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">
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
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
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
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">
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
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
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
        <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-text flex items-center gap-2">
                <span>✍️</span>
                <span>راهنمای تفصیلی تعامل و استانداردهای تحویل (Tiptap Guide)</span>
              </h2>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                نگارش شفاف استانداردهای مهندسی، متدولوژی کدنویسی، پایپ‌لاین‌های CI/CD و انتقال مالکیت کامل سورس‌ها
              </p>
            </div>

            {/* Language toggle for Tiptap */}
            <div className="flex items-center gap-1 rounded-xl border border-line bg-bg p-1">
              <button
                type="button"
                onClick={() => setGuideLang("fa")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-bold transition",
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
                  "rounded-lg px-3 py-1.5 text-xs font-bold transition",
                  guideLang === "en"
                    ? "bg-navy text-white shadow-sm"
                    : "text-muted hover:text-text",
                )}
              >
                English Content
              </button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-text mb-2">
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
                className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text mb-2">
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
                className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none transition-colors"
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
          <span>ذخیره تغییرات فرایند همکاری</span>
        </button>
      </div>
    </form>
  );
}
