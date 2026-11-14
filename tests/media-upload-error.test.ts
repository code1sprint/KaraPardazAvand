import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapUploadFsError } from "../src/lib/media/uploads";

describe("mapUploadFsError", () => {
  it("maps EACCES to a permission message", () => {
    const err = Object.assign(new Error("permission denied"), { code: "EACCES" });
    const mapped = mapUploadFsError(err);
    assert.equal(mapped.status, 500);
    assert.match(mapped.message, /دسترسی|مجوز|permission/i);
  });

  it("maps EPERM to a permission message", () => {
    const err = Object.assign(new Error("operation not permitted"), { code: "EPERM" });
    const mapped = mapUploadFsError(err);
    assert.equal(mapped.status, 500);
    assert.match(mapped.message, /دسترسی|مجوز|permission/i);
  });

  it("maps unknown errors to the generic storage message", () => {
    const mapped = mapUploadFsError(new Error("boom"));
    assert.equal(mapped.status, 500);
    assert.equal(mapped.message, "خطا در پردازش و ذخیره‌سازی فایل.");
  });
});
