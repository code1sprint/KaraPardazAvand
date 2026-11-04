"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth/context";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { ApiButton } from "@/components/admin/api-drawer/ApiButton";

interface DbHealth {
  connected: boolean;
  readyState: number;
  latencyMs?: number;
  error?: string;
}

interface LogEntry {
  id: string;
  time: string;
  level: "INFO" | "SUCCESS" | "WARN" | "ERROR";
  message: string;
}

export function AdminDashboardClient() {
  const { user } = useAuth();
  const [dbHealth, setDbHealth] = useState<DbHealth | null>(null);
  const [checkingDb, setCheckingDb] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "initial-log",
      time: new Date().toLocaleTimeString("fa-IR"),
      level: "INFO",
      message: "کنسول پایش سیستم آماده به کار است.",
    },
  ]);

  const addLog = useCallback(
    (level: LogEntry["level"], message: string) => {
      const time = new Date().toLocaleTimeString("fa-IR");
      setLogs((prev) => [
        { id: Math.random().toString(), time, level, message },
        ...prev.slice(0, 20),
      ]);
    },
    [],
  );

  const checkDb = useCallback(async () => {
    setCheckingDb(true);
    addLog("INFO", "در حال ارسال درخواست پایش سلامت به /api/health/db...");
    try {
      const start = Date.now();
      const res = await fetch("/api/health/db", { cache: "no-store" });
      const data = await res.json();
      const latency = Date.now() - start;

      if (res.ok && data.ok) {
        setDbHealth({
          connected: true,
          readyState: data.readyState ?? 1,
          latencyMs: data.latencyMs ?? latency,
        });
        addLog(
          "SUCCESS",
          `اتصال MongoDB پایدار است. زمان پاسخ‌دهی: ${data.latencyMs ?? latency} میلی‌ثانیه`,
        );
      } else {
        setDbHealth({
          connected: false,
          readyState: data.readyState ?? 0,
          error: data.message,
        });
        addLog(
          "ERROR",
          `پایگاه داده در دسترس نیست: ${data.message || "خطای ناشناخته"}`,
        );
      }
    } catch {
      setDbHealth({
        connected: false,
        readyState: 0,
        error: "عدم امکان برقراری ارتباط با سرور",
      });
      addLog("ERROR", "خطای شبکه در ارسال درخواست پایش سلامت.");
    } finally {
      setCheckingDb(false);
    }
  }, [addLog]);

  useEffect(() => {
    let ignore = false;
    const initialCheck = async () => {
      try {
        const start = Date.now();
        const res = await fetch("/api/health/db", { cache: "no-store" });
        const data = await res.json();
        const latency = Date.now() - start;

        if (!ignore) {
          if (res.ok && data.ok) {
            setDbHealth({
              connected: true,
              readyState: data.readyState ?? 1,
              latencyMs: data.latencyMs ?? latency,
            });
          } else {
            setDbHealth({
              connected: false,
              readyState: data.readyState ?? 0,
              error: data.message,
            });
          }
        }
      } catch {
        if (!ignore) {
          setDbHealth({
            connected: false,
            readyState: 0,
            error: "عدم امکان برقراری ارتباط با سرور",
          });
        }
      }
    };

    initialCheck();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 rounded-3xl border border-line bg-panel p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-ok animate-pulse" />
            <span className="text-xs font-bold text-muted">
              پیشخوان فعال مدیریت
            </span>
          </div>
          <h1 className="text-xl font-black text-text sm:text-2xl">
            خوش آمدید، {user?.name || "مدیر گرامی"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            سامانه مرکزی کارا پرداز اوند برای کنترل محتوا، سرنخ‌ها و مانیتورینگ
            زیرساخت.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ApiButton label="کنسول مدیریت API" />
          <button
            type="button"
            onClick={checkDb}
            disabled={checkingDb}
            className="inline-flex items-center gap-2 rounded-2xl border border-line bg-bg px-4 py-2.5 text-xs font-bold text-text transition hover:border-blue hover:bg-panel disabled:opacity-60"
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                checkingDb ? "bg-amber animate-ping" : "bg-blue",
              )}
            />
            <span>{checkingDb ? "در حال پایش..." : "تست سلامت دیتابیس"}</span>
          </button>

          <Link
            href="/admin/inquiries"
            className="rounded-2xl bg-navy px-4 py-2.5 text-xs font-bold text-white transition hover:bg-navy-2"
          >
            مشاهده پیام‌های تماس
          </Link>
        </div>
      </div>

      {/* Bento Grid: Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Database Health */}
        <div className="rounded-3xl border border-line bg-panel p-6 transition-all hover:border-blue/40">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-muted">پایگاه داده</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold",
                dbHealth?.connected
                  ? "bg-ok/15 text-ok"
                  : "bg-red-500/15 text-red-600",
              )}
            >
              {dbHealth?.connected ? "آنلاین" : "آفلاین"}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-text">
              {dbHealth?.connected ? "MongoDB" : "قطع اتصال"}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted">
            {dbHealth?.connected
              ? `زمان پاسخ‌دهی: ${dbHealth.latencyMs}ms (پایدار)`
              : "بررسی اتصال در .env.local"}
          </p>
        </div>

        {/* Metric 2: Security & Auth */}
        <div className="rounded-3xl border border-line bg-panel p-6 transition-all hover:border-blue/40">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-muted">احراز هویت</span>
            <span className="rounded-full bg-blue/15 px-2 py-0.5 text-[10px] font-bold text-blue">
              JWT HS256
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-text">HttpOnly</span>
          </div>
          <p className="mt-2 text-xs text-muted">
            نقش فعال: {user?.role === "admin" ? "مدیر ارشد" : "نویسنده"} (ایمن
            در برابر XSS)
          </p>
        </div>

        {/* Metric 3: CMS Content */}
        <div className="rounded-3xl border border-line bg-panel p-6 transition-all hover:border-blue/40">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-muted">مقالات و محتوا</span>
            <span className="rounded-full bg-navy/10 px-2 py-0.5 text-[10px] font-bold text-navy">
              MDX + API
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-text">آماده توسعه</span>
          </div>
          <p className="mt-2 text-xs text-muted">
            پشتیبانی از ساختار فایل‌محور و پایگاه داده
          </p>
        </div>

        {/* Metric 4: Inquiries */}
        <div className="rounded-3xl border border-line bg-panel p-6 transition-all hover:border-blue/40">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-muted">درخواست‌های تماس</span>
            <span className="rounded-full bg-orange/15 px-2 py-0.5 text-[10px] font-bold text-orange">
              Rate-Limited
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-text">فعال</span>
          </div>
          <p className="mt-2 text-xs text-muted">
            ثبت و اعتبارسنجی با طرحواره Zod
          </p>
        </div>
      </div>

      {/* System Console Window (Kara Pardaz signature app window) */}
      <div className="overflow-hidden rounded-3xl border border-line bg-[var(--win-bg)] text-[var(--win-text)] shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-[var(--win-line)] bg-[var(--win-deep)] px-6 py-3.5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
            <span className="ms-3 font-mono text-xs font-bold text-[var(--win-muted)]">
              kara-system-console.log
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-[var(--win-muted)]">
              Next.js 16 + Turbopack
            </span>
            <button
              type="button"
              onClick={() => setLogs([])}
              className="rounded-md border border-[var(--win-line)] px-2 py-0.5 text-[10px] text-[var(--win-muted)] transition hover:text-white"
            >
              پاک‌سازی لاگ
            </button>
          </div>
        </div>

        {/* Console Body */}
        <div className="max-h-80 overflow-y-auto p-6 font-mono text-xs leading-relaxed">
          {logs.length === 0 ? (
            <p className="text-[var(--win-muted)]">هیچ رخدادی ثبت نشده است.</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <span className="shrink-0 text-[var(--win-muted)]">
                    [{log.time}]
                  </span>
                  <span
                    className={cn(
                      "shrink-0 font-bold",
                      log.level === "INFO" && "text-blue",
                      log.level === "SUCCESS" && "text-ok",
                      log.level === "WARN" && "text-amber",
                      log.level === "ERROR" && "text-red-400",
                    )}
                  >
                    {log.level}:
                  </span>
                  <span className="break-all text-[var(--win-text)]">
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Link
          href="/admin/database"
          className="group rounded-3xl border border-line bg-panel p-6 transition-all hover:border-blue hover:shadow-md no-underline"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue/10 text-blue group-hover:bg-blue group-hover:text-white transition-all">
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
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
              />
            </svg>
          </div>
          <h3 className="text-base font-bold text-text group-hover:text-blue">
            پایش و تست پایگاه داده
          </h3>
          <p className="mt-1 text-xs text-muted">
            مشاهده وضعیت اتصال، پیکربندی کانکشن پول و عیب‌یابی MongoDB.
          </p>
        </Link>

        <Link
          href="/admin/inquiries"
          className="group rounded-3xl border border-line bg-panel p-6 transition-all hover:border-blue hover:shadow-md no-underline"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange/10 text-orange group-hover:bg-orange group-hover:text-white transition-all">
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-base font-bold text-text group-hover:text-blue">
            پیام‌ها و سرنخ‌های مشتریان
          </h3>
          <p className="mt-1 text-xs text-muted">
            بررسی فرم‌های تماس ارسالی توسط کارفرمایان و سازمان‌ها.
          </p>
        </Link>

        <Link
          href="/admin/posts"
          className="group rounded-3xl border border-line bg-panel p-6 transition-all hover:border-blue hover:shadow-md no-underline"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-navy/10 text-navy group-hover:bg-navy group-hover:text-white transition-all">
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
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h3 className="text-base font-bold text-text group-hover:text-blue">
            مدیریت محتوا و مقالات
          </h3>
          <p className="mt-1 text-xs text-muted">
            سازماندهی مطالب منتشرشده در بلاگ و تحلیل‌های فنی.
          </p>
        </Link>
      </div>
    </div>
  );
}
