import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { postsCacheTag, postsLocaleCacheTag } from "../src/lib/posts-cache";

describe("posts cache tags", () => {
  it("exposes a shared posts tag", () => {
    assert.equal(postsCacheTag, "posts");
  });

  it("scopes locale tags", () => {
    assert.equal(postsLocaleCacheTag("fa"), "posts:fa");
    assert.equal(postsLocaleCacheTag("en"), "posts:en");
  });
});
