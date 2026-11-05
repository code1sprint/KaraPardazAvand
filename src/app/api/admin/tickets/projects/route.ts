import { NextResponse } from "next/server";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { SupportedProject } from "@/lib/db/models/SupportedProject";
import { SupportTicket } from "@/lib/db/models/SupportTicket";

const createProjectSchema = z.object({
  name: z.string().min(2, "نام پروژه باید حداقل ۲ نویسه باشد"),
  projectId: z
    .string()
    .min(2, "شناسه انگلیسی پروژه باید حداقل ۲ نویسه باشد")
    .regex(/^[a-z0-9_-]+$/, "شناسه پروژه فقط می‌تواند شامل حروف کوچک انگلیسی، اعداد و خط تیره باشد"),
  departments: z
    .array(
      z.object({
        id: z.string().min(1),
        nameFa: z.string().min(1),
      }),
    )
    .optional(),
});

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

export const POST = withAuth(
  async (request: Request) => {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "فرمت داده ارسالی JSON نامعتبر است." },
        { status: 400 },
      );
    }

    const parseResult = createProjectSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "داده‌های ارسالی پروژه نامعتبر است.",
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 422 },
      );
    }

    const { name, projectId, departments } = parseResult.data;

    await connectToDatabase();

    const existing = await SupportedProject.findOne({ projectId: projectId.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { ok: false, message: `پروژه‌ای با شناسه «${projectId}» از قبل ثبت شده است.` },
        { status: 409 },
      );
    }

    // Generate random secret API key
    const randomHex = crypto.randomBytes(16).toString("hex");
    const rawApiKey = `kp_live_${projectId.toLowerCase()}_${randomHex}`;
    const apiKeyHash = await bcrypt.hash(rawApiKey, 10);

    const defaultDepartments = [
      { id: "technical", nameFa: "پشتیبانی فنی و سامانه" },
      { id: "sales", nameFa: "امور مالی و پرداخت" },
      { id: "general", nameFa: "عمومی و پیگیری" },
    ];

    const project = await SupportedProject.create({
      projectId: projectId.toLowerCase(),
      name,
      apiKeyHash,
      departments: departments && departments.length > 0 ? departments : defaultDepartments,
      isActive: true,
    });

    return NextResponse.json(
      {
        ok: true,
        project: {
          projectId: project.projectId,
          name: project.name,
          departments: project.departments,
        },
        rawApiKey,
      },
      { status: 201 },
    );
  },
  { roles: ["admin"] },
);
