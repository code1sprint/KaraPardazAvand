import assert from "node:assert";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { connectToDatabase } from "../src/lib/db/mongodb";
import { getProjectModel } from "../src/lib/db/models/Project";
import { GET as getProjectsList, POST as createProject } from "../src/app/api/admin/projects/route";
import {
  GET as getProjectById,
  PUT as updateProjectById,
  DELETE as deleteProjectById,
} from "../src/app/api/admin/projects/[id]/route";
import { signAuthToken } from "../src/lib/auth/jwt";

async function run() {
  console.log("Testing Admin Projects API Endpoints...");
  await connectToDatabase();
  const Project = await getProjectModel();

  await Project.deleteMany({ slug: "api-test-project" });

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

  // 1. Test POST /api/admin/projects
  const newProjectData = {
    slug: "api-test-project",
    title: "پایلوت پروژه‌ای برای تست روت‌ها",
    sector: "فین‌تک",
    year: "1403",
    services: ["crm"],
    role: "معماری محصول",
    problem: "گلوگاه‌های پردازش تراکنش و گزارش‌گیری دستی.",
    solution: "سیستم تحلیل بلادرنگ داده‌های مالی.",
    results: [
      {
        label: "سرعت صدور صورت‌حساب",
        value: "۳ برابر",
        source: "سنجش پایلوت",
      },
    ],
    stack: ["Go", "PostgreSQL"],
    cover: "/projects/ops-crm-cover.svg",
    gallery: [],
    systemMap: {
      windowTitle: "kara://api-test",
      layout: "hub",
      descriptionLead: "هسته سیستم",
      description: "شرح جریان کار",
      nodes: {
        inputTop: "وب",
        inputBottom: "بانک",
        core: "هسته تراکنش",
        outputTop: "داشبورد",
        outputBottom: "لاگ",
      },
      logs: ["init", "verify", "done"],
    },
    featured: true,
    status: "published",
    contentHtml: "<p>روایت تفصیلی پروژه تست...</p>",
  };

  const createReq = new Request("http://localhost:3000/api/admin/projects", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(newProjectData),
  });

  const createRes = await createProject(createReq);
  const createJson = await createRes.json();
  assert.strictEqual(createRes.status, 201);
  assert.strictEqual(createJson.ok, true);
  assert.strictEqual(createJson.project.slug, "api-test-project");
  const createdId = createJson.project._id;

  // 2. Test GET /api/admin/projects
  const listReq = new Request("http://localhost:3000/api/admin/projects", {
    headers: authHeaders,
  });
  const listRes = await getProjectsList(listReq);
  const listJson = await listRes.json();
  assert.strictEqual(listRes.status, 200);
  assert.strictEqual(listJson.ok, true);
  assert(Array.isArray(listJson.projects));
  assert(listJson.projects.some((p: { slug: string }) => p.slug === "api-test-project"));

  // 3. Test GET /api/admin/projects/[id]
  const getByIdReq = new Request(`http://localhost:3000/api/admin/projects/${createdId}`, {
    headers: authHeaders,
  });
  const getByIdRes = await getProjectById(getByIdReq, {
    params: Promise.resolve({ id: createdId }),
  });
  const getByIdJson = await getByIdRes.json();
  assert.strictEqual(getByIdRes.status, 200);
  assert.strictEqual(getByIdJson.project.slug, "api-test-project");

  // 4. Test PUT /api/admin/projects/[id]
  const updateReq = new Request(`http://localhost:3000/api/admin/projects/${createdId}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify({
      title: "عنوان پروژه ویرایش شد",
      status: "draft",
    }),
  });
  const updateRes = await updateProjectById(updateReq, {
    params: Promise.resolve({ id: createdId }),
  });
  const updateJson = await updateRes.json();
  assert.strictEqual(updateRes.status, 200);
  assert.strictEqual(updateJson.project.title, "عنوان پروژه ویرایش شد");
  assert.strictEqual(updateJson.project.status, "draft");

  // 5. Test DELETE /api/admin/projects/[id]
  const deleteReq = new Request(`http://localhost:3000/api/admin/projects/${createdId}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  const deleteRes = await deleteProjectById(deleteReq, {
    params: Promise.resolve({ id: createdId }),
  });
  const deleteJson = await deleteRes.json();
  assert.strictEqual(deleteRes.status, 200);
  assert.strictEqual(deleteJson.ok, true);

  // Clean check
  const checkDeleted = await Project.findById(createdId);
  assert.strictEqual(checkDeleted, null);

  console.log("PASS: Admin Projects API Endpoints tests passed!");
  process.exit(0);
}

run().catch((err) => {
  console.error("FAIL:", err);
  process.exit(1);
});
