import assert from "node:assert";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { connectToDatabase } from "../src/lib/db/mongodb";
import { getServiceModel } from "../src/lib/db/models/Service";
import { GET as getServicesList, POST as createService } from "../src/app/api/admin/services/route";
import {
  GET as getServiceById,
  PUT as updateServiceById,
  DELETE as deleteServiceById,
} from "../src/app/api/admin/services/[id]/route";
import { signAuthToken } from "../src/lib/auth/jwt";

async function run() {
  console.log("Testing Admin Services API Endpoints...");
  await connectToDatabase();
  const Service = await getServiceModel();

  await Service.deleteMany({ slug: "api-test-service" });

  const adminToken = await signAuthToken({
    sub: "test-admin-id",
    email: "admin@karapardaz.com",
    role: "admin",
    name: "Admin Tester",
  });

  const authHeaders = {
    Authorization: `Bearer ${adminToken}`,
    "Content-Type": "application/json",
  };

  // 1. Test POST /api/admin/services
  const newServiceData = {
    slug: "api-test-service",
    title: { fa: "خدمت آزمایشی روت", en: "Route Test Service" },
    outcome: { fa: "خلاصه بازدهی", en: "Outcome summary" },
    audience: [{ fa: "مدیران عامل", en: "CEOs" }],
    deliverables: [
      {
        title: { fa: "داشبورد اختصاصی", en: "Custom Dashboard" },
        description: { fa: "توضیح خروجی", en: "Output description" },
      },
    ],
    steps: [
      {
        title: { fa: "تحلیل نیاز", en: "Analysis" },
        description: { fa: "شرح مرحله اول", en: "Stage 1 description" },
      },
    ],
    stack: [
      {
        label: { fa: "دیتابیس", en: "Database" },
        items: ["MongoDB", "Redis"],
      },
    ],
    systemMap: {
      windowTitle: "api-test-map",
      layout: "hub",
      descriptionLead: { fa: "معماری سیستم", en: "Architecture" },
      description: { fa: "شرح جریان داده", en: "Flow description" },
      nodes: {
        inputTop: { fa: "وب‌هوک", en: "Webhook" },
        inputBottom: { fa: "فایل اکسل", en: "Excel" },
        core: { fa: "موتور پردازش", en: "Core Engine" },
        outputTop: { fa: "اعلان تلگرام", en: "Telegram" },
        outputBottom: { fa: "داشبورد", en: "Dashboard" },
      },
      logs: [
        { fa: "دریافت درخواست", en: "Request received" },
        { fa: "پردازش در هسته", en: "Processing in core" },
        { fa: "ارسال خروجی به کاربر", en: "Output dispatched" },
      ],
    },
    faqs: [
      {
        id: "faq-test-1",
        question: { fa: "امنیت چگونه تامین می‌شود؟", en: "How is security handled?" },
        answer: { fa: "با رمزنگاری داده‌ها.", en: "With encryption." },
      },
    ],
    relatedProjects: [],
    bento: {
      order: 10,
      span: 4,
      image: "/brand/bento/crm.svg",
      shortTitle: { fa: "خدمت تست", en: "Test Svc" },
    },
    deepDiveHtml: "<p>ملاحظات معماری برای خدمت تستی 1405</p>",
    status: "published",
  };

  const createReq = new Request("http://localhost:3000/api/admin/services", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(newServiceData),
  });

  const createRes = await createService(createReq);
  const createJson = await createRes.json();
  assert.strictEqual(createRes.status, 201, "Expected 201 Created");
  assert.strictEqual(createJson.ok, true);
  assert.strictEqual(createJson.service.slug, "api-test-service");
  const createdId = createJson.service._id;

  // 2. Test GET /api/admin/services
  const listReq = new Request("http://localhost:3000/api/admin/services", {
    headers: authHeaders,
  });
  const listRes = await getServicesList(listReq);
  const listJson = await listRes.json();
  assert.strictEqual(listRes.status, 200);
  assert.strictEqual(listJson.ok, true);
  assert(Array.isArray(listJson.services));
  assert(listJson.services.some((s: { slug: string }) => s.slug === "api-test-service"));

  // 3. Test GET /api/admin/services/[id]
  const getByIdReq = new Request(`http://localhost:3000/api/admin/services/${createdId}`, {
    headers: authHeaders,
  });
  const getByIdRes = await getServiceById(getByIdReq, {
    params: Promise.resolve({ id: createdId }),
  });
  const getByIdJson = await getByIdRes.json();
  assert.strictEqual(getByIdRes.status, 200);
  assert.strictEqual(getByIdJson.service.slug, "api-test-service");

  // 4. Test PUT /api/admin/services/[id]
  const updateReq = new Request(`http://localhost:3000/api/admin/services/${createdId}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify({
      title: { fa: "خدمت آزمایشی ویرایش شده", en: "Updated Service" },
      status: "draft",
    }),
  });
  const updateRes = await updateServiceById(updateReq, {
    params: Promise.resolve({ id: createdId }),
  });
  const updateJson = await updateRes.json();
  assert.strictEqual(updateRes.status, 200);
  assert.strictEqual(updateJson.service.title.fa, "خدمت آزمایشی ویرایش شده");
  assert.strictEqual(updateJson.service.status, "draft");

  // 5. Test DELETE /api/admin/services/[id]
  const deleteReq = new Request(`http://localhost:3000/api/admin/services/${createdId}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  const deleteRes = await deleteServiceById(deleteReq, {
    params: Promise.resolve({ id: createdId }),
  });
  const deleteJson = await deleteRes.json();
  assert.strictEqual(deleteRes.status, 200);
  assert.strictEqual(deleteJson.ok, true);

  // Clean check
  const checkDeleted = await Service.findById(createdId);
  assert.strictEqual(checkDeleted, null, "Doc must be deleted");

  console.log("PASS: Admin Services API Endpoints tests passed!");
  process.exit(0);
}

run().catch((err) => {
  console.error("FAIL:", err);
  process.exit(1);
});
