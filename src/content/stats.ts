import { TODO_REAL_DATA } from "@/content/site";
import { parseContentList, statSchema, type Stat } from "@/lib/content";

export type StatId = Stat["id"];
export type { Stat };

/**
 * Trust-strip metrics. Do not invent numbers; leave TODO_REAL_DATA until verified.
 * Validated at module load — invalid data fails `next build`.
 */
const statsRaw = [
  { id: "projects" as const, value: TODO_REAL_DATA },
  { id: "years" as const, value: TODO_REAL_DATA },
  { id: "industries" as const, value: TODO_REAL_DATA },
];

export const stats: readonly Stat[] = parseContentList(
  statSchema,
  statsRaw,
  "stats",
);

export function isResolvedStat(
  stat: Stat,
): stat is Stat & { value: string } {
  return stat.value !== TODO_REAL_DATA;
}

export function getResolvedStats(): Array<Stat & { value: string }> {
  return stats.filter(isResolvedStat);
}
