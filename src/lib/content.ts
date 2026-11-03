import { z } from "zod";
import type { AppLocale } from "@/i18n/routing";

/** Shared localized string map (fa default, en secondary). */
export const localizedStringSchema = z.object({
  fa: z.string().min(1),
  en: z.string().min(1),
}) satisfies z.ZodType<Record<AppLocale, string>>;

export type LocalizedString = z.infer<typeof localizedStringSchema>;

export const serviceDeliverableSchema = z.object({
  title: localizedStringSchema,
  description: localizedStringSchema,
  needs_business_confirmation: z.literal(true).optional(),
});

export const serviceStepSchema = z.object({
  title: localizedStringSchema,
  description: localizedStringSchema,
  needs_business_confirmation: z.literal(true).optional(),
});

export const serviceStackGroupSchema = z.object({
  label: localizedStringSchema,
  items: z.array(z.string().min(1)).min(1),
});

export const serviceFaqSchema = z.object({
  id: z.string().min(1),
  question: localizedStringSchema,
  answer: localizedStringSchema,
  needs_business_confirmation: z.literal(true).optional(),
});

/** System-map SVG topology presets (geometry lives in SystemMapDiagram). */
export const systemMapLayoutSchema = z.enum([
  "hub",
  "funnel",
  "modules",
  "pipeline",
  "etl",
  "stack",
]);

export type SystemMapLayout = z.infer<typeof systemMapLayoutSchema>;

export const serviceSystemMapSchema = z.object({
  windowTitle: z.string().min(1).optional(),
  layout: systemMapLayoutSchema.optional(),
  descriptionLead: localizedStringSchema,
  description: localizedStringSchema,
  nodes: z.object({
    inputTop: localizedStringSchema,
    inputBottom: localizedStringSchema,
    core: localizedStringSchema,
    outputTop: localizedStringSchema,
    outputBottom: localizedStringSchema,
  }),
  logs: z.tuple([
    localizedStringSchema,
    localizedStringSchema,
    localizedStringSchema,
  ]),
});

export const serviceBentoSchema = z.object({
  order: z.number().int().nonnegative(),
  span: z.union([z.literal(2), z.literal(4), z.literal(6)]),
  /** Decorative bento scene under `/public` (e.g. `/brand/bento/crm.svg`). */
  image: z
    .string()
    .min(1)
    .refine((value) => value.startsWith("/"), {
      message: "bento.image must be a root-relative public path",
    }),
  dark: z.boolean().optional(),
  shortTitle: localizedStringSchema,
});

/** Phase 6 service detail — one file per slug under `src/content/services/`. */
export const serviceSchema = z.object({
  slug: z.string().min(1),
  title: localizedStringSchema,
  outcome: localizedStringSchema,
  audience: z.array(localizedStringSchema).min(2).max(6),
  deliverables: z.array(serviceDeliverableSchema).min(4).max(6),
  steps: z.tuple([
    serviceStepSchema,
    serviceStepSchema,
    serviceStepSchema,
    serviceStepSchema,
  ]),
  stack: z.array(serviceStackGroupSchema).min(1),
  systemMap: serviceSystemMapSchema,
  faqs: z.array(serviceFaqSchema).min(3).max(4),
  relatedProjects: z.array(z.string().min(1)).default([]),
  bento: serviceBentoSchema,
  needs_business_confirmation: z.literal(true).optional(),
});

export type Service = z.infer<typeof serviceSchema>;
export type ServiceDeliverable = z.infer<typeof serviceDeliverableSchema>;
export type ServiceStep = z.infer<typeof serviceStepSchema>;
export type ServiceStackGroup = z.infer<typeof serviceStackGroupSchema>;
export type ServiceFaq = z.infer<typeof serviceFaqSchema>;
export type ServiceSystemMap = z.infer<typeof serviceSystemMapSchema>;
export type ServiceBento = z.infer<typeof serviceBentoSchema>;

export const projectResultSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  source: z.string().optional(),
});

export const projectGalleryItemSchema = z.object({
  src: z.string().min(1),
  caption: z.string().min(1),
  alt: z.string().min(1).optional(),
});

/** Project case-study system map — plain strings (project MDX is Persian-primary). */
export const projectSystemMapSchema = z.object({
  windowTitle: z.string().min(1).optional(),
  layout: systemMapLayoutSchema.optional(),
  descriptionLead: z.string().min(1),
  description: z.string().min(1),
  nodes: z.object({
    inputTop: z.string().min(1),
    inputBottom: z.string().min(1),
    core: z.string().min(1),
    outputTop: z.string().min(1),
    outputBottom: z.string().min(1),
  }),
  logs: z.tuple([
    z.string().min(1),
    z.string().min(1),
    z.string().min(1),
  ]),
});

