"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

interface PostItem {
  _id: string;
  slug: string;
  locale: "fa" | "en";
  title: string;
  summary: string;
  tags: string[];
  readingTime: number;
  publishedAt: string;
  status: "published" | "draft";
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [localeFilter, setLocaleFilter] = useState<"all" | "fa" | "en">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      setActionError(null);
      try {
        const params = new URLSearchParams();
        if (localeFilter !== "all") params.set("locale", localeFilter);
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (searchQuery) params.set("q", searchQuery);

        const res = await fetch(`/api/admin/posts?${params.toString()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!ignore) {
          if (res.ok && data.ok) {
            setPosts(data.posts || []);
          } else {
            setActionError(data.message || "خطا در دریافت لیست مقالات.");
          }
        }
      } catch {
        if (!ignore) {
          setActionError("خطا در برقراری ارتباط با سرور.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      ignore = true;
    };
  }, [localeFilter, statusFilter, searchQuery]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`آیا از حذف مقاله "${title}" اطمینان دارید؟`)) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(data.message || "خطا در حذف مقاله.");
      }
    } catch {
      alert("خطا در برقراری ارتباط با سرور هنگام حذف.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-text sm:text-2xl">
            مدیریت مقالات و یادداشت‌های تحلیلی
          </h1>
          <p className="mt-1 text-sm text-muted">
            مدیریت محتوا با ویرایشگر Tiptap، ذخیره‌سازی در MongoDB و تنظیم متادیتای مقالات.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/insights"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-line bg-panel px-4 py-2.5 text-xs font-bold text-text transition hover:border-blue"
          >
            <span>مشاهده وبلاگ در سایت</span>
            <svg
              className="h-3.5 w-3.5 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </Link>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-blue px-4 py-2.5 text-xs font-bold text-white transition hover:bg-navy-2 shadow-sm"
          >
            <span>+ مقاله جدید</span>
          </Link>
        </div>
      </div>

      {actionError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-600 dark:border-red-900/40 dark:bg-red-950/20">
          ⚠️ {actionError}
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-line bg-panel p-4 shadow-sm">
        {/* Search */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="جستجو در عنوان یا اسلاگ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs text-text focus:border-blue focus:outline-none"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Locale */}
          <div className="flex items-center bg-bg p-1 rounded-xl border border-line text-xs font-bold">
            <button
              onClick={() => setLocaleFilter("all")}
              className={`px-3 py-1 rounded-lg transition-colors ${localeFilter === "all" ? "bg-panel text-blue shadow-sm" : "text-muted"}`}
            >
              همه زبان‌ها
            </button>
            <button
              onClick={() => setLocaleFilter("fa")}
              className={`px-3 py-1 rounded-lg transition-colors ${localeFilter === "fa" ? "bg-panel text-blue shadow-sm" : "text-muted"}`}
            >
              فارسی
            </button>
            <button
              onClick={() => setLocaleFilter("en")}
              className={`px-3 py-1 rounded-lg transition-colors ${localeFilter === "en" ? "bg-panel text-blue shadow-sm" : "text-muted"}`}
            >
              English
            </button>
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "all" | "published" | "draft",
              )
            }
            className="rounded-xl border border-line bg-bg px-3 py-1.5 text-xs font-bold text-text focus:border-blue focus:outline-none"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="published">منتشر شده</option>
            <option value="draft">پیش‌نویس</option>
          </select>
        </div>
      </div>

      {/* Post Table */}
      <div className="rounded-3xl border border-line bg-panel overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-sm font-bold text-muted">
            در حال بارگذاری مقالات...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-bold text-muted">هیچ مقاله‌ای یافت نشد.</p>
            <Link
              href="/admin/posts/new"
              className="inline-block text-xs font-bold text-blue hover:underline"
            >
              نخستین مقاله را ایجاد کنید
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm">
              <thead className="border-b border-line bg-bg/50 text-xs font-bold text-muted">
                <tr>
                  <th className="px-6 py-4 text-start">عنوان مقاله</th>
                  <th className="px-6 py-4 text-start">زبان</th>
                  <th className="px-6 py-4 text-start">مدت مطالعه</th>
                  <th className="px-6 py-4 text-start">تاریخ انتشار</th>
                  <th className="px-6 py-4 text-start">وضعیت</th>
                  <th className="px-6 py-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {posts.map((post) => (
                  <tr key={post._id} className="transition hover:bg-bg/40">
                    <td className="px-6 py-4 max-w-xs sm:max-w-md">
                      <span className="block font-bold text-text">
                        {post.title}
                      </span>
                      <span className="block font-mono text-[11px] text-muted" dir="ltr">
                        slug: {post.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-md bg-bg px-2 py-0.5 text-[10px] font-bold text-muted border border-line uppercase">
                        {post.locale}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted font-mono">
                      {post.readingTime} دقیقه
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-muted">
                      {new Date(post.publishedAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="px-6 py-4">
                      {post.status === "published" ? (
                        <span className="inline-block rounded-full bg-ok/15 px-2.5 py-0.5 text-[11px] font-bold text-ok">
                          منتشرشده
                        </span>
                      ) : (
                        <span className="inline-block rounded-full bg-amber/15 px-2.5 py-0.5 text-[11px] font-bold text-amber">
                          پیش‌نویس
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/posts/${post._id}/edit`}
                          className="rounded-xl border border-line px-3 py-1.5 text-xs font-bold text-text transition hover:border-blue hover:text-blue"
                        >
                          ویرایش
                        </Link>
                        <Link
                          href={`/insights/${post.slug}`}
                          target="_blank"
                          className="rounded-xl border border-line px-3 py-1.5 text-xs font-bold text-muted transition hover:border-blue hover:text-text"
                          title="مشاهده در وبلاگ"
                        >
                          مشاهده
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(post._id, post.title)}
                          className="rounded-xl border border-line px-3 py-1.5 text-xs font-bold text-red-500 transition hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950/20"
                        >
                          حذف
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
