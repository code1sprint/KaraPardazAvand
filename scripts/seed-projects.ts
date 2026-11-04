import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { connectToDatabase } from "../src/lib/db/mongodb";
import { getProjectModel } from "../src/lib/db/models/Project";

async function seed() {
  console.log("Seeding existing pilot projects into MongoDB...");
  await connectToDatabase();
  const Project = await getProjectModel();

  const projectsDir = path.join(process.cwd(), "src/content/projects");
  const files = await fs.readdir(projectsDir);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));

  for (const file of mdxFiles) {
    const filePath = path.join(projectsDir, file);
    const raw = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(raw);

    const doc = {
      slug: data.slug || file.replace(/\.mdx$/, ""),
      title: data.title || "",
      sector: data.sector || "خدمات سازمانی",
      year: String(data.year || "1403"),
      services: data.services || [],
      role: data.role || "",
      problem: data.problem || "",
      solution: data.solution || "",
      results: data.results || [],
      stack: data.stack || [],
      cover: data.cover || "/projects/ops-crm-cover.svg",
      gallery: data.gallery || [],
      systemMap: data.systemMap || {
        windowTitle: "kara://pilot",
        layout: "hub",
        descriptionLead: "معماری پایلوت",
        description: "شرح جریان داده",
        nodes: {
          inputTop: "ورودی ۱",
          inputBottom: "ورودی ۲",
          core: "هسته",
          outputTop: "خروجی ۱",
          outputBottom: "خروجی ۲",
        },
        logs: ["init.ok", "sync.done", "ready.ok"],
      },
      featured: data.featured ?? true,
      status: data.status || "published", // Make visible for reviewing
      contentHtml: content.trim()
        ? `<p>${content.trim()}</p>`
        : "",
      contentJson: { type: "doc", content: [] },
    };

    await Project.findOneAndUpdate(
      { slug: doc.slug },
      { $set: doc },
      { upsert: true, returnDocument: "after" },
    );

    console.log(`✓ Upserted project: ${doc.slug} («${doc.title}»)`);
  }

  const count = await Project.countDocuments();
  console.log(`\n🎉 Successfully seeded ${count} projects into MongoDB!`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
