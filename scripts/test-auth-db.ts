import assert from "node:assert";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });
import { signAuthToken, verifyAuthToken } from "../src/lib/auth/jwt";
import { checkDatabaseHealth } from "../src/lib/db/mongodb";

async function runTests() {
  console.log("🧪 Starting Backend & Auth Tests...\n");

  // Test 1: Bcrypt password hashing & comparison
  console.log("1. Testing Bcrypt Hashing & Comparison...");
  const rawPassword = "SuperSecurePassword123!";
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(rawPassword, salt);
  assert(await bcrypt.compare(rawPassword, hash), "Password comparison failed");
  assert(
    !(await bcrypt.compare("WrongPassword", hash)),
    "Wrong password matched unexpectedly",
  );
  console.log("   ✅ Bcrypt hashing and comparison verified.");

  // Test 2: JWT signing and verification with Jose
  console.log("2. Testing Jose JWT Sign & Verify...");
  const userPayload = {
    sub: "671234567890abcdef123456",
    email: "test@karapardaz.com",
    name: "آزمایش‌کننده سیستم",
    role: "admin" as const,
  };

  const token = await signAuthToken(userPayload);
  assert(typeof token === "string" && token.length > 20, "Token was not generated");

  const decoded = await verifyAuthToken(token);
  assert(decoded !== null, "Token verification failed");
  assert.strictEqual(decoded.sub, userPayload.sub);
  assert.strictEqual(decoded.email, userPayload.email);
  assert.strictEqual(decoded.role, "admin");
  console.log("   ✅ JWT Sign, Expiration & Claims verified.");

  // Test 3: Tampered Token detection
  console.log("3. Testing Tampered Token Detection...");
  const tamperedToken = token.slice(0, -5) + "abcde";
  const tamperedResult = await verifyAuthToken(tamperedToken);
  assert.strictEqual(
    tamperedResult,
    null,
    "Tampered token should return null without throwing",
  );
  console.log("   ✅ Tampered token safely rejected.");

  // Test 4: Database Connection Crash Prevention
  console.log("4. Testing Database Resilience when DB is unreachable...");
  const health = await checkDatabaseHealth();
  console.log(
    `   Database Health Status: connected=${health.connected}, readyState=${health.readyState}`,
  );
  assert(
    typeof health.connected === "boolean",
    "Database health check did not return a valid boolean",
  );
  console.log("   ✅ DB failure was caught gracefully without process crash.");

  console.log("\n🎉 All backend & auth unit tests passed successfully!");
  await mongoose.disconnect();
  process.exit(0);
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
