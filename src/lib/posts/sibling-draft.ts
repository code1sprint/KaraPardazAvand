export type SiblingPostFields = {
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
};

const EMPTY_DOC: Record<string, unknown> = { type: "doc", content: [] };

/**
 * Build a create-mode draft for the other locale of the same slug.
 * Keeps shared metadata starters; clears fields that must be translated.
 */
export function buildSiblingCreateDraft<T extends SiblingPostFields>(
  from: T,
  targetLocale: "fa" | "en",
): T {
  return {
    ...from,
    locale: targetLocale,
    title: "",
    summary: "",
    status: "draft",
    contentJson: { ...EMPTY_DOC, content: [] },
    contentHtml: "",
  };
}
