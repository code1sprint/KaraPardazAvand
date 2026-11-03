import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type MdxDocument<TFrontmatter> = {
  slug: string;
  filePath: string;
  frontmatter: TFrontmatter;
  content: string;
};

/**
 * Shared MDX collection loader (posts, projects, legal).
 * Reads `*.mdx` from a content directory under `src/content`.
 */
export async function loadMdxCollection<TFrontmatter>(
  relativeDir: string,
): Promise<MdxDocument<TFrontmatter>[]> {
  const dir = path.join(process.cwd(), "src/content", relativeDir);

  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const docs: MdxDocument<TFrontmatter>[] = [];

  for (const entry of entries) {
    if (!entry.endsWith(".mdx")) continue;
    const filePath = path.join(dir, entry);
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);
    const slug = entry.replace(/\.mdx$/, "");

    docs.push({
      slug,
      filePath,
      frontmatter: data as TFrontmatter,
      content: content.trim(),
    });
  }

  return docs;
}

export async function loadMdxBySlug<TFrontmatter>(
  relativeDir: string,
  slug: string,
): Promise<MdxDocument<TFrontmatter> | null> {
  const docs = await loadMdxCollection<TFrontmatter>(relativeDir);
  return docs.find((doc) => doc.slug === slug) ?? null;
}
