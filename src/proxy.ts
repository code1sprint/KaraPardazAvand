import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API, uploads (runtime media), Next internals, static files, and Metadata routes.
  matcher: "/((?!api|trpc|_next|_vercel|uploads|sitemap\\.xml|robots\\.txt|.*\\..*).*)",
};
