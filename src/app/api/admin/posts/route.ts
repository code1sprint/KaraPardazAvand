import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getPostModel } from "@/lib/db/models/Post";
import { postInputSchema } from "@/lib/validations/post";
import { processPostContent } from "@/lib/editor/normalizer";

export const GET = withAuth(
  async (request: Request) => {
    await connectToDatabase();
    const Post = await getPostModel();

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale");
    const status = searchParams.get("status");
    const query = searchParams.get("q");

    const filter: Record<string, unknown> = {};
    if (locale && (locale === "fa" || locale === "en")) {
      filter.locale = locale;
    }
    if (status && (status === "published" || status === "draft")) {
      filter.status = status;
    }
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { summary: { $regex: query, $options: "i" } },
        { slug: { $regex: query, $options: "i" } },
      ];
    }

    const posts = await Post.find(filter)
      .select("-contentJson -contentHtml")
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, posts });
  },
  { roles: ["admin", "editor"] },
);

export const POST = withAuth(
  async (request: Request) => {
    await connectToDatabase();
    const Post = await getPostModel();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "داده ارسالی نامعتبر است." },
        { status: 400 },
      );
    }

    const parseResult = postInputSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "خطا در اعتبارسنجی فیلدهای مقاله.",
          errors: parseResult.error.flatten(),
        },
        { status: 422 },
      );
    }

    const validData = parseResult.data;

    // Check slug collision for the same locale
    const existing = await Post.findOne({
      slug: validData.slug,
      locale: validData.locale,
    });
    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          message: `اسلاگ '${validData.slug}' برای زبان ${validData.locale} قبلاً ثبت شده است.`,
        },
        { status: 409 },
      );
    }

    // Process content (TOC extraction, heading IDs, Persian character & digit normalization)
    const processed = processPostContent(validData.contentHtml, validData.locale);

    const postDoc = await Post.create({
      ...validData,
      readingTime: processed.readingTime,
      toc: processed.toc,
      contentHtml: processed.contentHtml,
    });

    return NextResponse.json(
      {
        ok: true,
        message: "مقاله با موفقیت ایجاد شد.",
        post: postDoc,
      },
      { status: 201 },
    );
  },
  { roles: ["admin", "editor"] },
);
