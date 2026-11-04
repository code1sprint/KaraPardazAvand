import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guard";
import { signAuthToken } from "@/lib/auth/jwt";

export const GET = withAuth(
  async (_request, { user }) => {
    // Generate fresh Bearer JWT token for headless API calls / cURL
    const token = await signAuthToken({
      sub: user.sub,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      ok: true,
      token,
      expiresIn: "7d",
    });
  },
  { roles: ["admin", "editor"] },
);
