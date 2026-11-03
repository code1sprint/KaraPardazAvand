import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import assert from "node:assert";
import { connectToDatabase } from "../src/lib/db/mongodb";
import { getServiceModel } from "../src/lib/db/models/Service";
import { serviceCreateSchema } from "../src/lib/validations/service";

async function run() {
  console.log("Testing Service model and validations...");

  // 1. Validate Schema
  const sampleData = {
    slug: "test-service",
    title: { fa: "خدمت آزمایشی", en: "Test Service" },
    outcome: { fa: "خلاصه آزمایشی", en: "Test Outcome" },
    audience: [{ fa: "مخاطب ۱", en: "Audience 1" }],
    deliverables: [
      {
        title: { fa: "خروجی ۱", en: "Deliverable 1" },
        description: { fa: "توضیح ۱", en: "Desc 1" },
      },
    ],
    steps: [
      {
        title: { fa: "گام ۱", en: "Step 1" },
        description: { fa: "شرح گام ۱", en: "Desc step 1" },
      },
    ],
    stack: [
      {
        label: { fa: "بک‌اند", en: "Backend" },
        items: ["Node.js", "PostgreSQL"],
      },
    ],
    systemMap: {
      windowTitle: "test-service-map",
      layout: "hub" as const,
      descriptionLead: { fa: "راهنما", en: "Lead" },
      description: { fa: "توضیح نقشه", en: "Map desc" },
      nodes: {
        inputTop: { fa: "ورودی بالا", en: "Top In" },
        inputBottom: { fa: "ورودی پایین", en: "Bottom In" },
        core: { fa: "هسته پردازش", en: "Core" },
        outputTop: { fa: "خروجی بالا", en: "Top Out" },
        outputBottom: { fa: "خروجی پایین", en: "Bottom Out" },
      },
      logs: [
        { fa: "لاگ ۱", en: "Log 1" },
        { fa: "لاگ ۲", en: "Log 2" },
        { fa: "لاگ ۳", en: "Log 3" },
      ] as [{ fa: string; en: string }, { fa: string; en: string }, { fa: string; en: string }],
    },
    faqs: [
      {
        id: "faq-test-1",
        question: { fa: "سوال ۱؟", en: "Question 1?" },
        answer: { fa: "پاسخ ۱.", en: "Answer 1." },
      },
    ],
    relatedProjects: ["test-project"],
    bento: {
      order: 1,
      span: 4 as const,
      image: "/brand/bento/crm.svg",
      shortTitle: { fa: "خدمت آزمایشی", en: "Test" },
    },
    deepDiveHtml: "<p>جزییات عمیق معماری خدمت...</p>",
    status: "published" as const,
  };

  const parsed = serviceCreateSchema.safeParse(sampleData);
  assert.strictEqual(parsed.success, true, "Zod validation must pass for valid service");

  // 2. Database Upsert and Query
  await connectToDatabase();
  const Service = await getServiceModel();

  await Service.deleteOne({ slug: "test-service" });

  const created = await Service.create(parsed.data);
  assert.strictEqual(created.slug, "test-service");
  assert.strictEqual(created.title.fa, "خدمت آزمایشی");
  assert.strictEqual(created.systemMap.layout, "hub");

  // Clean up
  await Service.deleteOne({ _id: created._id });

  console.log("PASS: Service model and validation tests succeeded!");
  process.exit(0);
}

run().catch((err) => {
  console.error("FAIL:", err);
  process.exit(1);
});
