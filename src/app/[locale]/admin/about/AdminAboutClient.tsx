"use client";

import { useEffect, useState } from "react";
import { AboutForm } from "@/components/admin/about/AboutForm";
import type { AboutFormData } from "@/lib/validations/about";

export function AdminAboutClient() {
  const [data, setData] = useState<AboutFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadAbout() {
      try {
        const res = await fetch("/api/admin/about", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          throw new Error(json.message || "خطا در دریافت اطلاعات درباره ما.");
        }
        if (mounted) {
          setData(json.about);
        }
      } catch (err: unknown) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "خطای ناشناخته");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAbout();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded-xl bg-line/60" />
        <div className="h-64 w-full animate-pulse rounded-2xl bg-panel" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm font-bold text-red-600">
        {error || "اطلاعاتی یافت نشد."}
      </div>
    );
  }

  return <AboutForm initialData={data} />;
}
