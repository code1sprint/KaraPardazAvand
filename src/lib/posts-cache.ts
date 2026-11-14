import { revalidateTag } from "next/cache";

export const postsCacheTag = "posts";

export function postsLocaleCacheTag(locale: "fa" | "en"): string {
  return `posts:${locale}`;
}

/** Invalidate public post lists after admin create/update/delete. */
export function revalidatePostsCache(locale?: "fa" | "en"): void {
  revalidateTag(postsCacheTag, "max");
  if (locale === "fa" || locale === "en") {
    revalidateTag(postsLocaleCacheTag(locale), "max");
  } else {
    revalidateTag(postsLocaleCacheTag("fa"), "max");
    revalidateTag(postsLocaleCacheTag("en"), "max");
  }
}
