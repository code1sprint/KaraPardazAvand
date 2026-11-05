import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { SupportTicket } from "@/lib/db/models/SupportTicket";

export const GET = withAuth(
  async (request: Request) => {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId")?.trim();
    const status = searchParams.get("status")?.trim();
    const department = searchParams.get("department")?.trim();
    const priority = searchParams.get("priority")?.trim();
    const query = searchParams.get("q")?.trim();

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (projectId && projectId !== "all") {
      filter.projectId = projectId.toLowerCase();
    }
    if (status && status !== "all") {
      filter.status = status;
    }
    if (department && department !== "all") {
      filter.department = department;
    }
    if (priority && priority !== "all") {
      filter.priority = priority;
    }
    if (query) {
      filter.$or = [
        { ticketNumber: { $regex: query, $options: "i" } },
        { subject: { $regex: query, $options: "i" } },
        { "requester.name": { $regex: query, $options: "i" } },
        { "requester.phone": { $regex: query, $options: "i" } },
        { "requester.organization": { $regex: query, $options: "i" } },
      ];
    }

    const baseCountFilter = projectId && projectId !== "all" ? { projectId: projectId.toLowerCase() } : {};

    const [tickets, totalFiltered, countsRaw] = await Promise.all([
      SupportTicket.find(filter)
        .sort({ lastMessageAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SupportTicket.countDocuments(filter),
      SupportTicket.aggregate([
        { $match: baseCountFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    const counts: Record<string, number> = {
      all: 0,
      OPEN: 0,
      IN_PROGRESS: 0,
      ANSWERED: 0,
      RESOLVED: 0,
      CLOSED: 0,
    };

    for (const c of countsRaw) {
      if (counts[c._id] !== undefined) {
        counts[c._id] = c.count;
      }
      counts.all += c.count;
    }

    return NextResponse.json({
      ok: true,
      tickets,
      pagination: {
        total: totalFiltered,
        page,
        limit,
        totalPages: Math.ceil(totalFiltered / limit),
      },
      counts,
    });
  },
  { roles: ["admin", "editor"] },
);
