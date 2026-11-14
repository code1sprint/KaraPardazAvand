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

    // Core docs may exist only as MDX on the site — create Mongo copies if missing.
    if (slug === "privacy" || slug === "terms") {
      const { ensureCoreLegalDocs } = await import("@/lib/legal-ensure");
      await ensureCoreLegalDocs(LegalDoc);
    }

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

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "داده ارسالی نامعتبر است." },
        { status: 400 },
      );
    }

    const existing = await LegalDoc.findOne({ slug });

    const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
    const normalized: Record<string, unknown> = {
      slug,
      title: existing?.title || { fa: slug, en: "" },
      summary: existing?.summary || { fa: "", en: "" },
      status: existing?.status || "published",
      tiptapBody: existing?.tiptapBody || {
        fa: { html: "", json: null },
        en: { html: "", json: null },
      },
      seo: existing?.seo || {
        title: { fa: "", en: "" },
        description: { fa: "", en: "" },
      },
      updatedIso:
        existing?.updatedIso || new Date().toISOString().slice(0, 10),
      ...raw,
    };

    // URL slug wins so PATCH /privacy always targets privacy
    normalized.slug = slug;

    if (typeof raw.title === "string") {
      normalized.title = {
        fa: raw.title,
        en: existing?.title?.en || "",
      };
    }
    if (typeof raw.summary === "string") {
      normalized.summary = {
        fa: raw.summary,
        en: existing?.summary?.en || "",
      };
    }

    // Normalize tiptapBody
    if (
      raw.tiptapBody &&
      typeof raw.tiptapBody === "object" &&
      (raw.tiptapBody as Record<string, unknown>).type === "doc"
    ) {
      normalized.tiptapBody = {
        fa: {
          html: existing?.tiptapBody?.fa?.html || "",
          json: raw.tiptapBody,
        },
        en: existing?.tiptapBody?.en || { html: "", json: null },
      };
    } else if (typeof raw.tiptapBody === "string") {
      normalized.tiptapBody = {
        fa: {
          html: raw.tiptapBody,
          json: existing?.tiptapBody?.fa?.json || null,
        },
        en: existing?.tiptapBody?.en || { html: "", json: null },
      };
    } else if (
      typeof raw.contentHtml === "string" ||
      typeof raw.content === "string" ||
      typeof raw.html === "string"
    ) {
      const htmlVal = (raw.contentHtml || raw.content || raw.html) as string;
      normalized.tiptapBody = {
        fa: {
          html: htmlVal,
          json: existing?.tiptapBody?.fa?.json || null,
        },
        en: existing?.tiptapBody?.en || { html: "", json: null },
      };
    }

    const parseResult = legalDocSchema.safeParse(normalized);
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

    if (existing) {
      existing.slug = validData.slug;
      existing.title = validData.title;
      existing.summary = validData.summary;
      existing.updatedIso = validData.updatedIso;
      existing.tiptapBody =
        validData.tiptapBody as unknown as typeof existing.tiptapBody;
      if (validData.seo) {
        existing.seo = validData.seo as unknown as typeof existing.seo;
      }
      existing.status = validData.status;
      existing.updatedAt = new Date();
      await existing.save();

      return NextResponse.json({
        ok: true,
        message: "سند حقوقی با موفقیت به‌روزرسانی شد.",
        doc: existing,
      });
    }

    const created = await LegalDoc.create({
      ...validData,
      slug,
    });

    return NextResponse.json(
      {
        ok: true,
        message: "سند حقوقی با موفقیت ایجاد و ذخیره شد.",
        doc: created,
      },
      { status: 201 },
    );
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
