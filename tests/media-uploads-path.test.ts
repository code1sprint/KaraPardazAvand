import assert from "node:assert/strict";
import path from "node:path";
import { describe, it } from "node:test";
import {
  getUploadsDir,
  resolveUploadFilePath,
} from "../src/lib/media/uploads";

describe("resolveUploadFilePath", () => {
  const root = getUploadsDir("/app");

  it("resolves a safe relative filename under uploads", () => {
    const resolved = resolveUploadFilePath(["photo.jpg"], root);
    assert.equal(resolved, path.join(root, "photo.jpg"));
  });

  it("rejects path traversal segments", () => {
    assert.equal(resolveUploadFilePath(["..", "secret.txt"], root), null);
    assert.equal(resolveUploadFilePath(["foo", "..", "..", "etc", "passwd"], root), null);
  });

  it("rejects empty or absolute-looking segments", () => {
    assert.equal(resolveUploadFilePath([], root), null);
    assert.equal(resolveUploadFilePath([""], root), null);
  });
});
