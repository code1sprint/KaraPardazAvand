"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { IconExternalLink } from "@/components/admin/editor/EditorIcons";
import { ApiButton } from "@/components/admin/api-drawer/ApiButton";
import { cn } from "@/lib/cn";
import type { ILegalDoc } from "@/lib/db/models/LegalDoc";

export function AdminLegalListClient() {
  const [docs, setDocs] = useState<ILegalDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadDocs() {
      try {
        const res = await fetch("/api/admin/legal", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          throw new Error(json.message || "خطا در دریافت فهرست اسناد حقوقی.");
        }
        if (mounted) {
          setDocs(json.docs);
        }
      } catch (err: unknown) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "خطای ناشناخته");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDocs();

    const handleRefresh = () => {
      void loadDocs();
    };
    window.addEventListener("kara-content-updated", handleRefresh);

    return () => {
      mounted = false;
      window.removeEventListener("kara-content-updated", handleRefresh);
    };
  }, []);

  const handleDelete = async (slug: string) => {
    if (slug === "terms" || slug === "privacy") {
      alert("اسناد اصلی سیستم (شرایط استفاده و حریم خصوصی) قابل حذف نیستند.");
      return;
    }

    if (!confirm(`آیا از حذف سند حقوقی '${slug}' اطمینان دارید؟`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/legal/${slug}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.message || "خطا در حذف سند حقوقی.");
      }
      setDocs((prev) => prev.filter((d) => d.slug !== slug));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "خطا در حذف.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
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
            <span className="text-xs font-bold text-text">اسناد حقوقی و قوانین</span>
          </div>
          <h1 className="mt-2 text-2xl font-black text-text">
            مدیریت اسناد حقوقی و شرایط استفاده
          </h1>
          <p className="mt-1 text-xs text-muted">
            مدیریت شرایط استفاده (Terms)، سیاست حریم خصوصی (Privacy) و توافق‌نامه‌های سازمانی در ویرایشگر پیشرفته Tiptap
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ApiButton variant="secondary" label="API اسناد حقوقی" />
          <Link
            href="/admin/legal/new"
            className="inline-flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-sky"
          >
            <span>+ ایجاد سند حقوقی جدید</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-bold text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-44 animate-pulse rounded-2xl bg-panel" />
          <div className="h-44 animate-pulse rounded-2xl bg-panel" />
        </div>
      ) : docs.length === 0 ? (
        <div className="rounded-2xl border border-line bg-panel p-12 text-center">
          <p className="text-sm font-bold text-muted">
            هنوز هیچ سند حقوقی ثبت نشده است.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => {
            const isCore = doc.slug === "terms" || doc.slug === "privacy";
            const publicUrl = isCore ? `/${doc.slug}` : `/legal/${doc.slug}`;

            return (
              <div
                key={doc.slug}
                className="group relative flex flex-col justify-between rounded-2xl border border-line bg-panel p-6 shadow-sm transition hover:border-blue/50 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md border border-line bg-bg px-2.5 py-1 text-[11px] font-mono font-bold text-muted">
                      /{doc.slug}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                        doc.status === "published"
                          ? "bg-ok/10 text-ok"
                          : "bg-amber/10 text-amber",
                      )}
                    >
                      {doc.status === "published" ? "منتشر شده" : "پیش‌نویس"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-black text-text group-hover:text-blue transition">
                    {doc.title?.fa || doc.slug}
                  </h3>

                  {doc.summary?.fa && (
                    <p className="mt-2 text-xs text-muted line-clamp-2 leading-relaxed">
                      {doc.summary.fa}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-2 text-[11px] text-muted font-mono">
                    <span>آخرین ویرایش:</span>
                    <span>{doc.updatedIso || "2026-01-01"}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/legal/${doc.slug}/edit`}
                      className="rounded-xl border border-line bg-bg px-3.5 py-1.5 text-xs font-bold text-text transition hover:border-blue hover:text-blue"
                    >
                      ویرایش سند
                    </Link>
                    <Link
                      href={publicUrl}
                      target="_blank"
                      className="rounded-xl border border-line px-2.5 py-1.5 text-xs text-muted transition hover:text-text inline-flex items-center justify-center"
                      title="مشاهده زنده"
                    >
                      <IconExternalLink className="size-3.5" />
                    </Link>
                  </div>

                  {!isCore && (
                    <button
                      type="button"
                      onClick={() => handleDelete(doc.slug)}
                      className="text-xs font-bold text-red-500 hover:text-red-700"
                    >
                      حذف
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
