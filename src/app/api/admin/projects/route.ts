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

    const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
    const normalized: Record<string, unknown> = { ...raw };

    if (raw.title && typeof raw.title === "object") {
      normalized.title = (raw.title as { fa?: string; en?: string }).fa || (raw.title as { fa?: string; en?: string }).en || "";
    }
    if (!normalized.sector && typeof raw.industry === "string") {
      normalized.sector = raw.industry;
    }
    if (!normalized.problem && typeof raw.summary === "string") {
      normalized.problem = raw.summary;
    } else if (!normalized.problem && raw.summary && typeof raw.summary === "object") {
      normalized.problem = (raw.summary as { fa?: string }).fa || "";
    }
    if (!normalized.solution && normalized.problem) {
      normalized.solution = String(normalized.problem);
    }
    if (!normalized.role) {
      normalized.role = "طراحی و توسعه نرم‌افزار";
    }
    if (!normalized.results && Array.isArray(raw.metrics)) {
      normalized.results = raw.metrics.map((m: { value?: string; label?: string | { fa?: string } }) => ({
        value: m.value || "",
        label: typeof m.label === "object" ? m.label?.fa || "" : m.label || "",
      }));
    }
    if (!normalized.systemMap) {
      normalized.systemMap = {
        windowTitle: "kara://system",
        layout: "hub",
        descriptionLead: "معماری سیستم و جریان داده",
        description: "یکپارچگی سرویس‌ها و ماژول‌های پردازشی",
        nodes: {
          inputTop: "دریافت ورودی",
          inputBottom: "پایگاه داده",
          core: "هسته پردازش",
          outputTop: "خروجی وب",
          outputBottom: "وب‌هوک و API",
        },
        logs: ["init", "sync", "ready"],
      };
    }

    // Normalize editor content
    if (!normalized.contentHtml) {
      if (typeof normalized.content === "string") {
        normalized.contentHtml = normalized.content;
      } else if (typeof normalized.body === "string") {
        normalized.contentHtml = normalized.body;
      } else if (typeof normalized.html === "string") {
        normalized.contentHtml = normalized.html;
      }
    }
    if (!normalized.contentJson) {
      if (
        normalized.tiptapBody &&
        typeof normalized.tiptapBody === "object" &&
        (normalized.tiptapBody as Record<string, unknown>).type === "doc"
      ) {
        normalized.contentJson = normalized.tiptapBody;
      } else if (
        normalized.content &&
        typeof normalized.content === "object" &&
        (normalized.content as Record<string, unknown>).type === "doc"
      ) {
        normalized.contentJson = normalized.content;
      }
    }

    const parseResult = projectCreateSchema.safeParse(normalized);
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
