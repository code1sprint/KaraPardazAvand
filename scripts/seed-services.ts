import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { connectToDatabase } from "../src/lib/db/mongodb";
import { getServiceModel } from "../src/lib/db/models/Service";

import { crmService } from "../src/content/services/crm";
import { customSoftwareService } from "../src/content/services/custom-software";
import { dataScienceService } from "../src/content/services/data-science";
import { erpService } from "../src/content/services/erp";
import { ragAiService } from "../src/content/services/rag-ai";
import { webPlatformsService } from "../src/content/services/web-platforms";

const ALL_INITIAL_SERVICES = [
  crmService,
  ragAiService,
  dataScienceService,
  erpService,
  webPlatformsService,
  customSoftwareService,
];

async function seed() {
  console.log("Seeding existing 6 services into MongoDB...");
  await connectToDatabase();
  const Service = await getServiceModel();

  for (const s of ALL_INITIAL_SERVICES) {
    const defaultDeepDiveHtml = `
      <div class="callout callout-note" data-callout-type="note">
        <p><strong>ملاحظات معماری و پایپ‌لاین فنی:</strong> این خدمت با رویکرد مقیاس‌پذیری و جداسازی دغدغه‌ها (Separation of Concerns) طراحی شده است تا بار پردازشی به پایگاه داده اصلی آسیب نزند.</p>
      </div>
      <p>در پیاده‌سازی این راهکار، حفظ پایداری سیستم تحت بار تراکنش‌های بالا، معماری ماژولار و یکپارچه‌سازی با نرم‌افزارهای موجود سازمان در اولویت قرار دارد.</p>
      <div data-inline-cta="" data-cta-label="درخواست جلسه ارزیابی فنی این راهکار" data-cta-url="/contact?service=${encodeURIComponent(s.slug)}" data-cta-variant="primary" data-cta-align="center">
        <a href="/contact?service=${encodeURIComponent(s.slug)}" class="inline-flex items-center gap-2 rounded-2xl bg-blue text-white px-6 py-3.5 font-bold text-sm shadow hover:bg-navy-2 transition-all not-prose">
          <span>درخواست جلسه ارزیابی فنی این راهکار</span>
          <span class="text-orange text-xs">◀</span>
        </a>
      </div>
    `.trim();

    const doc = {
      slug: s.slug,
      title: s.title,
      outcome: s.outcome,
      audience: s.audience,
      deliverables: s.deliverables,
      steps: s.steps,
      stack: s.stack,
      systemMap: s.systemMap,
      faqs: s.faqs,
      relatedProjects: s.relatedProjects || [],
      bento: s.bento,
      deepDiveHtml: defaultDeepDiveHtml,
      deepDiveJson: { type: "doc", content: [] },
      status: "published",
    };

    await Service.findOneAndUpdate(
      { slug: s.slug },
      { $set: doc },
      { upsert: true, returnDocument: "after" },
    );

    console.log(`✓ Upserted service: ${s.slug} (${s.title.fa})`);
  }

  const count = await Service.countDocuments();
  console.log(`\n🎉 Successfully seeded all ${count} services into MongoDB!`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
