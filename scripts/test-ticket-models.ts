import assert from "node:assert";
import { createTicketSchema, addMessageSchema, ticketStatusEnum, ticketPriorityEnum } from "../src/lib/validations/ticket";

console.log("🧪 Testing Ticket Zod Validation Schemas...");

// Test valid creation
const validPayload = {
  requester: {
    userId: "usr_123",
    name: "علی محمدی",
    phone: "09121112233",
    organization: "املاک نگین",
  },
  department: "technical",
  priority: "HIGH",
  subject: "مشکل در جستجو",
  message: "توضیحات باگ به صورت کامل",
};
const parsed = createTicketSchema.safeParse(validPayload);
assert(parsed.success, "Valid payload should pass validation");

// Test invalid priority
const invalidPriority = { ...validPayload, priority: "SUPER_URGENT" };
assert(!createTicketSchema.safeParse(invalidPriority).success, "Invalid priority must fail");

// Test missing required fields
assert(!createTicketSchema.safeParse({}).success, "Empty payload must fail");

// Test add message schema
const validMsg = { message: "پاسخ جدید از سمت مشاور" };
assert(addMessageSchema.safeParse(validMsg).success, "Valid message should pass");
assert(!addMessageSchema.safeParse({ message: "a" }).success, "Too short message must fail");

// Test enum values
assert(ticketStatusEnum.options.includes("OPEN"));
assert(ticketStatusEnum.options.includes("CLOSED"));
assert(ticketPriorityEnum.options.includes("URGENT"));

console.log("   ✅ Ticket validation schemas verified.");
