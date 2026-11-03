import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuthToken, AuthTokenPayload } from "./jwt";

export const AUTH_COOKIE_NAME = "kara_auth_token";
export const COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    name: AUTH_COOKIE_NAME,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  };
}

/**
 * Attaches the auth token as an HTTP-only cookie onto a NextResponse.
 */
export function setAuthCookie(response: NextResponse, token: string): void {
  const options = getCookieOptions();
  response.cookies.set({
    ...options,
    value: token,
  });
}

/**
 * Clears the auth cookie from a NextResponse.
 */
export function clearAuthCookie(response: NextResponse): void {
  const options = getCookieOptions();
  response.cookies.set({
    ...options,
    value: "",
    maxAge: 0,
    expires: new Date(0),
  });
}

/**
 * Extracts and verifies the current session user in Server Components,
 * Server Actions, or Route Handlers via next/headers cookies.
 */
export async function getCurrentUser(): Promise<AuthTokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}
