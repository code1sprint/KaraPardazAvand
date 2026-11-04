import { z } from "zod";

export const localizedStringSchema = z.object({
  fa: z.string().min(1, "متن فارسی الزامی است"),
  en: z.string().optional().default(""),
});

export const legalDocSchema = z.object({
  slug: z
    .string()
    .min(2, "اسلاگ باید حداقل ۲ کاراکتر باشد")
    .regex(/^[a-z0-9-]+$/, "اسلاگ فقط می‌تواند شامل حروف کوچک لاتین، اعداد و خط تیره (-) باشد"),
  title: localizedStringSchema,
  summary: localizedStringSchema.optional(),
  updatedIso: z
    .string()
    .optional()
    .default(() => new Date().toISOString().slice(0, 10)),
  tiptapBody: z
    .object({
      fa: z
        .object({
          html: z.string().optional().default(""),
          json: z.any().optional(),
        })
        .optional(),
      en: z
        .object({
          html: z.string().optional().default(""),
          json: z.any().optional(),
        })
        .optional(),
    })
    .optional(),
  status: z.enum(["published", "draft"]).default("published"),
});

export type LegalDocFormData = z.infer<typeof legalDocSchema>;
