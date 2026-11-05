import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { verifyTenantRequest } from "@/lib/auth/tenant-auth";
import { connectToDatabase } from "@/lib/db/mongodb";
import { SupportTicket } from "@/lib/db/models/SupportTicket";
import { addMessageSchema } from "@/lib/validations/ticket";

const clientMessagePayloadSchema = addMessageSchema.extend({
  userId: z.string().min(1, "شناسه کاربر الزامی است"),
  userName: z.string().optional(),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await verifyTenantRequest(request);
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "فرمت داده ارسالی JSON نامعتبر است." },
      { status: 400 },
    );
  }

  const parseResult = clientMessagePayloadSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "داده‌های پیام ارسالی نامعتبر است.",
        errors: parseResult.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const { userId, userName, message, attachments } = parseResult.data;

  await connectToDatabase();

  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  const idFilter = isObjectId
    ? { $or: [{ _id: id }, { ticketNumber: id.toUpperCase() }] }
    : { ticketNumber: id.toUpperCase() };

  const ticket = await SupportTicket.findOne({
    ...idFilter,
    projectId: auth.project.projectId,
    "requester.userId": userId,
  });

  if (!ticket) {
    return NextResponse.json(
      { ok: false, message: "تیکت یافت نشد یا دسترسی مجاز نیست." },
      { status: 404 },
    );
  }

  const now = new Date();

  // Review Focus 3: Closed tickets are immutable
  if (ticket.status === "CLOSED") {
    return NextResponse.json(
      {
        ok: false,
        message: "این تیکت بسته شده است و امکان ارسال پیام جدید وجود ندارد. لطفاً تیکت جدید ثبت کنید.",
      },
      { status: 409 },
    );
  }

  // Review Focus 4: Reopening resolved ticket within 7-day window
  if (ticket.status === "RESOLVED") {
    const resolvedTime = ticket.resolvedAt ? ticket.resolvedAt.getTime() : ticket.updatedAt.getTime();
    const daysSinceResolved = (now.getTime() - resolvedTime) / (1000 * 60 * 60 * 24);

    if (daysSinceResolved > 7) {
      ticket.status = "CLOSED";
      ticket.closedAt = now;
      await ticket.save();

      return NextResponse.json(
        {
          ok: false,
          message: "مهلت پیگیری این تیکت (۷ روز پس از حل مشکل) به پایان رسیده و تیکت بسته شده است.",
        },
        { status: 409 },
      );
    }

    // Reopen ticket
    ticket.status = "OPEN";
  } else if (ticket.status === "ANSWERED") {
    // When client replies to an answered ticket, it goes back to OPEN/in progress for support team
    ticket.status = "OPEN";
  }

  ticket.messages.push({
    senderRole: "CLIENT_USER",
    senderId: userId,
    senderName: userName || ticket.requester.name,
    message,
    attachments: attachments || [],
    createdAt: now,
  });

  ticket.lastMessageAt = now;
  await ticket.save();

  return NextResponse.json({ ok: true, ticket });
}
