"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import type { SiteSettingsFormData } from "@/lib/validations/site-settings";

interface HomeSettingsFormProps {
  initialData: SiteSettingsFormData;
}

export function HomeSettingsForm({ initialData }: HomeSettingsFormProps) {
  const [formData, setFormData] = useState<SiteSettingsFormData>(initialData);
  const [activeTab, setActiveTab] = useState<
    "hero" | "why" | "stats" | "contact" | "seo"
  >("hero");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "خطا در ذخیره‌سازی تنظیمات صفحه اصلی.");
      }

      setSuccessMessage(data.message || "تنظیمات با موفقیت ذخیره شد.");
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
            <span className="text-xs font-bold text-text">صفحه اصلی و تنظیمات هویت</span>
          </div>
          <h1 className="mt-2 text-2xl font-black text-text">
            مدیریت صفحه اصلی و تنظیمات هویت برند
          </h1>
          <p className="mt-1 text-xs text-muted">
            مدیریت هیرو، تیترهای گرادیانی، ارزش‌های پیشنهادی، آمار و شواهد عملکرد، راه‌های تماس و سئو
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="rounded-full border border-line bg-panel px-4 py-2 text-xs font-bold text-text transition hover:border-blue"
          >
            مشاهده صفحه اصلی زنده
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
              <span>ذخیره تنظیمات</span>
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
          ۱. سربرگ هیرو و تیتر اصلی
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("why")}
          className={cn(
            "rounded-xl px-4 py-2 text-xs font-black transition",
            activeTab === "why"
              ? "bg-navy text-white shadow-sm"
              : "bg-panel text-muted hover:bg-bg hover:text-text",
          )}
        >
          ۲. چرا کارا پرداز اوند؟ ({formData.whyStatements.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("stats")}
          className={cn(
            "rounded-xl px-4 py-2 text-xs font-black transition",
            activeTab === "stats"
              ? "bg-navy text-white shadow-sm"
              : "bg-panel text-muted hover:bg-bg hover:text-text",
          )}
        >
          ۳. آمار و شواهد عملکرد ({formData.stats.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          className={cn(
            "rounded-xl px-4 py-2 text-xs font-black transition",
            activeTab === "contact"
              ? "bg-navy text-white shadow-sm"
              : "bg-panel text-muted hover:bg-bg hover:text-text",
          )}
        >
          ۴. اطلاعات تماس و شبکه‌ها
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("seo")}
          className={cn(
            "rounded-xl px-4 py-2 text-xs font-black transition",
            activeTab === "seo"
              ? "bg-navy text-white shadow-sm"
              : "bg-panel text-muted hover:bg-bg hover:text-text",
          )}
        >
          ۵. سئو و هویت کلان
        </button>
      </div>

      {/* Tab 1: Hero */}
      {activeTab === "hero" && (
        <div className="rounded-2xl border border-line bg-panel p-6 space-y-6">
          <h2 className="text-base font-black text-text">
            سربرگ صفحه اصلی (Hero Section)
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                بج بالای تیتر / Pill (فارسی)
              </label>
              <input
                type="text"
                value={formData.hero.pill.fa}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      pill: { ...prev.hero.pill, fa: e.target.value },
                    },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text focus:border-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                Hero Pill (English)
              </label>
              <input
                type="text"
                dir="ltr"
                value={formData.hero.pill.en || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      pill: { ...prev.hero.pill, en: e.target.value },
                    },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text focus:border-blue focus:outline-none"
              />
            </div>
          </div>

          {/* Three-part Title */}
          <div className="rounded-xl border border-line bg-bg p-4 space-y-4">
            <h3 className="text-xs font-black text-text">
              تیتر سه‌بخشی هیرو با عبارت گرادیان برند
            </h3>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-text">
                  بخش اول (فارسی)
                </label>
                <input
                  type="text"
                  value={formData.hero.titleBefore.fa}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        titleBefore: {
                          ...prev.hero.titleBefore,
                          fa: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-blue">
                  عبارت گرادیان برند (فارسی) *
                </label>
                <input
                  type="text"
                  value={formData.hero.titleGradient.fa}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        titleGradient: {
                          ...prev.hero.titleGradient,
                          fa: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-blue bg-panel px-3 py-1.5 text-xs font-bold text-blue"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-text">
                  بخش پایانی (فارسی)
                </label>
                <input
                  type="text"
                  value={formData.hero.titleAfter.fa}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        titleAfter: {
                          ...prev.hero.titleAfter,
                          fa: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-text">
                  Title Before (English)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={formData.hero.titleBefore.en || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        titleBefore: {
                          ...prev.hero.titleBefore,
                          en: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-blue">
                  Title Gradient (English)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={formData.hero.titleGradient.en || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        titleGradient: {
                          ...prev.hero.titleGradient,
                          en: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-blue bg-panel px-3 py-1.5 text-xs font-bold text-blue"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-text">
                  Title After (English)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={formData.hero.titleAfter.en || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        titleAfter: {
                          ...prev.hero.titleAfter,
                          en: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                />
              </div>
            </div>
          </div>

          {/* Lead */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                لید پاراگراف معرفی هیرو (فارسی)
              </label>
              <textarea
                rows={3}
                value={formData.hero.lead.fa}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      lead: { ...prev.hero.lead, fa: e.target.value },
                    },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                Hero Lead Paragraph (English)
              </label>
              <textarea
                rows={3}
                dir="ltr"
                value={formData.hero.lead.en || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      lead: { ...prev.hero.lead, en: e.target.value },
                    },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none"
              />
            </div>
          </div>

          {/* CTAs */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-bg p-4 space-y-3">
              <span className="text-xs font-black text-text">
                دکمه فراخوان اصلی (Primary CTA)
              </span>
              <div>
                <label className="mb-1 block text-xs text-muted">
                  متن دکمه (فارسی)
                </label>
                <input
                  type="text"
                  value={formData.hero.ctaPrimary.label.fa}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        ctaPrimary: {
                          ...prev.hero.ctaPrimary,
                          label: {
                            ...prev.hero.ctaPrimary.label,
                            fa: e.target.value,
                          },
                        },
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted">
                  لینک مقصد
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={formData.hero.ctaPrimary.href}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        ctaPrimary: {
                          ...prev.hero.ctaPrimary,
                          href: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs font-mono text-text"
                />
              </div>
            </div>

            <div className="rounded-xl border border-line bg-bg p-4 space-y-3">
              <span className="text-xs font-black text-text">
                دکمه فراخوان ثانویه (Secondary CTA)
              </span>
              <div>
                <label className="mb-1 block text-xs text-muted">
                  متن دکمه (فارسی)
                </label>
                <input
                  type="text"
                  value={formData.hero.ctaSecondary.label.fa}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        ctaSecondary: {
                          ...prev.hero.ctaSecondary,
                          label: {
                            ...prev.hero.ctaSecondary.label,
                            fa: e.target.value,
                          },
                        },
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted">
                  لینک مقصد
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={formData.hero.ctaSecondary.href}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        ctaSecondary: {
                          ...prev.hero.ctaSecondary,
                          href: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs font-mono text-text"
                />
              </div>
            </div>
          </div>

          {/* Tech Marquee */}
          <div>
            <label className="mb-2 block text-xs font-bold text-text">
              تکنولوژی‌های نوار متحرک هیرو (با کاما جدا کنید)
            </label>
            <input
              type="text"
              dir="ltr"
              value={formData.hero.techMarquee.join(", ")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    techMarquee: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  },
                }))
              }
              className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs font-mono text-text focus:border-blue focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Why Us */}
      {activeTab === "why" && (
        <div className="rounded-2xl border border-line bg-panel p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-text">
                ارزش‌های پیشنهادی (Why Us Statements)
              </h2>
              <p className="text-xs text-muted">
                کارت‌های سه‌گانه نوار سورمه‌ای صفحه اصلی
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  whyStatements: [
                    ...prev.whyStatements,
                    {
                      id: `why-${Date.now()}`,
                      title: { fa: "ارزش جدید", en: "New Value" },
                      body: { fa: "توضیحات ارزش...", en: "Description..." },
                    },
                  ],
                }))
              }
              className="rounded-full border border-blue bg-blue/10 px-4 py-1.5 text-xs font-bold text-blue hover:bg-blue hover:text-white transition"
            >
              + افزودن کارت ارزش
            </button>
          </div>

          <div className="space-y-4">
            {formData.whyStatements.map((item, index) => (
              <div
                key={item.id || index}
                className="rounded-xl border border-line bg-bg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted">
                    کارت #{index + 1} ({item.id})
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        whyStatements: prev.whyStatements.filter(
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
                      عنوان (فارسی)
                    </label>
                    <input
                      type="text"
                      value={item.title.fa}
                      onChange={(e) => {
                        const updated = [...formData.whyStatements];
                        updated[index].title.fa = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          whyStatements: updated,
                        }));
                      }}
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-text">
                      Title (English)
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={item.title.en || ""}
                      onChange={(e) => {
                        const updated = [...formData.whyStatements];
                        updated[index].title.en = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          whyStatements: updated,
                        }));
                      }}
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-text">
                      توضیحات (فارسی)
                    </label>
                    <textarea
                      rows={2}
                      value={item.body.fa}
                      onChange={(e) => {
                        const updated = [...formData.whyStatements];
                        updated[index].body.fa = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          whyStatements: updated,
                        }));
                      }}
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-text">
                      Description (English)
                    </label>
                    <textarea
                      rows={2}
                      dir="ltr"
                      value={item.body.en || ""}
                      onChange={(e) => {
                        const updated = [...formData.whyStatements];
                        updated[index].body.en = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          whyStatements: updated,
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
      )}

      {/* Tab 3: Stats */}
      {activeTab === "stats" && (
        <div className="rounded-2xl border border-line bg-panel p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-text">
                آمار و شواهد عملکرد (Trust Strip)
              </h2>
              <p className="text-xs text-muted">
                طبق قوانین برند، تنها آمارهایی در سایت نمایش داده می‌شوند که دارای مقدار واقعی و سند باشند.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  stats: [
                    ...prev.stats,
                    {
                      id: `stat-${Date.now()}`,
                      value: "",
                      label: { fa: "شاخص جدید", en: "New metric" },
                      source: "",
                    },
                  ],
                }))
              }
              className="rounded-full border border-blue bg-blue/10 px-4 py-1.5 text-xs font-bold text-blue hover:bg-blue hover:text-white transition"
            >
              + افزودن آمار
            </button>
          </div>

          <div className="space-y-4">
            {formData.stats.map((stat, index) => (
              <div
                key={stat.id || index}
                className="rounded-xl border border-line bg-bg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted">
                    شاخص #{index + 1} ({stat.id})
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        stats: prev.stats.filter((_, i) => i !== index),
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
                      مقدار عددی / آماری (خالی بگذارید تا مخفی بماند)
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={stat.value || ""}
                      placeholder="e.g. +۱۵ یا ۱۰۰٪"
                      onChange={(e) => {
                        const updated = [...formData.stats];
                        updated[index].value = e.target.value;
                        setFormData((prev) => ({ ...prev, stats: updated }));
                      }}
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs font-mono text-text"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-text">
                      منبع و سند آماری (Source)
                    </label>
                    <input
                      type="text"
                      value={stat.source || ""}
                      placeholder="سند قرارداد، گزارش مالی یا لینک تایید"
                      onChange={(e) => {
                        const updated = [...formData.stats];
                        updated[index].source = e.target.value;
                        setFormData((prev) => ({ ...prev, stats: updated }));
                      }}
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-text">
                      برچسب شاخص (فارسی)
                    </label>
                    <input
                      type="text"
                      value={stat.label.fa}
                      onChange={(e) => {
                        const updated = [...formData.stats];
                        updated[index].label.fa = e.target.value;
                        setFormData((prev) => ({ ...prev, stats: updated }));
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
                      value={stat.label.en || ""}
                      onChange={(e) => {
                        const updated = [...formData.stats];
                        updated[index].label.en = e.target.value;
                        setFormData((prev) => ({ ...prev, stats: updated }));
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

      {/* Tab 4: Contact */}
      {activeTab === "contact" && (
        <div className="rounded-2xl border border-line bg-panel p-6 space-y-6">
          <h2 className="text-base font-black text-text">
            اطلاعات تماس و کانال‌های ارتباطی
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                تلفن تماس مستقیم
              </label>
              <input
                type="text"
                dir="ltr"
                value={formData.contact.phone || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, phone: e.target.value },
                  }))
                }
                placeholder="۰۲۱-۸۸۸۸۸۸۸۸"
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs font-mono text-text focus:border-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                ایمیل رسمی
              </label>
              <input
                type="email"
                dir="ltr"
                value={formData.contact.email || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, email: e.target.value },
                  }))
                }
                placeholder="info@karapardaz.com"
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs font-mono text-text focus:border-blue focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                آدرس پستی (فارسی)
              </label>
              <textarea
                rows={2}
                value={formData.contact.address?.fa || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact: {
                      ...prev.contact,
                      address: {
                        fa: e.target.value,
                        en: prev.contact.address?.en || "",
                      },
                    },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                ساعات کاری (فارسی)
              </label>
              <textarea
                rows={2}
                value={formData.contact.workingHours?.fa || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact: {
                      ...prev.contact,
                      workingHours: {
                        fa: e.target.value,
                        en: prev.contact.workingHours?.en || "",
                      },
                    },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none"
              />
            </div>
          </div>

          {/* Socials */}
          <div className="rounded-xl border border-line bg-bg p-4 space-y-3">
            <span className="text-xs font-black text-text">
              شبکه‌های اجتماعی و کانال‌های فنی
            </span>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-muted">
                  لینکدین (LinkedIn URL)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={formData.contact.socials?.linkedin || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        socials: {
                          ...prev.contact.socials,
                          linkedin: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs font-mono text-text"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-muted">
                  گیت‌هاب (GitHub URL)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={formData.contact.socials?.github || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        socials: {
                          ...prev.contact.socials,
                          github: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs font-mono text-text"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-muted">
                  تلگرام (Telegram URL)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={formData.contact.socials?.telegram || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        socials: {
                          ...prev.contact.socials,
                          telegram: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs font-mono text-text"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-muted">
                  اینستاگرام (Instagram URL)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={formData.contact.socials?.instagram || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        socials: {
                          ...prev.contact.socials,
                          instagram: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs font-mono text-text"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: SEO */}
      {activeTab === "seo" && (
        <div className="rounded-2xl border border-line bg-panel p-6 space-y-6">
          <h2 className="text-base font-black text-text">
            سئو و هویت کلان سایت (SEO & Metadata)
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                نام اصلی برند و سایت (فارسی) *
              </label>
              <input
                type="text"
                required
                value={formData.seo.siteName.fa}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo: {
                      ...prev.seo,
                      siteName: { ...prev.seo.siteName, fa: e.target.value },
                    },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text focus:border-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                Site Name (English)
              </label>
              <input
                type="text"
                dir="ltr"
                value={formData.seo.siteName.en || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo: {
                      ...prev.seo,
                      siteName: { ...prev.seo.siteName, en: e.target.value },
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
                تایتل اختصاصی صفحه اصلی (فارسی) *
              </label>
              <input
                type="text"
                required
                value={formData.seo.homeTitle.fa}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo: {
                      ...prev.seo,
                      homeTitle: { ...prev.seo.homeTitle, fa: e.target.value },
                    },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text focus:border-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                Home Meta Title (English)
              </label>
              <input
                type="text"
                dir="ltr"
                value={formData.seo.homeTitle.en || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo: {
                      ...prev.seo,
                      homeTitle: { ...prev.seo.homeTitle, en: e.target.value },
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
                متادیسکریپشن صفحه اصلی (فارسی) *
              </label>
              <textarea
                rows={3}
                required
                value={formData.seo.homeDescription.fa}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo: {
                      ...prev.seo,
                      homeDescription: {
                        ...prev.seo.homeDescription,
                        fa: e.target.value,
                      },
                    },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                Home Meta Description (English)
              </label>
              <textarea
                rows={3}
                dir="ltr"
                value={formData.seo.homeDescription.en || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo: {
                      ...prev.seo,
                      homeDescription: {
                        ...prev.seo.homeDescription,
                        en: e.target.value,
                      },
                    },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                توضیحات عکس اشتراک‌گذاری (OG Image Alt - فارسی)
              </label>
              <input
                type="text"
                value={formData.seo.ogImageAlt.fa}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo: {
                      ...prev.seo,
                      ogImageAlt: {
                        ...prev.seo.ogImageAlt,
                        fa: e.target.value,
                      },
                    },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text focus:border-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                OG Image Alt (English)
              </label>
              <input
                type="text"
                dir="ltr"
                value={formData.seo.ogImageAlt.en || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo: {
                      ...prev.seo,
                      ogImageAlt: {
                        ...prev.seo.ogImageAlt,
                        en: e.target.value,
                      },
                    },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text focus:border-blue focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Bar */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-line bg-panel/90 p-4 shadow-lg backdrop-blur-md">
        <span className="text-xs font-bold text-muted">
          تغییرات بلافاصله پس از ذخیره روی سربرگ، متادیتا و بخش‌های صفحه اصلی اعمال می‌شود.
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
            <span>ذخیره تغییرات صفحه اصلی</span>
          )}
        </button>
      </div>
    </form>
  );
}
