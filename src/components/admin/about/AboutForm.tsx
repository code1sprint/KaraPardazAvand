"use client";

import { useState, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { ApiButton } from "@/components/admin/api-drawer/ApiButton";
import { TiptapEditor } from "@/components/admin/editor/TiptapEditor";
import {
  IconFileText,
  IconDiamond,
  IconLandmark,
  IconUsers,
  IconPencil,
  IconAlertTriangle,
  IconCheckCircle,
  IconExternalLink,
  IconArrowRight,
} from "@/components/admin/editor/EditorIcons";
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

  const tabs: Array<{
    id: "intro" | "principles" | "brand" | "team" | "story";
    label: string;
    icon: ReactNode;
    badge?: string;
  }> = [
    { id: "intro", label: "۱. سربرگ و معرفی", icon: <IconFileText className="size-4" /> },
    {
      id: "principles",
      label: "۲. اصول ۴‌گانه برند",
      icon: <IconDiamond className="size-4" />,
      badge: `${formData.principles.length} اصل`,
    },
    {
      id: "brand",
      label: "۳. گره‌های هویتی و فرهنگ",
      icon: <IconLandmark className="size-4" />,
    },
    {
      id: "team",
      label: "۴. تیم و افراد",
      icon: <IconUsers className="size-4" />,
      badge: `${formData.team.length} نفر`,
    },
    {
      id: "story",
      label: "۵. داستان برند و مانیفست فنی (Tiptap)",
      icon: <IconPencil className="size-4" />,
      badge: "ادیتور آزاد",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-xs text-muted hover:text-blue transition-colors font-medium inline-flex items-center gap-1"
            >
              <IconArrowRight className="size-3.5" />
              <span>بازگشت به پیشخوان</span>
            </Link>
            <span className="text-muted">/</span>
            <span className="text-xs font-bold text-text">مدیریت درباره ما</span>
          </div>
          <h1 className="text-xl font-black text-text sm:text-2xl mt-1">
            تنظیمات صفحه «درباره ما»
          </h1>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            مدیریت اصول برند، معماری هویتی، تیم و روایت مانیفست سازمانی در قالب ادیتور پیشرفته
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ApiButton variant="secondary" label="API این بخش" />
          <Link
            href="/about"
            target="_blank"
            className="rounded-xl border border-line bg-panel px-4 py-2.5 text-xs font-bold text-text hover:border-blue transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <span>مشاهده زنده در سایت</span>
            <IconExternalLink className="size-3.5 text-muted" />
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

      {/* Messages */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-600">
          <IconAlertTriangle className="size-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-ok/30 bg-ok/10 p-4 text-xs font-semibold text-ok">
          <IconCheckCircle className="size-4 shrink-0 text-ok" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
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

      {/* Tab 1: Intro */}
      {activeTab === "intro" && (
        <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-6">
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
        <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <h3 className="text-sm font-bold text-text">
                اصول چهارگانه برند کارا پرداز اوند
              </h3>
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
              className="rounded-xl bg-blue/10 border border-blue/30 px-3 py-1.5 text-xs font-bold text-blue hover:bg-blue/20 transition-colors"
            >
              + افزودن اصل جدید
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.principles.map((principle, index) => (
              <div
                key={principle.id || index}
                className="rounded-2xl border border-line bg-bg/50 p-4 space-y-3 relative group"
              >
                <div className="flex items-center justify-between border-b border-line/60 pb-2">
                  <span className="text-[11px] font-bold text-muted">
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
                    className="text-red-500 hover:bg-red-500/10 px-2 py-0.5 rounded text-xs transition-colors"
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
          <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-4">
            <div className="border-b border-line pb-3">
              <h3 className="text-sm font-bold text-text">
                معماری هویتی و رابطه برندها (Brand Diagram)
              </h3>
              <p className="text-xs text-muted">
                شرح وظایف و تمرکز استودیو Code1Sprint و کارا پرداز اوند در دیاگرام هویتی
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {formData.brandNodes.map((node, index) => (
                <div
                  key={node.id}
                  className="rounded-2xl border border-line bg-bg/50 p-4 space-y-3 relative group"
                >
                  <span className="text-xs font-black text-blue uppercase">
                    گره برند: {node.id}
                  </span>
                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">
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
                      className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs font-bold text-text focus:border-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">
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
                      className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text leading-relaxed focus:border-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5 text-start">
                      Focus Area (English)
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
                      className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text leading-relaxed focus:border-blue focus:outline-none text-start"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Culture Items */}
          <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-sm font-bold text-text">
                  فرهنگ مهندسی (Engineering Culture)
                </h3>
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
                className="rounded-xl bg-blue/10 border border-blue/30 px-3 py-1.5 text-xs font-bold text-blue hover:bg-blue/20 transition-colors"
              >
                + افزودن فرهنگ مهندسی
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.culture.map((item, index) => (
                <div
                  key={item.id || index}
                  className="rounded-2xl border border-line bg-bg/50 p-4 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between border-b border-line/60 pb-2">
                    <span className="text-[11px] font-bold text-muted">
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
                      className="text-red-500 hover:bg-red-500/10 px-2 py-0.5 rounded text-xs transition-colors"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">
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
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs font-bold text-text focus:border-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5 text-start">
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
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none text-start"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">
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
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text leading-relaxed focus:border-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5 text-start">
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

      {/* Tab 4: Team */}
      {activeTab === "team" && (
        <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <h3 className="text-sm font-bold text-text">
                اعضای تیم و رهبری فنی
              </h3>
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
              className="rounded-xl bg-blue/10 border border-blue/30 px-3 py-1.5 text-xs font-bold text-blue hover:bg-blue/20 transition-colors"
            >
              + افزودن عضو جدید
            </button>
          </div>

          {formData.team.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-bg p-8 text-center text-xs text-muted">
              هنوز عضوی برای تیم ثبت نشده است. (سکشن تیم به صورت خودکار در سایت عمومی مخفی است).
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {formData.team.map((member, index) => (
                <div
                  key={member.id || index}
                  className="rounded-2xl border border-line bg-bg/50 p-4 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between border-b border-line/60 pb-2">
                    <span className="text-[11px] font-bold text-muted">
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
                      className="text-red-500 hover:bg-red-500/10 px-2 py-0.5 rounded text-xs transition-colors"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-text mb-1.5">
                          نام و نام‌خانوادگی (فارسی)
                        </label>
                        <input
                          type="text"
                          value={member.name.fa}
                          onChange={(e) => {
                            const updated = [...formData.team];
                            updated[index].name.fa = e.target.value;
                            setFormData((prev) => ({ ...prev, team: updated }));
                          }}
                          className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs font-bold text-text focus:border-blue focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-text mb-1.5 text-start">
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
                          className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none text-start"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-text mb-1.5">
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
                          className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-text mb-1.5 text-start">
                          Role Title (English)
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
                          className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none text-start"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">
                        آدرس تصویر پرسنلی واقعی (URL)
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={member.photo || ""}
                        placeholder="/team/member.webp (یا خالی اگر عکس واقعی نیست)"
                        onChange={(e) => {
                          const updated = [...formData.team];
                          updated[index].photo = e.target.value || null;
                          setFormData((prev) => ({ ...prev, team: updated }));
                        }}
                        className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text font-mono focus:border-blue focus:outline-none text-start"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Story with Tiptap */}
      {activeTab === "story" && (
        <div className="bg-panel p-6 rounded-3xl border border-line shadow-sm space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-text">
                  داستان برند و مانیفست فنی کارا پرداز اوند
                </h3>
                <span className="rounded-full bg-blue/10 px-2 py-0.5 text-[10px] font-bold text-blue">
                  ادیتور هوشمند Tiptap
                </span>
              </div>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                روایت عمیق سازمانی با امکان درج کادرهای تو در تو، کد بلاک، تصاویر/ویدیوها با چیدمان و دکمه CTA
              </p>
            </div>

            {/* Language toggle for Tiptap */}
            <div className="flex items-center gap-1 rounded-xl border border-line bg-bg p-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setStoryLang("fa")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-bold transition",
                  storyLang === "fa"
                    ? "bg-blue/15 border border-blue text-blue shadow-sm"
                    : "text-muted hover:text-text",
                )}
              >
                محتوای فارسی
              </button>
              <button
                type="button"
                onClick={() => setStoryLang("en")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-bold transition",
                  storyLang === "en"
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
                className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text mb-1.5 text-start">
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
                className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs text-text focus:border-blue focus:outline-none transition-colors text-start"
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
          <span>ذخیره تمام تغییرات</span>
        </button>
      </div>
    </form>
  );
}
