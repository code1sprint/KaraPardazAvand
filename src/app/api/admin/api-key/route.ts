import { NextResponse } from "next/server";
import crypto from "crypto";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";

export const GET = withAuth(
  async (_request, { user }) => {
    await connectToDatabase();
    const dbUser = await User.findById(user.sub).select("+apiKey apiKeyCreatedAt");
    if (!dbUser) {
      return NextResponse.json(
        { ok: false, message: "کاربر یافت نشد." },
        { status: 404 },
      );
    }

    const hasKey = Boolean(dbUser.apiKey);
    let maskedKey: string | null = null;
    if (dbUser.apiKey) {
      const len = dbUser.apiKey.length;
      maskedKey = `${dbUser.apiKey.substring(0, 10)}...${dbUser.apiKey.substring(len - 4)}`;
    }

    return NextResponse.json({
      ok: true,
      hasKey,
      maskedKey,
      apiKeyCreatedAt: dbUser.apiKeyCreatedAt || null,
    });
  },
  { roles: ["admin", "editor"] },
);

export const POST = withAuth(
  async (_request, { user }) => {
    await connectToDatabase();
    const dbUser = await User.findById(user.sub);
    if (!dbUser) {
      return NextResponse.json(
        { ok: false, message: "کاربر یافت نشد." },
        { status: 404 },
      );
    }

    // Generate Payload-style API key: kp_live_<hex>
    const randomHex = crypto.randomBytes(24).toString("hex");
    const newApiKey = `kp_live_${randomHex}`;

    dbUser.apiKey = newApiKey;
    dbUser.apiKeyCreatedAt = new Date();
    await dbUser.save();

    return NextResponse.json({
      ok: true,
      apiKey: newApiKey,
      message: "کلید API جدید با موفقیت تولید شد.",
    });
  },
  { roles: ["admin", "editor"] },
);

export const DELETE = withAuth(
  async (_request, { user }) => {
    await connectToDatabase();
    await User.findByIdAndUpdate(user.sub, {
      $unset: { apiKey: 1, apiKeyCreatedAt: 1 },
    });

    return NextResponse.json({
      ok: true,
      message: "کلید API با موفقیت ابطال شد.",
    });
  },
  { roles: ["admin", "editor"] },
);
