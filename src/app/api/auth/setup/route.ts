import { NextResponse } from "next/server";
import { connectToDatabase, DatabaseError } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";
import { setupAdminSchema } from "@/lib/auth/schema";
import { signAuthToken } from "@/lib/auth/jwt";
import { setAuthCookie } from "@/lib/auth/session";

/**
 * Checks whether an initial admin user already exists.
 */
export async function GET() {
  try {
    await connectToDatabase();
    const count = await User.countDocuments();
    return NextResponse.json({
      ok: true,
      initialized: count > 0,
      totalUsers: count,
    });
  } catch (error) {
    if (error instanceof DatabaseError) {
      return NextResponse.json(
        { ok: false, code: error.code, message: error.message },
        { status: error.statusCode },
      );
    }
    return NextResponse.json(
      { ok: false, message: "خطا در بررسی وضعیت راه‌اندازی" },
      { status: 500 },
    );
  }
}

/**
 * One-time setup endpoint: Creates the initial super admin.
 * Permanently locked once the first user is created.
 */
export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const existingCount = await User.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json(
        {
          ok: false,
          code: "ALREADY_INITIALIZED",
          message:
            "سیستم قبلاً راه‌اندازی شده است. ایجاد کاربر جدید از این مسیر مسدود است.",
        },
        { status: 403 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "فرمت بدنه درخواست نامعتبر است" },
        { status: 400 },
      );
    }

    const parsed = setupAdminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          code: "VALIDATION_ERROR",
          message: parsed.error.issues[0]?.message || "داده‌های ورودی نامعتبر است",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;

    const newAdmin = await User.create({
      name,
      email,
      password,
      role: "admin",
      isActive: true,
    });

    const token = await signAuthToken({
      sub: newAdmin._id.toString(),
      email: newAdmin.email,
      name: newAdmin.name,
      role: newAdmin.role,
    });

    const response = NextResponse.json({
      ok: true,
      message: "حساب مدیر ارشد با موفقیت ایجاد شد.",
      user: {
        id: newAdmin._id.toString(),
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
      token,
    });

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    if (error instanceof DatabaseError) {
      return NextResponse.json(
        { ok: false, code: error.code, message: error.message },
        { status: error.statusCode },
      );
    }

    console.error("[SETUP_ERROR]", error);
    return NextResponse.json(
      { ok: false, message: "خطا در ایجاد کاربر مدیر اولیه" },
      { status: 500 },
    );
  }
}
