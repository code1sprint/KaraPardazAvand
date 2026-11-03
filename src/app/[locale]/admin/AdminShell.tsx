"use client";

import { useState, useEffect, type ReactNode } from "react";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth/context";
import { cn } from "@/lib/cn";

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    latencyMs?: number;
  }>({
    connected: false,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  // Check database health periodically
  useEffect(() => {
    let mounted = true;
    const checkDb = async () => {
      try {
        const res = await fetch("/api/health/db", { cache: "no-store" });
        const data = await res.json();
        if (mounted) {
          setDbStatus({
            connected: data.ok === true,
            latencyMs: data.latencyMs,
          });
        }
      } catch {
        if (mounted) {
          setDbStatus({ connected: false });
        }
      }
    };

    checkDb();
    const interval = setInterval(checkDb, 30000); // Check every 30s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Protect non-login admin pages
  useEffect(() => {
    if (!isLoading && !user && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [user, isLoading, isLoginPage, router]);

  // If on login page, just render children cleanly inside admin-root container
  if (isLoginPage) {
    return <div className="admin-root min-h-screen bg-bg">{children}</div>;
  }

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue border-t-transparent" />
          <p className="text-sm font-medium text-muted">
            در حال اعتبارسنجی نشست مدیر...
          </p>
        </div>
      </div>
    );
  }

  // If unauthenticated, redirecting
  if (!user) {
    return null;
  }

  const navItems = [
    {
      href: "/admin",
      label: "پیشخوان وضعیت",
      badge: null,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      href: "/admin/inquiries",
      label: "پیام‌های تماس و درخواست‌ها",
      badge: "جدید",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      href: "/admin/posts",
      label: "مدیریت مقالات و محتوا",
      badge: null,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      ),
    },
    {
      href: "/admin/database",
      label: "سلامت و آمار پایگاه داده",
      badge: dbStatus.connected ? "آنلاین" : "قطع",
      badgeOk: dbStatus.connected,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="admin-root flex min-h-screen bg-bg">
      {/* Sidebar for Desktop */}
      <aside className="hidden w-72 shrink-0 border-e border-line bg-panel lg:flex lg:flex-col">
        {/* Brand header */}
        <div className="flex h-20 items-center justify-between border-b border-line px-6">
          <Link href="/admin" className="flex items-center gap-3 no-underline">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white p-2 shadow-xs">
              <Image
                src="/brand/logo.svg"
                alt="کارا پرداز اوند"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
            </div>
            <div>
              <span className="block text-sm font-black text-text">
                پیشخوان کارا پرداز
              </span>
              <span className="block text-[11px] text-muted">
                مدیریت سامانه سازمانی
              </span>
            </div>
          </Link>
          <span className="rounded-full bg-navy/10 px-2 py-0.5 text-[10px] font-bold text-navy">
            v3.0
          </span>
        </div>

        {/* Database Quick Health */}
        <div className="px-6 py-4">
          <div
            className={cn(
              "flex items-center justify-between rounded-xl border px-3 py-2 text-xs",
              dbStatus.connected
                ? "border-ok/30 bg-ok/5 text-ok"
                : "border-red-500/30 bg-red-500/5 text-red-600",
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  dbStatus.connected ? "animate-pulse bg-ok" : "bg-red-500",
                )}
              />
              <span className="font-bold">
                {dbStatus.connected ? "MongoDB متصل" : "MongoDB قطع"}
              </span>
            </div>
            {dbStatus.latencyMs !== undefined && dbStatus.connected && (
              <span className="font-mono text-[11px] text-muted">
                {dbStatus.latencyMs}ms
              </span>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all",
                  isActive
                    ? "bg-navy text-white shadow-sm"
                    : "text-muted hover:bg-bg hover:text-text",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-white" : "text-muted"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px]",
                      item.badgeOk
                        ? "bg-ok/20 text-ok"
                        : "bg-orange/20 text-orange",
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Profile & Actions */}
        <div className="border-t border-line p-4">
          <div className="mb-3 flex items-center justify-between rounded-2xl bg-bg p-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-xs font-black text-blue">
                {user.name.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-xs font-bold text-text">
                  {user.name}
                </span>
                <span className="block truncate text-[11px] text-muted">
                  {user.email}
                </span>
              </div>
            </div>
            <span className="shrink-0 rounded-md bg-blue/15 px-1.5 py-0.5 text-[10px] font-bold text-blue">
              {user.role === "admin" ? "مدیر" : "نویسنده"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 rounded-xl border border-line py-2 text-center text-xs font-bold text-muted transition hover:bg-bg hover:text-text"
            >
              مشاهده سایت اصلی
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-red-500/30 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
              title="خروج از حساب"
            >
              خروج
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top Header */}
        <header className="flex h-20 items-center justify-between border-b border-line bg-panel px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl border border-line p-2 text-muted lg:hidden hover:text-text"
              aria-label="منوی موبایل"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2 className="text-base font-black text-text sm:text-lg">
              {navItems.find((n) => n.href === pathname)?.label || "پیشخوان"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Database status pill */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1 text-xs">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  dbStatus.connected ? "bg-ok" : "bg-red-500",
                )}
              />
              <span className="text-muted">وضعیت دیتابیس:</span>
              <span
                className={cn(
                  "font-bold",
                  dbStatus.connected ? "text-ok" : "text-red-500",
                )}
              >
                {dbStatus.connected ? "پایدار" : "قطع"}
              </span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-3.5 py-1.5 text-xs font-bold text-text transition hover:border-blue"
            >
              <span>سایت اصلی</span>
              <svg
                className="h-3.5 w-3.5 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Link>

            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-line px-3 py-1.5 text-xs font-bold text-muted transition hover:border-red-500 hover:text-red-600"
            >
              خروج
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-line bg-panel p-4 lg:hidden">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-bold",
                    pathname === item.href
                      ? "bg-navy text-white"
                      : "text-muted hover:bg-bg",
                  )}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
