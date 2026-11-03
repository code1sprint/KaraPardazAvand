"use client";

import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";

export function VideoNodeView({ node, deleteNode }: NodeViewProps) {
  const src = (node.attrs.src as string) || "";
  const title = (node.attrs.title as string) || "ویدیو";

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

  return (
    <NodeViewWrapper className="my-6 rounded-2xl border border-line bg-panel p-3 shadow-md relative group select-none">
      <div
        contentEditable={false}
        className="flex items-center justify-between border-b border-line pb-2 mb-3 text-xs text-muted"
      >
        <span className="font-bold flex items-center gap-1.5 text-text">
          <span>🎬</span>
          <span>{title || "پخش‌کننده ویدیو"}</span>
        </span>
        <button
          type="button"
          onClick={deleteNode}
          className="rounded-lg border border-line bg-bg px-2 py-0.5 text-xs font-bold text-muted hover:text-red-500 hover:border-red-300 transition-colors"
          title="حذف ویدیو"
        >
          × حذف
        </button>
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
