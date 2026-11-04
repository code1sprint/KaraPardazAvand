"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/Button";
import {
  IconAlertTriangle,
  IconClose,
  IconCheck,
} from "@/components/admin/editor/EditorIcons";

export function AdminLoginForm() {
  const router = useRouter();
  const { user, isLoading: authLoading, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Setup state (for zero-admin bootstrap)
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [setupMode, setSetupMode] = useState(false);
  const [setupName, setSetupName] = useState("مدیر ارشد کارا پرداز");
  const [setupSuccess, setSetupSuccess] = useState<string | null>(null);

  // Check setup status
  useEffect(() => {
    fetch("/api/auth/setup")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.initialized === "boolean") {
          setIsInitialized(data.initialized);
          if (!data.initialized) {
            setSetupMode(true);
          }
        }
      })
      .catch(() => {
        setIsInitialized(true);
      });
  }, []);

  // If already logged in, navigate to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/admin");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    if (setupMode) {
      try {
        const res = await fetch("/api/auth/setup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: setupName,
            email,
            password,
          }),
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          setSetupSuccess("حساب مدیر ارشد با موفقیت ایجاد شد! در حال انتقال...");
          setTimeout(() => {
            router.push("/admin");
          }, 1200);
        } else {
          setErrorMessage(data.message || "خطا در راه‌اندازی کاربر اولیه");
        }
      } catch {
        setErrorMessage("خطای شبکه در اتصال به سرور");
      } finally {
        setLoading(false);
      }
      return;
    }

    const result = await login(email, password);
    setLoading(false);

    if (result.ok) {
      router.push("/admin");
    } else {
      setErrorMessage(result.message || "اطلاعات ورود نادرست است");
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-40 blur-3xl"
        aria-hidden
      >
        <div className="h-96 w-96 rounded-full bg-blue/20" />
        <div className="h-80 w-80 -translate-x-20 rounded-full bg-orange/15" />
      </div>

      <div className="w-full max-w-md">
        {/* Brand identity header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-panel p-3 shadow-sm">
            <Image
              src="/brand/logo.svg"
              alt="کارا پرداز اوند"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-black text-text sm:text-3xl">
            {setupMode ? "راه‌اندازی حساب مدیر ارشد" : "ورود به پیشخوان مدیریت"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {setupMode
              ? "اولین کاربر مدیر سیستم را با دسترسی کامل ایجاد کنید"
              : "سامانه مدیریت محتوا و ارتباطات کارا پرداز اوند"}
          </p>
        </div>

        {/* First time setup banner */}
        {isInitialized === false && !setupMode && (
          <div className="mb-6 rounded-2xl border border-amber/30 bg-amber/10 p-4 text-sm text-text">
            <p className="font-bold text-amber inline-flex items-center gap-1.5">
              <IconAlertTriangle className="size-4 shrink-0" />
              <span>سیستم هنوز کاربر مدیری ندارد!</span>
            </p>
            <p className="mt-1 text-xs text-muted">
              جهت شروع به کار، ابتدا حساب مدیر اولیه را ثبت نمایید.
            </p>
            <button
              type="button"
              onClick={() => setSetupMode(true)}
              className="mt-3 inline-block rounded-lg bg-navy px-3 py-1.5 text-xs font-bold text-white transition hover:bg-navy-2"
            >
              فعال‌سازی حالت راه‌اندازی اولیه
            </button>
          </div>
        )}

        {/* Login / Setup Card */}
        <div className="rounded-3xl border border-line bg-panel p-6 shadow-xl sm:p-8">
          {errorMessage && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400"
            >
              <IconClose className="shrink-0 size-4 text-red-700 dark:text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {setupSuccess && (
            <div
              role="status"
              className="mb-6 flex items-start gap-3 rounded-2xl border border-ok/30 bg-ok/10 p-4 text-sm text-ok"
            >
              <IconCheck className="shrink-0 size-4 text-ok mt-0.5" />
              <span>{setupSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {setupMode && (
              <div>
                <label
                  htmlFor="setup-name"
                  className="mb-2 block text-xs font-bold text-text"
                >
                  نام و نام خانوادگی مدیر
                </label>
                <input
                  id="setup-name"
                  type="text"
                  required
                  value={setupName}
                  onChange={(e) => setSetupName(e.target.value)}
                  placeholder="مثال: مدیر ارشد سیستم"
                  className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text transition focus:border-blue focus:bg-panel focus:outline-none focus:ring-2 focus:ring-blue/20"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-xs font-bold text-text"
              >
                پست الکترونیک (ایمیل)
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@karapardaz.com"
                className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text transition focus:border-blue focus:bg-panel focus:outline-none focus:ring-2 focus:ring-blue/20"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-bold text-text"
                >
                  کلمه عبور
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-muted transition hover:text-text"
                >
                  {showPassword ? "مخفی کردن" : "نمایش پسورد"}
                </button>
              </div>
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete={setupMode ? "new-password" : "current-password"}
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={setupMode ? "حداقل ۸ کاراکتر" : "••••••••"}
                className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text transition focus:border-blue focus:bg-panel focus:outline-none focus:ring-2 focus:ring-blue/20"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              size="md"
              className="mt-2 w-full justify-center"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>درحال بررسی...</span>
                </span>
              ) : setupMode ? (
                "ثبت و راه‌اندازی حساب مدیر"
              ) : (
                "ورود به حساب کاربری"
              )}
            </Button>
          </form>

          {isInitialized === false && setupMode && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setSetupMode(false)}
                className="text-xs text-muted hover:underline"
              >
                بازگشت به فرم لاگین عادی
              </button>
            </div>
          )}
        </div>

        {/* Security badge footer */}
        <div className="mt-8 text-center text-xs text-muted">
          <p className="flex items-center justify-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-ok" />
            <span>اتصال امن رمزنگاری‌شده (HTTP-Only + JWT HS256)</span>
          </p>
        </div>
      </div>
    </div>
  );
}
