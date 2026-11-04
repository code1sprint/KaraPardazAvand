"use client";

import { useEffect, useState, useCallback } from "react";
import { IconCheck, IconAlertTriangle } from "@/components/admin/editor/EditorIcons";
import { ApiButton } from "@/components/admin/api-drawer/ApiButton";
import { cn } from "@/lib/cn";

interface DbDetails {
  ok: boolean;
  status: string;
  message: string;
  readyState?: number;
  latencyMs?: number;
  error?: string;
}

export function AdminDatabaseClient() {
  const [data, setData] = useState<DbDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health/db", { cache: "no-store" });
      const json = await res.json();
      setData(json);
    } catch {
      setData({
        ok: false,
        status: "network_error",
        message: "خطا در برقراری ارتباط با API سرور",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch("/api/health/db", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (!ignore) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setData({
            ok: false,
            status: "network_error",
            message: "خطا در برقراری ارتباط با API سرور",
          });
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const readyStateLabels: Record<number, { text: string; color: string }> = {
    0: { text: "قطع (Disconnected)", color: "text-red-500" },
    1: { text: "متصل و پایدار (Connected)", color: "text-ok" },
    2: { text: "در حال اتصال (Connecting)", color: "text-amber" },
    3: { text: "در حال قطع اتصال (Disconnecting)", color: "text-red-400" },
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-text sm:text-2xl">
            سلامت و تنظیمات پایگاه داده MongoDB
          </h1>
          <p className="mt-1 text-sm text-muted">
            وضعیت زنده لایه ذخیره‌سازی، پیکربندی استخر کانکشن و پایش تاخیر
            سرور.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ApiButton variant="secondary" label="API وضعیت" />
          <button
            type="button"
            onClick={fetchHealth}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-navy px-5 py-2.5 text-xs font-bold text-white transition hover:bg-navy-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <span>بررسی مجدد اتصال</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Status Banner */}
      <div
        className={cn(
          "rounded-3xl border p-6 sm:p-8 transition-all",
          data?.ok
            ? "border-ok/30 bg-ok/5 text-text"
            : "border-red-500/30 bg-red-500/5 text-text",
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
                data?.ok ? "bg-ok/20 text-ok" : "bg-red-500/20 text-red-600",
              )}
            >
              {data?.ok ? (
                <IconCheck className="size-7" />
              ) : (
                <IconAlertTriangle className="size-7" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-black text-text">
                {data?.ok ? "پایگاه داده متصل است" : "عدم اتصال به پایگاه داده"}
              </h2>
              <p className="mt-0.5 text-xs text-muted">{data?.message}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {data?.latencyMs !== undefined && (
              <div className="rounded-2xl border border-line bg-panel px-4 py-2 text-center">
                <span className="block text-[10px] text-muted">تاخیر پینگ</span>
                <span className="font-mono text-sm font-bold text-text">
                  {data.latencyMs}ms
                </span>
              </div>
            )}
            <div className="rounded-2xl border border-line bg-panel px-4 py-2 text-center">
              <span className="block text-[10px] text-muted">ReadyState</span>
              <span
                className={cn(
                  "font-mono text-sm font-bold",
                  data?.readyState !== undefined &&
                    readyStateLabels[data.readyState]?.color,
                )}
              >
                {data?.readyState !== undefined
                  ? readyStateLabels[data.readyState]?.text || data.readyState
                  : "نامشخص"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Crash Prevention Checklist */}
      <div className="rounded-3xl border border-line bg-panel p-6 sm:p-8">
        <h3 className="mb-4 text-base font-bold text-text">
          ویژگی‌های امنیتی و ضد کرش پیاده‌سازی‌شده
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-2xl border border-line bg-bg p-4">
            <IconCheck className="size-4 shrink-0 text-ok mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-text">
                کش سراسری (Global Singleton Cache)
              </h4>
              <p className="mt-1 text-xs text-muted">
                جلوگیری از ساخت مجدد Connection Pool در حالت Fast Refresh فریم‌ورک
                Next.js.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-line bg-bg p-4">
            <IconCheck className="size-4 shrink-0 text-ok mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-text">
                تایم‌اوت و خطایابی کنترل‌شده (Timeout Guard)
              </h4>
              <p className="mt-1 text-xs text-muted">
                اعمال تایم‌اوت ۵ ثانیه‌ای و `bufferCommands: false` جهت جلوگیری از
                فریز شدن سرور.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-line bg-bg p-4">
            <IconCheck className="size-4 shrink-0 text-ok mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-text">
                جداسازی رمز عبور در کوری‌ها (Projection Safety)
              </h4>
              <p className="mt-1 text-xs text-muted">
                فیلد پسورد به صورت پیش‌فرض در اسکیمای کاربر دارای `select: false`
                است.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-line bg-bg p-4">
            <IconCheck className="size-4 shrink-0 text-ok mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-text">
                کوکی‌های محافظت‌شده (HttpOnly + Strict)
              </h4>
              <p className="mt-1 text-xs text-muted">
                توکن احراز هویت در مرورگر غیرقابل دسترس از طریق جاوااسکریپت و
                مصون از حملات XSS است.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guide on setup */}
      <div className="rounded-3xl border border-line bg-panel p-6 sm:p-8">
        <h3 className="mb-2 text-base font-bold text-text">
          راهنمای اتصال پایگاه داده ابری یا محلی
        </h3>
        <p className="text-xs text-muted">
          برای اتصال به کلاستر MongoDB Atlas یا سرور اختصاصی خود، متغیر
          `MONGODB_URI` را در فایل `.env.local` به‌روزرسانی کنید:
        </p>
        <div
          className="mt-4 overflow-x-auto rounded-2xl border border-line bg-bg p-4 font-mono text-xs text-text"
          dir="ltr"
        >
          <code>
            MONGODB_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.mongodb.net/karapardaz?retryWrites=true&w=majority
          </code>
        </div>
      </div>
    </div>
  );
}
