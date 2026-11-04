import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { connectToDatabase } from "../src/lib/db/mongodb";
import { getLegalDocModel } from "../src/lib/db/models/LegalDoc";
import { getResolvedLegalDoc, extractTocFromHtml } from "../src/lib/legal-data";

async function runTests() {
  console.log("Starting tests for Legal docs...");
  await connectToDatabase();

  const LegalDoc = await getLegalDocModel();

  // Test 1: Verify terms & privacy exist
  const terms = await LegalDoc.findOne({ slug: "terms" });
  if (!terms) throw new Error("Terms doc not found in DB!");
  console.log("✓ Terms found in DB:", terms.title.fa);

  const privacy = await LegalDoc.findOne({ slug: "privacy" });
  if (!privacy) throw new Error("Privacy doc not found in DB!");
  console.log("✓ Privacy found in DB:", privacy.title.fa);

  // Test 2: Verify extractTocFromHtml
  const sampleHtml = "<h2>بخش اول</h2><p>متن</p><h3>زیربخش ۱</h3><p>متن ۲</p>";
  const { toc, htmlWithIds } = extractTocFromHtml(sampleHtml);
  if (toc.length !== 2) throw new Error("TOC extraction failed!");
  if (!htmlWithIds.includes('id="بخش-اول"')) {
    throw new Error("HTML ID replacement failed!");
  }
  console.log("✓ extractTocFromHtml verified with Persian slugs:", toc.map((t) => t.id));

  // Test 3: Verify getResolvedLegalDoc (FA & EN)
  const resolvedTermsFa = await getResolvedLegalDoc("terms", "fa");
  if (!resolvedTermsFa || resolvedTermsFa.toc.length === 0) {
    throw new Error("Resolved Terms FA failed!");
  }
  console.log("✓ Resolved Terms FA TOC count:", resolvedTermsFa.toc.length);

  const resolvedTermsEn = await getResolvedLegalDoc("terms", "en");
  if (!resolvedTermsEn || !resolvedTermsEn.title) {
    throw new Error("Resolved Terms EN failed!");
  }
  console.log("✓ Resolved Terms EN Title:", resolvedTermsEn.title);

  console.log("All Legal tests PASSED successfully! 🎉");
  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
