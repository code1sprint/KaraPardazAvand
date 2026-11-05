import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { SupportTicket } from "@/lib/db/models/SupportTicket";
import { ticketStatusEnum, ticketPriorityEnum } from "@/lib/validations/ticket";

const updateStatusSchema = z.object({
  status: ticketStatusEnum.optional(),
  priority: ticketPriorityEnum.optional(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const PATCH = withAuth(
  async (request: Request, context: unknown) => {
    const { id } = await (context as RouteContext).params;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "فرمت داده ارسالی JSON نامعتبر است." },
        { status: 400 },
      );
    }

    const parseResult = updateStatusSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { ok: false, message: "داده‌های تغییر وضعیت نامعتبر است." },
        { status: 422 },
      );
    }

    const { status, priority } = parseResult.data;

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
    if (status) {
      ticket.status = status;
      if (status === "RESOLVED") ticket.resolvedAt = now;
      if (status === "CLOSED") ticket.closedAt = now;
    }
    if (priority) {
      ticket.priority = priority;
    }

    await ticket.save();

    return NextResponse.json({ ok: true, ticket });
  },
  { roles: ["admin", "editor"] },
);
