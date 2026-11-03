import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getPostModel } from "@/lib/db/models/Post";
import { PostForm } from "@/components/admin/posts/PostForm";

interface EditPostPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  await connectToDatabase();
  const Post = await getPostModel();

  let post = null;
  try {
    post = await Post.findById(id).lean();
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  const initialData = {
    slug: post.slug,
    locale: post.locale as "fa" | "en",
    title: post.title,
    summary: post.summary,
    tags: post.tags || [],
    author: {
      name: post.author?.name || "کارا پرداز اوند",
      role: post.author?.role || "تیم فنی کارا پرداز",
      avatar: post.author?.avatar || "",
    },
    cover: post.cover || "",
    status: post.status as "draft" | "published",
    publishedAt: post.publishedAt
      ? new Date(post.publishedAt).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    contentJson: (post.contentJson as Record<string, unknown>) || { type: "doc", content: [] },
    contentHtml: post.contentHtml || "",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-text sm:text-2xl">
            ویرایش مقاله: {post.title}
          </h1>
          <p className="mt-1 text-sm text-muted">
            ویرایش محتوا و متادیتای مقاله با اسلاگ <span className="font-mono text-xs">{post.slug}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/insights/${post.slug}`}
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
      <PostForm initialData={initialData} postId={id} isEdit />
    </div>
  );
}
