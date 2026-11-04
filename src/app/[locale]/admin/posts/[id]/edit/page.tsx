import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getPostModel } from "@/lib/db/models/Post";
import { EditPostClient } from "./EditPostClient";
import { DynamicMarker } from "../../../DynamicMarker";

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
    <>
      <DynamicMarker />
      <EditPostClient
        initialData={initialData}
        postId={id}
        slug={post.slug}
        title={post.title}
      />
    </>
  );
}
