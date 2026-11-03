import type { AppLocale } from "@/i18n/routing";
import {
  parseContentList,
  stackGroupSchema,
  type LocalizedString,
  type StackGroup,
} from "@/lib/content";

export type { LocalizedString, StackGroup };
export type StackGroupId = StackGroup["id"];

export type ResolvedStackGroup = {
  id: StackGroupId;
  label: string;
  items: string[];
};

/** Validated at module load — invalid data fails `next build`. */
const stackGroupsRaw = [
  {
    id: "frontend" as const,
    label: {
      fa: "فرانت‌اند",
      en: "Frontend",
    },
    items: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "next-intl",
    ],
  },
  {
    id: "backend" as const,
    label: {
      fa: "بک‌اند",
      en: "Backend",
    },
    items: ["Node.js", "Python", "REST", "PostgreSQL", "Redis"],
  },
  {
    id: "ai" as const,
    label: {
      fa: "هوش مصنوعی و RAG",
      en: "AI and RAG",
    },
    items: [
      "RAG pipelines",
      "Vector search",
      "LLM APIs",
      "Evaluation harnesses",
      "Prompt tooling",
    ],
  },
  {
    id: "data" as const,
    label: {
      fa: "داده",
      en: "Data",
    },
    items: [
      "ETL / ELT",
      "SQL warehouses",
      "Dashboards",
      "Feature stores",
      "Data quality checks",
    ],
  },
  {
    id: "devops" as const,
    label: {
      fa: "دواپس",
      en: "DevOps",
    },
    items: [
      "Docker",
      "CI/CD",
      "Linux servers",
      "Observability",
      "Secrets management",
    ],
  },
];

export const stackGroups: StackGroup[] = parseContentList(
  stackGroupSchema,
  stackGroupsRaw,
  "stackGroups",
);

export function getStackGroups(locale: AppLocale): ResolvedStackGroup[] {
  return stackGroups.map((group) => ({
    id: group.id,
    label: group.label[locale],
    items: group.items,
  }));
}
