import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { connectToDatabase } from "../src/lib/db/mongodb";
import { getSiteSettingsModel } from "../src/lib/db/models/SiteSettings";
import { getResolvedHomeData } from "../src/lib/home-data";

async function runTests() {
  console.log("Starting tests for Site & Home settings...");
  await connectToDatabase();

  const SiteSettings = await getSiteSettingsModel();

  // Test 1: Verify SiteSettings exist
  const settings = await SiteSettings.findOne();
  if (!settings) throw new Error("SiteSettings document not found in DB!");
  console.log("✓ SiteSettings found in DB:", settings.seo.siteName.fa);

  // Test 2: Verify getResolvedHomeData (FA)
  const homeFa = await getResolvedHomeData("fa");
  if (!homeFa.hero.titleGradient || homeFa.whyStatements.length === 0) {
    throw new Error("Resolved Home FA failed!");
  }
  console.log("✓ Resolved Home FA Hero gradient:", homeFa.hero.titleGradient);
  console.log("✓ Resolved Home FA Why count:", homeFa.whyStatements.length);

  // Test 3: Verify getResolvedHomeData (EN)
  const homeEn = await getResolvedHomeData("en");
  if (!homeEn.hero.titleGradient || !homeEn.seo.siteName) {
    throw new Error("Resolved Home EN failed!");
  }
  console.log("✓ Resolved Home EN Hero gradient:", homeEn.hero.titleGradient);
  console.log("✓ Resolved Home EN Site name:", homeEn.seo.siteName);

  console.log("All Site & Home settings tests PASSED successfully! 🎉");
  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
