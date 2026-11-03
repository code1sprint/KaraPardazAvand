"use client";

import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { cn } from "@/lib/cn";
import {
  IconVideo,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconTrash,
} from "./EditorIcons";

export function VideoNodeView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const src = (node.attrs.src as string) || "";
  const title = (node.attrs.title as string) || "ویدیو";
  const width = (node.attrs.width as string) || "100%";
  const align = (node.attrs.align as "center" | "left" | "right") || "center";

  const isEmbed = src.includes("youtube.com") || src.includes("youtu.be") || src.includes("aparat.com");

  const getEmbedUrl = (raw: string): string => {
    if (raw.includes("aparat.com/v/")) {
      const parts = raw.split("/v/")[1]?.split("?")[0];
      return parts ? `https://www.aparat.com/video/video/embed/videohash/${parts}/vt/frame` : raw;
    }
    if (raw.includes("youtube.com/watch")) {
      const match = raw.match(/[?&]v=([^&]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : raw;
    }
    if (raw.includes("youtu.be/")) {
      const id = raw.split("youtu.be/")[1]?.split("?")[0];
      return id ? `https://www.youtube.com/embed/${id}` : raw;
    }
    return raw;
  };

  const getFloatClasses = () => {
    if (align === "left") {
      return "float-left mr-6 mb-4 clear-left";
    }
    if (align === "right") {
      return "float-right ml-6 mb-4 clear-right";
    }
    return "mx-auto block clear-both my-6";
  };

  return (
    <NodeViewWrapper
      className={cn(
        "rounded-2xl border border-line bg-panel p-3 shadow-md relative group select-none transition-all",
        getFloatClasses(),
      )}
      style={{ width }}
      data-align={align}
      data-width={width}
    >
      {/* Video Control Bar */}
      <div
        contentEditable={false}
        className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2 mb-3 text-xs text-muted"
      >
        <span className="font-bold flex items-center gap-1.5 text-text">
          <IconVideo className="size-4 text-blue shrink-0" />
          <span>{title || "ویدیو"}</span>
        </span>

        {/* Alignment & Width Controls */}
        <div className="flex items-center gap-2">
          {/* Alignment */}
          <div className="flex items-center gap-0.5 bg-bg p-0.5 rounded-lg border border-line text-[11px]">
            <button
              type="button"
              onClick={() => updateAttributes({ align: "left" })}
              className={cn(
                "px-1.5 py-0.5 rounded font-bold transition-colors inline-flex items-center gap-1",
                align === "left" ? "bg-blue/15 text-blue" : "text-muted hover:text-text",
              )}
              title="چپ‌چین با پیچش متن در سمت راست"
            >
              <IconAlignLeft className="size-3" />
              <span>چپ</span>
            </button>
            <button
              type="button"
              onClick={() => updateAttributes({ align: "center" })}
              className={cn(
                "px-1.5 py-0.5 rounded font-bold transition-colors inline-flex items-center gap-1",
                align === "center" ? "bg-blue/15 text-blue" : "text-muted hover:text-text",
              )}
              title="وسط‌چین بدون پیچش متن"
            >
              <IconAlignCenter className="size-3" />
              <span>وسط</span>
            </button>
            <button
              type="button"
              onClick={() => updateAttributes({ align: "right" })}
              className={cn(
                "px-1.5 py-0.5 rounded font-bold transition-colors inline-flex items-center gap-1",
                align === "right" ? "bg-blue/15 text-blue" : "text-muted hover:text-text",
              )}
              title="راست‌چین با پیچش متن در سمت چپ"
            >
              <IconAlignRight className="size-3" />
              <span>راست</span>
            </button>
          </div>

          {/* Width */}
          <div className="flex items-center gap-0.5 bg-bg p-0.5 rounded-lg border border-line text-[11px] font-mono">
            {(["50%", "75%", "100%"] as const).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => updateAttributes({ width: w })}
                className={cn(
                  "px-1.5 py-0.5 rounded transition-colors",
                  width === w ? "bg-panel text-blue font-bold shadow-sm" : "text-muted hover:text-text",
                )}
              >
                {w}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={deleteNode}
            className="rounded-lg border border-line bg-bg p-1 text-xs font-bold text-muted hover:text-red-500 hover:border-red-300 transition-colors flex items-center justify-center"
            title="حذف ویدیو"
          >
            <IconTrash className="size-3" />
          </button>
        </div>
      </div>

      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/90 flex items-center justify-center">
        {isEmbed ? (
          <iframe
            src={getEmbedUrl(src)}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={src}
            controls
            className="w-full h-full object-contain"
            preload="metadata"
          >
            مرورگر شما از برچسب ویدیو پشتیبانی نمی‌کند.
          </video>
        )}
      </div>
    </NodeViewWrapper>
  );
}
