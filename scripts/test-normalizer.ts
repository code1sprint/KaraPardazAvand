import assert from "node:assert";
import { normalizePersianText, processPostContent } from "../src/lib/editor/normalizer";

async function run() {
  console.log("Testing Persian Normalizer & TOC Extractor...");

  // Test 1: Arabic characters & ZWNJ cleanup
  const dirtyPersian = "يك متن با كلي ي هاي عربي و فاصله ‌ هاي اشتباه";
  const normalized = normalizePersianText(dirtyPersian);
  assert(!normalized.includes("ك"), "Should not contain Arabic kaf");
  assert(!normalized.includes("ي"), "Should not contain Arabic yeh");
  assert(normalized.includes("یک متن با کلی ی های عربی"), "Should contain normalized Persian letters");

  // Test 2: HTML processing with code preservation
  const rawHtml = `
    <h2>مقدمه سیستم</h2>
    <p>در سال 2026 شرکت 10 پروژه موفق داشت.</p>
    <pre><code>const count = 123;</code></pre>
    <a href="https://example.com/page-123">لینک 123</a>
    <h2>نتیجه‌گیری</h2>
    <p>بخش اول</p>
    <h2>نتیجه‌گیری</h2>
    <p>بخش دوم</p>
    <h3>زیربخش تخصصی</h3>
  `;

  const processed = processPostContent(rawHtml, "fa");

  // Verify TOC
  assert.strictEqual(processed.toc.length, 4, "Should extract 4 headings");
  assert.strictEqual(processed.toc[0].id, "مقدمه-سیستم");
  assert.strictEqual(processed.toc[0].depth, 2);
  assert.strictEqual(processed.toc[1].id, "نتیجهگیری");
  assert.strictEqual(processed.toc[2].id, "نتیجهگیری-1", "Duplicate heading should have -1 suffix");
  assert.strictEqual(processed.toc[3].id, "زیربخش-تخصصی");
  assert.strictEqual(processed.toc[3].depth, 3);

  // Verify HTML contains IDs
  assert(processed.contentHtml.includes('id="مقدمه-سیستم"'), "HTML should include heading ID");
  assert(processed.contentHtml.includes('id="نتیجهگیری-1"'), "HTML should include duplicate heading ID with suffix");

  // Verify Code block retains LTR and Latin numbers
  assert(processed.contentHtml.includes("const count = 123;"), "Code block must preserve Latin digits and syntax");
  assert(processed.contentHtml.includes('href="https://example.com/page-123"'), "URLs must preserve Latin digits");

  // Verify Persian numbers in normal paragraph
  assert(processed.contentHtml.includes("۲۰۲۶"), "Year in paragraph should be Persian digits");

  // Verify Reading Time
  assert(processed.readingTime >= 1, "Reading time should be at least 1 minute");

  console.log("PASS: Persian Normalizer & TOC Extractor tests passed!");
}

run().catch((err) => {
  console.error("FAIL:", err);
  process.exit(1);
});
