import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import matter from "gray-matter";
import { connectToDatabase } from "../src/lib/db/mongodb";
import { getPostModel } from "../src/lib/db/models/Post";
import { processPostContent } from "../src/lib/editor/normalizer";

function markdownToHtml(md: string): string {
  const lines = md.trim().split("\n");
  const htmlParts: string[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "";
  let paragraphBuffer: string[] = [];

  function flushParagraph() {
    if (paragraphBuffer.length > 0) {
      const text = paragraphBuffer.join(" ").trim();
      if (text) {
        htmlParts.push(`<p>${text}</p>`);
      }
      paragraphBuffer = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (!inCodeBlock) {
        flushParagraph();
        inCodeBlock = true;
        codeLang = trimmed.slice(3).trim();
        codeBuffer = [];
      } else {
        inCodeBlock = false;
        const codeContent = codeBuffer.join("\n");
        htmlParts.push(
          `<pre dir="ltr"><code class="language-${codeLang || "plaintext"}">${codeContent}</code></pre>`,
        );
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      htmlParts.push(`<h2>${trimmed.slice(3).trim()}</h2>`);
    } else if (trimmed.startsWith("### ")) {
      flushParagraph();
      htmlParts.push(`<h3>${trimmed.slice(4).trim()}</h3>`);
    } else if (trimmed === "") {
      flushParagraph();
    } else {
      paragraphBuffer.push(trimmed);
    }
  }

  flushParagraph();
  return htmlParts.join("\n");
}

async function seed() {
  console.log("Seeding posts from MDX into MongoDB...");
  await connectToDatabase();
  const Post = await getPostModel();

  const postsDir = path.join(process.cwd(), "src/content/posts");
  const files = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const fullPath = path.join(postsDir, file);
    const rawContent = fs.readFileSync(fullPath, "utf-8");
    const { data: frontmatter, content } = matter(rawContent);

    const slug = frontmatter.slug || file.replace(/\.mdx$/, "");
    const rawHtml = markdownToHtml(content);
    const processed = processPostContent(rawHtml, "fa");

    const authorObj =
      typeof frontmatter.author === "string"
        ? { name: frontmatter.author, role: "تیم فنی کارا پرداز" }
        : {
            name: frontmatter.author?.name || "کارا پرداز اوند",
            role: frontmatter.author?.role || "تیم فنی کارا پرداز",
          };

    const doc = {
      slug,
      locale: "fa" as const,
      title: frontmatter.title || slug,
      summary: frontmatter.summary || "",
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      author: authorObj,
      cover: frontmatter.cover || "",
      status: (frontmatter.status === "draft" ? "draft" : "published") as "draft" | "published",
      readingTime: processed.readingTime,
      publishedAt: frontmatter.date ? new Date(frontmatter.date) : new Date(),
      toc: processed.toc,
      contentJson: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: content }],
          },
        ],
      },
      contentHtml: processed.contentHtml,
    };

    await Post.findOneAndUpdate(
      { slug, locale: "fa" },
      { $set: doc },
      { upsert: true, returnDocument: "after" },
    );

    console.log(`✓ Seeded post: ${slug} (${doc.title})`);
  }

  console.log("Successfully seeded all posts into MongoDB!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Failed to seed posts:", err);
  process.exit(1);
});
