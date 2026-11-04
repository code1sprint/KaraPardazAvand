import type { AppLocale } from "@/i18n/routing";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getLegalDocModel } from "@/lib/db/models/LegalDoc";
import { getLegalDoc as getMdxLegalDoc, getLegalSlugs as getMdxLegalSlugs } from "@/content/legal";
import { slugifyHeading } from "@/lib/mdx/slugify";

export type TocItem = {
  id: string;
  title: string;
  depth: 2 | 3;
};

export type ResolvedLegalDoc = {
  slug: string;
  title: string;
  summary?: string;
  updatedIso?: string;
  html: string;
  toc: TocItem[];
  status: "published" | "draft";
};

/**
 * Extracts H2 and H3 headings from HTML, generates clean IDs,
 * and returns TOC items along with modified HTML that includes heading ids.
 */
export function extractTocFromHtml(html: string): {
  toc: TocItem[];
  htmlWithIds: string;
} {
  const toc: TocItem[] = [];
  const headingRegex = /<h([23])(?:\s+[^>]*)?>([\s\S]*?)<\/h\1>/gi;

  const htmlWithIds = html.replace(
    headingRegex,
    (_fullMatch, levelStr, innerText) => {
      const depth = Number(levelStr) as 2 | 3;
      // Strip any nested tags from innerText for title
      const cleanTitle = innerText.replace(/<[^>]+>/g, "").trim();
      const id = slugifyHeading(cleanTitle) || `heading-${toc.length + 1}`;

      toc.push({ id, title: cleanTitle, depth });
      return `<h${depth} id="${id}" class="scroll-mt-24">${innerText}</h${depth}>`;
    },
  );

  return { toc, htmlWithIds };
}

export async function getResolvedLegalDoc(
  slug: string,
  locale: AppLocale,
): Promise<ResolvedLegalDoc | null> {
  "use cache";

  try {
    await connectToDatabase();
    const LegalDoc = await getLegalDocModel();
    const doc = await LegalDoc.findOne({ slug }).lean();

    if (doc) {
      const title =
        (locale === "en" ? doc.title?.en : doc.title?.fa) ||
        doc.title?.fa ||
        "";
      const summary =
        (locale === "en" ? doc.summary?.en : doc.summary?.fa) ||
        doc.summary?.fa ||
        undefined;

      const rawHtml =
        (locale === "en"
          ? doc.tiptapBody?.en?.html
          : doc.tiptapBody?.fa?.html) ||
        doc.tiptapBody?.fa?.html ||
        "";

      const { toc, htmlWithIds } = extractTocFromHtml(rawHtml);

      return {
        slug: doc.slug,
        title,
        summary,
        updatedIso: doc.updatedIso,
        html: htmlWithIds,
        toc,
        status: doc.status as "published" | "draft",
      };
    }
  } catch {
    // Fall back to MDX during build or DB outage
  }

  // Fallback to static MDX
  const mdxDoc = await getMdxLegalDoc(slug);
  if (!mdxDoc) return null;

  return {
    slug: mdxDoc.slug,
    title: mdxDoc.title,
    summary: mdxDoc.summary,
    updatedIso: mdxDoc.updatedIso,
    html: "", // Handled by MDX compiler in caller if empty
    toc: [],
    status: "published",
  };
}

export async function getAllLegalSlugs(): Promise<string[]> {
  "use cache";

  try {
    await connectToDatabase();
    const LegalDoc = await getLegalDocModel();
    const docs = await LegalDoc.find({ status: "published" })
      .select("slug")
      .lean();
    const slugs = docs.map((d) => d.slug);
    const combined = Array.from(new Set([...slugs, ...getMdxLegalSlugs()]));
    return combined;
  } catch {
    return getMdxLegalSlugs();
  }
}
