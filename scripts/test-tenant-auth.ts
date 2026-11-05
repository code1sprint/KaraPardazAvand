import assert from "node:assert";
import { verifyTenantHeaders } from "../src/lib/auth/tenant-auth";

console.log("🧪 Testing Tenant Auth Helper...");

// Test missing headers
const reqNoHeaders = new Request("http://localhost/api/v1/tickets");
const resNoHeaders = verifyTenantHeaders(reqNoHeaders);
assert(resNoHeaders.error !== null, "Missing headers should return error");
assert.strictEqual(resNoHeaders.error.status, 401);

// Test missing key
const reqOnlyProject = new Request("http://localhost/api/v1/tickets", {
  headers: { "x-project-id": "amlak" },
});
assert.strictEqual(verifyTenantHeaders(reqOnlyProject).error?.status, 401);

// Test with valid format headers
const reqWithHeaders = new Request("http://localhost/api/v1/tickets", {
  headers: {
    "x-project-id": "amlak",
    "x-project-key": "secret_key_123",
  },
});
const extracted = verifyTenantHeaders(reqWithHeaders);
assert.strictEqual(extracted.error, null);
assert.strictEqual(extracted.projectId, "amlak");
assert.strictEqual(extracted.projectKey, "secret_key_123");

console.log("   ✅ Tenant header verification logic verified.");
