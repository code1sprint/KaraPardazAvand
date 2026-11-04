"use client";

import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import {
  IconUpload,
  IconImage,
  IconSpinner,
  IconTrash,
  IconClose,
  IconAlertTriangle,
  IconCheck,
  IconExternalLink,
  IconPencil,
} from "@/components/admin/editor/EditorIcons";
import { cn } from "@/lib/cn";
import type { MediaItem } from "@/app/api/admin/media/route";

interface ProjectCoverPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export function ProjectCoverPicker({
  value,
  onChange,
  label = "تصویر کاور اصلی پروژه",
  required = false,
}: ProjectCoverPickerProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  // Media Library modal state
  const [showLibrary, setShowLibrary] = useState(false);
  const [library, setLibrary] = useState<MediaItem[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImgError = failedUrl === value;

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("فایل انتخابی باید یک تصویر معتبر (PNG, JPG, WebP, SVG) باشد.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadError("حجم تصویر نمی‌تواند بیش از ۵۰ مگابایت باشد.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "خطا در آپلود تصویر");
      }

      onChange(data.url);
      setUploadError(null);
    } catch (err: unknown) {
      setUploadError(
        err instanceof Error ? err.message : "خطای ناشناخته در آپلود فایل رخ داد.",
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleFileUpload(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleFileUpload(file);
    }
  };

  const openLibraryModal = async () => {
    setShowLibrary(true);
    setLoadingLibrary(true);
    try {
      const res = await fetch("/api/admin/media");
      const json = await res.json();
      if (res.ok && json.ok) {
        // filter only images
        const imagesOnly = (json.media as MediaItem[]).filter(
          (m) => m.type === "image",
        );
        setLibrary(imagesOnly);
      }
    } catch {
      // ignore
    } finally {
      setLoadingLibrary(false);
    }
  };

  const filteredLibrary = library.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-2">
      {/* Label and Actions */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-text">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowManualInput((prev) => !prev)}
          className="text-[11px] text-muted hover:text-blue transition-colors flex items-center gap-1"
        >
          <IconPencil className="size-3" />
          <span>{showManualInput ? "بستن ویرایش دستی" : "ویرایش دستی آدرس"}</span>
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Manual URL input fallback if toggled */}
      {showManualInput && (
        <div className="p-3 rounded-xl border border-line bg-panel space-y-1.5 transition-all">
          <label className="block text-[11px] text-muted font-medium">
            آدرس مستقیم فایل یا URL خارجی:
          </label>
          <input
            type="text"
            dir="ltr"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/projects/example.svg یا https://..."
            className="w-full rounded-lg border border-line bg-bg px-3 py-1.5 text-xs font-mono text-text focus:border-blue focus:outline-none"
          />
        </div>
      )}

      {/* Uploading State */}
      {uploading && (
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-blue/40 bg-blue/5 text-blue gap-2">
          <IconSpinner className="size-6 animate-spin text-blue" />
          <span className="text-xs font-bold">در حال آپلود و ذخیره‌سازی تصویر در سرور...</span>
          <span className="text-[11px] text-muted">لطفاً چند لحظه شکیبا باشید.</span>
        </div>
      )}

      {/* When Cover Image is Selected */}
      {!uploading && value && (
        <div className="relative rounded-2xl border border-line bg-panel p-3.5 shadow-sm transition-all hover:border-blue/50">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Thumbnail Preview */}
            <div className="relative w-full sm:w-44 h-28 shrink-0 rounded-xl overflow-hidden border border-line bg-bg flex items-center justify-center group">
              {!isImgError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={value}
                  alt="پیش‌نمایش کاور پروژه"
                  onError={() => setFailedUrl(value)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1 text-muted text-xs p-2 text-center">
                  <IconImage className="size-6 text-muted/60" />
                  <span className="text-[10px]">خطا در بارگذاری پیش‌نمایش</span>
                </div>
              )}
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                title="مشاهده در اندازه اصلی"
                className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
              >
                <IconExternalLink className="size-5" />
              </a>
            </div>

            {/* Info & Action Buttons */}
            <div className="flex-1 min-w-0 space-y-2.5 w-full text-start">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                  <IconCheck className="size-3.5 text-ok shrink-0" />
                  <span>تصویر کاور انتخاب شده است</span>
                </div>
                <div
                  dir="ltr"
                  className="text-[11px] font-mono text-muted truncate mt-0.5"
                  title={value}
                >
                  {value}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl border border-blue/40 bg-blue/10 px-3 py-1.5 text-xs font-bold text-blue hover:bg-blue/20 transition-colors inline-flex items-center gap-1.5"
                >
                  <IconUpload className="size-3.5" />
                  <span>انتخاب تصویر دیگر از مرورگر</span>
                </button>

                <button
                  type="button"
                  onClick={openLibraryModal}
                  className="rounded-xl border border-line bg-bg px-3 py-1.5 text-xs font-bold text-text hover:border-blue hover:text-blue transition-colors inline-flex items-center gap-1.5"
                >
                  <IconImage className="size-3.5" />
                  <span>کتابخانه رسانه‌ها</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500/20 transition-colors inline-flex items-center gap-1.5"
                >
                  <IconTrash className="size-3.5" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* When No Cover Image is Selected (Empty Dropzone) */}
      {!uploading && !value && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "rounded-2xl border-2 border-dashed p-6 transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-3",
            isDragging
              ? "border-blue bg-blue/10 scale-[0.99]"
              : "border-line bg-bg/50 hover:border-blue/60 hover:bg-blue/5",
          )}
        >
          <div className="w-12 h-12 rounded-2xl bg-blue/10 border border-blue/20 flex items-center justify-center text-blue">
            <IconUpload className="size-6" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-text">
              برای انتخاب فایل از مرورگر کلیک کنید، یا فایل را به اینجا بکشید
            </p>
            <p className="text-[11px] text-muted">
              پشتیبانی از PNG, JPG, WebP, SVG, AVIF (حداکثر ۵۰ مگابایت)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="rounded-xl bg-blue px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-navy-2 transition-colors inline-flex items-center gap-1.5"
            >
              <IconUpload className="size-3.5" />
              <span>انتخاب از سیستم / مرورگر</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openLibraryModal();
              }}
              className="rounded-xl border border-line bg-panel px-3.5 py-1.5 text-xs font-bold text-text hover:border-blue transition-colors inline-flex items-center gap-1.5"
            >
              <IconImage className="size-3.5" />
              <span>انتخاب از رسانه‌های موجود</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-xs font-semibold text-red-600">
          <IconAlertTriangle className="size-4 shrink-0 text-red-600" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Media Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-panel w-full max-w-2xl rounded-3xl border border-line shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div className="flex items-center gap-2">
                <IconImage className="size-5 text-blue" />
                <h3 className="text-sm font-bold text-text">
                  انتخاب تصویر از رسانه‌های آپلودشده
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                className="rounded-xl p-1.5 text-muted hover:bg-bg hover:text-text transition-colors"
              >
                <IconClose className="size-4" />
              </button>
            </div>

            {/* Modal Search */}
            <div className="px-6 py-3 border-b border-line bg-bg/50">
              <input
                type="text"
                placeholder="جستجو بر اساس نام فایل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-line bg-panel px-3.5 py-2 text-xs text-text focus:border-blue focus:outline-none"
              />
            </div>

            {/* Modal Grid */}
            <div className="p-6 overflow-y-auto flex-1 min-h-[240px]">
              {loadingLibrary ? (
                <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted text-xs">
                  <IconSpinner className="size-6 animate-spin text-blue" />
                  <span>در حال بارگذاری رسانه‌ها...</span>
                </div>
              ) : filteredLibrary.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted text-xs">
                  <IconImage className="size-8 text-muted/50" />
                  <span>هیچ تصویری در این جستجو یافت نشد.</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredLibrary.map((item) => {
                    const isSelected = value === item.url;
                    return (
                      <button
                        key={item.url}
                        type="button"
                        onClick={() => {
                          onChange(item.url);
                          setShowLibrary(false);
                        }}
                        className={cn(
                          "group relative rounded-xl border overflow-hidden p-1.5 text-start transition-all hover:border-blue flex flex-col gap-1.5",
                          isSelected
                            ? "border-blue bg-blue/10 ring-2 ring-blue/20"
                            : "border-line bg-bg",
                        )}
                      >
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-panel">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          {isSelected && (
                            <div className="absolute top-1.5 end-1.5 bg-blue text-white rounded-full p-0.5 shadow">
                              <IconCheck className="size-3" />
                            </div>
                          )}
                        </div>
                        <span
                          dir="ltr"
                          className="text-[10px] font-mono text-muted truncate block w-full px-0.5"
                          title={item.name}
                        >
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-line px-6 py-3.5 bg-bg/50">
              <span className="text-[11px] text-muted">
                {filteredLibrary.length} تصویر موجود
              </span>
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                className="rounded-xl border border-line bg-panel px-4 py-1.5 text-xs font-bold text-text hover:bg-bg transition-colors"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
