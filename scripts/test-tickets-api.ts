import assert from "node:assert";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { connectToDatabase } from "../src/lib/db/mongodb";
import { SupportedProject } from "../src/lib/db/models/SupportedProject";
import { SupportTicket } from "../src/lib/db/models/SupportTicket";
import { POST as createTicketHandler, GET as listTicketsHandler } from "../src/app/api/v1/tickets/route";
import { POST as addMessageHandler } from "../src/app/api/v1/tickets/[id]/messages/route";
import { PATCH as closeTicketHandler } from "../src/app/api/v1/tickets/[id]/close/route";

async function runTicketApiTests() {
  console.log("🧪 Starting External Tenant Ticket API Integration Tests...\n");

  await connectToDatabase();

  const amlakSecretKey = "secret_amlak_key_test_123";
  const clinicSecretKey = "secret_clinic_key_test_456";

  const amlakKeyHash = await bcrypt.hash(amlakSecretKey, 10);
  const clinicKeyHash = await bcrypt.hash(clinicSecretKey, 10);

  // Setup test projects
  await SupportedProject.findOneAndUpdate(
    { projectId: "test_amlak" },
    {
      projectId: "test_amlak",
      name: "سامانه آزمایشی املاک",
      apiKeyHash: amlakKeyHash,
      isActive: true,
      departments: [{ id: "technical", nameFa: "فنی" }],
    },
    { upsert: true, new: true },
  );

  await SupportedProject.findOneAndUpdate(
    { projectId: "test_clinic" },
    {
      projectId: "test_clinic",
      name: "سامانه آزمایشی کلینیک",
      apiKeyHash: clinicKeyHash,
      isActive: true,
      departments: [{ id: "records", nameFa: "پرونده" }],
    },
    { upsert: true, new: true },
  );

  // Clean old test tickets
  await SupportTicket.deleteMany({ projectId: { $in: ["test_amlak", "test_clinic"] } });

  const userId = "usr_consultant_007";

  // 1. Test POST /api/v1/tickets (Create Ticket)
  console.log("1. Testing Ticket Creation (POST /api/v1/tickets)...");
  const createReq = new Request("http://localhost/api/v1/tickets", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-project-id": "test_amlak",
      "x-project-key": amlakSecretKey,
    },
    body: JSON.stringify({
      requester: {
        userId,
        name: "بهرام رادمنش",
        phone: "09120000000",
        organization: "آژانس املاک ونک",
      },
      department: "technical",
      priority: "HIGH",
      subject: "عدم نمایش نقشه ملک",
      message: "در صفحه ثبت فایل جدید، نقشه لود نمی‌شود.",
    }),
  });

  const createRes = await createTicketHandler(createReq);
  assert.strictEqual(createRes.status, 201, "Expected 201 Created");
  const createData = await createRes.json();
  assert(createData.ok, "Expected ok: true");
  assert(createData.ticket.ticketNumber.startsWith("TK-TEST_AMLAK-"));
  assert.strictEqual(createData.ticket.messages.length, 1);
  assert.strictEqual(createData.ticket.status, "OPEN");
  console.log(`   ✅ Ticket created: ${createData.ticket.ticketNumber}`);

  const ticketId = createData.ticket._id;

  // 2. Test GET /api/v1/tickets (List Tickets)
  console.log("2. Testing Ticket Listing (GET /api/v1/tickets)...");
  const listReq = new Request(`http://localhost/api/v1/tickets?userId=${userId}`, {
    headers: {
      "x-project-id": "test_amlak",
      "x-project-key": amlakSecretKey,
    },
  });
  const listRes = await listTicketsHandler(listReq);
  const listData = await listRes.json();
  assert.strictEqual(listRes.status, 200);
  assert.strictEqual(listData.tickets.length, 1);
  assert.strictEqual(listData.tickets[0].subject, "عدم نمایش نقشه ملک");
  console.log("   ✅ Ticket listed successfully.");

  // 3. Test POST /api/v1/tickets/[id]/messages (Add Message Reply)
  console.log("3. Testing User Reply Message...");
  const replyReq = new Request(`http://localhost/api/v1/tickets/${ticketId}/messages`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-project-id": "test_amlak",
      "x-project-key": amlakSecretKey,
    },
    body: JSON.stringify({
      userId,
      message: "یک عکس اسکرین‌شات هم از خطا ضمیمه کردم.",
    }),
  });
  const replyRes = await addMessageHandler(replyReq, { params: Promise.resolve({ id: ticketId }) });
  const replyData = await replyRes.json();
  assert.strictEqual(replyRes.status, 200);
  assert.strictEqual(replyData.ticket.messages.length, 2);
  console.log("   ✅ User reply appended successfully.");

  // 4. Test Review Focus 2: Cross-Tenant IDOR Attack Detection
  console.log("4. Testing Cross-Tenant IDOR Protection...");
  const crossTenantReq = new Request(`http://localhost/api/v1/tickets/${ticketId}/messages`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-project-id": "test_clinic", // Clinic trying to access AMLAK ticket!
      "x-project-key": clinicSecretKey,
    },
    body: JSON.stringify({
      userId,
      message: "حمله تلاقی مستأجرها",
    }),
  });
  const crossRes = await addMessageHandler(crossTenantReq, { params: Promise.resolve({ id: ticketId }) });
  assert.strictEqual(crossRes.status, 404, "Cross-tenant access must return 404 Not Found");
  console.log("   ✅ Cross-tenant IDOR attack blocked with 404.");

  // 5. Test Review Focus 4: Reopening a RESOLVED Ticket
  console.log("5. Testing Reopening RESOLVED Ticket...");
  await SupportTicket.findByIdAndUpdate(ticketId, { status: "RESOLVED", resolvedAt: new Date() });
  const reopenReq = new Request(`http://localhost/api/v1/tickets/${ticketId}/messages`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-project-id": "test_amlak",
      "x-project-key": amlakSecretKey,
    },
    body: JSON.stringify({
      userId,
      message: "هنوز در مرورگر فایرفاکس مشکل پابرجاست.",
    }),
  });
  const reopenRes = await addMessageHandler(reopenReq, { params: Promise.resolve({ id: ticketId }) });
  const reopenData = await reopenRes.json();
  assert.strictEqual(reopenRes.status, 200);
  assert.strictEqual(reopenData.ticket.status, "OPEN", "Resolved ticket should reopen to OPEN on user reply");
  console.log("   ✅ Resolved ticket successfully reopened to OPEN.");

  // 6. Test Review Focus 3: CLOSED Ticket Immutability
  console.log("6. Testing CLOSED Ticket Immutability...");
  const closeReq = new Request(`http://localhost/api/v1/tickets/${ticketId}/close`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-project-id": "test_amlak",
      "x-project-key": amlakSecretKey,
    },
    body: JSON.stringify({ userId }),
  });
  const closeRes = await closeTicketHandler(closeReq, { params: Promise.resolve({ id: ticketId }) });
  assert.strictEqual(closeRes.status, 200);

  // Now try to post a message to the closed ticket
  const postToClosedReq = new Request(`http://localhost/api/v1/tickets/${ticketId}/messages`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-project-id": "test_amlak",
      "x-project-key": amlakSecretKey,
    },
    body: JSON.stringify({
      userId,
      message: "پیام پس از بسته‌شدن تیکت",
    }),
  });
  const closedPostRes = await addMessageHandler(postToClosedReq, { params: Promise.resolve({ id: ticketId }) });
  assert.strictEqual(closedPostRes.status, 409, "Posting to closed ticket must fail with 409 Conflict");
  console.log("   ✅ Closed ticket is immutable (409 Conflict returned).");

  // Clean test data
  await SupportTicket.deleteMany({ projectId: { $in: ["test_amlak", "test_clinic"] } });
  await SupportedProject.deleteMany({ projectId: { $in: ["test_amlak", "test_clinic"] } });

  await mongoose.disconnect();
  console.log("\n🎉 All External Tenant API Tests Passed Successfully!\n");
}

runTicketApiTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
