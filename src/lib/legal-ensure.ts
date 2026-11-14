import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Model } from "mongoose";
import type { ILegalDoc } from "@/lib/db/models/LegalDoc";

const CORE_SLUGS = ["privacy", "terms"] as const;

type CoreSlug = (typeof CORE_SLUGS)[number];

const CORE_META: Record<
  CoreSlug,
  { titleEn: string; summaryEn: string; file: string }
> = {
  privacy: {
    titleEn: "Privacy Policy",
    summaryEn:
      "What Kara Pardaz Avand collects from visitors and contact forms, how it is used, and how it is protected.",
    file: "src/content/legal/privacy.mdx",
  },
  terms: {
    titleEn: "Terms of Use",
    summaryEn:
      "Website terms for Kara Pardaz Avand: content ownership, liability limits, and how site use differs from a delivery contract.",
    file: "src/content/legal/terms.mdx",
  },
};

function markdownToBasicHtml(md: string): string {
  const lines = md.split("\n");
  const htmlParts: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      continue;
    }

    if (trimmed.startsWith("## ")) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      htmlParts.push(`<h2>${trimmed.replace(/^##\s+/, "")}</h2>`);
    } else if (trimmed.startsWith("### ")) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      htmlParts.push(`<h3>${trimmed.replace(/^###\s+/, "")}</h3>`);
    } else if (trimmed.startsWith("- ")) {
      if (!inList) {
        htmlParts.push("<ul>");
        inList = true;
      }
      htmlParts.push(`<li>${trimmed.replace(/^-+\s+/, "")}</li>`);
    } else {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      const withBold = trimmed.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      htmlParts.push(`<p>${withBold}</p>`);
    }
  }

  if (inList) {
    htmlParts.push("</ul>");
  }

  return htmlParts.join("");
}

async function loadPayloadJson(slug: CoreSlug): Promise<Record<string, unknown> | null> {
  try {
    const payloadPath = path.join(
      process.cwd(),
      "tmp/admin-legal-payloads",
      `${slug}.json`,
    );
    const raw = await fs.readFile(payloadPath, "utf-8");
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function buildDocFromMdx(slug: CoreSlug): Promise<Record<string, unknown>> {
  const meta = CORE_META[slug];
  const fullPath = path.join(process.cwd(), meta.file);
  const raw = await fs.readFile(fullPath, "utf-8");
  const { data, content } = matter(raw);
  const html = markdownToBasicHtml(content);

  return {
    slug,
    title: {
      fa: String(data.title || (slug === "terms" ? "شرایط استفاده" : "سیاست حریم خصوصی")),
      en: meta.titleEn,
    },
    summary: {
      fa: String(data.summary || ""),
      en: meta.summaryEn,
    },
    updatedIso:
      data.updated instanceof Date
        ? data.updated.toISOString().slice(0, 10)
        : String(data.updated || new Date().toISOString().slice(0, 10)),
    tiptapBody: {
      fa: { html, json: null },
      en: {
        html: `<p>${meta.summaryEn}</p>`,
        json: null,
      },
    },
    seo: {
      title: { fa: "", en: "" },
      description: { fa: "", en: "" },
    },
    status: "published",
  };
}

/**
 * Ensures privacy + terms exist in Mongo so admin panel lists them.
 * Prefers tmp JSON payloads (full fa/en) when present; else MDX.
 */
export async function ensureCoreLegalDocs(
  LegalDoc: Model<ILegalDoc>,
): Promise<void> {
  for (const slug of CORE_SLUGS) {
    const existing = await LegalDoc.findOne({ slug }).select("_id").lean();
    if (existing) continue;

    const fromJson = await loadPayloadJson(slug);
    const doc = fromJson ?? (await buildDocFromMdx(slug));
    await LegalDoc.create(doc);
  }
}
