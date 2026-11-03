"use client";

import { Link } from "@/i18n/navigation";
import { PostForm, type PostFormData } from "@/components/admin/posts/PostForm";

interface EditPostClientProps {
  initialData: Partial<PostFormData>;
  postId: string;
  slug: string;
  title: string;
}

export function EditPostClient({
  initialData,
  postId,
  slug,
  title,
}: EditPostClientProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-text sm:text-2xl">
            ویرایش مقاله: {title}
          </h1>
          <p className="mt-1 text-sm text-muted">
            ویرایش محتوا و متادیتای مقاله با اسلاگ <span className="font-mono text-xs">{slug}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/insights/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-line bg-panel px-4 py-2 text-xs font-bold text-text transition hover:border-blue"
          >
            <span>مشاهده در سایت</span>
          </Link>
          <Link
            href="/admin/posts"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-line bg-panel px-4 py-2 text-xs font-bold text-text transition hover:border-blue"
          >
            <span>بازگشت به مقالات</span>
          </Link>
        </div>
      </div>

      {/* Form */}
      <PostForm initialData={initialData} postId={postId} isEdit />
    </div>
  );
}
