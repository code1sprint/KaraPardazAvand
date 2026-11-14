import { revalidatePath, revalidateTag } from "next/cache";

export const postsCacheTag = "posts";

export function postsLocaleCacheTag(locale: "fa" | "en"): string {
  return `posts:${locale}`;
}

/** Public routes that embed post lists and must refresh after mutations. */
export function postsPublicPaths(locale?: "fa" | "en"): string[] {
  const locales: Array<"fa" | "en"> =
    locale === "fa" || locale === "en" ? [locale] : ["fa", "en"];
  const paths: string[] = [];
  for (const loc of locales) {
    paths.push(`/${loc}/insights`, `/${loc}`);
  }
  paths.push("/insights/rss.xml");
  return paths;
}

/**
 * Invalidate post data + full route cache after admin create/update/delete.
 * Tag-only revalidation is not enough: insights index is statically rendered
 * at build (often with an empty DB), so paths must be revalidated too.
 */
export function revalidatePostsCache(locale?: "fa" | "en"): void {
  revalidateTag(postsCacheTag, { expire: 0 });
  if (locale === "fa" || locale === "en") {
    revalidateTag(postsLocaleCacheTag(locale), { expire: 0 });
  } else {
    revalidateTag(postsLocaleCacheTag("fa"), { expire: 0 });
    revalidateTag(postsLocaleCacheTag("en"), { expire: 0 });
  }

  for (const path of postsPublicPaths(locale)) {
    revalidatePath(path);
  }
}
