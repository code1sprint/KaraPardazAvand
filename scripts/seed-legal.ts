import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { connectToDatabase } from "../src/lib/db/mongodb";
import { getLegalDocModel } from "../src/lib/db/models/LegalDoc";

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
      const title = trimmed.replace(/^##\s+/, "");
      htmlParts.push(`<h2>${title}</h2>`);
    } else if (trimmed.startsWith("### ")) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      const title = trimmed.replace(/^###\s+/, "");
      htmlParts.push(`<h3>${title}</h3>`);
    } else if (trimmed.startsWith("- ")) {
      if (!inList) {
        htmlParts.push("<ul>");
        inList = true;
      }
      const item = trimmed.replace(/^-+\s+/, "");
      htmlParts.push(`<li>${item}</li>`);
    } else {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      htmlParts.push(`<p>${trimmed}</p>`);
    }
  }

  if (inList) {
    htmlParts.push("</ul>");
  }

  return htmlParts.join("");
}

async function seed() {
  console.log("Seeding Legal documents into MongoDB...");
  await connectToDatabase();
  const LegalDoc = await getLegalDocModel();

  const legalFiles = [
    {
      slug: "terms",
      filePath: "src/content/legal/terms.mdx",
      titleEn: "Terms of Service",
      summaryEn: "Framework for site terms of service.",
    },
    {
      slug: "privacy",
      filePath: "src/content/legal/privacy.mdx",
      titleEn: "Privacy Policy",
      summaryEn: "Framework for privacy policy and data security.",
    },
  ];

  for (const item of legalFiles) {
    const fullPath = path.join(process.cwd(), item.filePath);
    const raw = await fs.readFile(fullPath, "utf-8");
    const { data, content } = matter(raw);

    const html = markdownToBasicHtml(content);

    const doc = {
      slug: item.slug,
      title: {
        fa: data.title || (item.slug === "terms" ? "شرایط استفاده" : "حریم خصوصی"),
        en: item.titleEn,
      },
      summary: {
        fa: data.summary || "",
        en: item.summaryEn,
      },
      updatedIso:
        data.updated instanceof Date
          ? data.updated.toISOString().slice(0, 10)
          : String(data.updated || "2026-01-01"),
      tiptapBody: {
        fa: {
          html,
          json: null,
        },
        en: {
          html: `<p>English translation for ${item.titleEn} will be provided following official legal review.</p>`,
          json: null,
        },
      },
      status: "published" as const,
    };

    const existing = await LegalDoc.findOne({ slug: item.slug });
    if (!existing) {
      await LegalDoc.create(doc);
      console.log(`Created legal doc: ${item.slug}`);
    } else {
      console.log(`Legal doc ${item.slug} already exists, skipping.`);
    }
  }

  console.log("Legal documents seeded successfully.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Legal seed error:", err);
  process.exit(1);
});
