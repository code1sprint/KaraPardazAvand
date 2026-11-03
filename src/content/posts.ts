import { connectToDatabase } from "@/lib/db/mongodb";
import { getPostModel, ITocItem } from "@/lib/db/models/Post";
import { type PostStatus } from "@/lib/content";

export type { PostStatus };

export type PostMeta = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  author: string;
  cover?: string;
  status: PostStatus;
  readingTime: string;
  dateIso: string;
  updatedIso?: string;
};

export interface PostDetail {
  meta: PostMeta;
  content: string;
  contentHtml: string;
  toc: ITocItem[];
}

/**
 * Drafts are visible in development so layout can be reviewed.
 * Production builds (`next build` / `next start`) never include drafts.
 */
export function isPostVisible(status: PostStatus): boolean {
  if (status === "published") return true;
  return process.env.NODE_ENV !== "production";
}

function toDateIso(value: Date | string | undefined): string {
  if (!value) return new Date().toISOString().slice(0, 10);
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value).slice(0, 10);
  }
  return parsed.toISOString().slice(0, 10);
}

export async function getAllPosts(locale?: string): Promise<PostMeta[]> {
  try {
    await connectToDatabase();
    const Post = await getPostModel();

    const query: Record<string, unknown> = {};
    if (locale && (locale === "fa" || locale === "en")) {
      query.locale = locale;
    }

    const docs = await Post.find(query)
      .select("-contentJson -contentHtml")
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();

    return docs
      .filter((doc) => isPostVisible(doc.status as PostStatus))
      .map((doc) => ({
        slug: doc.slug,
        title: doc.title,
        summary: doc.summary,
        tags: doc.tags || [],
        author: doc.author?.name || "کارا پرداز اوند",
        cover: doc.cover || undefined,
        status: doc.status as PostStatus,
        readingTime: `${doc.readingTime} دقیقه`,
        dateIso: toDateIso(doc.publishedAt),
        updatedIso: doc.updatedAt ? toDateIso(doc.updatedAt) : undefined,
      }));
  } catch (err) {
    console.warn("[posts] Failed to load posts from database:", err);
    return [];
  }
}

export async function getLatestPosts(limit = 3, locale?: string): Promise<PostMeta[]> {
  const posts = await getAllPosts(locale);
  return posts.slice(0, limit);
}

export async function getFeaturedPost(locale?: string): Promise<PostMeta | null> {
  const posts = await getAllPosts(locale);
  return posts[0] ?? null;
}

export async function getPostBySlug(slug: string, locale?: string): Promise<PostDetail | null> {
  try {
    await connectToDatabase();
    const Post = await getPostModel();

    const query: Record<string, unknown> = { slug };
    if (locale && (locale === "fa" || locale === "en")) {
      query.locale = locale;
    }

    let doc = await Post.findOne(query).lean();
    if (!doc && locale) {
      // Fallback if not specifically found in the requested locale
      doc = await Post.findOne({ slug }).lean();
    }

    if (!doc) return null;
    if (!isPostVisible(doc.status as PostStatus)) return null;

    const meta: PostMeta = {
      slug: doc.slug,
      title: doc.title,
      summary: doc.summary,
      tags: doc.tags || [],
      author: doc.author?.name || "کارا پرداز اوند",
      cover: doc.cover || undefined,
      status: doc.status as PostStatus,
      readingTime: `${doc.readingTime} دقیقه`,
      dateIso: toDateIso(doc.publishedAt),
      updatedIso: doc.updatedAt ? toDateIso(doc.updatedAt) : undefined,
    };

    return {
      meta,
      content: doc.contentHtml || "",
      contentHtml: doc.contentHtml || "",
      toc: (doc.toc as ITocItem[]) || [],
    };
  } catch (err) {
    console.warn(`[posts] Failed to load post ${slug}:`, err);
    return null;
  }
}

export async function getPostSlugs(locale?: string): Promise<string[]> {
  const posts = await getAllPosts(locale);
  return posts.map((post) => post.slug);
}

/** Unique tags across published (visible) posts, frequency-desc then locale sort. */
export function collectPostTags(posts: PostMeta[]): string[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fa"))
    .map(([tag]) => tag);
}

/** Related posts sharing at least one tag, scored by overlap then recency. */
export async function getRelatedPosts(
  slug: string,
  limit = 3,
  locale?: string,
): Promise<PostMeta[]> {
  const posts = await getAllPosts(locale);
  const current = posts.find((post) => post.slug === slug);
  if (!current || current.tags.length === 0) return [];

  const tagSet = new Set(current.tags);
  return posts
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      score: post.tags.reduce(
        (sum, tag) => sum + (tagSet.has(tag) ? 1 : 0),
        0,
      ),
    }))
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.post.dateIso.localeCompare(a.post.dateIso),
    )
    .slice(0, limit)
    .map((entry) => entry.post);
}
