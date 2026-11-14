import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  postsCacheTag,
  postsLocaleCacheTag,
  postsPublicPaths,
} from "../src/lib/posts-cache";

describe("posts cache tags", () => {
  it("exposes a shared posts tag", () => {
    assert.equal(postsCacheTag, "posts");
  });

  it("scopes locale tags", () => {
    assert.equal(postsLocaleCacheTag("fa"), "posts:fa");
    assert.equal(postsLocaleCacheTag("en"), "posts:en");
  });

  it("lists public paths that must revalidate for one locale", () => {
    assert.deepEqual(postsPublicPaths("fa"), [
      "/fa/insights",
      "/fa",
      "/insights/rss.xml",
    ]);
  });

  it("lists public paths for both locales when locale omitted", () => {
    assert.deepEqual(postsPublicPaths(), [
      "/fa/insights",
      "/fa",
      "/en/insights",
      "/en",
      "/insights/rss.xml",
    ]);
  });
});
