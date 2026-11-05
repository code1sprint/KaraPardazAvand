import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { verifyTenantRequest } from "@/lib/auth/tenant-auth";
import { connectToDatabase } from "@/lib/db/mongodb";
import { SupportTicket } from "@/lib/db/models/SupportTicket";

const closeTicketSchema = z.object({
  userId: z.string().min(1, "شناسه کاربر الزامی است"),
});

export async function PATCH(
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

  const parseResult = closeTicketSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { ok: false, message: "شناسه کاربر الزامی است." },
      { status: 422 },
    );
  }

  const { userId } = parseResult.data;

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

  ticket.status = "CLOSED";
  ticket.closedAt = new Date();
  await ticket.save();

  return NextResponse.json({ ok: true, ticket });
}
