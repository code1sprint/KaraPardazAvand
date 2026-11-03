import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.json({
    ok: true,
    message: "با موفقیت از حساب کاربری خارج شدید.",
  });

  clearAuthCookie(response);
  return response;
}
