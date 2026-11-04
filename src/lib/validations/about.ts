import { z } from "zod";

export const localizedStringSchema = z.object({
  fa: z.string().min(1, "متن فارسی الزامی است"),
  en: z.string().optional().default(""),
});

export const aboutPrincipleSchema = z.object({
  id: z.string().min(1, "شناسه الزامی است"),
  title: localizedStringSchema,
  body: localizedStringSchema,
});

export const aboutBrandNodeSchema = z.object({
  id: z.enum(["code1sprint", "kara"]),
  name: localizedStringSchema,
  focus: localizedStringSchema,
});

export const aboutTeamMemberSchema = z.object({
  id: z.string().min(1, "شناسه الزامی است"),
  name: localizedStringSchema,
  role: localizedStringSchema,
  photo: z.string().nullable().optional(),
});

export const aboutCultureItemSchema = z.object({
  id: z.string().min(1, "شناسه الزامی است"),
  title: localizedStringSchema,
  body: localizedStringSchema,
  needs_business_confirmation: z.boolean().optional().default(true),
});

export const aboutFormSchema = z.object({
  intro: z.object({
    title: localizedStringSchema,
    lead: localizedStringSchema,
  }),
  story: z.object({
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
  }),
  principles: z.array(aboutPrincipleSchema).default([]),
  brandNodes: z.array(aboutBrandNodeSchema).default([]),
  team: z.array(aboutTeamMemberSchema).default([]),
  culture: z.array(aboutCultureItemSchema).default([]),
});

export type AboutFormData = z.infer<typeof aboutFormSchema>;
