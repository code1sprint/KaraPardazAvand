/** Unicode-aware slug for headings (Persian + Latin). Shared with rehype-slug style ids. */
export function slugifyHeading(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
