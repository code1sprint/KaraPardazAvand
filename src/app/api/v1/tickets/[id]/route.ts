import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { verifyTenantRequest } from "@/lib/auth/tenant-auth";
import { connectToDatabase } from "@/lib/db/mongodb";
import { SupportTicket } from "@/lib/db/models/SupportTicket";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await verifyTenantRequest(request);
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId")?.trim();

  if (!userId) {
    return NextResponse.json(
      { ok: false, message: "پارامتر userId برای دسترسی به جزئیات تیکت الزامی است." },
      { status: 400 },
    );
  }

  await connectToDatabase();

  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  const idFilter = isObjectId
    ? { $or: [{ _id: id }, { ticketNumber: id.toUpperCase() }] }
    : { ticketNumber: id.toUpperCase() };

  const ticket = await SupportTicket.findOne({
    ...idFilter,
    projectId: auth.project.projectId,
    "requester.userId": userId,
  }).lean();

  if (!ticket) {
    return NextResponse.json(
      { ok: false, message: "تیکت یافت نشد یا دسترسی مجاز نیست." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, ticket });
}
