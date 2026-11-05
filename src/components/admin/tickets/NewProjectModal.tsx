"use client";

import React, { useState } from "react";
import type { ProjectInfo } from "./ProjectFilterBar";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (project: ProjectInfo) => void;
}

export function NewProjectModal({
  isOpen,
  onClose,
  onCreated,
}: NewProjectModalProps) {
  const [name, setName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success state with generated API key
  const [createdData, setCreatedData] = useState<{
    project: ProjectInfo;
    rawApiKey: string;
  } | null>(null);

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !projectId.trim()) {
      setError("لطفاً نام پروژه و شناسه انگلیسی را وارد کنید.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/tickets/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          projectId: projectId.trim().toLowerCase(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "خطا در ثبت سامانه جدید.");
      }

      setCreatedData({
        project: data.project,
        rawApiKey: data.rawApiKey,
      });
      onCreated(data.project);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای نامشخص در ثبت سامانه.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setProjectId("");
    setError(null);
    setCreatedData(null);
    setCopiedKey(false);
    setCopiedEnv(false);
    onClose();
  };

  const envSnippet = createdData
    ? `KARAPARDAZ_API_URL=https://karapardazavand.ir\nKARAPARDAZ_PROJECT_ID=${createdData.project.projectId}\nKARAPARDAZ_PROJECT_KEY=${createdData.rawApiKey}`
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl border border-line bg-panel p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {!createdData ? (
          /* Form View */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-base font-bold text-text">ثبت سامانه و پروژه جدید</h3>
                <p className="mt-0.5 text-xs text-muted">
                  اتصال فروشگاه، کلینیک یا هر نرم‌افزار جدید به هسته پشتیبانی کاراپرداز
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted hover:text-text"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-text mb-1">
                  نام فارسی سامانه یا پروژه:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: فروشگاه اینترنتی پوشاک یا کلینیک امید"
                  className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-xs text-text focus:border-blue focus:outline-hidden focus:ring-1 focus:ring-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text mb-1">
                  شناسه انگلیسی یکتا (Project ID):
                </label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) =>
                    setProjectId(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9_-]/g, ""),
                    )
                  }
                  placeholder="مثال: shop یا clinic یا crm-portal"
                  className="w-full font-mono rounded-lg border border-line bg-bg px-3 py-2 text-xs text-text focus:border-blue focus:outline-hidden focus:ring-1 focus:ring-blue"
                  required
                />
                <span className="mt-1 block text-[11px] text-muted">
                  این شناسه در سربرگ <code>x-project-id</code> و شماره تیکت‌ها (مانند <code>TK-SHOP-1001</code>) استفاده می‌شود.
                </span>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs text-rose-600">
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2 border-t border-line pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-line bg-bg px-4 py-2 text-xs font-medium text-text hover:bg-panel"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !projectId.trim()}
                className="flex items-center gap-2 rounded-lg bg-blue px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-navy disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>در حال صدور کلید...</span>
                  </>
                ) : (
                  <span>ثبت و صدور کلید امنیتی API</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Success View */
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-line pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ok/15 text-ok">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-text">سامانه با موفقیت ثبت شد</h3>
                <p className="text-xs text-muted">
                  پروژه «{createdData.project.name}» آماده دریافت تیکت‌های مشتریان است.
                </p>
              </div>
            </div>

            {/* API Key Box */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text">
                کلید امنیتی اختصاصی (API Key):
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-line bg-bg p-2 font-mono text-xs">
                <span className="flex-1 truncate text-navy font-bold">
                  {createdData.rawApiKey}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(createdData.rawApiKey);
                    setCopiedKey(true);
                    setTimeout(() => setCopiedKey(false), 2000);
                  }}
                  className="rounded-md border border-line bg-panel px-2.5 py-1 text-[11px] font-sans font-medium text-text hover:bg-bg"
                >
                  {copiedKey ? "کپی شد ✓" : "کپی کلید"}
                </button>
              </div>
              <p className="text-[11px] text-orange">
                ⚠️ این کلید تنها یک‌بار به صورت کامل نمایش داده می‌شود؛ لطفاً آن را ذخیره کنید.
              </p>
            </div>

            {/* Config Snippet */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text">
                  تنظیمات آماده برای فایل <code>.env.local</code> پروژه مقصد:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(envSnippet);
                    setCopiedEnv(true);
                    setTimeout(() => setCopiedEnv(false), 2000);
                  }}
                  className="text-[11px] text-blue hover:underline"
                >
                  {copiedEnv ? "کد کپی شد ✓" : "کپی تمام متغیرها"}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-lg border border-line bg-navy p-3 font-mono text-[11px] text-win-text direction-ltr text-start">
                {envSnippet}
              </pre>
            </div>

            <div className="mt-6 flex justify-end border-t border-line pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg bg-blue px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-navy"
              >
                تکمیل و بازگشت به پیشخوان تیکت‌ها
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
