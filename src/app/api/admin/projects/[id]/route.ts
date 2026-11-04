import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getProjectModel } from "@/lib/db/models/Project";
import { projectUpdateSchema } from "@/lib/validations/project";
import { normalizePersianText } from "@/lib/editor/normalizer";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = withAuth(
  async (_request: Request, context: unknown) => {
    const { id } = await (context as RouteContext).params;
    await connectToDatabase();
    const Project = await getProjectModel();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const project = await Project.findOne(
      isObjectId ? { _id: id } : { slug: id },
    ).lean();

    if (!project) {
      return NextResponse.json(
        { ok: false, message: "پروژه مورد نظر یافت نشد." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, project });
  },
  { roles: ["admin", "editor"] },
);

export const PUT = withAuth(
  async (request: Request, context: unknown) => {
    const { id } = await (context as RouteContext).params;
    await connectToDatabase();
    const Project = await getProjectModel();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const existing = await Project.findOne(
      isObjectId ? { _id: id } : { slug: id },
    );

    if (!existing) {
      return NextResponse.json(
        { ok: false, message: "پروژه مورد نظر یافت نشد." },
        { status: 404 },
      );
    }

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

    const parseResult = projectUpdateSchema.safeParse(normalized);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "خطا در اعتبارسنجی اطلاعات ویرایش پروژه.",
          errors: parseResult.error.flatten(),
        },
        { status: 422 },
      );
    }

    const validData = parseResult.data;

    // Check slug collision if slug changed
    if (validData.slug && validData.slug !== existing.slug) {
      const collision = await Project.findOne({
        slug: validData.slug,
        _id: { $ne: existing._id },
      });
      if (collision) {
        return NextResponse.json(
          {
            ok: false,
            message: `اسلاگ '${validData.slug}' قبلاً برای پروژه دیگری ثبت شده است.`,
          },
          { status: 409 },
        );
      }
    }

    let normalizedHtml = validData.contentHtml;
    if (normalizedHtml) {
      normalizedHtml = normalizePersianText(normalizedHtml);
    }

    const updated = await Project.findByIdAndUpdate(
      existing._id,
      {
        $set: {
          ...validData,
          ...(normalizedHtml !== undefined ? { contentHtml: normalizedHtml } : {}),
        },
      },
      { returnDocument: "after" },
    );

    return NextResponse.json({
      ok: true,
      message: "پروژه با موفقیت به‌روزرسانی شد.",
      project: updated,
    });
  },
  { roles: ["admin", "editor"] },
);

export const PATCH = PUT;

export const DELETE = withAuth(
  async (_request: Request, context: unknown) => {
    const { id } = await (context as RouteContext).params;
    await connectToDatabase();
    const Project = await getProjectModel();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const existing = await Project.findOne(
      isObjectId ? { _id: id } : { slug: id },
    );

    if (!existing) {
      return NextResponse.json(
        { ok: false, message: "پروژه مورد نظر یافت نشد." },
        { status: 404 },
      );
    }

    await Project.deleteOne({ _id: existing._id });

    return NextResponse.json({
      ok: true,
      message: "پروژه با موفقیت حذف شد.",
    });
  },
  { roles: ["admin"] },
);
