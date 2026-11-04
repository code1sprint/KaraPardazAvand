import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { connectToDatabase } from "../src/lib/db/mongodb";
import { getAboutModel } from "../src/lib/db/models/About";
import { getProcessModel } from "../src/lib/db/models/Process";
import { getResolvedAboutData } from "../src/lib/about-data";
import { getResolvedProcessData } from "../src/lib/process-data";

async function runTests() {
  console.log("Starting tests for About & Process...");
  await connectToDatabase();

  // Test 1: Verify About document
  const About = await getAboutModel();
  const aboutDoc = await About.findOne();
  if (!aboutDoc) {
    throw new Error("About document not found!");
  }
  console.log("✓ About document loaded:", aboutDoc.intro.title.fa);

  // Test 2: Verify getResolvedAboutData (FA & EN)
  const resolvedAboutFa = await getResolvedAboutData("fa");
  if (!resolvedAboutFa.intro.title || resolvedAboutFa.principles.length === 0) {
    throw new Error("Resolved About FA data is incomplete!");
  }
  console.log("✓ Resolved About FA OK:", resolvedAboutFa.principles.length, "principles");

  const resolvedAboutEn = await getResolvedAboutData("en");
  if (!resolvedAboutEn.intro.title) {
    throw new Error("Resolved About EN data is incomplete!");
  }
  console.log("✓ Resolved About EN OK:", resolvedAboutEn.intro.title);

  // Test 3: Verify Process document
  const Process = await getProcessModel();
  const processDoc = await Process.findOne();
  if (!processDoc) {
    throw new Error("Process document not found!");
  }
  console.log("✓ Process document loaded:", processDoc.hero?.titleGradient?.fa);

  // Test 4: Verify getResolvedProcessData (FA & EN)
  const resolvedProcFa = await getResolvedProcessData("fa");
  if (!resolvedProcFa.steps || resolvedProcFa.steps.length === 0) {
    throw new Error("Resolved Process FA data is incomplete!");
  }
  console.log("✓ Resolved Process FA OK:", resolvedProcFa.steps.length, "steps");

  const resolvedProcEn = await getResolvedProcessData("en");
  if (!resolvedProcEn.steps || resolvedProcEn.steps.length === 0) {
    throw new Error("Resolved Process EN data is incomplete!");
  }
  console.log("✓ Resolved Process EN OK:", resolvedProcEn.steps[0].title);

  console.log("All About & Process tests PASSED successfully! 🎉");
  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
