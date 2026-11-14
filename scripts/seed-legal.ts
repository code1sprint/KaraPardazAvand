import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { connectToDatabase } from "../src/lib/db/mongodb";
import { getLegalDocModel } from "../src/lib/db/models/LegalDoc";
import { ensureCoreLegalDocs } from "../src/lib/legal-ensure";

async function seed() {
  console.log("Seeding Legal documents into MongoDB...");
  await connectToDatabase();
  const LegalDoc = await getLegalDocModel();

  await ensureCoreLegalDocs(LegalDoc);

  // Upsert from JSON payloads when present (refreshes content intentionally)
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  for (const slug of ["privacy", "terms"] as const) {
    try {
      const payloadPath = path.join(
        process.cwd(),
        "tmp/admin-legal-payloads",
        `${slug}.json`,
      );
      const raw = await fs.readFile(payloadPath, "utf-8");
      const doc = JSON.parse(raw) as Record<string, unknown>;
      await LegalDoc.findOneAndUpdate(
        { slug },
        { $set: doc },
        { upsert: true, returnDocument: "after" },
      );
      console.log(`Upserted legal doc from JSON: ${slug}`);
    } catch {
      console.log(`No JSON payload for ${slug}; ensure/create already handled.`);
    }
  }

  const count = await LegalDoc.countDocuments();
  console.log(`Legal documents ready (${count} total).`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Legal seed error:", err);
  process.exit(1);
});
