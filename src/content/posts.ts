import { loadMdxBySlug, loadMdxCollection } from "@/lib/mdx";
import {
  parseContent,
  postSchema,
  type Post,
  type PostStatus,
} from "@/lib/content";

export const postFrontmatterSchema = postSchema;
export type PostFrontmatter = Post;
export type { PostStatus };

export type PostMeta = Omit<PostFrontmatter, "slug" | "date" | "updated"> & {
  slug: string;
  dateIso: string;
  updatedIso?: string;
};

/**
 * Drafts are visible in development so layout can be reviewed.
 * Production builds (`next build` / `next start`) never include drafts.
 */
export function isPostVisible(status: PostStatus): boolean {
  if (status === "published") return true;
  return process.env.NODE_ENV !== "production";
}

function toDateIso(value: string | Date | undefined): string | undefined {
  if (value == null) return undefined;
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toISOString().slice(0, 10);
}

function parseFrontmatter(raw: unknown, fileSlug: string): PostMeta {
  const data = parseContent(postSchema, raw, `posts/${fileSlug}.mdx`);
  const updatedIso = toDateIso(data.updated);
  return {
    title: data.title,
    summary: data.summary,
    tags: data.tags,
    author: data.author,
    cover: data.cover,
    status: data.status,
    readingTime: data.readingTime,
    slug: data.slug ?? fileSlug,
    dateIso: toDateIso(data.date) ?? String(data.date),
    ...(updatedIso ? { updatedIso } : {}),
  };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  "use cache";

  const docs = await loadMdxCollection<unknown>("posts");
  const posts = docs
    .map((doc) => parseFrontmatter(doc.frontmatter, doc.slug))
    .filter((post) => isPostVisible(post.status));

  return posts.sort((a, b) => b.dateIso.localeCompare(a.dateIso));
}

export async function getLatestPosts(limit = 3): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
}

export async function getFeaturedPost(): Promise<PostMeta | null> {
  const posts = await getAllPosts();
  return posts[0] ?? null;
}

export async function getPostBySlug(slug: string) {
  "use cache";

  const doc = await loadMdxBySlug<unknown>("posts", slug);
  if (!doc) return null;
  const meta = parseFrontmatter(doc.frontmatter, doc.slug);
  if (!isPostVisible(meta.status)) return null;
  return { meta, content: doc.content };
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
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
): Promise<PostMeta[]> {
  const posts = await getAllPosts();
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
