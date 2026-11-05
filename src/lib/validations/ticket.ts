import { z } from "zod";

export const ticketStatusEnum = z.enum([
  "OPEN",
  "IN_PROGRESS",
  "ANSWERED",
  "RESOLVED",
  "CLOSED",
]);
export type TicketStatusType = z.infer<typeof ticketStatusEnum>;

export const ticketPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export type TicketPriorityType = z.infer<typeof ticketPriorityEnum>;

export const ticketSenderRoleEnum = z.enum(["CLIENT_USER", "SUPPORT_AGENT"]);
export type TicketSenderRoleType = z.infer<typeof ticketSenderRoleEnum>;

export const ticketAttachmentSchema = z.object({
  name: z.string().min(1, "نام فایل الزامی است"),
  url: z.string().url("آدرس فایل نامعتبر است"),
  size: z.number().optional(),
  mimeType: z.string().optional(),
});
export type TicketAttachmentInput = z.infer<typeof ticketAttachmentSchema>;

export const ticketRequesterSchema = z.object({
  userId: z.string().min(1, "شناسه کاربر الزامی است"),
  name: z.string().min(1, "نام کاربر الزامی است"),
  phone: z.string().optional().default(""),
  email: z.string().email("ایمیل نامعتبر است").optional().or(z.literal("")),
  organization: z.string().optional().default(""),
});
export type TicketRequesterInput = z.infer<typeof ticketRequesterSchema>;

export const createTicketSchema = z.object({
  requester: ticketRequesterSchema,
  department: z.string().min(1, "دپارتمان الزامی است"),
  priority: ticketPriorityEnum.default("MEDIUM"),
  subject: z.string().min(3, "عنوان تیکت باید حداقل ۳ نویسه باشد").max(200),
  message: z.string().min(5, "متن پیام تیکت باید حداقل ۵ نویسه باشد"),
  attachments: z.array(ticketAttachmentSchema).optional().default([]),
});
export type CreateTicketPayload = z.infer<typeof createTicketSchema>;

export const addMessageSchema = z.object({
  message: z.string().min(2, "متن پیام باید حداقل ۲ نویسه باشد"),
  attachments: z.array(ticketAttachmentSchema).optional().default([]),
});
export type AddMessagePayload = z.infer<typeof addMessageSchema>;
