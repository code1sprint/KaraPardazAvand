"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

interface ServiceItem {
  _id: string;
  slug: string;
  title: { fa: string; en: string };
  outcome: { fa: string; en: string };
  status: "published" | "draft";
  bento: {
    order: number;
    span: number;
    image: string;
    shortTitle: { fa: string; en: string };
  };
  systemMap: {
    layout: string;
    windowTitle?: string;
  };
  deliverables: Array<{ title: { fa: string; en: string } }>;
  steps: Array<{ title: { fa: string; en: string } }>;
  deepDiveHtml?: string;
  updatedAt: string;
}

export function AdminServicesClient() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      if (!res.ok) throw new Error("خطا در دریافت فهرست خدمات");
      const data = await res.json();
      setServices(data.services || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch("/api/admin/services");
        if (!res.ok) throw new Error("خطا در دریافت فهرست خدمات");
        const data = await res.json();
        if (!ignore) {
          setServices(data.services || []);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "خطا در ارتباط با سرور");
          setLoading(false);
        }
      }
    };
    void load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id: string, titleFa: string) => {
    if (!window.confirm(`آیا از حذف خدمت «${titleFa}» اطمینان دارید؟`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در حذف خدمت");

      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "خطا در حذف");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredServices = services.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle =
        s.title.fa.toLowerCase().includes(q) || s.title.en.toLowerCase().includes(q);
      const matchSlug = s.slug.toLowerCase().includes(q);
      const matchOutcome = s.outcome.fa.toLowerCase().includes(q);
      return matchTitle || matchSlug || matchOutcome;
    }
    return true;
  });

  const totalCount = services.length;
  const publishedCount = services.filter((s) => s.status === "published").length;
  const draftCount = services.filter((s) => s.status === "draft").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-text sm:text-2xl">
            مدیریت خدمات و راهکارهای نرم‌افزاری
          </h1>
          <p className="mt-1 text-sm text-muted">
            کنترل ساختار صفحات خدمات، نودهای نقشه سیستم، خروجی‌های ملموس و توضیحات عمیق فنی.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/services"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-line bg-panel px-4 py-2.5 text-xs font-bold text-text shadow-sm transition-colors hover:border-blue"
          >
            <span>مشاهده کاتالوگ در سایت</span>
            <span className="text-muted">↗</span>
          </Link>
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-blue text-white px-5 py-2.5 text-xs font-bold shadow hover:bg-navy-2 transition-all"
          >
            <span>+ تعریف خدمت جدید</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
          <span className="text-xs font-semibold text-muted">کل خدمات تعریف‌شده</span>
          <div className="mt-2 text-2xl font-black text-text font-mono">{totalCount}</div>
        </div>
        <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
          <span className="text-xs font-semibold text-muted">خدمات فعال (منتشرشده)</span>
          <div className="mt-2 text-2xl font-black text-blue font-mono">{publishedCount}</div>
        </div>
        <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
          <span className="text-xs font-semibold text-muted">پیش‌نویس‌ها (غیرفعال)</span>
          <div className="mt-2 text-2xl font-black text-amber font-mono">{draftCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-muted me-2">وضعیت:</span>
          {(
            [
              { id: "all", label: "همه" },
              { id: "published", label: "منتشرشده" },
              { id: "draft", label: "پیش‌نویس" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setStatusFilter(t.id)}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors",
                statusFilter === t.id
                  ? "bg-blue text-white shadow-sm"
                  : "bg-panel border border-line text-muted hover:text-text",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در عنوان، اسلاگ، یا شرح..."
            className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Services List Table */}
      <div className="rounded-3xl border border-line bg-panel overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue border-t-transparent" />
            <span className="text-xs text-muted">در حال بارگذاری لیست خدمات...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-500">
            {error}
            <button
              type="button"
              onClick={fetchServices}
              className="block mx-auto mt-2 text-blue underline font-bold"
            >
              تلاش مجدد
            </button>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted">
            هیچ خدمتی مطابق با فیلترهای انتخابی یافت نشد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm">
              <thead className="border-b border-line bg-bg/50 text-xs font-bold text-muted">
                <tr>
                  <th className="px-6 py-4 text-start">عنوان خدمت و دسته‌بندی</th>
                  <th className="px-6 py-4 text-start">اسلاگ مسیر</th>
                  <th className="px-6 py-4 text-start">توپولوژی نقشه سیستم</th>
                  <th className="px-6 py-4 text-center">خروجی‌ها / مراحل</th>
                  <th className="px-6 py-4 text-center">توضیح عمیق (Deep-Dive)</th>
                  <th className="px-6 py-4 text-center">وضعیت</th>
                  <th className="px-6 py-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredServices.map((service) => {
                  const hasDeepDive = Boolean(service.deepDiveHtml?.trim());
                  return (
                    <tr
                      key={service._id}
                      className="hover:bg-bg/40 transition-colors group"
                    >
                      {/* Title & Short Title */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-text group-hover:text-blue transition-colors">
                            {service.title.fa}
                          </span>
                          <span className="text-[11px] text-muted font-sans" dir="ltr">
                            {service.title.en}
                          </span>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="px-6 py-4 font-mono text-xs text-muted" dir="ltr">
                        /services/{service.slug}
                      </td>

                      {/* Topology Layout */}
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-bg px-2 py-1 text-[11px] font-mono text-text border border-line">
                          {service.systemMap?.layout || "hub"}
                        </span>
                      </td>

                      {/* Deliverables / Steps count */}
                      <td className="px-6 py-4 text-center font-mono text-xs text-muted">
                        {service.deliverables?.length || 0} خروجی / {service.steps?.length || 0} مرحله
                      </td>

                      {/* Deep-Dive Badge */}
                      <td className="px-6 py-4 text-center">
                        {hasDeepDive ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue bg-blue/10 px-2 py-0.5 rounded-full">
                            <span>✓</span>
                            <span>فعال (Tiptap)</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted">بدون متن عمیق</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                            service.status === "published"
                              ? "bg-ok/15 text-ok"
                              : "bg-amber/15 text-amber",
                          )}
                        >
                          {service.status === "published" ? "منتشرشده" : "پیش‌نویس"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/admin/services/${service._id}/edit`}
                            className="rounded-xl border border-line bg-panel px-3 py-1 text-xs font-semibold text-text hover:border-blue hover:text-blue transition-colors"
                          >
                            ویرایش
                          </Link>
                          <Link
                            href={`/services/${service.slug}`}
                            target="_blank"
                            className="rounded-xl border border-line bg-panel p-1.5 text-xs text-muted hover:text-text hover:border-line transition-colors"
                            title="مشاهده زنده در سایت"
                          >
                            ↗
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(service._id, service.title.fa)}
                            disabled={deletingId === service._id}
                            className="rounded-xl border border-transparent p-1.5 text-xs text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                            title="حذف خدمت"
                          >
                            {deletingId === service._id ? "..." : "🗑"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
