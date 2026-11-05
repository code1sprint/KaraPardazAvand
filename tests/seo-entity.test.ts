import assert from "node:assert/strict";
import { test } from "node:test";
import { EntitySchema, entityConfig } from "../src/lib/seo/entity";

test("entityConfig conforms to EntitySchema and matches confirmed brand rules", () => {
  const parsed = EntitySchema.parse(entityConfig);
  assert.equal(parsed.canonicalName.fa, "کارا پرداز اوند");
  assert.equal(parsed.canonicalName.en, "Kara Pardaz Avand");
  assert.equal(parsed.url, "https://karapardazavand.ir");
  assert.ok(parsed.definition.fa.length > 20);
  assert.ok(parsed.definition.en.length > 20);
  assert.ok(parsed.services.length >= 6);

  // Check confirmed services exist
  const slugs = parsed.services.map((s) => s.slug);
  assert.ok(slugs.includes("crm"));
  assert.ok(slugs.includes("erp"));
  assert.ok(slugs.includes("rag-ai"));
  assert.ok(slugs.includes("web-platforms"));
  assert.ok(slugs.includes("custom-software"));
  assert.ok(slugs.includes("data-science"));
});

test("EntitySchema rejects invalid URLs or missing canonical names", () => {
  assert.throws(() => {
    EntitySchema.parse({
      ...entityConfig,
      canonicalName: { fa: "", en: "" },
    });
  });

  assert.throws(() => {
    EntitySchema.parse({
      ...entityConfig,
      url: "not-a-valid-url",
    });
  });
});
