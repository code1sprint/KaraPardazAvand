import { NextResponse } from "next/server";
import { verifyTenantRequest } from "@/lib/auth/tenant-auth";
import { connectToDatabase } from "@/lib/db/mongodb";
import { SupportTicket } from "@/lib/db/models/SupportTicket";
import { createTicketSchema, ticketStatusEnum, TicketStatusType } from "@/lib/validations/ticket";

export async function GET(request: Request) {
  const auth = await verifyTenantRequest(request);
  if (auth.errorResponse) return auth.errorResponse;

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId")?.trim();

  if (!userId) {
    return NextResponse.json(
      { ok: false, message: "پارامتر userId برای دریافت تیکت‌های کاربر الزامی است." },
      { status: 400 },
    );
  }

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;

  const status = searchParams.get("status")?.trim();
  const filter: Record<string, unknown> = {
    projectId: auth.project.projectId,
    "requester.userId": userId,
  };

  if (status && ticketStatusEnum.options.includes(status as TicketStatusType)) {
    filter.status = status;
  }

  await connectToDatabase();

  const [tickets, total] = await Promise.all([
    SupportTicket.find(filter)
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    SupportTicket.countDocuments(filter),
  ]);

  return NextResponse.json({
    ok: true,
    tickets,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: Request) {
  const auth = await verifyTenantRequest(request);
  if (auth.errorResponse) return auth.errorResponse;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "فرمت داده ارسالی JSON نامعتبر است." },
      { status: 400 },
    );
  }

  const parseResult = createTicketSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "اطلاعات ارسالی تیکت نامعتبر است.",
        errors: parseResult.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = parseResult.data;
  await connectToDatabase();

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const timestampSuffix = Date.now().toString().slice(-4);
  const ticketNumber = `TK-${auth.project.projectId.toUpperCase()}-${randomSuffix}${timestampSuffix}`;

  const now = new Date();
  const newTicket = await SupportTicket.create({
    ticketNumber,
    projectId: auth.project.projectId,
    requester: data.requester,
    department: data.department,
    priority: data.priority,
    subject: data.subject,
    status: "OPEN",
    messages: [
      {
        senderRole: "CLIENT_USER",
        senderId: data.requester.userId,
        senderName: data.requester.name,
        message: data.message,
        attachments: data.attachments || [],
        createdAt: now,
      },
    ],
    lastMessageAt: now,
  });

  return NextResponse.json(
    { ok: true, ticket: newTicket },
    { status: 201 },
  );
}
