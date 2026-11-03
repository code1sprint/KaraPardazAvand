"use client";

import { useState, useEffect, useRef } from "react";
import type { MediaItem } from "@/app/api/admin/media/route";
import { cn } from "@/lib/cn";

export interface MediaInsertParams {
  src: string;
  alt?: string;
  title?: string;
  width?: string;
  align?: "center" | "left" | "right";
}

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (attrs: MediaInsertParams) => void;
  onInsertVideo: (attrs: MediaInsertParams) => void;
  defaultType?: "image" | "video";
}

export function MediaModal({
  isOpen,
  onClose,
  onInsertImage,
  onInsertVideo,
  defaultType = "image",
}: MediaModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "library" | "url">("upload");
  const [mediaType, setMediaType] = useState<"image" | "video">(defaultType);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [titleText, setTitleText] = useState("");
  const [selectedWidth, setSelectedWidth] = useState<string>("100%");
  const [selectedAlign, setSelectedAlign] = useState<"center" | "left" | "right">("center");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Media library state
  const [library, setLibrary] = useState<MediaItem[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    let ignore = false;

    const load = async () => {
      setLoadingLibrary(true);
      try {
        const res = await fetch("/api/admin/media");
        const json = await res.json();
        if (!ignore && res.ok && json.ok) {
          setLibrary(json.media || []);
        }
      } catch {
        // Ignore
      } finally {
        if (!ignore) {
          setLoadingLibrary(false);
        }
      }
    };

    void load();

    return () => {
      ignore = true;
    };
  }, [isOpen]);

  const refreshLibrary = async () => {
    try {
      const res = await fetch("/api/admin/media");
      const json = await res.json();
      if (res.ok && json.ok) {
        setLibrary(json.media || []);
      }
    } catch {
      // Ignore
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.message || "خطا در آپلود فایل.");
      }

      setSelectedUrl(json.url);
      setMediaType(json.type);
      if (!altText) {
        setAltText(file.name.replace(/\.[^/.]+$/, ""));
      }
      void refreshLibrary();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطا در آپلود فایل.";
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmInsert = () => {
    if (!selectedUrl) return;

    const params: MediaInsertParams = {
      src: selectedUrl,
      alt: altText || titleText,
      title: titleText,
      width: selectedWidth,
      align: selectedAlign,
    };

    if (mediaType === "video") {
      onInsertVideo(params);
    } else {
      onInsertImage(params);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-line bg-panel p-6 shadow-2xl space-y-5 font-vazirmatn text-text">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h2 className="text-base font-black text-text">
              درج و مدیریت رسانه (تصویر / ویدیو)
            </h2>
            <p className="text-xs text-muted mt-0.5">
              آپلود از حافظه سیستم، انتخاب از کتابخانه، تعیین سایز و پیچش متن (Float).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line p-1.5 text-muted hover:text-text hover:bg-bg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Top Type Switch & Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Media Type */}
          <div className="flex items-center bg-bg p-1 rounded-xl border border-line text-xs font-bold">
            <button
              type="button"
              onClick={() => setMediaType("image")}
              className={cn(
                "px-3 py-1 rounded-lg transition-colors",
                mediaType === "image" ? "bg-panel text-blue shadow-sm font-black" : "text-muted",
              )}
            >
              🖼 تصویر
            </button>
            <button
              type="button"
              onClick={() => setMediaType("video")}
              className={cn(
                "px-3 py-1 rounded-lg transition-colors",
                mediaType === "video" ? "bg-panel text-blue shadow-sm font-black" : "text-muted",
              )}
            >
              🎬 ویدیو
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-bg p-1 rounded-xl border border-line text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={cn(
                "px-3 py-1 rounded-lg transition-colors",
                activeTab === "upload" ? "bg-panel text-blue shadow-sm font-black" : "text-muted",
              )}
            >
              آپلود از سیستم (Browser)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("library")}
              className={cn(
                "px-3 py-1 rounded-lg transition-colors",
                activeTab === "library" ? "bg-panel text-blue shadow-sm font-black" : "text-muted",
              )}
            >
              کتابخانه رسانه‌ها ({library.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("url")}
              className={cn(
                "px-3 py-1 rounded-lg transition-colors",
                activeTab === "url" ? "bg-panel text-blue shadow-sm font-black" : "text-muted",
              )}
            >
              آدرس اینترنتی (URL)
            </button>
          </div>
        </div>

        {/* Tab 1: Upload & Local File Browser */}
        {activeTab === "upload" && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-line hover:border-blue bg-bg/50 hover:bg-bg cursor-pointer transition-all text-center space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={mediaType === "image" ? "image/*" : "video/*"}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="h-12 w-12 rounded-2xl bg-blue/10 text-blue flex items-center justify-center text-xl font-bold">
                {uploading ? "⏳" : "📁"}
              </div>
              <div>
                <p className="text-xs font-bold text-text">
                  {uploading
                    ? "در حال آپلود و انتقال فایل به سرور..."
                    : "فایل را اینجا بکشید یا برای انتخاب از سیستم کلیک کنید (Browse Files)"}
                </p>
                <p className="text-[11px] text-muted mt-1">
                  پشتیبانی از انواع فرمت‌های تصویر و ویدیو تا حداکثر ۵۰ مگابایت
                </p>
              </div>
            </div>

            {uploadError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600 dark:border-red-900/40 dark:bg-red-950/20">
                ⚠️ {uploadError}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Media Library */}
        {activeTab === "library" && (
          <div className="space-y-3">
            {loadingLibrary ? (
              <div className="py-12 text-center text-xs font-bold text-muted">
                در حال بارگذاری فایل‌های آپلود شده...
              </div>
            ) : library.length === 0 ? (
              <div className="py-12 text-center text-xs font-bold text-muted space-y-2">
                <p>هیچ فایلی تا کنون آپلود نشده است.</p>
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className="text-blue hover:underline"
                >
                  اولین فایل را آپلود کنید
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
                {library
                  .filter((item) => item.type === mediaType)
                  .map((item) => (
                    <div
                      key={item.url}
                      onClick={() => {
                        setSelectedUrl(item.url);
                        setAltText(item.name.replace(/\.[^/.]+$/, ""));
                      }}
                      className={cn(
                        "rounded-xl border p-2 cursor-pointer transition-all text-center space-y-1 relative group overflow-hidden",
                        selectedUrl === item.url
                          ? "border-blue bg-blue/10 shadow-sm"
                          : "border-line bg-bg hover:border-blue/50",
                      )}
                    >
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-panel flex items-center justify-center text-lg">
                        {item.type === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl">🎬</span>
                        )}
                      </div>
                      <div className="text-[10px] font-bold text-text truncate">
                        {item.name}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Direct URL */}
        {activeTab === "url" && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5">
                آدرس اینترنتی رسانه (URL مستقیم یا لینک ویدیو یوتیوب / آپارات)
              </label>
              <input
                type="text"
                dir="ltr"
                value={selectedUrl}
                onChange={(e) => setSelectedUrl(e.target.value)}
                placeholder="https://... یا /uploads/..."
                className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs font-mono text-text focus:border-blue focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Selected Preview & Metadata Attributes */}
        {selectedUrl && (
          <div className="rounded-2xl border border-line bg-bg/40 p-4 space-y-3.5">
            <div className="flex items-center gap-3 border-b border-line/60 pb-3">
              <div className="h-14 w-20 shrink-0 rounded-xl overflow-hidden border border-line bg-panel flex items-center justify-center">
                {mediaType === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">🎬</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-mono text-blue truncate" dir="ltr">
                  {selectedUrl}
                </span>
                <span className="text-[11px] text-muted">فایل رسانه انتخاب شده</span>
              </div>
            </div>

            {/* Layout & Text Wrapping Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-line/60 pb-3">
              {/* Alignment / Wrap */}
              <div>
                <label className="block text-xs font-bold text-muted mb-1.5">
                  تراز و پیچش متن (Text Wrapping)
                </label>
                <div className="flex items-center gap-1 bg-panel p-1 rounded-xl border border-line text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAlign("left");
                      if (selectedWidth === "100%") setSelectedWidth("50%");
                    }}
                    className={cn(
                      "flex-1 py-1 rounded-lg font-bold transition-colors text-center",
                      selectedAlign === "left"
                        ? "bg-blue/15 text-blue"
                        : "text-muted hover:text-text",
                    )}
                  >
                    ⬅ چپ (متن راست)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedAlign("center")}
                    className={cn(
                      "flex-1 py-1 rounded-lg font-bold transition-colors text-center",
                      selectedAlign === "center"
                        ? "bg-blue/15 text-blue"
                        : "text-muted hover:text-text",
                    )}
                  >
                    ⏺ وسط‌چین
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAlign("right");
                      if (selectedWidth === "100%") setSelectedWidth("50%");
                    }}
                    className={cn(
                      "flex-1 py-1 rounded-lg font-bold transition-colors text-center",
                      selectedAlign === "right"
                        ? "bg-blue/15 text-blue"
                        : "text-muted hover:text-text",
                    )}
                  >
                    راست (متن چپ) ➡️
                  </button>
                </div>
              </div>

              {/* Width Presets */}
              <div>
                <label className="block text-xs font-bold text-muted mb-1.5">
                  سایز و عرض رسانه (Width)
                </label>
                <div className="flex items-center gap-1 bg-panel p-1 rounded-xl border border-line text-xs font-mono">
                  {(["25%", "50%", "75%", "100%"] as const).map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWidth(w)}
                      className={cn(
                        "flex-1 py-1 rounded-lg transition-colors text-center",
                        selectedWidth === w
                          ? "bg-blue text-white font-bold"
                          : "text-muted hover:text-text",
                      )}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Alt & Caption */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-muted mb-1">
                  متن جایگزین سئو (Alt Text)
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="توضیح کوتاه تصویر برای موتورهای جستجو..."
                  className="w-full rounded-xl border border-line bg-panel px-3 py-1.5 text-xs text-text focus:border-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted mb-1">
                  زیرنویس / عنوان (Caption)
                </label>
                <input
                  type="text"
                  value={titleText}
                  onChange={(e) => setTitleText(e.target.value)}
                  placeholder="زیرنویس اختیاری..."
                  className="w-full rounded-xl border border-line bg-panel px-3 py-1.5 text-xs text-text focus:border-blue focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-line pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line px-4 py-2 text-xs font-bold text-muted hover:text-text transition-colors"
          >
            انصراف
          </button>
          <button
            type="button"
            disabled={!selectedUrl}
            onClick={handleConfirmInsert}
            className="rounded-xl bg-blue text-white px-5 py-2 text-xs font-bold shadow hover:bg-navy-2 transition-all disabled:opacity-40"
          >
            درج {mediaType === "image" ? "تصویر" : "ویدیو"} در مقاله
          </button>
        </div>
      </div>
    </div>
  );
}
