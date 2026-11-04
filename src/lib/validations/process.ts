import { z } from "zod";

export const localizedStringSchema = z.object({
  fa: z.string().min(1, "متن فارسی الزامی است"),
  en: z.string().optional().default(""),
});

export const processStepSchema = z.object({
  id: z.string().min(1, "شناسه الزامی است"),
  number: z.number().int().min(1),
  title: localizedStringSchema,
  purpose: localizedStringSchema,
  deliverables: z.array(localizedStringSchema).default([]),
  clientInvolvement: localizedStringSchema,
  duration: localizedStringSchema.nullable().optional(),
});

export const engagementModelSchema = z.object({
  id: z.string().min(1, "شناسه الزامی است"),
  title: localizedStringSchema,
  description: localizedStringSchema,
  needs_business_confirmation: z.boolean().optional().default(true),
});

export const communicationRowSchema = z.object({
  id: z.string().min(1, "شناسه الزامی است"),
  label: localizedStringSchema,
  value: localizedStringSchema.nullable().optional(),
  needs_business_confirmation: z.boolean().optional().default(true),
});

export const processFormSchema = z.object({
  hero: z
    .object({
      titleBefore: localizedStringSchema.optional(),
      titleGradient: localizedStringSchema.optional(),
      titleAfter: localizedStringSchema.optional(),
      lead: localizedStringSchema.optional(),
    })
    .optional(),
  steps: z.array(processStepSchema).default([]),
  engagementModels: z.array(engagementModelSchema).default([]),
  communicationRows: z.array(communicationRowSchema).default([]),
  guide: z
    .object({
      title: localizedStringSchema,
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
    })
    .optional(),
});

export type ProcessFormData = z.infer<typeof processFormSchema>;
