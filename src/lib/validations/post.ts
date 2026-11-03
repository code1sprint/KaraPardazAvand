import { z } from "zod";

export const postInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "اسلاگ باید حداقل ۲ کاراکتر باشد.")
    .regex(/^[a-z0-9-]+$/, "اسلاگ فقط می‌تواند شامل حروف کوچک انگلیسی، ارقام و خط تیره (-) باشد."),
  locale: z.enum(["fa", "en"]),
  title: z.string().trim().min(3, "عنوان مقاله باید حداقل ۳ کاراکتر باشد."),
  summary: z.string().trim().min(10, "خلاصه مقاله باید حداقل ۱۰ کاراکتر باشد."),
  tags: z.array(z.string().trim()).default([]),
  author: z.object({
    name: z.string().trim().min(2, "نام نویسنده الزامی است."),
    role: z.string().trim().min(2, "سمت نویسنده الزامی است."),
    avatar: z.string().optional(),
  }),
  cover: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  publishedAt: z.coerce.date().default(() => new Date()),
  contentJson: z.record(z.string(), z.any()).default({ type: "doc", content: [] }),
  contentHtml: z.string().default(""),
});

export type PostInput = z.infer<typeof postInputSchema>;
