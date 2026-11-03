import Link from "next/link";
import { routing } from "@/i18n/routing";

/**
 * Root not-found when no locale layout is available.
 * Locale-scoped 404 UI lives in `[locale]/not-found.tsx`.
 */
export default function RootNotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#F6F7FB",
          color: "#131A2E",
        }}
      >
        <p style={{ fontFamily: "ui-monospace, monospace", color: "#5A6482" }}>
          404
        </p>
        <h1 style={{ marginTop: "0.75rem", fontSize: "1.75rem" }}>
          صفحه پیدا نشد
        </h1>
        <p style={{ marginTop: "1rem", color: "#5A6482", maxWidth: "28rem" }}>
          آدرس معتبر نیست یا صفحه جابه‌جا شده است.
        </p>
        <Link
          href={`/${routing.defaultLocale}`}
          style={{
            marginTop: "2rem",
            display: "inline-flex",
            alignItems: "center",
            height: "2.75rem",
            paddingInline: "1.25rem",
            borderRadius: 12,
            background: "#3556E0",
            color: "#FFFFFF",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          بازگشت به خانه
        </Link>
      </body>
    </html>
  );
}