export const projectSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1),
  sector: z.string().min(1),
  year: z.union([z.string().min(1), z.number().int()]),
  services: z.array(z.string().min(1)).min(1),
  role: z.string().min(1),
  problem: z.string().min(1),
  solution: z.string().min(1),
  results: z.array(projectResultSchema).default([]),
  stack: z.array(z.string().min(1)).default([]),
  cover: z.string().min(1),
  gallery: z.array(projectGalleryItemSchema).default([]),
  systemMap: projectSystemMapSchema,
  featured: z.boolean().default(false),
  status: z.enum(["published", "draft"]),
  needs_business_confirmation: z.literal(true).optional(),
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectGalleryItem = z.infer<typeof projectGalleryItemSchema>;
export type ProjectSystemMap = z.infer<typeof projectSystemMapSchema>;

export const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  date: z.union([z.string(), z.date()]),
  updated: z.union([z.string(), z.date()]).optional(),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
  author: z.string().min(1),
  cover: z.string().min(1).optional(),
  status: z.enum(["published", "draft"]),
  readingTime: z.string().min(1),
});

export type Post = z.infer<typeof postSchema>;
export type PostStatus = Post["status"];

export const faqTopicIdSchema = z.enum([
  "project-schedule",
  "cost-contract",
  "tech-security",
  "support",
]);

export type FaqTopicId = z.infer<typeof faqTopicIdSchema>;

export const faqSchema = z.object({
  id: z.string().min(1),
  topicId: faqTopicIdSchema,
  question: localizedStringSchema,
  answer: localizedStringSchema,
  needs_business_confirmation: z.literal(true),
});

export type Faq = z.infer<typeof faqSchema>;

export const faqTopicSchema = z.object({
  id: faqTopicIdSchema,
  title: localizedStringSchema,
});

export type FaqTopic = z.infer<typeof faqTopicSchema>;

export const statSchema = z.object({
  id: z.enum(["projects", "years", "industries"]),
  value: z.union([z.string().min(1), z.literal("TODO_REAL_DATA")]),
});

export type Stat = z.infer<typeof statSchema>;

export const processStepSchema = z.object({
  id: z.string().min(1),
  number: z.number().int().positive(),
  title: localizedStringSchema,
  purpose: localizedStringSchema,
  deliverables: z.array(localizedStringSchema).min(2).max(3),
  clientInvolvement: localizedStringSchema,
  /** Confirmed range, or TODO_REAL_DATA until verified (hidden in UI). */
  duration: z.union([localizedStringSchema, z.literal("TODO_REAL_DATA")]),
});

export type ProcessStep = z.infer<typeof processStepSchema>;

export const engagementModelSchema = z.object({
  id: z.string().min(1),
  title: localizedStringSchema,
  description: localizedStringSchema,
  needs_business_confirmation: z.literal(true),
});

export type EngagementModel = z.infer<typeof engagementModelSchema>;

export const communicationRowSchema = z.object({
  id: z.string().min(1),
  label: localizedStringSchema,
  /** Confirmed practice text, or TODO_REAL_DATA until verified (row hidden). */
  value: z.union([localizedStringSchema, z.literal("TODO_REAL_DATA")]),
  needs_business_confirmation: z.literal(true).optional(),
});

export type CommunicationRow = z.infer<typeof communicationRowSchema>;

export const aboutPrincipleSchema = z.object({
  id: z.string().min(1),
  title: localizedStringSchema,
  body: localizedStringSchema,
});

export type AboutPrinciple = z.infer<typeof aboutPrincipleSchema>;

export const aboutBrandNodeSchema = z.object({
  id: z.enum(["code1sprint", "kara"]),
  name: localizedStringSchema,
  focus: localizedStringSchema,
});

export type AboutBrandNode = z.infer<typeof aboutBrandNodeSchema>;

export const aboutTeamMemberSchema = z.object({
  id: z.string().min(1),
  name: localizedStringSchema,
  role: localizedStringSchema,
  /** Public image path under /public, or TODO_REAL_DATA until a real photo exists. */
  photo: z.union([z.string().min(1), z.literal("TODO_REAL_DATA")]),
});

export type AboutTeamMember = z.infer<typeof aboutTeamMemberSchema>;

export const aboutCultureItemSchema = z.object({
  id: z.string().min(1),
  title: localizedStringSchema,
  body: localizedStringSchema,
  needs_business_confirmation: z.literal(true),
});

export type AboutCultureItem = z.infer<typeof aboutCultureItemSchema>;

export const stackGroupSchema = z.object({
  id: z.enum(["frontend", "backend", "ai", "data", "devops"]),
  label: localizedStringSchema,
  items: z.array(z.string().min(1)).min(1),
});

export type StackGroup = z.infer<typeof stackGroupSchema>;

/**
 * Validate content at module/build time. Throws a readable error so
 * `next build` fails when data does not match the schema.
 */
export function parseContent<T>(
  schema: z.ZodType<T>,
  data: unknown,
  label: string,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
        return `  - ${path}: ${issue.message}`;
      })
      .join("\n");
    throw new Error(
      `[content] Invalid ${label} — fix the content file before building.\n${details}`,
    );
  }
  return result.data;
}

export function parseContentList<T>(
  schema: z.ZodType<T>,
  data: unknown[],
  label: string,
): T[] {
  return data.map((item, index) =>
    parseContent(schema, item, `${label}[${index}]`),
  );
}
