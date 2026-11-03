import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "ایمیل الزامی است")
    .email("فرمت ایمیل نامعتبر است")
    .toLowerCase(),
  password: z
    .string()
    .min(1, "کلمه عبور الزامی است"),
});

export const setupAdminSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  email: z
    .string()
    .trim()
    .min(1, "ایمیل الزامی است")
    .email("فرمت ایمیل نامعتبر است")
    .toLowerCase(),
  password: z
    .string()
    .min(8, "کلمه عبور باید حداقل ۸ کاراکتر باشد"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SetupAdminInput = z.infer<typeof setupAdminSchema>;
