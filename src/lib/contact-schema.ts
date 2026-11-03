import { z } from "zod";
import { CONTACT_SERVICE_IDS, CONTACT_STAGE_IDS } from "@/content/contact";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Iranian mobile / landline-ish; also allows +98… */
const phonePattern =
  /^(?:\+98|0)?9\d{9}$|^(?:\+98|0)\d{10,11}$|^\+?[\d\s()-]{8,20}$/;

export function isEmail(value: string): boolean {
  return emailPattern.test(value.trim());
}

export function isPhone(value: string): boolean {
  return phonePattern.test(value.trim());
}

export type ContactSchemaMessages = {
  nameRequired: string;
  nameMax: string;
  contactRequired: string;
  phoneInvalid: string;
  emailInvalid: string;
  serviceRequired: string;
  stageRequired: string;
  messageRequired: string;
  messageMax: string;
  consentRequired: string;
};

/** Server + client schema. Localized messages are applied on the client. */
export function createContactSchema(messages: ContactSchemaMessages) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(2, messages.nameRequired)
        .max(80, messages.nameMax),
      phone: z.string().trim().default(""),
      email: z.string().trim().default(""),
      service: z
        .string()
        .min(1, messages.serviceRequired)
        .refine((value) => CONTACT_SERVICE_IDS.includes(value), {
          message: messages.serviceRequired,
        }),
      stage: z
        .string()
        .min(1, messages.stageRequired)
        .refine((value) => CONTACT_STAGE_IDS.includes(value), {
          message: messages.stageRequired,
        }),
      message: z
        .string()
        .trim()
        .min(10, messages.messageRequired)
        .max(2000, messages.messageMax),
      consent: z.boolean().refine((value) => value === true, {
        message: messages.consentRequired,
      }),
      /** Honeypot — must stay empty. */
      website: z.string().default(""),
    })
    .superRefine((data, ctx) => {
      const phone = data.phone.trim();
      const email = data.email.trim();

      if (!phone && !email) {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: messages.contactRequired,
        });
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: messages.contactRequired,
        });
        return;
      }

      if (phone && !isPhone(phone)) {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: messages.phoneInvalid,
        });
      }

      if (email && !isEmail(email)) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: messages.emailInvalid,
        });
      }
    });
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;

/** API-facing schema with English technical messages (mapped to UI separately). */
export const contactApiSchema = createContactSchema({
  nameRequired: "name_required",
  nameMax: "name_max",
  contactRequired: "contact_required",
  phoneInvalid: "phone_invalid",
  emailInvalid: "email_invalid",
  serviceRequired: "service_required",
  stageRequired: "stage_required",
  messageRequired: "message_required",
  messageMax: "message_max",
  consentRequired: "consent_required",
});
