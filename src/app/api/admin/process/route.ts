import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getProcessModel } from "@/lib/db/models/Process";
import { processFormSchema } from "@/lib/validations/process";
import { normalizePersianText } from "@/lib/editor/normalizer";

export const GET = withAuth(
  async () => {
    await connectToDatabase();
    const Process = await getProcessModel();

    let processDoc = await Process.findOne().lean();
    if (!processDoc) {
      processDoc = await Process.create({
        hero: {
          titleBefore: { fa: "فرایند همکاری؛ از تحلیل نیاز تا ", en: "" },
          titleGradient: { fa: "تحویل پایدار", en: "" },
          titleAfter: { fa: " نرم‌افزار", en: "" },
          lead: { fa: "مسیر شفاف مهندسی با خروجی‌های ملموس.", en: "" },
        },
        steps: [],
        engagementModels: [],
        communicationRows: [],
        guide: {
          title: { fa: "راهنمای شفاف تعامل و استانداردهای تحویل نرم‌افزار", en: "" },
          tiptapBody: {
            fa: { html: "", json: null },
            en: { html: "", json: null },
          },
        },
      });
    }

    return NextResponse.json({ ok: true, process: processDoc });
  },
  { roles: ["admin", "editor"] },
);

export const PUT = withAuth(
  async (request: Request) => {
    await connectToDatabase();
    const Process = await getProcessModel();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "داده ارسالی نامعتبر است." },
        { status: 400 },
      );
    }

    const parseResult = processFormSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "خطا در اعتبارسنجی اطلاعات فرایند همکاری.",
          errors: parseResult.error.flatten(),
        },
        { status: 422 },
      );
    }

    const validData = parseResult.data;

    if (validData.guide?.tiptapBody?.fa?.html) {
      validData.guide.tiptapBody.fa.html = normalizePersianText(
        validData.guide.tiptapBody.fa.html,
      );
    }

    let processDoc = await Process.findOne();
    if (processDoc) {
      processDoc.hero = validData.hero;
      processDoc.steps = validData.steps as unknown as typeof processDoc.steps;
      processDoc.engagementModels = validData.engagementModels;
      processDoc.communicationRows = validData.communicationRows;
      processDoc.guide = validData.guide as unknown as typeof processDoc.guide;
      processDoc.updatedAt = new Date();
      await processDoc.save();
    } else {
      processDoc = await Process.create(validData);
    }

    return NextResponse.json({
      ok: true,
      message: "اطلاعات صفحه فرایند همکاری با موفقیت ذخیره شد.",
      process: processDoc,
    });
  },
  { roles: ["admin", "editor"] },
);
