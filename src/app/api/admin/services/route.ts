import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getServiceModel } from "@/lib/db/models/Service";
import { serviceCreateSchema } from "@/lib/validations/service";
import { normalizePersianText } from "@/lib/editor/normalizer";

export const GET = withAuth(
  async (request: Request) => {
    await connectToDatabase();
    const Service = await getServiceModel();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const query = searchParams.get("q");

    const filter: Record<string, unknown> = {};
    if (status && (status === "published" || status === "draft")) {
      filter.status = status;
    }
    if (query) {
      filter.$or = [
        { "title.fa": { $regex: query, $options: "i" } },
        { "title.en": { $regex: query, $options: "i" } },
        { "outcome.fa": { $regex: query, $options: "i" } },
        { slug: { $regex: query, $options: "i" } },
      ];
    }

    const services = await Service.find(filter)
      .select("-deepDiveJson")
      .sort({ "bento.order": 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, services });
  },
  { roles: ["admin", "editor"] },
);

export const POST = withAuth(
  async (request: Request) => {
    await connectToDatabase();
    const Service = await getServiceModel();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "داده ارسالی نامعتبر است." },
        { status: 400 },
      );
    }

    const parseResult = serviceCreateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "خطا در اعتبارسنجی فیلدهای خدمت.",
          errors: parseResult.error.flatten(),
        },
        { status: 422 },
      );
    }

    const validData = parseResult.data;

    // Check slug collision
    const existing = await Service.findOne({ slug: validData.slug });
    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          message: `اسلاگ '${validData.slug}' قبلاً برای خدمت دیگری ثبت شده است.`,
        },
        { status: 409 },
      );
    }

    // Persian normalization for deep-dive HTML
    let normalizedDeepDive = validData.deepDiveHtml || "";
    if (normalizedDeepDive) {
      normalizedDeepDive = normalizePersianText(normalizedDeepDive);
    }

    const serviceDoc = await Service.create({
      ...validData,
      deepDiveHtml: normalizedDeepDive,
    });

    return NextResponse.json(
      {
        ok: true,
        message: "خدمت جدید با موفقیت ایجاد شد.",
        service: serviceDoc,
      },
      { status: 201 },
    );
  },
  { roles: ["admin", "editor"] },
);
