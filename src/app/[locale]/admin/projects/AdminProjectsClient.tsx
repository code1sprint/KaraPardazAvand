"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

interface ProjectItem {
  _id: string;
  slug: string;
  title: string;
  sector: string;
  year: string;
  services: string[];
  role: string;
  cover: string;
  results: Array<{ label: string; value: string; source?: string }>;
  systemMap: { layout?: string };
  featured: boolean;
  status: "published" | "draft";
  contentHtml?: string;
  updatedAt: string;
}

export function AdminProjectsClient() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch("/api/admin/projects");
        if (!res.ok) throw new Error("خطا در دریافت فهرست پروژه‌ها");
        const data = await res.json();
        if (!ignore) {
          setProjects(data.projects || []);
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

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`آیا از حذف مطالعه موردی «${title}» اطمینان دارید؟`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در حذف پروژه");

      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "خطا در حذف");
    } finally {
      setDeletingId(null);
    }
  };

  const sectors = Array.from(new Set(projects.map((p) => p.sector))).filter(Boolean);

  const filteredProjects = projects.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (sectorFilter !== "all" && p.sector !== sectorFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSlug = p.slug.toLowerCase().includes(q);
      const matchSector = p.sector.toLowerCase().includes(q);
      const matchRole = p.role.toLowerCase().includes(q);
      return matchTitle || matchSlug || matchSector || matchRole;
    }
    return true;
  });

  const totalCount = projects.length;
  const publishedCount = projects.filter((p) => p.status === "published").length;
  const draftCount = projects.filter((p) => p.status === "draft").length;
  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-text sm:text-2xl">
            مدیریت نمونه‌کارها و مطالعات موردی
          </h1>
          <p className="mt-1 text-sm text-muted">
            کنترل شناسنامه پروژه‌ها، شاخص‌های مستند بازدهی، نقشه سیستم و روایت تفصیلی Tiptap.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/portfolio"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-line bg-panel px-4 py-2.5 text-xs font-bold text-text shadow-sm transition-colors hover:border-blue"
          >
            <span>مشاهده نمونه‌کارها در سایت</span>
            <span className="text-muted">↗</span>
          </Link>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-blue text-white px-5 py-2.5 text-xs font-bold shadow hover:bg-navy-2 transition-all"
          >
            <span>+ ثبت پروژه جدید</span>
          </Link>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
          <span className="text-xs font-semibold text-muted">کل پروژه‌ها</span>
          <div className="mt-2 text-2xl font-black text-text font-mono">{totalCount}</div>
        </div>
        <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
          <span className="text-xs font-semibold text-muted">منتشرشده (فعال)</span>
          <div className="mt-2 text-2xl font-black text-blue font-mono">{publishedCount}</div>
        </div>
        <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
          <span className="text-xs font-semibold text-muted">پیش‌نویس‌ها</span>
          <div className="mt-2 text-2xl font-black text-amber font-mono">{draftCount}</div>
        </div>
        <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
          <span className="text-xs font-semibold text-muted">پروژه‌های برگزیده (Featured)</span>
          <div className="mt-2 text-2xl font-black text-orange font-mono">{featuredCount}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-muted me-1">وضعیت:</span>
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

          {sectors.length > 0 && (
            <div className="flex items-center gap-1 ms-2">
              <span className="text-xs font-bold text-muted me-1">صنعت:</span>
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="rounded-xl border border-line bg-panel px-3 py-1.5 text-xs text-text"
              >
                <option value="all">تمام صنایع</option>
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در عنوان، اسلاگ، یا صنعت..."
            className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="rounded-3xl border border-line bg-panel overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue border-t-transparent" />
            <span className="text-xs text-muted">در حال بارگذاری لیست پروژه‌ها...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-500">{error}</div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted">
            هیچ مطالعه موردی مطابق با فیلترهای انتخابی یافت نشد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm">
              <thead className="border-b border-line bg-bg/50 text-xs font-bold text-muted">
                <tr>
                  <th className="px-6 py-4 text-start">عنوان پروژه و صنعت</th>
                  <th className="px-6 py-4 text-start">اسلاگ مسیر</th>
                  <th className="px-6 py-4 text-start">خدمات متصل</th>
                  <th className="px-6 py-4 text-center">شاخص‌ها / سال</th>
                  <th className="px-6 py-4 text-center">برگزیده</th>
                  <th className="px-6 py-4 text-center">وضعیت</th>
                  <th className="px-6 py-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredProjects.map((project) => (
                  <tr
                    key={project._id}
                    className="hover:bg-bg/40 transition-colors group"
                  >
                    {/* Title & Sector */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-text group-hover:text-blue transition-colors">
                          {project.title}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-bg px-1.5 py-0.5 text-[10px] font-bold text-muted border border-line">
                            {project.sector}
                          </span>
                          <span className="text-[11px] text-muted">{project.role}</span>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="px-6 py-4 font-mono text-xs text-muted" dir="ltr">
                      /portfolio/{project.slug}
                    </td>

                    {/* Services */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.services?.map((svc) => (
                          <span
                            key={svc}
                            className="rounded-lg bg-blue/10 px-2 py-0.5 text-[10px] font-bold text-blue font-mono"
                          >
                            {svc}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Metrics / Year */}
                    <td className="px-6 py-4 text-center font-mono text-xs text-muted">
                      {project.results?.length || 0} شاخص / {project.year}
                    </td>

                    {/* Featured */}
                    <td className="px-6 py-4 text-center">
                      {project.featured ? (
                        <span className="text-orange text-sm font-bold" title="پروژه ویژه در صفحه اصلی">
                          ★
                        </span>
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                          project.status === "published"
                            ? "bg-ok/15 text-ok"
                            : "bg-amber/15 text-amber",
                        )}
                      >
                        {project.status === "published" ? "منتشرشده" : "پیش‌نویس"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href={`/admin/projects/${project._id}/edit`}
                          className="rounded-xl border border-line bg-panel px-3 py-1 text-xs font-semibold text-text hover:border-blue hover:text-blue transition-colors"
                        >
                          ویرایش
                        </Link>
                        <Link
                          href={`/portfolio/${project.slug}`}
                          target="_blank"
                          className="rounded-xl border border-line bg-panel p-1.5 text-xs text-muted hover:text-text hover:border-line transition-colors"
                          title="مشاهده زنده در سایت"
                        >
                          ↗
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(project._id, project.title)}
                          disabled={deletingId === project._id}
                          className="rounded-xl border border-transparent p-1.5 text-xs text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                          title="حذف پروژه"
                        >
                          {deletingId === project._id ? "..." : "🗑"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
