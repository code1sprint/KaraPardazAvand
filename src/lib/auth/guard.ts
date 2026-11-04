import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuthToken, AuthTokenPayload } from "./jwt";
import { AUTH_COOKIE_NAME } from "./session";
import { connectToDatabase, DatabaseError } from "@/lib/db/mongodb";
import { User, UserRole } from "@/lib/db/models/User";

export type AuthenticatedHandler<T = unknown> = (
  request: Request,
  context: { user: AuthTokenPayload; params?: T },
) => Promise<NextResponse> | NextResponse;

/**
 * Extracts and verifies token from Bearer header, API key (Payload-style), or HTTP-only cookie.
 */
export async function authenticateRequest(
  request: Request,
): Promise<AuthTokenPayload | null> {
  const authHeader = request.headers.get("authorization");
  const xApiKey = request.headers.get("x-api-key");

  // 1. Check for API key (via x-api-key header or Authorization: Api-Key / users API-Key)
  let extractedApiKey: string | null = null;
  if (xApiKey && xApiKey.trim().length > 0) {
    extractedApiKey = xApiKey.trim();
  } else if (authHeader) {
    if (authHeader.startsWith("Api-Key ")) {
      extractedApiKey = authHeader.substring(8).trim();
    } else if (authHeader.toLowerCase().startsWith("users api-key ")) {
      // Payload CMS standard API key format: "Authorization: users API-Key <key>"
      extractedApiKey = authHeader.substring(14).trim();
    }
  }

  if (extractedApiKey) {
    try {
      await connectToDatabase();
      const apiKeyUser = await User.findOne({
        apiKey: extractedApiKey,
        isActive: true,
      }).select("_id email name role");

      if (apiKeyUser) {
        return {
          sub: apiKeyUser._id.toString(),
          email: apiKeyUser.email,
          name: apiKeyUser.name,
          role: apiKeyUser.role,
        };
      }
    } catch (err) {
      console.error("[AUTH_API_KEY_ERROR]", err);
    }
  }

  // 2. Try Bearer header
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.substring(7).trim();
    if (bearerToken) {
      const user = await verifyAuthToken(bearerToken);
      if (user) return user;
    }
  }

  // 3. Try HTTP-only cookie via next/headers
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (cookieToken) {
      const user = await verifyAuthToken(cookieToken);
      if (user) return user;
    }
  } catch {
    // Ignore cookie store errors in unsupported contexts
  }

  // 4. Fallback: manual cookie header parsing from request
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const match = cookieHeader.match(
      new RegExp(`(?:^|;\\s*)${AUTH_COOKIE_NAME}=([^;]+)`),
    );
    if (match?.[1]) {
      const user = await verifyAuthToken(decodeURIComponent(match[1]));
      if (user) return user;
    }
  }

  return null;
}

/**
 * Wraps an API route handler with authentication and role checking.
 * Safely handles unauthenticated requests and database errors.
 */
export function withAuth<T = unknown>(
  handler: AuthenticatedHandler<T>,
  options?: { roles?: UserRole[] },
) {
  return async (
    request: Request,
    context?: { params?: Promise<T> | T },
  ): Promise<NextResponse> => {
    try {
      const user = await authenticateRequest(request);

      if (!user) {
        return NextResponse.json(
          {
            ok: false,
            code: "UNAUTHORIZED",
            message: "دسترسی غیرمجاز. لطفاً ابتدا وارد حساب کاربری خود شوید.",
          },
          { status: 401 },
        );
      }

      if (options?.roles && !options.roles.includes(user.role)) {
        return NextResponse.json(
          {
            ok: false,
            code: "FORBIDDEN",
            message: "شما مجوز دسترسی به این بخش را ندارید.",
          },
          { status: 403 },
        );
      }

      const resolvedParams = context?.params
        ? await Promise.resolve(context.params)
        : undefined;

      return await handler(request, { user, params: resolvedParams });
    } catch (error: unknown) {
      // Re-throw Next.js internal prerender interrupt errors
      if (
        typeof error === "object" &&
        error !== null &&
        "digest" in error &&
        (error as { digest?: string }).digest === "NEXT_PRERENDER_INTERRUPTED"
      ) {
        throw error;
      }

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

      console.error("[API_ERROR]", error);
      return NextResponse.json(
        {
          ok: false,
          code: "INTERNAL_ERROR",
          message: "خطای غیرمنتظره در سرور رخ داده است.",
        },
        { status: 500 },
      );
    }
  };
}
