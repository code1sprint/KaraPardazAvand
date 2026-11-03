import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";

export const GET = withAuth(async (_request, { user }) => {
  try {
    await connectToDatabase();
    const dbUser = await User.findById(user.sub).select("-password");

    if (!dbUser || !dbUser.isActive) {
      return NextResponse.json(
        {
          ok: false,
          code: "USER_NOT_FOUND",
          message: "کاربر یافت نشد یا حساب غیرفعال شده است.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        lastLoginAt: dbUser.lastLoginAt,
        createdAt: dbUser.createdAt,
      },
    });
  } catch {
    // If DB check fails, fallback to verified token payload to be resilient
    return NextResponse.json({
      ok: true,
      user: {
        id: user.sub,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
});
