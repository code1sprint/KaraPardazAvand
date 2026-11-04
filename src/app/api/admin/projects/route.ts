import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getProjectModel } from "@/lib/db/models/Project";
import { projectCreateSchema } from "@/lib/validations/project";
import { normalizePersianText } from "@/lib/editor/normalizer";

export const GET = withAuth(
  async (request: Request) => {
    await connectToDatabase();
    const Project = await getProjectModel();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const sector = searchParams.get("sector");
    const query = searchParams.get("q");

    const filter: Record<string, unknown> = {};
    if (status && (status === "published" || status === "draft")) {
      filter.status = status;
    }
    if (sector) {
      filter.sector = sector;
    }
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { slug: { $regex: query, $options: "i" } },
        { problem: { $regex: query, $options: "i" } },
        { solution: { $regex: query, $options: "i" } },
        { sector: { $regex: query, $options: "i" } },
      ];
    }

    const projects = await Project.find(filter)
      .select("-contentJson")
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, projects });
  },
  { roles: ["admin", "editor"] },
);

export const POST = withAuth(
  async (request: Request) => {
    await connectToDatabase();
    const Project = await getProjectModel();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "داده ارسالی نامعتبر است." },
        { status: 400 },
      );
    }

    const parseResult = projectCreateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "خطا در اعتبارسنجی اطلاعات پروژه.",
          errors: parseResult.error.flatten(),
        },
        { status: 422 },
      );
    }

    const validData = parseResult.data;

    // Check slug collision
    const existing = await Project.findOne({ slug: validData.slug });
    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          message: `اسلاگ '${validData.slug}' قبلاً برای پروژه دیگری ثبت شده است.`,
        },
        { status: 409 },
      );
    }

    let normalizedHtml = validData.contentHtml || "";
    if (normalizedHtml) {
      normalizedHtml = normalizePersianText(normalizedHtml);
    }

    const projectDoc = await Project.create({
      ...validData,
      contentHtml: normalizedHtml,
    });

    return NextResponse.json(
      {
        ok: true,
        message: "پروژه جدید با موفقیت ایجاد شد.",
        project: projectDoc,
      },
      { status: 201 },
    );
  },
  { roles: ["admin", "editor"] },
);
