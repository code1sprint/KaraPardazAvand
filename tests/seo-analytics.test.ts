import assert from "node:assert/strict";
import { test } from "node:test";
import { classifyReferrer } from "../src/lib/analytics";

test("classifyReferrer categorizes AI assistants correctly", () => {
  assert.equal(classifyReferrer("https://chatgpt.com/c/1234"), "ai-assistant");
  assert.equal(classifyReferrer("https://chat.openai.com"), "ai-assistant");
  assert.equal(classifyReferrer("https://www.perplexity.ai/search?q=crm"), "ai-assistant");
  assert.equal(classifyReferrer("https://gemini.google.com/app"), "ai-assistant");
  assert.equal(classifyReferrer("https://claude.ai/chat/123"), "ai-assistant");
  assert.equal(classifyReferrer("https://copilot.microsoft.com"), "ai-assistant");
});

test("classifyReferrer categorizes search engines and social correctly", () => {
  assert.equal(classifyReferrer("https://www.google.com/search?q=karapardaz"), "search-engine");
  assert.equal(classifyReferrer("https://www.bing.com"), "search-engine");
  assert.equal(classifyReferrer("https://linkedin.com/company/karapardazavand"), "social");
  assert.equal(classifyReferrer("https://t.me/channel"), "social");
  assert.equal(classifyReferrer(""), "direct");
});
