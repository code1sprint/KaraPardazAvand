import { z } from "zod";

export const projectResultInputSchema = z.object({
  label: z.string().min(1, "عنوان شاخص الزامی است").trim(),
  value: z.string().min(1, "مقدار شاخص الزامی است").trim(),
  source: z.string().optional().default("").transform((s) => s?.trim() || ""),
});

export const projectGalleryItemInputSchema = z.object({
  src: z.string().min(1, "آدرس تصویر الزامی است").trim(),
  caption: z.string().min(1, "کپشن تصویر الزامی است").trim(),
  alt: z.string().optional().default("").transform((s) => s?.trim() || ""),
});

export const projectSystemMapInputSchema = z.object({
  windowTitle: z.string().optional().default("kara://project"),
  layout: z
    .enum(["hub", "funnel", "modules", "pipeline", "etl", "stack"])
    .default("hub"),
  descriptionLead: z.string().min(1, "راهنمای نقشه الزامی است").trim(),
  description: z.string().min(1, "شرح معماری الزامی است").trim(),
  nodes: z.object({
    inputTop: z.string().min(1, "ورودی بالا الزامی است").trim(),
    inputBottom: z.string().min(1, "ورودی پایین الزامی است").trim(),
    core: z.string().min(1, "هسته پردازش الزامی است").trim(),
    outputTop: z.string().min(1, "خروجی بالا الزامی است").trim(),
    outputBottom: z.string().min(1, "خروجی پایین الزامی است").trim(),
  }),
  logs: z.array(z.string().min(1)).length(3, "بخش لاگ‌ها باید دقیقاً ۳ خط باشد"),
});

export const projectCreateSchema = z.object({
  slug: z
    .string()
    .min(2, "اسلاگ حداقل ۲ کاراکتر باشد")
    .max(64)
    .regex(/^[a-z0-9-]+$/, "اسلاگ فقط می‌تواند حروف کوچک انگلیسی، ارقام و خط تیره باشد")
    .trim(),
  title: z.string().min(2, "عنوان پروژه الزامی است").trim(),
  sector: z.string().min(2, "حوزه صنعت الزامی است").trim(),
  year: z.string().min(2, "سال اجرا الزامی است").trim().default("1403"),
  services: z.array(z.string()).default([]),
  role: z.string().min(2, "نقش شرکت در پروژه الزامی است").trim(),
  problem: z.string().min(5, "طرح مسئله حداقل ۵ کاراکتر باشد").trim(),
  solution: z.string().min(5, "راه‌حل ارائه‌شده حداقل ۵ کاراکتر باشد").trim(),
  results: z.array(projectResultInputSchema).default([]),
  stack: z.array(z.string().min(1)).default([]),
  cover: z.string().min(1, "تصویر کاور الزامی است").default("/projects/ops-crm-cover.svg"),
  gallery: z.array(projectGalleryItemInputSchema).default([]),
  systemMap: projectSystemMapInputSchema,
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  contentJson: z.record(z.string(), z.unknown()).optional().default({}),
  contentHtml: z.string().optional().default(""),
});

export const projectUpdateSchema = projectCreateSchema.partial().extend({
  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9-]+$/)
    .trim()
    .optional(),
});

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
