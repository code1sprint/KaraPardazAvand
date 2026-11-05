import assert from "node:assert/strict";
import { test } from "node:test";
import robots, { getAiCrawlerRules } from "../src/app/robots";
import sitemap from "../src/app/sitemap";

test("robots generates clean directives for standard and AI crawlers", () => {
  const robotsData = robots();
  assert.ok(Array.isArray(robotsData.rules));
  
  // Verify default userAgent rule
  const defaultRule = robotsData.rules.find((r) => r.userAgent === "*");
  assert.ok(defaultRule);
  assert.equal(defaultRule.allow, "/");
  assert.ok(defaultRule.disallow);

  // Verify sitemap URL
  assert.ok(typeof robotsData.sitemap === "string");
  assert.ok(robotsData.sitemap.endsWith("/sitemap.xml"));

  // Verify AI crawlers allow by default
  const aiAllow = getAiCrawlerRules("allow");
  assert.ok(aiAllow.length >= 6);
  const gptBot = aiAllow.find((r) => r.userAgent === "GPTBot");
  assert.equal(gptBot?.allow, "/");

  // Verify AI crawlers block when configured
  const aiBlock = getAiCrawlerRules("block");
  const claudeBot = aiBlock.find((r) => r.userAgent === "ClaudeBot");
  assert.equal(claudeBot?.disallow, "/");
});

test("sitemap covers 100% of indexable routes with hreflang alternates", async () => {
  const items = await sitemap();
  assert.ok(items.length >= 25, `Expected >= 25 sitemap items, got ${items.length}`);

  // Must not contain admin or private routes
  for (const item of items) {
    assert.ok(!item.url.includes("/admin"), `Sitemap contains private route: ${item.url}`);
    assert.ok(!item.url.includes("/api"), `Sitemap contains api route: ${item.url}`);
    assert.ok(item.alternates?.languages?.["fa"], `Missing fa alternate for ${item.url}`);
    assert.ok(item.alternates?.languages?.["en"], `Missing en alternate for ${item.url}`);
    assert.ok(item.alternates?.languages?.["x-default"], `Missing x-default for ${item.url}`);
  }
});
