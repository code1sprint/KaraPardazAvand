import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getPostModel } from "@/lib/db/models/Post";
import { postUpdateSchema } from "@/lib/validations/post";
import { processPostContent } from "@/lib/editor/normalizer";

type RouteParams = { id: string };

export const GET = withAuth<RouteParams>(
  async (_request: Request, { params }) => {
    if (!params?.id) {
      return NextResponse.json({ ok: false, message: "شناسه نامعتبر است." }, { status: 400 });
    }

    await connectToDatabase();
    const Post = await getPostModel();

    const post = await Post.findById(params.id).lean();
    if (!post) {
      return NextResponse.json({ ok: false, message: "مقاله یافت نشد." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, post });
  },
  { roles: ["admin", "editor"] },
);

export const PUT = withAuth<RouteParams>(
  async (request: Request, { params }) => {
    if (!params?.id) {
      return NextResponse.json({ ok: false, message: "شناسه نامعتبر است." }, { status: 400 });
    }

    await connectToDatabase();
    const Post = await getPostModel();

    const existingPost = await Post.findById(params.id);
    if (!existingPost) {
      return NextResponse.json({ ok: false, message: "مقاله یافت نشد." }, { status: 404 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ ok: false, message: "داده نامعتبر است." }, { status: 400 });
    }

    const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
    const normalized: Record<string, unknown> = { ...raw };

    if (!normalized.summary && typeof normalized.excerpt === "string") {
      normalized.summary = normalized.excerpt;
    }

    // Normalize editor content
    if (!normalized.contentHtml) {
      if (typeof normalized.content === "string") {
        normalized.contentHtml = normalized.content;
      } else if (typeof normalized.body === "string") {
        normalized.contentHtml = normalized.body;
      } else if (typeof normalized.html === "string") {
        normalized.contentHtml = normalized.html;
      } else if (
        normalized.tiptapBody &&
        typeof normalized.tiptapBody === "object" &&
        (normalized.tiptapBody as Record<string, unknown>).html
      ) {
        normalized.contentHtml = (normalized.tiptapBody as Record<string, unknown>).html;
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

    const parseResult = postUpdateSchema.safeParse(normalized);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "خطا در اعتبارسنجی فیلدها.",
          errors: parseResult.error.flatten(),
        },
        { status: 422 },
      );
    }

    const validData = parseResult.data;

    // Check slug collision with other posts of the same locale
    const targetSlug = validData.slug || existingPost.slug;
    const targetLocale = validData.locale || existingPost.locale;
    const collision = await Post.findOne({
      slug: targetSlug,
      locale: targetLocale,
      _id: { $ne: params.id },
    });
    if (collision) {
      return NextResponse.json(
        {
          ok: false,
          message: `اسلاگ '${targetSlug}' برای زبان ${targetLocale} توسط مقاله دیگری استفاده شده است.`,
        },
        { status: 409 },
      );
    }

    const updateFields: Record<string, unknown> = { ...validData };

    if (typeof validData.contentHtml === "string") {
      const processed = processPostContent(validData.contentHtml, targetLocale);
      updateFields.readingTime = processed.readingTime;
      updateFields.toc = processed.toc;
      updateFields.contentHtml = processed.contentHtml;
    }

    const updated = await Post.findByIdAndUpdate(
      params.id,
      { $set: updateFields },
      { returnDocument: "after" },
    );

    return NextResponse.json({
      ok: true,
      message: "مقاله با موفقیت به‌روزرسانی شد.",
      post: updated,
    });
  },
  { roles: ["admin", "editor"] },
);

export const PATCH = PUT;

export const DELETE = withAuth<RouteParams>(
  async (_request: Request, { params }) => {
    if (!params?.id) {
      return NextResponse.json({ ok: false, message: "شناسه نامعتبر است." }, { status: 400 });
    }

    await connectToDatabase();
    const Post = await getPostModel();

    const deleted = await Post.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ ok: false, message: "مقاله یافت نشد." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      message: "مقاله با موفقیت حذف شد.",
    });
  },
  { roles: ["admin"] },
);
