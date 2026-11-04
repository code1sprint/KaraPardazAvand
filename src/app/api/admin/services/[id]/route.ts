import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getServiceModel } from "@/lib/db/models/Service";
import { serviceUpdateSchema } from "@/lib/validations/service";
import { normalizePersianText } from "@/lib/editor/normalizer";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = withAuth(
  async (_request: Request, context: unknown) => {
    const { id } = await (context as RouteContext).params;
    await connectToDatabase();
    const Service = await getServiceModel();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const service = await Service.findOne(
      isObjectId ? { _id: id } : { slug: id },
    ).lean();

    if (!service) {
      return NextResponse.json(
        { ok: false, message: "خدمت مورد نظر یافت نشد." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, service });
  },
  { roles: ["admin", "editor"] },
);

export const PUT = withAuth(
  async (request: Request, context: unknown) => {
    const { id } = await (context as RouteContext).params;
    await connectToDatabase();
    const Service = await getServiceModel();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const existing = await Service.findOne(
      isObjectId ? { _id: id } : { slug: id },
    );

    if (!existing) {
      return NextResponse.json(
        { ok: false, message: "خدمت مورد نظر یافت نشد." },
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

    if (!normalized.deepDiveHtml) {
      if (typeof normalized.deepDive === "string") {
        normalized.deepDiveHtml = normalized.deepDive;
      } else if (typeof normalized.contentHtml === "string") {
        normalized.deepDiveHtml = normalized.contentHtml;
      } else if (typeof normalized.content === "string") {
        normalized.deepDiveHtml = normalized.content;
      } else if (typeof normalized.body === "string") {
        normalized.deepDiveHtml = normalized.body;
      } else if (typeof normalized.html === "string") {
        normalized.deepDiveHtml = normalized.html;
      }
    }
    if (!normalized.deepDiveJson) {
      if (
        normalized.deepDive &&
        typeof normalized.deepDive === "object" &&
        (normalized.deepDive as Record<string, unknown>).type === "doc"
      ) {
        normalized.deepDiveJson = normalized.deepDive;
      } else if (
        normalized.contentJson &&
        typeof normalized.contentJson === "object" &&
        (normalized.contentJson as Record<string, unknown>).type === "doc"
      ) {
        normalized.deepDiveJson = normalized.contentJson;
      } else if (
        normalized.tiptapBody &&
        typeof normalized.tiptapBody === "object" &&
        (normalized.tiptapBody as Record<string, unknown>).type === "doc"
      ) {
        normalized.deepDiveJson = normalized.tiptapBody;
      }
    }

    const parseResult = serviceUpdateSchema.safeParse(normalized);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "خطا در اعتبارسنجی اطلاعات ویرایش خدمت.",
          errors: parseResult.error.flatten(),
        },
        { status: 422 },
      );
    }

    const validData = parseResult.data;

    // Check slug collision if slug changed
    if (validData.slug && validData.slug !== existing.slug) {
      const collision = await Service.findOne({
        slug: validData.slug,
        _id: { $ne: existing._id },
      });
      if (collision) {
        return NextResponse.json(
          {
            ok: false,
            message: `اسلاگ '${validData.slug}' قبلاً برای خدمت دیگری ثبت شده است.`,
          },
          { status: 409 },
        );
      }
    }

    let normalizedDeepDive = validData.deepDiveHtml;
    if (normalizedDeepDive) {
      normalizedDeepDive = normalizePersianText(normalizedDeepDive);
    }

    const updated = await Service.findByIdAndUpdate(
      existing._id,
      {
        $set: {
          ...validData,
          ...(normalizedDeepDive !== undefined ? { deepDiveHtml: normalizedDeepDive } : {}),
        },
      },
      { returnDocument: "after" },
    );

    return NextResponse.json({
      ok: true,
      message: "خدمت با موفقیت به‌روزرسانی شد.",
      service: updated,
    });
  },
  { roles: ["admin", "editor"] },
);

export const PATCH = PUT;

export const DELETE = withAuth(
  async (_request: Request, context: unknown) => {
    const { id } = await (context as RouteContext).params;
    await connectToDatabase();
    const Service = await getServiceModel();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const existing = await Service.findOne(
      isObjectId ? { _id: id } : { slug: id },
    );

    if (!existing) {
      return NextResponse.json(
        { ok: false, message: "خدمت مورد نظر یافت نشد." },
        { status: 404 },
      );
    }

    await Service.deleteOne({ _id: existing._id });

    return NextResponse.json({
      ok: true,
      message: "خدمت با موفقیت حذف شد.",
    });
  },
  { roles: ["admin"] },
);
