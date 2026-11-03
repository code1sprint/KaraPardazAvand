import { TODO_REAL_DATA } from "./site";

/**
 * Final CTA band. Assurances render only when confirmed (not TODO_REAL_DATA).
 */

export type CtaAssurance = {
  id: string;
  text: string;
};

export const finalCta = {
  /** One sentence CTA copy (UI strings live in messages; this is content fallback). */
  sentenceKey: "sentence" as const,
  primaryHref: "/contact",
  assurances: [
    {
      id: "ownership",
      text: TODO_REAL_DATA,
    },
    {
      id: "staged",
      text: TODO_REAL_DATA,
    },
    {
      id: "support",
      text: TODO_REAL_DATA,
    },
  ] as CtaAssurance[],
};

export function getConfirmedAssurances(): CtaAssurance[] {
  return finalCta.assurances.filter(
    (item) => item.text !== TODO_REAL_DATA && item.text.trim().length > 0,
  );
}
