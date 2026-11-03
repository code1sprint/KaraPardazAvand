import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { postInputSchema } from "../src/lib/validations/post";
import { getPostModel } from "../src/lib/db/models/Post";
import { connectToDatabase } from "../src/lib/db/mongodb";

async function main() {
  console.log("Testing Post model and validations...");

  // 1. Zod validation test
  const validData = {
    slug: "test-slug-1",
    locale: "fa" as const,
    title: "عنوان تست برای مقاله",
    summary: "این یک متن خلاصه حداقل ده کلمه‌ای برای تست ولیدیشن است.",
    tags: ["تست", "معماری"],
    author: {
      name: "سهیل",
      role: "مدیر فنی",
    },
    status: "draft" as const,
    publishedAt: new Date(),
    contentJson: { type: "doc", content: [] },
    contentHtml: "<p>محتوای تست</p>",
  };

  const parsed = postInputSchema.safeParse(validData);
  if (!parsed.success) {
    throw new Error(`Zod failed valid input: ${JSON.stringify(parsed.error.issues)}`);
  }

  const invalidSlug = postInputSchema.safeParse({ ...validData, slug: "INVALID SLUG!" });
  if (invalidSlug.success) {
    throw new Error("Zod should have failed uppercase/spaces in slug");
  }

  // 2. Mongoose DB test
  await connectToDatabase();
  const Post = await getPostModel();

  // Clean up any lingering test doc
  await Post.deleteMany({ slug: "test-slug-1" });

  const created = await Post.create({
    ...validData,
    readingTime: 3,
    toc: [{ id: "section-1", title: "بخش اول", depth: 2 }],
  });

  if (!created._id) {
    throw new Error("Failed to create post document in DB");
  }

  // Verify duplicate { slug, locale } throws
  let duplicateThrew = false;
  try {
    await Post.create({
      ...validData,
      title: "Duplicate",
    });
  } catch (err: any) {
    duplicateThrew = true;
  }

  if (!duplicateThrew) {
    throw new Error("Expected compound index { slug, locale } to throw duplicate error");
  }

  // Cleanup
  await Post.deleteMany({ slug: "test-slug-1" });
  console.log("PASS: Post model and validation tests succeeded!");
  process.exit(0);
}

main().catch((err) => {
  console.error("FAIL:", err);
  process.exit(1);
});
