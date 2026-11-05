import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { SupportTicket } from "@/lib/db/models/SupportTicket";
import { addMessageSchema } from "@/lib/validations/ticket";

const adminReplySchema = addMessageSchema.extend({
  status: z.enum(["ANSWERED", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional().default("ANSWERED"),
});

export const POST = withAuth(
  async (request: Request, context: { user: { sub: string; name: string }; params: Promise<{ id: string }> }) => {
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

    const parseResult = adminReplySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "داده ارسالی پاسخ نامعتبر است.",
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 422 },
      );
    }

    const { message, attachments, status } = parseResult.data;

    await connectToDatabase();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const idFilter = isObjectId
      ? { $or: [{ _id: id }, { ticketNumber: id.toUpperCase() }] }
      : { ticketNumber: id.toUpperCase() };

    const ticket = await SupportTicket.findOne(idFilter);

    if (!ticket) {
      return NextResponse.json(
        { ok: false, message: "تیکت یافت نشد." },
        { status: 404 },
      );
    }

    const now = new Date();
    ticket.messages.push({
      senderRole: "SUPPORT_AGENT",
      senderId: context.user.sub,
      senderName: context.user.name || "تیم پشتیبانی کاراپرداز",
      message,
      attachments: attachments || [],
      createdAt: now,
    });

    ticket.status = status;
    ticket.lastMessageAt = now;
    if (status === "RESOLVED") ticket.resolvedAt = now;
    if (status === "CLOSED") ticket.closedAt = now;

    await ticket.save();

    return NextResponse.json({ ok: true, ticket });
  },
  { roles: ["admin", "editor"] },
);
