"use client";

import { Link } from "@/i18n/navigation";

interface PostItem {
  slug: string;
  title: string;
  category: string;
  date: string;
  readingMinutes: number;
  status: "published" | "draft";
}

const POSTS: PostItem[] = [
  {
    slug: "crm-fit",
    title: "انتخاب CRM سازمانی: چرا نرم‌افزارهای آماده پاسخگوی فرایندهای اختصاصی نیستند؟",
    category: "سیستم‌های سازمانی و CRM",
    date: "۱۴۰۳/۰۸/۱۲",
    readingMinutes: 6,
    status: "published",
  },
  {
    slug: "staged-delivery",
    title: "تحویل مرحله‌ای نرم‌افزار در برابر روش‌های یکپارچه سنتی: رویکرد کاهش ریسک کارفرما",
    category: "مهندسی نرم‌افزار",
    date: "۱۴۰۳/۰۸/۰۵",
    readingMinutes: 8,
    status: "published",
  },
  {
    slug: "rag-boundaries",
    title: "مرزهای هوش مصنوعی سازمانی و RAG: کجا مدل‌های زبانی ارزش عملیاتی خلق می‌کنند؟",
    category: "هوش مصنوعی و داده",
    date: "۱۴۰۳/۰۷/۲۸",
    readingMinutes: 7,
    status: "published",
  },
];

export default function AdminPostsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-text sm:text-2xl">
            مدیریت مقالات و یادداشت‌های تحلیلی
          </h1>
          <p className="mt-1 text-sm text-muted">
            کنترل وضعیت انتشار، دسته‌بندی‌ها و متادیتای مقالات بخش Insights.
          </p>
        </div>
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
      </div>

      {/* Post List */}
      <div className="rounded-3xl border border-line bg-panel overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="border-b border-line bg-bg/50 text-xs font-bold text-muted">
              <tr>
                <th className="px-6 py-4 text-start">عنوان مقاله</th>
                <th className="px-6 py-4 text-start">دسته‌بندی</th>
                <th className="px-6 py-4 text-start">مدت مطالعه</th>
                <th className="px-6 py-4 text-start">تاریخ</th>
                <th className="px-6 py-4 text-start">وضعیت</th>
                <th className="px-6 py-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {POSTS.map((post) => (
                <tr key={post.slug} className="transition hover:bg-bg/40">
                  <td className="px-6 py-4 max-w-xs sm:max-w-md">
                    <span className="block font-bold text-text">
                      {post.title}
                    </span>
                    <span className="block font-mono text-[11px] text-muted" dir="ltr">
                      slug: {post.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-text">
                    {post.category}
                  </td>
                  <td className="px-6 py-4 text-xs text-muted font-mono">
                    {post.readingMinutes} دقیقه
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-muted">
                    {post.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block rounded-full bg-ok/15 px-2.5 py-0.5 text-[11px] font-bold text-ok">
                      منتشرشده
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/insights/${post.slug}`}
                      target="_blank"
                      className="rounded-xl border border-line px-3 py-1.5 text-xs font-bold text-text transition hover:border-blue hover:text-blue"
                    >
                      مشاهده صفحه
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
