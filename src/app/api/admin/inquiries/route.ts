import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Inquiry, type InquiryStatus } from "@/lib/db/models/Inquiry";

export const GET = withAuth(
  async (request: Request) => {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const query = searchParams.get("q");

    const filter: Record<string, unknown> = {};
    if (status && ["new", "reviewed", "contacted"].includes(status)) {
      filter.status = status;
    }
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
        { message: { $regex: query, $options: "i" } },
        { service: { $regex: query, $options: "i" } },
      ];
    }

    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, inquiries });
  },
  { roles: ["admin", "editor"] },
);

export const POST = withAuth(
  async (request: Request) => {
    await connectToDatabase();

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "داده ارسالی نامعتبر است." },
        { status: 400 },
      );
    }

    if (!body.name || !body.message || !body.service || !body.stage) {
      return NextResponse.json(
        { ok: false, message: "فیلدهای نام، پیام، نوع خدمت و مرحله الزامی هستند." },
        { status: 422 },
      );
    }

    const created = await Inquiry.create({
      name: String(body.name).trim(),
      email: body.email ? String(body.email).trim() : "",
      phone: body.phone ? String(body.phone).trim() : "",
      service: String(body.service).trim(),
      stage: String(body.stage).trim(),
      message: String(body.message).trim(),
      status: (body.status as InquiryStatus) || "new",
      notes: body.notes ? String(body.notes) : "",
      source: body.source ? String(body.source) : "admin-api",
    });

    return NextResponse.json(
      { ok: true, inquiry: created, message: "درخواست با موفقیت ثبت شد." },
      { status: 201 },
    );
  },
  { roles: ["admin", "editor"] },
);
