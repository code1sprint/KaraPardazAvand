import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { SupportedProject } from "@/lib/db/models/SupportedProject";
import { SupportTicket } from "@/lib/db/models/SupportTicket";

export const GET = withAuth(
  async () => {
    await connectToDatabase();

    const projects = await SupportedProject.find({ isActive: true })
      .select("projectId name departments createdAt")
      .lean();

    const counts = await SupportTicket.aggregate([
      {
        $group: {
          _id: { projectId: "$projectId", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);

    const projectStats: Record<string, { total: number; open: number }> = {};
    for (const p of projects) {
      projectStats[p.projectId] = { total: 0, open: 0 };
    }

    for (const c of counts) {
      const pid = c._id.projectId;
      if (!projectStats[pid]) {
        projectStats[pid] = { total: 0, open: 0 };
      }
      projectStats[pid].total += c.count;
      if (c._id.status === "OPEN" || c._id.status === "IN_PROGRESS") {
        projectStats[pid].open += c.count;
      }
    }

    const result = projects.map((p) => ({
      ...p,
      stats: projectStats[p.projectId] || { total: 0, open: 0 },
    }));

    return NextResponse.json({ ok: true, projects: result });
  },
  { roles: ["admin", "editor"] },
);
