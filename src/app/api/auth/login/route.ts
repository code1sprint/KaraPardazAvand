import { NextResponse } from "next/server";
import { connectToDatabase, DatabaseError } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";
import { loginSchema } from "@/lib/auth/schema";
import { signAuthToken } from "@/lib/auth/jwt";
import { setAuthCookie } from "@/lib/auth/session";
import { takeRateLimit } from "@/lib/rate-limit";

const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 5;

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  // 1. Rate limiting against brute-force
  const ip = clientKey(request);
  const limited = takeRateLimit(`login:${ip}`, MAX_LOGIN_ATTEMPTS, LOGIN_WINDOW_MS);

  if (!limited.ok) {
    const retryAfterSec = Math.ceil(limited.retryAfterMs / 1000);
    return NextResponse.json(
      {
        ok: false,
        code: "RATE_LIMITED",
        message: `تعداد تلاش‌های ناموفق بیش از حد مجاز است. لطفاً ${Math.ceil(retryAfterSec / 60)} دقیقه دیگر مجدداً تلاش کنید.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSec) },
      },
    );
  }

  // 2. Body parsing & schema validation
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "INVALID_JSON",
        message: "فرمت داده‌های ارسالی نامعتبر است.",
      },
      { status: 400 },
    );
  }

  const parsed = loginSchema.safeParse(body);
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

  const { email, password } = parsed.data;

  // 3. Database connection & user verification
  try {
    await connectToDatabase();

    const user = await User.findOne({ email }).select("+password");

    // Generic error message to prevent user enumeration attacks
    const invalidCredentialsResponse = () =>
      NextResponse.json(
        {
          ok: false,
          code: "INVALID_CREDENTIALS",
          message: "ایمیل یا کلمه عبور وارد شده نادرست است.",
        },
        { status: 401 },
      );

    if (!user) {
      return invalidCredentialsResponse();
    }

    if (!user.isActive) {
      return NextResponse.json(
        {
          ok: false,
          code: "ACCOUNT_DISABLED",
          message: "حساب کاربری شما غیرفعال شده است. با پشتیبانی تماس بگیرید.",
        },
        { status: 403 },
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return invalidCredentialsResponse();
    }

    // 4. Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // 5. Generate secure JWT token
    const token = await signAuthToken({
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const userPayload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const response = NextResponse.json({
      ok: true,
      message: "ورود با موفقیت انجام شد.",
      user: userPayload,
      token,
    });

    // 6. Set HTTP-only secure cookie
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    if (error instanceof DatabaseError) {
      return NextResponse.json(
        {
          ok: false,
          code: error.code,
          message: error.message,
        },
        { status: error.statusCode },
      );
    }

    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json(
      {
        ok: false,
        code: "INTERNAL_ERROR",
        message: "خطایی در پردازش ورود رخ داد. لطفاً لحظاتی دیگر تلاش کنید.",
      },
      { status: 500 },
    );
  }
}
