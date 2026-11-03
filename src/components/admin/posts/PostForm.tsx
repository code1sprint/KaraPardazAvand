"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { TiptapEditor } from "@/components/admin/editor/TiptapEditor";
import { slugifyHeading } from "@/lib/editor/normalizer";
import { cn } from "@/lib/cn";

export interface PostFormData {
  slug: string;
  locale: "fa" | "en";
  title: string;
  summary: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  cover?: string;
  status: "draft" | "published";
  publishedAt: string;
  contentJson: Record<string, unknown>;
  contentHtml: string;
}

interface PostFormProps {
  initialData?: Partial<PostFormData>;
  postId?: string;
  isEdit?: boolean;
}

export function PostForm({ initialData, postId, isEdit }: PostFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<PostFormData>({
    slug: initialData?.slug || "",
    locale: initialData?.locale || "fa",
    title: initialData?.title || "",
    summary: initialData?.summary || "",
    tags: initialData?.tags || [],
    author: {
      name: initialData?.author?.name || "کارا پرداز اوند",
      role: initialData?.author?.role || "تیم فنی کارا پرداز",
      avatar: initialData?.author?.avatar || "",
    },
    cover: initialData?.cover || "",
    status: initialData?.status || "draft",
    publishedAt: initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    contentJson: initialData?.contentJson || { type: "doc", content: [] },
    contentHtml: initialData?.contentHtml || "",
  });

  const [tagsInput, setTagsInput] = useState(
    initialData?.tags ? initialData.tags.join("، ") : "",
  );
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      // Auto-generate slug on new posts if user hasn't typed a custom slug
      slug: !isEdit && !prev.slug ? slugifyHeading(newTitle) : prev.slug,
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTagsInput(val);
    const parsedTags = val
      .split(/[،,]/)
      .map((t) => t.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags: parsedTags }));
  };

  const handleAutoSlug = () => {
    if (!formData.title) return;
    setFormData((prev) => ({ ...prev, slug: slugifyHeading(prev.title) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const url = isEdit ? `/api/admin/posts/${postId}` : `/api/admin/posts`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "خطا در ذخیره مقاله.");
      }

      setSuccessMsg(isEdit ? "تغییرات مقاله با موفقیت ذخیره شد." : "مقاله با موفقیت ایجاد شد.");

      if (!isEdit) {
        setTimeout(() => {
          router.push("/admin/posts");
        }, 1200);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "خطای ناشناخته رخ داد.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Messages */}
      {errorMsg && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 dark:border-red-900/40 dark:bg-red-950/20">
          ⚠️ {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="rounded-2xl border border-ok/30 bg-ok/10 p-4 text-sm font-bold text-ok">
          ✓ {successMsg}
        </div>
      )}

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title */}
          <div className="rounded-3xl border border-line bg-panel p-6 shadow-sm">
            <label className="block text-xs font-bold text-muted mb-2">
              عنوان مقاله
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="عنوان مقاله یا یادداشت تحلیلی را وارد کنید..."
              required
              className="w-full text-lg sm:text-xl font-black text-text bg-transparent border-0 border-b border-line pb-2 focus:ring-0 focus:border-blue transition-colors"
            />
          </div>

          {/* Editor / Preview Tabs */}
          <div className="rounded-3xl border border-line bg-panel p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="text-sm font-bold text-text">متن و بدنه مقاله</span>
              <div className="flex items-center gap-1 bg-bg p-1 rounded-xl border border-line">
                <button
                  type="button"
                  onClick={() => setActiveTab("editor")}
                  className={cn(
                    "px-3 py-1 text-xs font-bold rounded-lg transition-colors",
                    activeTab === "editor"
                      ? "bg-panel text-blue shadow-sm"
                      : "text-muted hover:text-text",
                  )}
                >
                  ویرایشگر Tiptap
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={cn(
                    "px-3 py-1 text-xs font-bold rounded-lg transition-colors",
                    activeTab === "preview"
                      ? "bg-panel text-blue shadow-sm"
                      : "text-muted hover:text-text",
                  )}
                >
                  پیش‌نمایش زنده
                </button>
              </div>
            </div>

            {activeTab === "editor" ? (
              <TiptapEditor
                contentJson={formData.contentJson}
                contentHtml={formData.contentHtml}
                locale={formData.locale}
                onChange={(json, html) => {
                  setFormData((prev) => ({
                    ...prev,
                    contentJson: json,
                    contentHtml: html,
                  }));
                }}
              />
            ) : (
              <div
                className="prose prose-slate max-w-none p-5 rounded-2xl border border-line bg-bg/30 min-h-[360px] font-vazirmatn text-text"
                dir={formData.locale === "fa" ? "rtl" : "ltr"}
                dangerouslySetInnerHTML={{
                  __html: formData.contentHtml || "<p className='text-muted'>متنی وجود ندارد.</p>",
                }}
              />
            )}
          </div>
        </div>

        {/* Sidebar Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publish Action Card */}
          <div className="rounded-3xl border border-line bg-panel p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-text border-b border-line pb-2">
              وضعیت و انتشار
            </h3>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5">
                وضعیت انتشار
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as "draft" | "published",
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs font-bold text-text focus:border-blue focus:outline-none"
              >
                <option value="draft">پیش‌نویس (Draft)</option>
                <option value="published">منتشر شده (Published)</option>
              </select>
            </div>

            {/* Locale */}
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5">
                زبان مقاله
              </label>
              <select
                value={formData.locale}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    locale: e.target.value as "fa" | "en",
                  }))
                }
                className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs font-bold text-text focus:border-blue focus:outline-none"
              >
                <option value="fa">فارسی (FA)</option>
                <option value="en">انگلیسی (EN)</option>
              </select>
            </div>

            {/* Published Date */}
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5">
                تاریخ انتشار
              </label>
              <input
                type="date"
                value={formData.publishedAt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, publishedAt: e.target.value }))
                }
                className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs font-mono text-text focus:border-blue focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-blue text-white font-bold text-sm shadow hover:bg-navy-2 transition disabled:opacity-50"
              >
                {loading ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "ایجاد و انتشار مقاله"}
              </button>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="rounded-3xl border border-line bg-panel p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-text border-b border-line pb-2">
              مشخصات و سئو
            </h3>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-muted">اسلاگ (URL)</label>
                <button
                  type="button"
                  onClick={handleAutoSlug}
                  className="text-[11px] font-bold text-blue hover:underline"
                >
                  تولید از عنوان
                </button>
              </div>
              <input
                type="text"
                dir="ltr"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="slug-name"
                required
                className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs font-mono text-text focus:border-blue focus:outline-none"
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5">
                خلاصه مقاله (توضیحات سئو)
              </label>
              <textarea
                rows={3}
                value={formData.summary}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, summary: e.target.value }))
                }
                placeholder="خلاصه ۲ الی ۳ جمله‌ای مقاله..."
                required
                className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs text-text focus:border-blue focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5">
                برچسب‌ها (با ویرگول جدا کنید)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={handleTagsChange}
                placeholder="CRM، هوش مصنوعی، معماری"
                className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs text-text focus:border-blue focus:outline-none"
              />
            </div>

            {/* Cover URL */}
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5">
                آدرس تصویر شاخص (Cover URL)
              </label>
              <input
                type="text"
                dir="ltr"
                value={formData.cover}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, cover: e.target.value }))
                }
                placeholder="/brand/cover.png یا URL مستقیم"
                className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs font-mono text-text focus:border-blue focus:outline-none"
              />
            </div>

            {/* Author */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-muted mb-1.5">
                  نام نویسنده
                </label>
                <input
                  type="text"
                  value={formData.author.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      author: { ...prev.author, name: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs text-text focus:border-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted mb-1.5">
                  سمت نویسنده
                </label>
                <input
                  type="text"
                  value={formData.author.role}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      author: { ...prev.author, role: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs text-text focus:border-blue focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
