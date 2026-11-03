import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Load environment variables from .env.local or .env
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;
const INITIAL_ADMIN_EMAIL =
  process.env.INITIAL_ADMIN_EMAIL || "admin@karapardaz.com";
const INITIAL_ADMIN_PASSWORD =
  process.env.INITIAL_ADMIN_PASSWORD || "AdminSecurePassword2026!";
const INITIAL_ADMIN_NAME =
  process.env.INITIAL_ADMIN_NAME || "مدیر ارشد کارا پرداز";

async function main() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not set. Check your .env.local file.");
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Failed to get native database instance");
  }

  const usersCollection = db.collection("users");

  const existing = await usersCollection.findOne({
    email: INITIAL_ADMIN_EMAIL.toLowerCase(),
  });

  if (existing) {
    console.log(`ℹ️ Admin user already exists: ${INITIAL_ADMIN_EMAIL}`);
    await mongoose.disconnect();
    process.exit(0);
  }

  console.log("🔒 Hashing password with bcrypt...");
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(INITIAL_ADMIN_PASSWORD, salt);

  const result = await usersCollection.insertOne({
    name: INITIAL_ADMIN_NAME,
    email: INITIAL_ADMIN_EMAIL.toLowerCase(),
    password: hashedPassword,
    role: "admin",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("✅ Super Admin created successfully!");
  console.log(`   ID: ${result.insertedId}`);
  console.log(`   Email: ${INITIAL_ADMIN_EMAIL}`);
  console.log(`   Role: admin`);
  console.log("   (Make sure to change the default password after first login!)");

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err.message);
  process.exit(1);
});
