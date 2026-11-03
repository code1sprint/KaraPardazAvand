import { Link } from "@/i18n/navigation";
import { PostForm } from "@/components/admin/posts/PostForm";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-text sm:text-2xl">
            افزودن مقاله جدید
          </h1>
          <p className="mt-1 text-sm text-muted">
            ایجاد یادداشت یا مقاله تحلیلی جدید با ویرایشگر Tiptap و ساختار چندزبانه.
          </p>
        </div>
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-1.5 rounded-2xl border border-line bg-panel px-4 py-2 text-xs font-bold text-text transition hover:border-blue"
        >
          <span>بازگشت به مقالات</span>
        </Link>
      </div>

      {/* Form */}
      <PostForm />
    </div>
  );
}
