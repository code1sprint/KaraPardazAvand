import { z } from "zod";

export const localizedStringInputSchema = z.object({
  fa: z.string().min(1, "متن فارسی الزامی است").trim(),
  en: z.string().min(1, "متن انگلیسی الزامی است").trim(),
});

export const serviceDeliverableInputSchema = z.object({
  title: localizedStringInputSchema,
  description: localizedStringInputSchema,
});

export const serviceStepInputSchema = z.object({
  title: localizedStringInputSchema,
  description: localizedStringInputSchema,
});

export const serviceStackGroupInputSchema = z.object({
  label: localizedStringInputSchema,
  items: z.array(z.string().min(1).trim()).min(1, "حداقل یک ابزار یا فریم‌ورک مشخص کنید"),
});

export const serviceFaqInputSchema = z.object({
  id: z.string().min(1).trim(),
  question: localizedStringInputSchema,
  answer: localizedStringInputSchema,
});

export const serviceSystemMapInputSchema = z.object({
  windowTitle: z.string().optional().default("karapardaz-system"),
  layout: z
    .enum(["hub", "funnel", "modules", "pipeline", "etl", "stack"])
    .default("hub"),
  descriptionLead: localizedStringInputSchema,
  description: localizedStringInputSchema,
  nodes: z.object({
    inputTop: localizedStringInputSchema,
    inputBottom: localizedStringInputSchema,
    core: localizedStringInputSchema,
    outputTop: localizedStringInputSchema,
    outputBottom: localizedStringInputSchema,
  }),
  logs: z.array(localizedStringInputSchema).length(3, "بخش گزارش‌ها باید دقیقاً شامل ۳ خط باشد"),
});

export const serviceBentoInputSchema = z.object({
  order: z.number().int().nonnegative().default(0),
  span: z.union([z.literal(2), z.literal(4), z.literal(6)]).default(4),
  image: z.string().min(1).default("/brand/bento/crm.svg"),
  shortTitle: localizedStringInputSchema,
});

export const serviceCreateSchema = z.object({
  slug: z
    .string()
    .min(2, "اسلاگ حداقل ۲ کاراکتر باشد")
    .max(64)
    .regex(/^[a-z0-9-]+$/, "اسلاگ فقط می‌تواند حروف کوچک انگلیسی، ارقام و خط تیره باشد")
    .trim(),
  title: localizedStringInputSchema,
  outcome: localizedStringInputSchema,
  audience: z.array(localizedStringInputSchema).default([]),
  deliverables: z.array(serviceDeliverableInputSchema).default([]),
  steps: z.array(serviceStepInputSchema).default([]),
  stack: z.array(serviceStackGroupInputSchema).default([]),
  systemMap: serviceSystemMapInputSchema,
  faqs: z.array(serviceFaqInputSchema).default([]),
  relatedProjects: z.array(z.string()).default([]),
  bento: serviceBentoInputSchema,
  deepDiveJson: z.record(z.string(), z.unknown()).optional().default({}),
  deepDiveHtml: z.string().optional().default(""),
  status: z.enum(["draft", "published"]).default("published"),
});

export const serviceUpdateSchema = serviceCreateSchema.partial().extend({
  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9-]+$/)
    .trim()
    .optional(),
});

export type ServiceCreateInput = z.infer<typeof serviceCreateSchema>;
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>;
