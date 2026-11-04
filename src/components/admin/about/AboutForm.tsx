"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { TiptapEditor } from "@/components/admin/editor/TiptapEditor";
import { cn } from "@/lib/cn";
import type { AboutFormData } from "@/lib/validations/about";

interface AboutFormProps {
  initialData: AboutFormData;
}

export function AboutForm({ initialData }: AboutFormProps) {
  const [formData, setFormData] = useState<AboutFormData>(initialData);
  const [activeTab, setActiveTab] = useState<
    "intro" | "principles" | "brand" | "team" | "story"
  >("intro");
  const [storyLang, setStoryLang] = useState<"fa" | "en">("fa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "خطا در ذخیره‌سازی اطلاعات درباره ما.");
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
    { id: "intro", label: "۱. سربرگ و معرفی", icon: "📋" },
    {
      id: "principles",
      label: `۲. اصول ۴‌گانه برند (${formData.principles.length})`,
      icon: "💎",
    },
    { id: "brand", label: "۳. گره‌های هویتی و فرهنگ", icon: "🏛️" },
    {
      id: "team",
      label: `۴. اعضای تیم فنی (${formData.team.length})`,
      icon: "👥",
    },
    { id: "story", label: "۵. داستان برند و مانیفست (Tiptap)", icon: "✍️" },
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
            <span className="text-xs font-bold text-text">مدیریت درباره ما و اصول برند</span>
          </div>
          <h1 className="text-xl font-black text-text sm:text-2xl mt-1">
            تنظیمات صفحه «درباره ما»
          </h1>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            مدیریت اصول برند، معماری هویتی، تیم و روایت مانیفست سازمانی در قالب ادیتور پیشرفته
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/about"
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
            <span>ذخیره تغییرات درباره ما</span>
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

      {/* Navigation Tabs */}
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

      {/* Tab 1: Intro */}
      {activeTab === "intro" && (
        <div className="rounded-2xl border border-line bg-panel p-6 space-y-6">
          <h2 className="text-base font-black text-text">
            معرفی و متن سربرگ (Hero & Intro)
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                عنوان اصلی (فارسی) *
              </label>
              <input
                type="text"
                required
                value={formData.intro.title.fa}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    intro: {
                      ...prev.intro,
                      title: { ...prev.intro.title, fa: e.target.value },
                    },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text focus:border-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                Main Headline (English)
              </label>
              <input
                type="text"
                dir="ltr"
                value={formData.intro.title.en || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    intro: {
                      ...prev.intro,
                      title: { ...prev.intro.title, en: e.target.value },
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
                لید معرفی (فارسی) *
              </label>
              <textarea
                rows={4}
                required
                value={formData.intro.lead.fa}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    intro: {
                      ...prev.intro,
                      lead: { ...prev.intro.lead, fa: e.target.value },
                    },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                Intro Lead (English)
              </label>
              <textarea
                rows={4}
                dir="ltr"
                value={formData.intro.lead.en || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    intro: {
                      ...prev.intro,
                      lead: { ...prev.intro.lead, en: e.target.value },
                    },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Principles */}
      {activeTab === "principles" && (
        <div className="rounded-2xl border border-line bg-panel p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-text">
                اصول چهارگانه برند کارا پرداز اوند
              </h2>
              <p className="text-xs text-muted">
                این اصول در قالب نوار سورمه‌ای برند (Navy Band) به صورت افقی نمایش داده می‌شوند.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  principles: [
                    ...prev.principles,
                    {
                      id: `principle-${Date.now()}`,
                      title: { fa: "اصل جدید", en: "New principle" },
                      body: { fa: "شرح اصل جدید...", en: "Description..." },
                    },
                  ],
                }))
              }
              className="rounded-full border border-blue bg-blue/10 px-4 py-1.5 text-xs font-bold text-blue hover:bg-blue hover:text-white transition"
            >
              + افزودن اصل جدید
            </button>
          </div>

          <div className="space-y-4">
            {formData.principles.map((principle, index) => (
              <div
                key={principle.id || index}
                className="rounded-xl border border-line bg-bg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted">
                    اصل #{index + 1} ({principle.id})
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        principles: prev.principles.filter((_, i) => i !== index),
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
                      عنوان اصل (فارسی)
                    </label>
                    <input
                      type="text"
                      value={principle.title.fa}
                      onChange={(e) => {
                        const updated = [...formData.principles];
                        updated[index].title.fa = e.target.value;
                        setFormData((prev) => ({ ...prev, principles: updated }));
                      }}
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-text">
                      Principle Title (English)
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={principle.title.en || ""}
                      onChange={(e) => {
                        const updated = [...formData.principles];
                        updated[index].title.en = e.target.value;
                        setFormData((prev) => ({ ...prev, principles: updated }));
                      }}
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-text">
                      شرح اصل (فارسی)
                    </label>
                    <textarea
                      rows={2}
                      value={principle.body.fa}
                      onChange={(e) => {
                        const updated = [...formData.principles];
                        updated[index].body.fa = e.target.value;
                        setFormData((prev) => ({ ...prev, principles: updated }));
                      }}
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-text">
                      Principle Description (English)
                    </label>
                    <textarea
                      rows={2}
                      dir="ltr"
                      value={principle.body.en || ""}
                      onChange={(e) => {
                        const updated = [...formData.principles];
                        updated[index].body.en = e.target.value;
                        setFormData((prev) => ({ ...prev, principles: updated }));
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

      {/* Tab 3: Brand Nodes & Culture */}
      {activeTab === "brand" && (
        <div className="space-y-6">
          {/* Brand Architecture */}
          <div className="rounded-2xl border border-line bg-panel p-6 space-y-6">
            <div>
              <h2 className="text-base font-black text-text">
                معماری هویتی و رابطه برندها (Brand Diagram)
              </h2>
              <p className="text-xs text-muted">
                شرح وظایف و تمرکز استودیو Code1Sprint و کارا پرداز اوند در دیاگرام هویتی
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {formData.brandNodes.map((node, index) => (
                <div
                  key={node.id}
                  className="rounded-xl border border-line bg-bg p-4 space-y-3"
                >
                  <span className="text-xs font-black text-navy uppercase">
                    گره برند: {node.id}
                  </span>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-text">
                      نام نمایشی (فارسی)
                    </label>
                    <input
                      type="text"
                      value={node.name.fa}
                      onChange={(e) => {
                        const updated = [...formData.brandNodes];
                        updated[index].name.fa = e.target.value;
                        setFormData((prev) => ({ ...prev, brandNodes: updated }));
                      }}
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-text">
                      حوزه تمرکز (فارسی)
                    </label>
                    <textarea
                      rows={2}
                      value={node.focus.fa}
                      onChange={(e) => {
                        const updated = [...formData.brandNodes];
                        updated[index].focus.fa = e.target.value;
                        setFormData((prev) => ({ ...prev, brandNodes: updated }));
                      }}
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-text">
                      حوزه تمرکز (English)
                    </label>
                    <textarea
                      rows={2}
                      dir="ltr"
                      value={node.focus.en || ""}
                      onChange={(e) => {
                        const updated = [...formData.brandNodes];
                        updated[index].focus.en = e.target.value;
                        setFormData((prev) => ({ ...prev, brandNodes: updated }));
                      }}
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Culture Items */}
          <div className="rounded-2xl border border-line bg-panel p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-text">
                  فرهنگ مهندسی (Engineering Culture)
                </h2>
                <p className="text-xs text-muted">
                  تعهدات مهندسی شامل مالکیت سورس، مستندسازی و متدولوژی چابک
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    culture: [
                      ...prev.culture,
                      {
                        id: `culture-${Date.now()}`,
                        title: { fa: "مورد جدید", en: "New item" },
                        body: { fa: "توضیحات...", en: "Details..." },
                        needs_business_confirmation: true,
                      },
                    ],
                  }))
                }
                className="rounded-full border border-blue bg-blue/10 px-4 py-1.5 text-xs font-bold text-blue hover:bg-blue hover:text-white transition"
              >
                + افزودن فرهنگ مهندسی
              </button>
            </div>

            <div className="space-y-4">
              {formData.culture.map((item, index) => (
                <div
                  key={item.id || index}
                  className="rounded-xl border border-line bg-bg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted">
                      مورد #{index + 1} ({item.id})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          culture: prev.culture.filter((_, i) => i !== index),
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
                          const updated = [...formData.culture];
                          updated[index].title.fa = e.target.value;
                          setFormData((prev) => ({ ...prev, culture: updated }));
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
                          const updated = [...formData.culture];
                          updated[index].title.en = e.target.value;
                          setFormData((prev) => ({ ...prev, culture: updated }));
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
                          const updated = [...formData.culture];
                          updated[index].body.fa = e.target.value;
                          setFormData((prev) => ({ ...prev, culture: updated }));
                        }}
                        className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-text">
                        Details (English)
                      </label>
                      <textarea
                        rows={2}
                        dir="ltr"
                        value={item.body.en || ""}
                        onChange={(e) => {
                          const updated = [...formData.culture];
                          updated[index].body.en = e.target.value;
                          setFormData((prev) => ({ ...prev, culture: updated }));
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

      {/* Tab 4: Team */}
      {activeTab === "team" && (
        <div className="rounded-2xl border border-line bg-panel p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-text">
                اعضای تیم و رهبری فنی
              </h2>
              <p className="text-xs text-muted">
                طبق قوانین برند کارا پرداز اوند، تصاویر باید واقعی باشند. در صورت خالی بودن تیم، کل سکشن تیم در سایت مخفی می‌ماند.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  team: [
                    ...prev.team,
                    {
                      id: `member-${Date.now()}`,
                      name: { fa: "", en: "" },
                      role: { fa: "", en: "" },
                      photo: null,
                    },
                  ],
                }))
              }
              className="rounded-full border border-blue bg-blue/10 px-4 py-1.5 text-xs font-bold text-blue hover:bg-blue hover:text-white transition"
            >
              + افزودن عضو جدید
            </button>
          </div>

          {formData.team.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-bg p-8 text-center text-xs text-muted">
              هنوز عضوی برای تیم ثبت نشده است. (سکشن تیم به صورت خودکار در سایت عمومی مخفی است).
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {formData.team.map((member, index) => (
                <div
                  key={member.id || index}
                  className="rounded-xl border border-line bg-bg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted">
                      عضو #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          team: prev.team.filter((_, i) => i !== index),
                        }))
                      }
                      className="text-xs font-bold text-red-500 hover:text-red-700"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-text">
                        نام و نام خانوادگی (فارسی)
                      </label>
                      <input
                        type="text"
                        value={member.name.fa}
                        onChange={(e) => {
                          const updated = [...formData.team];
                          updated[index].name.fa = e.target.value;
                          setFormData((prev) => ({ ...prev, team: updated }));
                        }}
                        className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-text">
                        Full Name (English)
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={member.name.en || ""}
                        onChange={(e) => {
                          const updated = [...formData.team];
                          updated[index].name.en = e.target.value;
                          setFormData((prev) => ({ ...prev, team: updated }));
                        }}
                        className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-text">
                        سمت سازمانی (فارسی)
                      </label>
                      <input
                        type="text"
                        value={member.role.fa}
                        onChange={(e) => {
                          const updated = [...formData.team];
                          updated[index].role.fa = e.target.value;
                          setFormData((prev) => ({ ...prev, team: updated }));
                        }}
                        className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-text">
                        Role (English)
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={member.role.en || ""}
                        onChange={(e) => {
                          const updated = [...formData.team];
                          updated[index].role.en = e.target.value;
                          setFormData((prev) => ({ ...prev, team: updated }));
                        }}
                        className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-text">
                      آدرس عکس واقعی (URL یا مسیر فایل)
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={member.photo || ""}
                      placeholder="/team/name.jpg"
                      onChange={(e) => {
                        const updated = [...formData.team];
                        updated[index].photo = e.target.value || null;
                        setFormData((prev) => ({ ...prev, team: updated }));
                      }}
                      className="w-full rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-text font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Story with Tiptap */}
      {activeTab === "story" && (
        <div className="rounded-2xl border border-line bg-panel p-6 space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-black text-text">
                داستان برند و مانیفست فنی کارا پرداز اوند
              </h2>
              <p className="text-xs text-muted">
                روایت عمیق سازمانی با امکان درج کادرهای تو در تو، کد بلاک، تصاویر/ویدیوها با چیدمان و دکمه CTA
              </p>
            </div>

            {/* Language toggle for Tiptap */}
            <div className="flex items-center gap-1 rounded-xl border border-line bg-bg p-1">
              <button
                type="button"
                onClick={() => setStoryLang("fa")}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-black transition",
                  storyLang === "fa"
                    ? "bg-navy text-white shadow-sm"
                    : "text-muted hover:text-text",
                )}
              >
                محتوای فارسی
              </button>
              <button
                type="button"
                onClick={() => setStoryLang("en")}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-black transition",
                  storyLang === "en"
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
                عنوان بخش داستان (فارسی)
              </label>
              <input
                type="text"
                value={formData.story.title.fa}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    story: {
                      ...prev.story,
                      title: { ...prev.story.title, fa: e.target.value },
                    },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text focus:border-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold text-text">
                Story Title (English)
              </label>
              <input
                type="text"
                dir="ltr"
                value={formData.story.title.en || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    story: {
                      ...prev.story,
                      title: { ...prev.story.title, en: e.target.value },
                    },
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text focus:border-blue focus:outline-none"
              />
            </div>
          </div>

          {/* Tiptap Editor */}
          {storyLang === "fa" ? (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-text">
                ویرایشگر متن داستان به زبان فارسی:
              </label>
              <TiptapEditor
                contentHtml={formData.story.tiptapBody?.fa?.html || ""}
                contentJson={
                  formData.story.tiptapBody?.fa?.json as
                    | Record<string, unknown>
                    | undefined
                }
                locale="fa"
                onChange={(json, html) => {
                  setFormData((prev) => ({
                    ...prev,
                    story: {
                      ...prev.story,
                      tiptapBody: {
                        ...prev.story.tiptapBody,
                        fa: { html, json },
                      },
                    },
                  }));
                }}
                placeholder="داستان شرکت، دلایل شکل‌گیری و مانیفست فنی را با جزئیات بنویسید..."
              />
            </div>
          ) : (
            <div className="space-y-2" dir="ltr">
              <label className="block text-xs font-bold text-text text-start">
                Story Narrative in English:
              </label>
              <TiptapEditor
                contentHtml={formData.story.tiptapBody?.en?.html || ""}
                contentJson={
                  formData.story.tiptapBody?.en?.json as
                    | Record<string, unknown>
                    | undefined
                }
                locale="en"
                onChange={(json, html) => {
                  setFormData((prev) => ({
                    ...prev,
                    story: {
                      ...prev.story,
                      tiptapBody: {
                        ...prev.story.tiptapBody,
                        en: { html, json },
                      },
                    },
                  }));
                }}
                placeholder="Write company story, background, and engineering manifesto in English..."
              />
            </div>
          )}
        </div>
      )}

      {/* Form Bottom Actions */}
      <div className="flex items-center justify-between border-t border-line pt-6">
        <span className="text-xs text-muted">
          تغییرات پس از ذخیره مستقیماً در صفحه عمومی «درباره ما» اعمال خواهند شد.
        </span>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-blue text-white px-6 py-2.5 text-xs font-bold shadow hover:bg-navy-2 transition-all disabled:opacity-50 inline-flex items-center gap-2"
        >
          {isSubmitting && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          <span>ذخیره تغییرات درباره ما</span>
        </button>
      </div>
    </form>
  );
}
