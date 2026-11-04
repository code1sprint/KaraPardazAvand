"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { STATIC_SITE_LINKS, type SiteLinkItem } from "@/lib/site-links";
import { cn } from "@/lib/cn";
import { TriMarker } from "@/components/ui/TriMarker";
import {
  IconClose,
  IconAlignRight,
  IconAlignCenter,
  IconAlignLeft,
  IconFullWidth,
  IconChevronDown,
} from "./EditorIcons";

export interface CtaModalParams {
  label: string;
  url: string;
  variant: "primary" | "secondary" | "outline";
  align: "center" | "left" | "right" | "full";
}

interface CtaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (params: CtaModalParams) => void;
  initialParams?: Partial<CtaModalParams>;
}

export function CtaModal({
  isOpen,
  onClose,
  onConfirm,
  initialParams,
}: CtaModalProps) {
  const [label, setLabel] = useState(initialParams?.label || "درخواست جلسه ارزیابی فنی");
  const [url, setUrl] = useState(initialParams?.url || "/contact");
  const [variant, setVariant] = useState<"primary" | "secondary" | "outline">(
    initialParams?.variant || "primary",
  );
  const [align, setAlign] = useState<"center" | "left" | "right" | "full">(
    initialParams?.align || "center",
  );

  const initialUrl = initialParams?.url || "/contact";
  const isCustomByDefault =
    !STATIC_SITE_LINKS.some((l) => l.url === initialUrl) && !initialUrl.startsWith("/");

  const [mode, setMode] = useState<"catalog" | "custom">(
    isCustomByDefault ? "custom" : "catalog",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [extraPostLinks, setExtraPostLinks] = useState<SiteLinkItem[]>([]);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);

  // Fetch dynamic posts from API so newly created articles are also selectable
  useEffect(() => {
    if (!isOpen) return;
    let ignore = false;

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/admin/posts?limit=50");
        if (!res.ok) return;
        const data = (await res.json()) as { posts: Array<{ title: string; slug: string; excerpt?: string }> };
        if (ignore || !data.posts) return;

        const dynamicLinks: SiteLinkItem[] = data.posts.map((p) => ({
          title: p.title,
          url: `/insights/${p.slug}`,
          slug: p.slug,
          category: "insights",
          categoryLabel: "مقاله",
          description: p.excerpt,
        }));

        setExtraPostLinks(dynamicLinks);
      } catch {
        // Silently ignore if offline or error, static catalog will suffice
      }
    };

    void fetchPosts();

    return () => {
      ignore = true;
    };
  }, [isOpen]);

  // Close combobox when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setComboboxOpen(false);
      }
    };

    if (comboboxOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [comboboxOpen]);

  // Combine static and dynamic links, deduplicating by URL
  const allLinks = useMemo(() => {
    const map = new Map<string, SiteLinkItem>();
    for (const item of STATIC_SITE_LINKS) {
      map.set(item.url, item);
    }
    for (const item of extraPostLinks) {
      map.set(item.url, item);
    }
    return Array.from(map.values());
  }, [extraPostLinks]);

  // Filtered links according to user query
  const filteredLinks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allLinks;
    return allLinks.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        (item.slug && item.slug.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)),
    );
  }, [allLinks, searchQuery]);

  const selectedLinkItem = useMemo(() => {
    return allLinks.find((l) => l.url === url);
  }, [allLinks, url]);

  const handleSelectLink = (item: SiteLinkItem) => {
    setUrl(item.url);
    setComboboxOpen(false);
    // If the label is default, suggest an intelligent label
    if (!label || label === "درخواست جلسه ارزیابی فنی" || label === "درخواست مشاوره اختصاصی") {
      if (item.category === "services") {
        setLabel(`بررسی خدمات ${item.title.split(" و ")[0] || item.title}`);
      } else if (item.category === "insights") {
        setLabel("مطالعه مقاله کامل");
      } else if (item.category === "projects") {
        setLabel("مشاهده جزییات پایلوت");
      }
    }
  };

  const handleConfirm = () => {
    if (!url.trim()) return;
    onConfirm({
      label: label.trim() || "مشاهده جزییات",
      url: url.trim(),
      variant,
      align,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cta-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-line bg-panel p-6 shadow-2xl flex flex-col gap-5 text-start animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h2 id="cta-modal-title" className="text-base font-bold text-text">
              پیکربندی دکمه اقدام (CTA Button)
            </h2>
            <p className="text-xs text-muted mt-1">
              تعیین عنوان، مقصد از میان صفحات و اسلاگ‌ها، استایل و موقعیت چیدمان دکمه.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:text-text hover:bg-bg transition-colors flex items-center justify-center"
            title="بستن پنجره"
          >
            <IconClose className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex flex-col gap-4">
          {/* Label Input */}
          <div>
            <label className="block text-xs font-bold text-text mb-1.5">
              متن روی دکمه (Label) *
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="مثال: درخواست جلسه ارزیابی فنی"
              className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-sm text-text focus:border-blue focus:outline-none transition-colors"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-muted">پیشنهادها:</span>
              {[
                "درخواست جلسه ارزیابی فنی",
                "مشاهده خدمات نرم‌افزاری",
                "مطالعه مقاله مرتبط",
                "درخواست مشاوره اختصاصی",
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setLabel(preset)}
                  className="rounded-md border border-line bg-bg/80 px-2 py-0.5 text-[11px] text-muted hover:text-blue hover:border-blue/50 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Destination URL: Searchable Combobox with Slugs */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-text">
                آدرس مقصد دکمه (Destination Link / Slug) *
              </label>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setMode("catalog")}
                  className={cn(
                    "px-2 py-0.5 rounded transition-colors font-medium",
                    mode === "catalog"
                      ? "bg-blue/15 text-blue font-bold"
                      : "text-muted hover:text-text",
                  )}
                >
                  انتخاب از صفحات و اسلاگ‌ها
                </button>
                <button
                  type="button"
                  onClick={() => setMode("custom")}
                  className={cn(
                    "px-2 py-0.5 rounded transition-colors font-medium",
                    mode === "custom"
                      ? "bg-blue/15 text-blue font-bold"
                      : "text-muted hover:text-text",
                  )}
                >
                  لینک دلخواه / خارجی
                </button>
              </div>
            </div>

            {mode === "catalog" ? (
              <div className="relative" ref={comboboxRef}>
                {/* Search / Select trigger button */}
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={comboboxOpen}
                  onClick={() => setComboboxOpen(!comboboxOpen)}
                  className="flex items-center justify-between w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-sm text-text cursor-pointer hover:border-blue/50 focus:border-blue focus:outline-none transition-colors"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {selectedLinkItem ? (
                      <>
                        <span className="rounded bg-blue/10 px-1.5 py-0.5 text-[10px] font-bold text-blue shrink-0">
                          {selectedLinkItem.categoryLabel}
                        </span>
                        <span className="font-medium text-text truncate">
                          {selectedLinkItem.title}
                        </span>
                        <span className="font-mono text-xs text-muted shrink-0" dir="ltr">
                          {selectedLinkItem.url}
                        </span>
                      </>
                    ) : (
                      <span className="font-mono text-text" dir="ltr">
                        {url || "انتخاب آدرس..."}
                      </span>
                    )}
                  </div>
                  <IconChevronDown className="size-3.5 text-muted ms-2 shrink-0" />
                </button>

                {/* Dropdown Menu */}
                {comboboxOpen && (
                  <div className="absolute top-full start-0 mt-1.5 w-full z-40 rounded-xl border border-line bg-panel shadow-2xl p-2 flex flex-col gap-2 max-h-72 overflow-y-auto">
                    {/* Search Field */}
                    <div className="sticky top-0 bg-panel z-10 pb-1">
                      <input
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="جستجوی عنوان، اسلاگ (مثلاً crm، erp) یا آدرس..."
                        className="w-full rounded-lg border border-line bg-bg px-3 py-1.5 text-xs text-text focus:border-blue focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Results List */}
                    <div className="flex flex-col gap-1">
                      {filteredLinks.length === 0 ? (
                        <div className="p-4 text-center text-xs text-muted">
                          صفحه‌ای با این مشخصات یافت نشد.
                        </div>
                      ) : (
                        filteredLinks.map((item) => {
                          const isSelected = item.url === url;
                          return (
                            <button
                              key={item.url}
                              type="button"
                              onClick={() => handleSelectLink(item)}
                              className={cn(
                                "flex flex-col gap-0.5 text-start p-2 rounded-lg transition-colors border text-xs",
                                isSelected
                                  ? "bg-blue/15 border-blue/40 text-blue font-bold"
                                  : "border-transparent hover:bg-bg/80 text-text",
                              )}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 overflow-hidden">
                                  <span className="rounded bg-bg px-1.5 py-0.5 text-[9px] font-bold text-muted border border-line shrink-0">
                                    {item.categoryLabel}
                                  </span>
                                  <span className="font-semibold truncate">{item.title}</span>
                                </div>
                                <span className="font-mono text-[11px] text-muted shrink-0" dir="ltr">
                                  {item.slug ? `/${item.slug}` : item.url}
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-[10px] text-muted line-clamp-1 ps-1">
                                  {item.description}
                                </p>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  dir="ltr"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://... یا /path"
                  className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-sm font-mono text-text focus:border-blue focus:outline-none transition-colors"
                />
              </div>
            )}
          </div>

          {/* Alignment & Layout Selection */}
          <div>
            <label className="block text-xs font-bold text-text mb-1.5">
              موقعیت و چیدمان دکمه (Layout & Alignment)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "right", label: "راست‌چین", desc: "سمت راست (شروع)", icon: <IconAlignRight className="size-4" /> },
                { id: "center", label: "وسط‌چین", desc: "مرکز متن", icon: <IconAlignCenter className="size-4" /> },
                { id: "left", label: "چپ‌چین", desc: "سمت چپ (پایان)", icon: <IconAlignLeft className="size-4" /> },
                { id: "full", label: "تمام‌عرض", desc: "عرض ۱۰۰٪", icon: <IconFullWidth className="size-4" /> },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAlign(opt.id as typeof align)}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all text-xs gap-1",
                    align === opt.id
                      ? "border-blue bg-blue/10 text-blue font-bold shadow-sm"
                      : "border-line bg-bg text-muted hover:text-text",
                  )}
                >
                  {opt.icon}
                  <span className="font-semibold">{opt.label}</span>
                  <span className="text-[10px] text-muted mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Button Style Variant */}
          <div>
            <label className="block text-xs font-bold text-text mb-1.5">
              استایل بصری دکمه (Variant)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "primary", label: "دکمه اصلی (آبی برند)", desc: "رنگ اصلی کاتالوگ" },
                { id: "secondary", label: "دکمه ثانویه (روشن)", desc: "سفید با کادر خاکستری" },
                { id: "outline", label: "دکمه خطی (Outline)", desc: "کادر و متن آبی" },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariant(v.id as typeof variant)}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all text-xs",
                    variant === v.id
                      ? "border-blue bg-blue/10 text-blue font-bold shadow-sm"
                      : "border-line bg-bg text-muted hover:text-text",
                  )}
                >
                  <span className="font-semibold">{v.label}</span>
                  <span className="text-[10px] text-muted mt-0.5">{v.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="rounded-xl border border-line bg-bg/50 p-4">
            <div className="flex items-center justify-between text-[11px] font-bold text-muted mb-3">
              <span>پیش‌نمایش زنده در مقاله:</span>
              <span className="font-mono text-[10px]">
                {align} | {variant}
              </span>
            </div>

            <div
              className={cn(
                "w-full flex my-2",
                align === "center" && "justify-center",
                align === "right" && "justify-start",
                align === "left" && "justify-end",
                align === "full" && "w-full",
              )}
            >
              <div
                className={cn(
                  "inline-flex items-center gap-2 font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm select-none no-underline",
                  align === "full" && "w-full justify-center",
                  variant === "primary" && "bg-blue text-on-brand",
                  variant === "secondary" && "bg-panel text-text border border-line",
                  variant === "outline" && "border-2 border-blue text-blue bg-transparent",
                )}
              >
                <span
                  className={cn(
                    variant === "primary" && "text-on-brand font-bold",
                    variant === "secondary" && "text-text font-bold",
                    variant === "outline" && "text-blue font-bold",
                  )}
                >
                  {label || "عنوان دکمه"}
                </span>
                {/* Signature Brand Triangle Accent */}
                <TriMarker className="-rotate-90 size-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-line pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line px-4 py-2 text-xs font-semibold text-muted hover:bg-bg transition-colors"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-xl bg-blue text-white px-5 py-2 text-xs font-bold shadow hover:bg-navy-2 transition-all"
          >
            درج / ذخیره دکمه CTA
          </button>
        </div>
      </div>
    </div>
  );
}
