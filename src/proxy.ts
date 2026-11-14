import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

/**
 * Admin UI is Persian-only (hardcoded FA copy). Visiting /en/admin kept FA text
 * but flipped html[dir] to ltr via the locale layout — redirect to /fa/admin.
 */
function redirectEnAdminToFa(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  if (pathname !== "/en/admin" && !pathname.startsWith("/en/admin/")) {
    return null;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/fa${pathname.slice(3)}`;
  return NextResponse.redirect(url);
}

export default function proxy(request: NextRequest) {
  const adminRedirect = redirectEnAdminToFa(request);
  if (adminRedirect) {
    return adminRedirect;
  }

  return handleI18nRouting(request);
}

export const config = {
  // Skip API, uploads (runtime media), Next internals, static files, and Metadata routes.
  matcher: "/((?!api|trpc|_next|_vercel|uploads|sitemap\\.xml|robots\\.txt|.*\\..*).*)",
};
