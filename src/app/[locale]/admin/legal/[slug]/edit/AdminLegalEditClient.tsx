"use client";

import { useEffect, useState } from "react";
import { LegalForm } from "@/components/admin/legal/LegalForm";
import type { LegalDocFormData } from "@/lib/validations/legal";

interface AdminLegalEditClientProps {
  slug: string;
}

export function AdminLegalEditClient({ slug }: AdminLegalEditClientProps) {
  const [data, setData] = useState<LegalDocFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadDoc() {
      try {
        const res = await fetch(`/api/admin/legal/${slug}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          throw new Error(json.message || "خطا در دریافت سند حقوقی.");
        }
        if (mounted) {
          setData(json.doc);
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

    loadDoc();

    return () => {
      mounted = false;
    };
  }, [slug]);

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
        {error || "سند حقوقی یافت نشد."}
      </div>
    );
  }

  return <LegalForm initialData={data} isNew={false} />;
}
