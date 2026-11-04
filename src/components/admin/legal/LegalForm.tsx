"use client";

import { useState, useEffect } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiButton } from "@/components/admin/api-drawer/ApiButton";
import { TiptapEditor } from "@/components/admin/editor/TiptapEditor";
import { cn } from "@/lib/cn";
import type { LegalDocFormData } from "@/lib/validations/legal";

interface LegalFormProps {
  initialData?: LegalDocFormData;
  isNew?: boolean;
}

export function LegalForm({ initialData, isNew = false }: LegalFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<LegalDocFormData>(
    initialData || {
      slug: "",
      title: { fa: "", en: "" },
      summary: { fa: "", en: "" },
      updatedIso: new Date().toISOString().slice(0, 10),
      tiptapBody: {
        fa: { html: "", json: null },
        en: { html: "", json: null },
      },
      status: "published",
    },
  );

  const [activeLang, setActiveLang] = useState<"fa" | "en">("fa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Synchronize form if updated via API Drawer or background event
  useEffect(() => {
    if (isNew || !formData.slug) return;

    const handleRemoteUpdate = async (e: Event) => {
      const customEvent = e as CustomEvent<{ resource?: string; path?: string }>;
      const isLegalResource =
        customEvent.detail?.resource === "legal" || customEvent.detail?.path?.includes("/legal");
      const pathMatches = customEvent.detail?.path?.includes(formData.slug);

      if (isLegalResource && (pathMatches || !isNew)) {
        try {
          const res = await fetch(`/api/admin/legal/${formData.slug}`);
          const json = await res.json();
          if (json.ok && json.doc) {
            const d = json.doc;
            setFormData((prev) => ({
              ...prev,
              slug: d.slug ?? prev.slug,
              title: d.title ?? prev.title,
              summary: d.summary ?? prev.summary,
              updatedIso: d.updatedIso ?? prev.updatedIso,
              tiptapBody: d.tiptapBody ?? prev.tiptapBody,
              status: d.status ?? prev.status,
            }));
            setSuccessMessage("محتوای سند حقوقی از طریق API به‌روزرسانی و در ادیتور همگام شد.");
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
  }, [formData.slug, isNew]);

  const isCoreDoc = !isNew && (formData.slug === "terms" || formData.slug === "privacy");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const endpoint = isNew
        ? "/api/admin/legal"
        : `/api/admin/legal/${formData.slug}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "خطا در ذخیره‌سازی سند حقوقی.");
      }

      setSuccessMessage(data.message || "سند حقوقی با موفقیت ذخیره شد.");
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (isNew) {
        router.push(`/admin/legal/${data.doc.slug}/edit`);
      }
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
            <Link
              href="/admin/legal"
              className="text-xs font-bold text-muted hover:text-blue transition"
            >
              اسناد حقوقی
            </Link>
            <span className="text-xs text-muted">/</span>
            <span className="text-xs font-bold text-text">
              {isNew ? "ایجاد سند جدید" : `ویرایش ${formData.title.fa || formData.slug}`}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-black text-text">
            {isNew ? "ایجاد سند حقوقی جدید" : `ویرایش سند: ${formData.title.fa}`}
          </h1>
          <p className="mt-1 text-xs text-muted">
            نگارش متون بلند قانونی، شرایط استفاده، حریم خصوصی یا توافق‌نامه‌ها همراه با تولید خودکار فهرست عناوین (TOC)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ApiButton variant="secondary" label="API این سند" />
          {!isNew && (
            <Link
              href={formData.slug === "terms" || formData.slug === "privacy" ? `/${formData.slug}` : `/legal/${formData.slug}`}
              target="_blank"
              className="rounded-full border border-line bg-panel px-4 py-2 text-xs font-bold text-text transition hover:border-blue"
            >
              مشاهده صفحه زنده
            </Link>
          )}
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
              <span>{isNew ? "انتشار سند حقوقی" : "ذخیره تغییرات"}</span>
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

      {/* Meta Settings Panel */}
      <div className="rounded-2xl border border-line bg-panel p-6 space-y-6">
        <h2 className="text-base font-black text-text">
          مشخصات و متادیتای سند حقوقی
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs font-bold text-text">
              اسلاگ سند (Slug) *
            </label>
            <input
              type="text"
              dir="ltr"
              required
              disabled={isCoreDoc}
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                }))
              }
              placeholder="e.g. terms, privacy, sla"
              className={cn(
                "w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs font-mono text-text focus:border-blue focus:outline-none",
                isCoreDoc && "opacity-60 cursor-not-allowed",
              )}
            />
            {isCoreDoc && (
              <p className="mt-1 text-[11px] text-muted">
                اسلاگ اسناد اصلی سیستم غیرقابل تغییر است.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-text">
              تاریخ اعمال / آخرین بازبینی (ISO) *
            </label>
            <input
              type="text"
              dir="ltr"
              required
              value={formData.updatedIso || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, updatedIso: e.target.value }))
              }
              placeholder="2026-01-01"
              className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs font-mono text-text focus:border-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-text">
              وضعیت انتشار *
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as "published" | "draft",
                }))
              }
              className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text focus:border-blue focus:outline-none"
            >
              <option value="published">منتشر شده (عمومی)</option>
              <option value="draft">پیش‌نویس (خصوصی)</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold text-text">
              عنوان سند (فارسی) *
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
              placeholder="مثلاً: شرایط استفاده از خدمات"
              className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text focus:border-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-text">
              Document Title (English)
            </label>
            <input
              type="text"
              dir="ltr"
              value={formData.title.en || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: { ...prev.title, en: e.target.value },
                }))
              }
              placeholder="e.g. Terms of Service"
              className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text focus:border-blue focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold text-text">
              خلاصه سند (فارسی)
            </label>
            <textarea
              rows={2}
              value={formData.summary?.fa || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  summary: {
                    fa: e.target.value,
                    en: prev.summary?.en || "",
                  },
                }))
              }
              placeholder="چکیده کوتاه برای سربرگ و سئو..."
              className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-text">
              Summary (English)
            </label>
            <textarea
              rows={2}
              dir="ltr"
              value={formData.summary?.en || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  summary: {
                    fa: prev.summary?.fa || "",
                    en: e.target.value,
                  },
                }))
              }
              placeholder="Brief summary for hero and SEO..."
              className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-xs text-text leading-relaxed focus:border-blue focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Editor Panel */}
      <div className="rounded-2xl border border-line bg-panel p-6 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-black text-text">
              متن کامل سند حقوقی (Tiptap Editor)
            </h2>
            <p className="text-xs text-muted">
              تیترهای ۲ (H2) و ۳ (H3) به صورت خودکار به عنوان فهرست مطالب کناری (Table of Contents) شناسایی می‌شوند.
            </p>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-line bg-bg p-1">
            <button
              type="button"
              onClick={() => setActiveLang("fa")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-black transition",
                activeLang === "fa"
                  ? "bg-navy text-white shadow-sm"
                  : "text-muted hover:text-text",
              )}
            >
              محتوای فارسی
            </button>
            <button
              type="button"
              onClick={() => setActiveLang("en")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-black transition",
                activeLang === "en"
                  ? "bg-navy text-white shadow-sm"
                  : "text-muted hover:text-text",
              )}
            >
              English Content
            </button>
          </div>
        </div>

        {activeLang === "fa" ? (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-text">
              نگارش متن فارسی سند حقوقی:
            </label>
            <TiptapEditor
              contentHtml={formData.tiptapBody?.fa?.html || ""}
              contentJson={
                formData.tiptapBody?.fa?.json as
                  | Record<string, unknown>
                  | undefined
              }
              locale="fa"
              onChange={(json, html) => {
                setFormData((prev) => ({
                  ...prev,
                  tiptapBody: {
                    ...prev.tiptapBody,
                    fa: { html, json },
                  },
                }));
              }}
              placeholder="بندهای حقوقی، مقدمه، شرایط، تعهدات و تعاریف را به همراه تیترهای استاندارد بنویسید..."
            />
          </div>
        ) : (
          <div className="space-y-2" dir="ltr">
            <label className="block text-xs font-bold text-text text-start">
              Legal Document Text in English:
            </label>
            <TiptapEditor
              contentHtml={formData.tiptapBody?.en?.html || ""}
              contentJson={
                formData.tiptapBody?.en?.json as
                  | Record<string, unknown>
                  | undefined
              }
              locale="en"
              onChange={(json, html) => {
                setFormData((prev) => ({
                  ...prev,
                  tiptapBody: {
                    ...prev.tiptapBody,
                    en: { html, json },
                  },
                }));
              }}
              placeholder="Write legal clauses, terms, and conditions in English..."
            />
          </div>
        )}
      </div>

      {/* Floating Save Bar */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-line bg-panel/90 p-4 shadow-lg backdrop-blur-md">
        <span className="text-xs font-bold text-muted">
          تغییرات پس از ذخیره مستقیماً در اسناد عمومی اعمال می‌شوند.
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
            <span>{isNew ? "انتشار سند حقوقی" : "ذخیره تغییرات سند"}</span>
          )}
        </button>
      </div>
    </form>
  );
}
