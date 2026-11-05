import assert from "node:assert";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { signAuthToken } from "../src/lib/auth/jwt";
import { connectToDatabase } from "../src/lib/db/mongodb";
import { GET as getProjectsHandler } from "../src/app/api/admin/tickets/projects/route";
import { GET as getTicketsHandler } from "../src/app/api/admin/tickets/route";
import { POST as replyTicketHandler } from "../src/app/api/admin/tickets/[id]/reply/route";
import { PATCH as updateStatusHandler } from "../src/app/api/admin/tickets/[id]/status/route";

async function runAdminTicketApiTests() {
  console.log("🧪 Starting Admin Ticket API Integration Tests...\n");

  await connectToDatabase();

  const adminPayload = {
    sub: "admin_user_001",
    email: "admin@karapardaz.com",
    name: "مدیر ارشد کاراپرداز",
    role: "admin" as const,
  };
  const adminToken = await signAuthToken(adminPayload);

  // 1. Test Review Focus 5: Unauthenticated request rejection
  console.log("1. Testing Unauthenticated Access Rejection...");
  const unauthReq = new Request("http://localhost/api/admin/tickets");
  const unauthRes = await getTicketsHandler(unauthReq);
  assert.strictEqual(unauthRes.status, 401, "Unauthenticated request must be 401");
  console.log("   ✅ Unauthenticated request rejected with 401.");

  // 2. Test GET /api/admin/tickets/projects
  console.log("2. Testing Projects List & Stats (GET /api/admin/tickets/projects)...");
  const projectsReq = new Request("http://localhost/api/admin/tickets/projects", {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const projectsRes = await getProjectsHandler(projectsReq);
  assert.strictEqual(projectsRes.status, 200);
  const projectsData = await projectsRes.json();
  assert(projectsData.ok);
  assert(Array.isArray(projectsData.projects));
  assert(projectsData.projects.length >= 2, "Expected at least amlak and clinic projects");
  console.log(`   ✅ Retrieved ${projectsData.projects.length} projects with stats.`);

  // 3. Test GET /api/admin/tickets?projectId=amlak
  console.log("3. Testing Ticket Filtering (GET /api/admin/tickets?projectId=amlak)...");
  const filteredReq = new Request("http://localhost/api/admin/tickets?projectId=amlak", {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const filteredRes = await getTicketsHandler(filteredReq);
  assert.strictEqual(filteredRes.status, 200);
  const filteredData = await filteredRes.json();
  assert(filteredData.ok);
  assert(filteredData.tickets.every((t: { projectId: string }) => t.projectId === "amlak"));
  console.log(`   ✅ Retrieved ${filteredData.tickets.length} tickets for project amlak.`);

  const testTicket = filteredData.tickets[0];
  assert(testTicket, "Expected at least one ticket in amlak");
  const ticketId = testTicket._id;

  // 4. Test POST /api/admin/tickets/[id]/reply
  console.log("4. Testing Admin Reply Submission (POST /api/admin/tickets/[id]/reply)...");
  const replyReq = new Request(`http://localhost/api/admin/tickets/${ticketId}/reply`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      message: "پاسخ رسمی پشتیبانی کاراپرداز: موضوع بررسی و برطرف شد.",
      status: "ANSWERED",
    }),
  });
  const replyRes = await replyTicketHandler(replyReq, {
    params: Promise.resolve({ id: ticketId }),
  });
  assert.strictEqual(replyRes.status, 200);
  const replyData = await replyRes.json();
  assert(replyData.ok);
  assert.strictEqual(replyData.ticket.status, "ANSWERED");
  const lastMsg = replyData.ticket.messages[replyData.ticket.messages.length - 1];
  assert.strictEqual(lastMsg.senderRole, "SUPPORT_AGENT");
  assert.strictEqual(lastMsg.senderName, adminPayload.name);
  console.log("   ✅ Admin reply added and status set to ANSWERED.");

  // 5. Test PATCH /api/admin/tickets/[id]/status
  console.log("5. Testing Status Update (PATCH /api/admin/tickets/[id]/status)...");
  const statusReq = new Request(`http://localhost/api/admin/tickets/${ticketId}/status`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status: "RESOLVED" }),
  });
  const statusRes = await updateStatusHandler(statusReq, {
    params: Promise.resolve({ id: ticketId }),
  });
  assert.strictEqual(statusRes.status, 200);
  const statusData = await statusRes.json();
  assert.strictEqual(statusData.ticket.status, "RESOLVED");
  assert(statusData.ticket.resolvedAt !== null);
  console.log("   ✅ Ticket status updated to RESOLVED.");

  // 6. Test Registering New Project (POST /api/admin/tickets/projects)
  console.log("6. Testing Dynamic Project Registration...");
  const { POST: createProjectHandler } = await import("../src/app/api/admin/tickets/projects/route");
  const createProjReq = new Request("http://localhost/api/admin/tickets/projects", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      name: "فروشگاه آنلاین تستی",
      projectId: "test_shop_dynamo",
    }),
  });
  const createProjRes = await createProjectHandler(createProjReq);
  assert.strictEqual(createProjRes.status, 201);
  const createProjData = await createProjRes.json();
  assert(createProjData.ok);
  assert(createProjData.rawApiKey.startsWith("kp_live_test_shop_dynamo_"));
  console.log(`   ✅ New project created dynamically with key: ${createProjData.rawApiKey}`);

  await mongoose.disconnect();
  console.log("\n🎉 All Admin Ticket API Tests Passed Successfully!\n");
}

runAdminTicketApiTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
