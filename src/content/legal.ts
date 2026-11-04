import { z } from "zod";
import { loadMdxBySlug, loadMdxCollection } from "@/lib/mdx/load-mdx";
import { parseContent } from "@/lib/content";

export const legalFrontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1).optional(),
  updated: z.union([z.string(), z.date()]).optional(),
});

export type LegalFrontmatter = z.infer<typeof legalFrontmatterSchema>;

export type LegalDoc = {
  slug: string;
  title: string;
  summary?: string;
  updatedIso?: string;
  content: string;
};

const LEGAL_SLUGS = ["privacy", "terms"] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export function isLegalSlug(slug: string): slug is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(slug);
}

export function getLegalSlugs(): LegalSlug[] {
  return [...LEGAL_SLUGS];
}

function toDateIso(value: string | Date | undefined): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toISOString().slice(0, 10);
}

function parseFrontmatter(
  raw: unknown,
  slug: string,
): Omit<LegalDoc, "content"> {
  const data = parseContent(
    legalFrontmatterSchema,
    raw,
    `legal/${slug}.mdx`,
  );
  return {
    slug,
    title: data.title,
    summary: data.summary,
    updatedIso: toDateIso(data.updated),
  };
}

export async function getLegalDoc(slug: string): Promise<LegalDoc | null> {
  "use cache";

  if (!isLegalSlug(slug)) return null;
  const doc = await loadMdxBySlug<unknown>("legal", slug);
  if (!doc) return null;
  const meta = parseFrontmatter(doc.frontmatter, doc.slug);
  return { ...meta, content: doc.content };
}

export async function getAllLegalDocs(): Promise<LegalDoc[]> {
  "use cache";

  const docs = await loadMdxCollection<unknown>("legal");
  return docs
    .filter((doc) => isLegalSlug(doc.slug))
    .map((doc) => {
      const meta = parseFrontmatter(doc.frontmatter, doc.slug);
      return { ...meta, content: doc.content };
    });
}
