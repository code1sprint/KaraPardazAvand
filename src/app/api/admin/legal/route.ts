import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getLegalDocModel } from "@/lib/db/models/LegalDoc";
import { legalDocSchema } from "@/lib/validations/legal";
import { normalizePersianText } from "@/lib/editor/normalizer";

export const GET = withAuth(
  async () => {
    await connectToDatabase();
    const LegalDoc = await getLegalDocModel();

    const docs = await LegalDoc.find()
      .select("-tiptapBody.fa.json -tiptapBody.en.json")
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, docs });
  },
  { roles: ["admin", "editor"] },
);

export const POST = withAuth(
  async (request: Request) => {
    await connectToDatabase();
    const LegalDoc = await getLegalDocModel();

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

    // Check slug collision
    const existing = await LegalDoc.findOne({ slug: validData.slug });
    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          message: `اسلاگ '${validData.slug}' قبلاً ثبت شده است.`,
        },
        { status: 409 },
      );
    }

    if (validData.tiptapBody?.fa?.html) {
      validData.tiptapBody.fa.html = normalizePersianText(
        validData.tiptapBody.fa.html,
      );
    }

    const doc = await LegalDoc.create(validData);

    return NextResponse.json(
      {
        ok: true,
        message: "سند حقوقی جدید با موفقیت ایجاد شد.",
        doc,
      },
      { status: 201 },
    );
  },
  { roles: ["admin", "editor"] },
);
