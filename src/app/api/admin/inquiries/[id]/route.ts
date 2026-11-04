import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Inquiry } from "@/lib/db/models/Inquiry";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = withAuth(
  async (_request: Request, context: unknown) => {
    const { id } = await (context as RouteContext).params;
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: "شناسه پیام نامعتبر است." },
        { status: 400 },
      );
    }

    const inquiry = await Inquiry.findById(id).lean();
    if (!inquiry) {
      return NextResponse.json(
        { ok: false, message: "پیام مورد نظر یافت نشد." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, inquiry });
  },
  { roles: ["admin", "editor"] },
);

export const PUT = withAuth(
  async (request: Request, context: unknown) => {
    const { id } = await (context as RouteContext).params;
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: "شناسه پیام نامعتبر است." },
        { status: 400 },
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "داده ارسالی نامعتبر است." },
        { status: 400 },
      );
    }

    const updateFields: Record<string, unknown> = {};
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.notes !== undefined) updateFields.notes = body.notes;
    if (body.name !== undefined) updateFields.name = body.name;
    if (body.email !== undefined) updateFields.email = body.email;
    if (body.phone !== undefined) updateFields.phone = body.phone;
    if (body.service !== undefined) updateFields.service = body.service;
    if (body.stage !== undefined) updateFields.stage = body.stage;
    if (body.message !== undefined) updateFields.message = body.message;

    const updated = await Inquiry.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true },
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { ok: false, message: "پیام یافت نشد." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      inquiry: updated,
      message: "پیام با موفقیت به‌روزرسانی شد.",
    });
  },
  { roles: ["admin", "editor"] },
);

export const PATCH = PUT;

export const DELETE = withAuth(
  async (_request: Request, context: unknown) => {
    const { id } = await (context as RouteContext).params;
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: "شناسه پیام نامعتبر است." },
        { status: 400 },
      );
    }

    const deleted = await Inquiry.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { ok: false, message: "پیام یافت نشد." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "پیام با موفقیت حذف شد.",
    });
  },
  { roles: ["admin", "editor"] },
);
