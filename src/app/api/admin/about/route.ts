import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getAboutModel } from "@/lib/db/models/About";
import { aboutFormSchema } from "@/lib/validations/about";
import { normalizePersianText } from "@/lib/editor/normalizer";

export const GET = withAuth(
  async () => {
    await connectToDatabase();
    const About = await getAboutModel();

    let aboutDoc = await About.findOne().lean();
    if (!aboutDoc) {
      aboutDoc = await About.create({
        intro: {
          title: { fa: "نرم‌افزاری می‌سازیم که با کار واقعی سازمان هم‌خوان باشد", en: "" },
          lead: { fa: "کارا پرداز اوند سامانه‌های سفارشی، وب، CRM، ERP، RAG و داشبورد داده را با تمرکز بر نتیجهٔ عملیاتی طراحی و تحویل می‌دهد.", en: "" },
        },
        story: {
          title: { fa: "داستان کارا پرداز اوند", en: "" },
          tiptapBody: {
            fa: { html: "", json: null },
            en: { html: "", json: null },
          },
        },
        principles: [],
        brandNodes: [],
        team: [],
        culture: [],
      });
    }

    return NextResponse.json({ ok: true, about: aboutDoc });
  },
  { roles: ["admin", "editor"] },
);

export const PUT = withAuth(
  async (request: Request) => {
    await connectToDatabase();
    const About = await getAboutModel();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "داده ارسالی نامعتبر است." },
        { status: 400 },
      );
    }

    const parseResult = aboutFormSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "خطا در اعتبارسنجی اطلاعات درباره ما.",
          errors: parseResult.error.flatten(),
        },
        { status: 422 },
      );
    }

    const validData = parseResult.data;

    if (validData.story?.tiptapBody?.fa?.html) {
      validData.story.tiptapBody.fa.html = normalizePersianText(
        validData.story.tiptapBody.fa.html,
      );
    }

    let aboutDoc = await About.findOne();
    if (aboutDoc) {
      aboutDoc.intro = validData.intro;
      aboutDoc.story = validData.story as unknown as typeof aboutDoc.story;
      aboutDoc.principles = validData.principles;
      aboutDoc.brandNodes = validData.brandNodes;
      aboutDoc.team = validData.team;
      aboutDoc.culture = validData.culture;
      aboutDoc.updatedAt = new Date();
      await aboutDoc.save();
    } else {
      aboutDoc = await About.create(validData);
    }

    return NextResponse.json({
      ok: true,
      message: "اطلاعات صفحه درباره ما با موفقیت ذخیره شد.",
      about: aboutDoc,
    });
  },
  { roles: ["admin", "editor"] },
);

export const PATCH = PUT;
