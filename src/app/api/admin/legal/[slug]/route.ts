import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getLegalDocModel } from "@/lib/db/models/LegalDoc";
import { legalDocSchema } from "@/lib/validations/legal";
import { normalizePersianText } from "@/lib/editor/normalizer";

type RouteParams = { params: Promise<{ slug: string }> };

export const GET = withAuth(
  async (_req: Request, context: unknown) => {
    await connectToDatabase();
    const LegalDoc = await getLegalDocModel();
    const { slug } = await (context as RouteParams).params;

    const doc = await LegalDoc.findOne({ slug }).lean();
    if (!doc) {
      return NextResponse.json(
        { ok: false, message: `سند حقوقی با اسلاگ '${slug}' یافت نشد.` },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, doc });
  },
  { roles: ["admin", "editor"] },
);

export const PUT = withAuth(
  async (request: Request, context: unknown) => {
    await connectToDatabase();
    const LegalDoc = await getLegalDocModel();
    const { slug } = await (context as RouteParams).params;

    const doc = await LegalDoc.findOne({ slug });
    if (!doc) {
      return NextResponse.json(
        { ok: false, message: `سند حقوقی با اسلاگ '${slug}' یافت نشد.` },
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

    const parseResult = legalDocSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "خطا در اعتبارسنجی سند حقوقی.",
          errors: parseResult.error.flatten(),
        },
        { status: 422 },
      );
    }

    const validData = parseResult.data;

    // Check slug collision if changing
    if (validData.slug !== slug) {
      const collision = await LegalDoc.findOne({ slug: validData.slug });
      if (collision) {
        return NextResponse.json(
          {
            ok: false,
            message: `اسلاگ '${validData.slug}' قبلاً برای سند دیگری ثبت شده است.`,
          },
          { status: 409 },
        );
      }
    }

    if (validData.tiptapBody?.fa?.html) {
      validData.tiptapBody.fa.html = normalizePersianText(
        validData.tiptapBody.fa.html,
      );
    }

    doc.slug = validData.slug;
    doc.title = validData.title;
    doc.summary = validData.summary;
    doc.updatedIso = validData.updatedIso;
    doc.tiptapBody = validData.tiptapBody as unknown as typeof doc.tiptapBody;
    doc.status = validData.status;
    doc.updatedAt = new Date();
    await doc.save();

    return NextResponse.json({
      ok: true,
      message: "سند حقوقی با موفقیت به‌روزرسانی شد.",
      doc,
    });
  },
  { roles: ["admin", "editor"] },
);

export const PATCH = PUT;

export const DELETE = withAuth(
  async (_req: Request, context: unknown) => {
    await connectToDatabase();
    const LegalDoc = await getLegalDocModel();
    const { slug } = await (context as RouteParams).params;

    if (slug === "terms" || slug === "privacy") {
      return NextResponse.json(
        {
          ok: false,
          message: "اسناد اصلی سیستم (terms و privacy) قابل حذف نیستند.",
        },
        { status: 403 },
      );
    }

    const deleted = await LegalDoc.findOneAndDelete({ slug });
    if (!deleted) {
      return NextResponse.json(
        { ok: false, message: `سند حقوقی با اسلاگ '${slug}' یافت نشد.` },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "سند حقوقی با موفقیت حذف شد.",
    });
  },
  { roles: ["admin"] },
);
