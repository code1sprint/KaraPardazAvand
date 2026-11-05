import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { SupportTicket } from "@/lib/db/models/SupportTicket";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = withAuth(
  async (_request: Request, context: unknown) => {
    const { id } = await (context as RouteContext).params;
    await connectToDatabase();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const idFilter = isObjectId
      ? { $or: [{ _id: id }, { ticketNumber: id.toUpperCase() }] }
      : { ticketNumber: id.toUpperCase() };

    const ticket = await SupportTicket.findOne(idFilter).lean();

    if (!ticket) {
      return NextResponse.json(
        { ok: false, message: "تیکت یافت نشد." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, ticket });
  },
  { roles: ["admin", "editor"] },
);
