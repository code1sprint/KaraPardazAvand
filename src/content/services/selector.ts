/**
 * Client-side service recommender for `/services`.
 * No network calls — scoring only.
 */

export type SelectorProblem =
  | "sales"
  | "operations"
  | "knowledge"
  | "metrics"
  | "web"
  | "custom";

export type SelectorTeamSize = "small" | "medium" | "large";

export type SelectorSystemState = "existing" | "new" | "unsure";

export type SelectorAnswers = {
  problem: SelectorProblem | null;
  teamSize: SelectorTeamSize | null;
  systemState: SelectorSystemState | null;
};

const PROBLEM_SCORES: Record<SelectorProblem, Record<string, number>> = {
  sales: { crm: 3, "web-platforms": 1, "custom-software": 1 },
  operations: { erp: 3, "custom-software": 2, "data-science": 1 },
  knowledge: { "rag-ai": 3, "data-science": 1, "custom-software": 1 },
  metrics: { "data-science": 3, erp: 1, crm: 1 },
  web: { "web-platforms": 3, crm: 1, "custom-software": 1 },
  custom: { "custom-software": 3, erp: 1, "web-platforms": 1 },
};

const TEAM_SCORES: Record<SelectorTeamSize, Record<string, number>> = {
  small: { "web-platforms": 1, crm: 1, "rag-ai": 0.5 },
  medium: { crm: 0.5, "data-science": 0.5, "custom-software": 0.5 },
  large: { erp: 1, "custom-software": 1, "rag-ai": 0.5, "data-science": 0.5 },
};

const SYSTEM_SCORES: Record<SelectorSystemState, Record<string, number>> = {
  existing: { erp: 1, crm: 1, "rag-ai": 1, "data-science": 1 },
  new: { "web-platforms": 1, "custom-software": 1, crm: 0.5 },
  unsure: { "custom-software": 0.5, crm: 0.5 },
};

/** Return one or two recommended service slugs from local answers. */
export function recommendServices(answers: SelectorAnswers): string[] {
  const scores = new Map<string, number>();

  function add(table: Record<string, number> | undefined) {
    if (!table) return;
    for (const [slug, score] of Object.entries(table)) {
      scores.set(slug, (scores.get(slug) ?? 0) + score);
    }
  }

  if (answers.problem) add(PROBLEM_SCORES[answers.problem]);
  if (answers.teamSize) add(TEAM_SCORES[answers.teamSize]);
  if (answers.systemState) add(SYSTEM_SCORES[answers.systemState]);

  if (scores.size === 0) return [];

  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  const top = ranked[0];
  if (!top) return [];

  const result = [top[0]];
  const second = ranked[1];
  if (second && second[1] >= top[1] - 1 && second[1] >= 2) {
    result.push(second[0]);
  }

  return result.slice(0, 2);
}
