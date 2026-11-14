import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { editorChromeForLocale } from "../src/lib/editor/locale-chrome";

describe("editorChromeForLocale", () => {
  it("returns RTL Vazirmatn chrome for Persian", () => {
    const chrome = editorChromeForLocale("fa");
    assert.equal(chrome.dir, "rtl");
    assert.match(chrome.className, /font-vazirmatn/);
    assert.match(chrome.placeholder, /مقاله|بنویسید|\//);
  });

  it("returns LTR chrome for English", () => {
    const chrome = editorChromeForLocale("en");
    assert.equal(chrome.dir, "ltr");
    assert.doesNotMatch(chrome.className, /font-vazirmatn/);
    assert.match(chrome.placeholder, /Write|article|\//i);
  });
});
