"use client";

import { useEffect, useState } from "react";
import { ProcessForm } from "@/components/admin/process/ProcessForm";
import type { ProcessFormData } from "@/lib/validations/process";

export function AdminProcessClient() {
  const [data, setData] = useState<ProcessFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProcess() {
      try {
        const res = await fetch("/api/admin/process", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          throw new Error(json.message || "خطا در دریافت اطلاعات فرایند همکاری.");
        }
        if (mounted) {
          setData(json.process);
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

    loadProcess();

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

  return <ProcessForm initialData={data} />;
}
