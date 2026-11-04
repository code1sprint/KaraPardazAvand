import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import assert from "node:assert";
import { connectToDatabase } from "../src/lib/db/mongodb";
import { getProjectModel } from "../src/lib/db/models/Project";
import { projectCreateSchema } from "../src/lib/validations/project";

async function run() {
  console.log("Testing Project model and validations...");

  const sampleData = {
    slug: "test-project",
    title: "پایلوت سیستم آزمایشی",
    sector: "فروش B2B",
    year: "1403",
    services: ["crm", "custom-software"],
    role: "طراحی و توسعه",
    problem: "چالش پراکندگی داده‌های عملیاتی و نبود شفافیت در گزارش‌دهی.",
    solution: "یکپارچه‌سازی فرآیندها با هسته پردازشی متمرکز و داشبورد زنده.",
    results: [
      {
        label: "کاهش خطای ورود داده",
        value: "۴۵٪",
        source: "گزارش ۳ ماهه پایلوت",
      },
    ],
    stack: ["TypeScript", "PostgreSQL", "Next.js"],
    cover: "/projects/ops-crm-cover.svg",
    gallery: [
      {
        src: "/projects/ops-crm-cover.svg",
        caption: "نمای شماتیک داشبورد",
        alt: "داشبورد",
      },
    ],
    systemMap: {
      windowTitle: "kara://test-pilot",
      layout: "hub" as const,
      descriptionLead: "هسته متمرکز داده",
      description: "ارتباط ورودی‌ها با هسته و خروجی داشبورد.",
      nodes: {
        inputTop: "کانال وب",
        inputBottom: "سیستم مالی",
        core: "هسته پردازش",
        outputTop: "داشبورد مدیریت",
        outputBottom: "اعلان‌ها",
      },
      logs: ["init.ok", "sync.done", "metrics.ready"] as [string, string, string],
    },
    featured: true,
    status: "published" as const,
    contentHtml: "<h2>روایت فنی پروژه</h2><p>توضیحات تکمیلی پیرامون معماری...</p>",
  };

  const parsed = projectCreateSchema.safeParse(sampleData);
  assert.strictEqual(parsed.success, true, "Zod validation must succeed");

  await connectToDatabase();
  const Project = await getProjectModel();

  await Project.deleteOne({ slug: "test-project" });

  const created = await Project.create(parsed.data);
  assert.strictEqual(created.slug, "test-project");
  assert.strictEqual(created.sector, "فروش B2B");
  assert.strictEqual(created.featured, true);

  // Clean up
  await Project.deleteOne({ _id: created._id });

  console.log("PASS: Project model and validation tests succeeded!");
  process.exit(0);
}

run().catch((err) => {
  console.error("FAIL:", err);
  process.exit(1);
});
