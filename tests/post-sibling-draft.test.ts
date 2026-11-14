import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildSiblingCreateDraft,
  type SiblingPostFields,
} from "../src/lib/posts/sibling-draft";

const base: SiblingPostFields = {
  slug: "enterprise-graphrag",
  locale: "fa",
  title: "عنوان فارسی",
  summary: "خلاصه",
  tags: ["RAG", "GraphRAG"],
  author: { name: "کارا پرداز اوند", role: "تیم فنی" },
  cover: "/uploads/cover.jpg",
  relatedPosts: ["other-slug"],
  status: "published",
  publishedAt: "2026-11-07",
  contentJson: { type: "doc", content: [{ type: "paragraph" }] },
  contentHtml: "<p>متن</p>",
};

describe("buildSiblingCreateDraft", () => {
  it("keeps slug/meta starters and clears translatable fields for EN", () => {
    const draft = buildSiblingCreateDraft(base, "en");
    assert.equal(draft.slug, "enterprise-graphrag");
    assert.equal(draft.locale, "en");
    assert.equal(draft.title, "");
    assert.equal(draft.summary, "");
    assert.equal(draft.contentHtml, "");
    assert.deepEqual(draft.contentJson, { type: "doc", content: [] });
    assert.equal(draft.status, "draft");
    assert.deepEqual(draft.tags, ["RAG", "GraphRAG"]);
    assert.equal(draft.cover, "/uploads/cover.jpg");
    assert.deepEqual(draft.author, base.author);
    assert.deepEqual(draft.relatedPosts, ["other-slug"]);
  });

  it("targets FA from an EN source the same way", () => {
    const draft = buildSiblingCreateDraft({ ...base, locale: "en" }, "fa");
    assert.equal(draft.locale, "fa");
    assert.equal(draft.slug, base.slug);
    assert.equal(draft.title, "");
  });
});
