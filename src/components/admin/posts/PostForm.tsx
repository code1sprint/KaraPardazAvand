"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "@/i18n/navigation";
import { TiptapEditor } from "@/components/admin/editor/TiptapEditor";
import {
  IconAlertTriangle,
  IconCheckCircle,
  IconSparkles,
} from "@/components/admin/editor/EditorIcons";
import { slugifyHeading } from "@/lib/editor/normalizer";
import { highlightHtmlCodeBlocks } from "@/lib/syntax-highlight";
import { cn } from "@/lib/cn";
import { ApiButton } from "@/components/admin/api-drawer/ApiButton";
import { CoverImagePicker } from "@/components/admin/common/CoverImagePicker";

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
  relatedPosts: string[];
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

interface AvailablePostOption {
  id: string;
  slug: string;
  title: string;
  cover?: string;
  status: string;
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
    relatedPosts: initialData?.relatedPosts || [],
    status: initialData?.status || "draft",
    publishedAt: initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    contentJson: initialData?.contentJson || { type: "doc", content: [] },
    contentHtml: initialData?.contentHtml || "",
  });

  const [availablePosts, setAvailablePosts] = useState<AvailablePostOption[]>([]);
  const [relatedSearch, setRelatedSearch] = useState("");

  const [tagsInput, setTagsInput] = useState(
    initialData?.tags ? initialData.tags.join("، ") : "",
  );
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadAvailablePosts() {
      try {
        const res = await fetch(`/api/admin/posts?locale=${formData.locale}`);
        const json = await res.json();
        if (!ignore && json.ok && Array.isArray(json.posts)) {
          setAvailablePosts(
            json.posts
              .filter((p: { _id?: string; slug: string }) => p._id !== postId && p.slug !== formData.slug)
              .map((p: { _id?: string; id?: string; slug: string; title: string; cover?: string; status: string }) => ({
                id: p._id || p.id || p.slug,
                slug: p.slug,
                title: p.title,
                cover: p.cover,
                status: p.status,
              })),
          );
        }
      } catch (err) {
        console.warn("Failed to fetch posts for related picker:", err);
      }
    }
    loadAvailablePosts();
    return () => {
      ignore = true;
    };
  }, [formData.locale, formData.slug, postId]);

  // Synchronize form if updated via API Drawer or background event
  useEffect(() => {
    if (!postId) return;
    const handleRemoteUpdate = async (e: Event) => {
      const customEvent = e as CustomEvent<{
        resource?: string;
        path?: string;
        data?: { post?: Partial<PostFormData> };
      }>;
      const pathMatches = customEvent.detail?.path?.includes(postId) || customEvent.detail?.path?.includes(formData.slug);
      const isPostResource = customEvent.detail?.resource === "posts" || customEvent.detail?.path?.includes("/posts");

      if (isPostResource && (pathMatches || isEdit)) {
        try {
          const res = await fetch(`/api/admin/posts/${postId}`);
          const json = await res.json();
          if (json.ok && json.post) {
            const p = json.post;
            setFormData((prev) => ({
              ...prev,
              slug: p.slug ?? prev.slug,
              locale: p.locale ?? prev.locale,
              title: p.title ?? prev.title,
              summary: p.summary ?? prev.summary,
              tags: p.tags ?? prev.tags,
              author: p.author ?? prev.author,
              cover: p.cover ?? prev.cover,
              relatedPosts: p.relatedPosts ?? prev.relatedPosts,
              status: p.status ?? prev.status,
              publishedAt: p.publishedAt
                ? new Date(p.publishedAt).toISOString().slice(0, 10)
                : prev.publishedAt,
              contentJson: p.contentJson ?? prev.contentJson,
              contentHtml: p.contentHtml ?? prev.contentHtml,
            }));
            if (p.tags) {
              setTagsInput(p.tags.join("، "));
            }
            setSuccessMsg("محتوا با موفقیت از طریق API به‌روزرسانی و در ادیتور همگام شد.");
          }
        } catch {
          // Ignore background fetch failure
        }
      }
    };

    window.addEventListener("kara-content-updated", handleRemoteUpdate);
    return () => {
      window.removeEventListener("kara-content-updated", handleRemoteUpdate);
    };
  }, [postId, isEdit, formData.slug]);

  const toggleRelatedPost = (slug: string) => {
    setFormData((prev) => {
      const exists = prev.relatedPosts.includes(slug);
      return {
        ...prev,
        relatedPosts: exists
          ? prev.relatedPosts.filter((s) => s !== slug)
          : [...prev.relatedPosts, slug],
      };
    });
  };

  const removeRelatedPost = (slug: string) => {
    setFormData((prev) => ({
      ...prev,
      relatedPosts: prev.relatedPosts.filter((s) => s !== slug),
    }));
  };

  const filteredAvailablePosts = useMemo(() => {
    if (!relatedSearch.trim()) return availablePosts;
    const q = relatedSearch.toLowerCase();
    return availablePosts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q),
    );
  }, [availablePosts, relatedSearch]);

  const handleAiSuggest = async () => {
    setAiLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/admin/posts/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          contentHtml: formData.contentHtml,
          locale: formData.locale,
        }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        if (json.suggestedSummary) {
          setFormData((prev) => ({ ...prev, summary: json.suggestedSummary }));
        }

        if (json.suggestedTags && json.suggestedTags.length > 0) {
          setFormData((prev) => ({ ...prev, tags: json.suggestedTags }));
          setTagsInput(json.suggestedTags.join("، "));
        }

        if (json.suggestedTitle && !formData.title) {
          setFormData((prev) => ({
            ...prev,
            title: json.suggestedTitle,
            slug: !prev.slug ? slugifyHeading(json.suggestedTitle) : prev.slug,
          }));
        }
        setSuccessMsg("پیشنهادات هوش مصنوعی برای سئو و برچسب‌ها اعمال شد.");
      }
    } catch {
      setErrorMsg("خطا در برقراری ارتباط با سرویس هوش مصنوعی.");
    } finally {
      setAiLoading(false);
    }
  };

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
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 dark:border-red-900/40 dark:bg-red-950/20 inline-flex items-center gap-2 w-full">
          <IconAlertTriangle className="size-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="rounded-2xl border border-ok/30 bg-ok/10 p-4 text-sm font-bold text-ok inline-flex items-center gap-2 w-full">
          <IconCheckCircle className="size-4 shrink-0 text-ok" />
          <span>{successMsg}</span>
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
                className="prose prose-slate max-w-none p-6 rounded-2xl border border-line bg-panel min-h-[360px] font-vazirmatn text-text"
                dir={formData.locale === "fa" ? "rtl" : "ltr"}
                dangerouslySetInnerHTML={{
                  __html:
                    highlightHtmlCodeBlocks(formData.contentHtml) ||
                    "<p class='text-muted'>متنی وجود ندارد.</p>",
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

            <div className="pt-2 space-y-2">
              <ApiButton
                variant="secondary"
                label="مدیریت API این مقاله"
                className="w-full justify-center py-2"
              />
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
            <div className="flex items-center justify-between border-b border-line pb-2">
              <h3 className="text-sm font-bold text-text">
                مشخصات و سئو
              </h3>
              <button
                type="button"
                onClick={handleAiSuggest}
                disabled={aiLoading}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg border border-orange/40 bg-orange/10 text-orange hover:bg-orange/20 transition-colors disabled:opacity-50"
                title="تکمیل خودکار خلاصه سئو و برچسب‌ها با تحلیل محتوای مقاله"
              >
                <IconSparkles className="size-3 text-orange shrink-0" />
                <span>{aiLoading ? "در حال تحلیل..." : "پیشنهاد هوش مصنوعی"}</span>
              </button>
            </div>

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

            {/* Cover Image Picker */}
            <CoverImagePicker
              value={formData.cover || ""}
              onChange={(url) => setFormData((prev) => ({ ...prev, cover: url }))}
              label="تصویر شاخص مقاله (Cover Image)"
              altText="پیش‌نمایش تصویر شاخص مقاله"
            />

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

          {/* Related Posts Card */}
          <div className="rounded-3xl border border-line bg-panel p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <div>
                <h3 className="text-sm font-bold text-text">مقالات مرتبط</h3>
                <p className="text-[11px] text-muted mt-0.5">
                  انتخاب دستی مقالاتی که در انتهای این مطلب نمایش داده می‌شوند.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue bg-blue/10 px-2.5 py-1 rounded-full shrink-0">
                {formData.relatedPosts.length} مورد
              </span>
            </div>

            {/* Selected Posts badges */}
            {formData.relatedPosts.length > 0 ? (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-muted block">موارد انتخاب‌شده:</span>
                <div className="flex flex-wrap gap-1.5">
                  {formData.relatedPosts.map((slug) => {
                    const item = availablePosts.find((p) => p.slug === slug);
                    const title = item?.title || slug;
                    return (
                      <span
                        key={slug}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue/30 bg-blue/10 px-2.5 py-1 text-xs font-medium text-blue"
                      >
                        <span className="max-w-[160px] truncate" title={title}>
                          {title}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeRelatedPost(slug)}
                          className="text-blue hover:text-red-500 font-bold transition-colors"
                          title="حذف"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-muted leading-relaxed">
                مقاله‌ای انتخاب نشده است (در این حالت مقالات بر اساس برچسب‌ها خودکار نمایش داده می‌شوند).
              </p>
            )}

            {/* Search filter */}
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5">
                جستجو و انتخاب از مقالات موجود
              </label>
              <input
                type="text"
                value={relatedSearch}
                onChange={(e) => setRelatedSearch(e.target.value)}
                placeholder="جستجو در بین مقالات..."
                className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs text-text focus:border-blue focus:outline-none"
              />
            </div>

            {/* Available Posts list with quick toggle */}
            <div className="max-h-52 overflow-y-auto space-y-1 rounded-xl border border-line bg-bg/50 p-2">
              {filteredAvailablePosts.length === 0 ? (
                <p className="p-3 text-center text-xs text-muted">مقاله‌ای یافت نشد.</p>
              ) : (
                filteredAvailablePosts.map((post) => {
                  const isSelected = formData.relatedPosts.includes(post.slug);
                  return (
                    <button
                      type="button"
                      key={post.slug}
                      onClick={() => toggleRelatedPost(post.slug)}
                      className={cn(
                        "w-full flex items-center justify-between gap-2 p-2 rounded-lg text-start transition-colors text-xs",
                        isSelected
                          ? "bg-blue/10 border border-blue/30 text-blue font-bold"
                          : "hover:bg-panel border border-transparent text-text",
                      )}
                    >
                      <span className="truncate">{post.title}</span>
                      <span
                        className={cn(
                          "shrink-0 px-2 py-0.5 rounded text-[10px] font-bold transition-colors",
                          isSelected
                            ? "bg-blue text-white"
                            : "bg-panel border border-line text-muted",
                        )}
                      >
                        {isSelected ? "انتخاب‌شده ✓" : "افزودن +"}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
