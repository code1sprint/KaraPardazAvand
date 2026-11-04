import { z } from "zod";

export const localizedStringSchema = z.object({
  fa: z.string().min(1, "متن فارسی الزامی است"),
  en: z.string().optional().default(""),
});

export const siteSettingsSchema = z.object({
  hero: z.object({
    pill: localizedStringSchema,
    titleBefore: localizedStringSchema,
    titleGradient: localizedStringSchema,
    titleAfter: localizedStringSchema,
    lead: localizedStringSchema,
    ctaPrimary: z.object({
      label: localizedStringSchema,
      href: z.string().min(1, "لینک الزامی است"),
    }),
    ctaSecondary: z.object({
      label: localizedStringSchema,
      href: z.string().min(1, "لینک الزامی است"),
    }),
    techMarquee: z.array(z.string()).default([]),
  }),
  whyStatements: z
    .array(
      z.object({
        id: z.string().min(1),
        title: localizedStringSchema,
        body: localizedStringSchema,
      }),
    )
    .default([]),
  stats: z
    .array(
      z.object({
        id: z.string().min(1),
        value: z.string().optional().default(""),
        label: localizedStringSchema,
        source: z.string().optional().default(""),
      }),
    )
    .default([]),
  contact: z.object({
    phone: z.string().optional().default(""),
    email: z.string().optional().default(""),
    address: localizedStringSchema.optional(),
    workingHours: localizedStringSchema.optional(),
    socials: z
      .object({
        linkedin: z.string().optional().default(""),
        github: z.string().optional().default(""),
        telegram: z.string().optional().default(""),
        instagram: z.string().optional().default(""),
      })
      .optional()
      .default({
        linkedin: "",
        github: "",
        telegram: "",
        instagram: "",
      }),
  }),
  seo: z.object({
    siteName: localizedStringSchema,
    homeTitle: localizedStringSchema,
    homeDescription: localizedStringSchema,
    ogImageAlt: localizedStringSchema,
  }),
});

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;
