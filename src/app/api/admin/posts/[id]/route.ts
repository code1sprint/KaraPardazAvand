import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getPostModel } from "@/lib/db/models/Post";
import { postInputSchema } from "@/lib/validations/post";
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

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ ok: false, message: "داده نامعتبر است." }, { status: 400 });
    }

    const parseResult = postInputSchema.safeParse(body);
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
    const existing = await Post.findOne({
      slug: validData.slug,
      locale: validData.locale,
      _id: { $ne: params.id },
    });
    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          message: `اسلاگ '${validData.slug}' برای زبان ${validData.locale} توسط مقاله دیگری استفاده شده است.`,
        },
        { status: 409 },
      );
    }

    const processed = processPostContent(validData.contentHtml, validData.locale);

    const updated = await Post.findByIdAndUpdate(
      params.id,
      {
        $set: {
          ...validData,
          readingTime: processed.readingTime,
          toc: processed.toc,
          contentHtml: processed.contentHtml,
        },
      },
      { returnDocument: "after" },
    );

    if (!updated) {
      return NextResponse.json({ ok: false, message: "مقاله یافت نشد." }, { status: 404 });
    }

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
