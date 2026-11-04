"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { STATIC_SITE_LINKS, type SiteLinkItem } from "@/lib/site-links";
import { cn } from "@/lib/cn";
import { TriMarker } from "@/components/ui/TriMarker";
import {
  IconClose,
  IconLink,
  IconExternalLink,
  IconUnlink,
  IconCheck,
} from "./EditorIcons";

export interface LinkModalParams {
  url: string;
  text?: string;
  openInNewTab?: boolean;
}

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (params: LinkModalParams) => void;
  onUnlink?: () => void;
  initialParams?: Partial<LinkModalParams>;
  hasExistingLink?: boolean;
}

export function LinkModal({
  isOpen,
  onClose,
  onConfirm,
  onUnlink,
  initialParams,
  hasExistingLink = false,
}: LinkModalProps) {
  const incomingUrl = initialParams?.url || "";
  const isInternal = incomingUrl.startsWith("/") && incomingUrl.length > 1;

  const [url, setUrl] = useState(incomingUrl);
  const [text, setText] = useState(initialParams?.text || "");
  const [openInNewTab, setOpenInNewTab] = useState(initialParams?.openInNewTab ?? false);
  const [activeTab, setActiveTab] = useState<"direct" | "catalog">(
    isInternal ? "catalog" : "direct"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [extraPostLinks, setExtraPostLinks] = useState<SiteLinkItem[]>([]);
  const [urlError, setUrlError] = useState("");

  const urlInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the URL input
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        urlInputRef.current?.focus();
        urlInputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Load dynamic blog posts from API to include in internal link suggestions
  useEffect(() => {
    if (!isOpen) return;
    let ignore = false;
    async function fetchDynamicPosts() {
      try {
        const res = await fetch("/api/admin/posts");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.posts) && !ignore) {
            const mapped: SiteLinkItem[] = data.posts.map(
              (p: { title: string; slug: string; summary?: string }) => ({
                title: p.title,
                url: `/insights/${p.slug}`,
                slug: p.slug,
                category: "insights" as const,
                categoryLabel: "مقالات وبلاگ",
                description: p.summary || "مقاله تخصصی",
              }),
            );
            setExtraPostLinks(mapped);
          }
        }
      } catch {
        // Ignore network errors in suggestions
      }
    }
    void fetchDynamicPosts();
    return () => {
      ignore = true;
    };
  }, [isOpen]);

  // Combined site links
  const allSiteLinks = useMemo(() => {
    const combined = [...STATIC_SITE_LINKS];
    extraPostLinks.forEach((p) => {
      if (!combined.some((item) => item.url === p.url)) {
        combined.push(p);
      }
    });
    return combined;
  }, [extraPostLinks]);

  // Filtered links in catalog
  const filteredLinks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allSiteLinks;
    return allSiteLinks.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        item.categoryLabel.toLowerCase().includes(q),
    );
  }, [allSiteLinks, searchQuery]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setUrlError("لطفاً آدرس اینترنتی یا مسیر داخلی را وارد کنید.");
      return;
    }

    // Auto-fix protocol if missing for external domains (e.g. "google.com" -> "https://google.com")
    let finalUrl = trimmedUrl;
    if (
      !finalUrl.startsWith("http://") &&
      !finalUrl.startsWith("https://") &&
      !finalUrl.startsWith("/") &&
      !finalUrl.startsWith("#") &&
      !finalUrl.startsWith("mailto:") &&
      !finalUrl.startsWith("tel:")
    ) {
      finalUrl = `https://${finalUrl}`;
    }

    onConfirm({
      url: finalUrl,
      text: text.trim(),
      openInNewTab,
    });
  };

  const handleSelectCatalogItem = (item: SiteLinkItem) => {
    setUrl(item.url);
    if (!text.trim()) {
      setText(item.title);
    }
    setActiveTab("direct");
    setUrlError("");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="link-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-lg rounded-3xl border border-line bg-panel p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue/10 text-blue">
              <IconLink className="size-4" />
            </span>
            <div>
              <h3 id="link-modal-title" className="text-sm font-bold text-text flex items-center gap-1.5">
                <TriMarker className="shrink-0" />
                <span>{hasExistingLink ? "ویرایش لینک" : "افزودن لینک به متن"}</span>
              </h3>
              <p className="text-[11px] text-muted">
                آدرس اینترنتی مستقیم یا صفحه داخلی سایت کارا پرداز
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-xl border border-line bg-bg text-muted hover:text-text hover:border-blue transition-colors"
            title="بستن پنجره"
          >
            <IconClose className="size-4" />
          </button>
        </div>

        {/* Tab switch: Direct URL vs Site Catalog */}
        <div className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-bg p-1 text-xs font-bold mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("direct")}
            className={cn(
              "py-1.5 rounded-xl transition-all",
              activeTab === "direct"
                ? "bg-panel text-blue shadow-sm"
                : "text-muted hover:text-text",
            )}
          >
            آدرس دلخواه (URL)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("catalog")}
            className={cn(
              "py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5",
              activeTab === "catalog"
                ? "bg-panel text-blue shadow-sm"
                : "text-muted hover:text-text",
            )}
          >
            <span>صفحات داخلی سایت</span>
            <span className="rounded-full bg-blue/15 px-1.5 py-0.2 text-[10px] text-blue">
              {allSiteLinks.length}
            </span>
          </button>
        </div>

        {/* Tab Content: Direct URL */}
        {activeTab === "direct" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* URL Input */}
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5">
                آدرس مقصد (URL):
              </label>
              <div className="relative">
                <input
                  ref={urlInputRef}
                  type="text"
                  dir="ltr"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (urlError) setUrlError("");
                  }}
                  placeholder="https://example.com یا /services/crm"
                  className={cn(
                    "w-full rounded-xl border bg-bg px-3.5 py-2.5 ps-9 text-xs font-mono text-start text-text focus:outline-none transition-colors",
                    urlError
                      ? "border-red-500 focus:border-red-500"
                      : "border-line focus:border-blue",
                  )}
                />
                <span className="absolute start-3 top-1/2 -translate-y-1/2 text-muted">
                  <IconLink className="size-4" />
                </span>
              </div>
              {urlError && (
                <p className="mt-1 text-[11px] font-bold text-red-500">{urlError}</p>
              )}
            </div>

            {/* Display Text (Anchor Text) */}
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5">
                متن نمایش داده شده در متن (اختیاری):
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="در صورت خالی بودن، متن انتخابی حفظ می‌شود"
                className="w-full rounded-xl border border-line bg-bg px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none transition-colors"
              />
            </div>

            {/* New Tab Option */}
            <div className="rounded-xl border border-line/60 bg-bg/50 p-3">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={openInNewTab}
                  onChange={(e) => setOpenInNewTab(e.target.checked)}
                  className="size-4 rounded border-line text-blue focus:ring-blue accent-blue cursor-pointer"
                />
                <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                  <IconExternalLink className="size-3.5 text-muted" />
                  <span>باز شدن در تب جدید (Open in new window)</span>
                </div>
              </label>
              <p className="text-[10px] text-muted mt-1 ps-6.5">
                برای لینک‌های خارج از سایت کارا پرداز آوند توصیه می‌شود فعال باشد.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-line">
              {hasExistingLink && onUnlink ? (
                <button
                  type="button"
                  onClick={onUnlink}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-500/20 transition-colors inline-flex items-center gap-1.5"
                >
                  <IconUnlink className="size-3.5" />
                  <span>حذف لینک</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2 ms-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-line bg-panel px-4 py-2 text-xs font-bold text-muted hover:text-text transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-navy px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-navy-2 transition-colors inline-flex items-center gap-1.5"
                >
                  <IconCheck className="size-3.5 text-ok" />
                  <span>{hasExistingLink ? "ذخیره تغییرات" : "ثبت لینک"}</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Tab Content: Internal Site Catalog */
          <div className="space-y-3">
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در صفحات خدمات، مقالات، درباره ما و..."
                className="w-full rounded-xl border border-line bg-bg px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none transition-colors"
              />
            </div>

            {/* Links List */}
            <div className="max-h-64 overflow-y-auto space-y-1 rounded-2xl border border-line/60 bg-bg/30 p-1.5">
              {filteredLinks.length === 0 ? (
                <p className="p-4 text-center text-xs text-muted">
                  موردی با این عبارت یافت نشد.
                </p>
              ) : (
                filteredLinks.map((item) => {
                  const isSelected = url === item.url;
                  return (
                    <button
                      key={item.url}
                      type="button"
                      onClick={() => handleSelectCatalogItem(item)}
                      className={cn(
                        "w-full text-start p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between gap-2 border",
                        isSelected
                          ? "bg-blue/10 border-blue/40 text-blue font-bold"
                          : "bg-panel hover:bg-bg border-transparent hover:border-line text-text",
                      )}
                    >
                      <div className="min-w-0">
                        <div className="font-bold truncate">{item.title}</div>
                        <div className="text-[10px] text-muted font-mono truncate" dir="ltr">
                          {item.url}
                        </div>
                      </div>
                      <span className="shrink-0 rounded-lg bg-bg px-2 py-0.5 text-[10px] text-muted border border-line">
                        {item.categoryLabel}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => setActiveTab("direct")}
                className="rounded-xl border border-line bg-panel px-4 py-2 text-xs font-bold text-muted hover:text-text transition-colors"
              >
                بازگشت به فرم لینک
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
