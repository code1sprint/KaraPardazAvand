"use client";

import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { cn } from "@/lib/cn";
import {
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconTrash,
} from "./EditorIcons";

export function ImageNodeView({
  node,
  updateAttributes,
  deleteNode,
  selected,
}: NodeViewProps) {
  const src = (node.attrs.src as string) || "";
  const alt = (node.attrs.alt as string) || "";
  const title = (node.attrs.title as string) || "";
  const width = (node.attrs.width as string) || "100%";
  const align = (node.attrs.align as "center" | "left" | "right") || "center";

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
        "relative group transition-all my-2 select-none",
        getFloatClasses(),
      )}
      style={{ width }}
      data-align={align}
      data-width={width}
    >
      {/* Floating Control Toolbar on Hover or Selection */}
      <div
        contentEditable={false}
        className={cn(
          "absolute -top-10 z-30 flex items-center gap-1 bg-panel border border-line shadow-xl rounded-xl p-1 text-xs select-none transition-all whitespace-nowrap",
          align === "left" && width !== "100%"
            ? "left-0"
            : align === "right" && width !== "100%"
              ? "right-0"
              : "left-1/2 -translate-x-1/2",
          selected ? "opacity-100 visible" : "opacity-0 group-hover:opacity-100 group-hover:visible",
        )}
      >
        {/* Alignment */}
        <div className="flex items-center gap-0.5 bg-bg p-0.5 rounded-lg border border-line">
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

        <div className="h-3 w-px bg-line mx-0.5" />

        {/* Width Presets */}
        <div className="flex items-center gap-0.5 bg-bg p-0.5 rounded-lg border border-line text-[11px] font-mono">
          {(["25%", "50%", "75%", "100%"] as const).map((w) => (
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
          className="rounded-lg border border-line bg-bg p-1 text-xs text-muted hover:text-red-500 hover:border-red-300 flex items-center justify-center"
          title="حذف تصویر"
        >
          <IconTrash className="size-3" />
        </button>
      </div>

      {/* Image Render */}
      <figure className="m-0 overflow-hidden rounded-2xl border border-line bg-panel shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          title={title}
          className={cn(
            "w-full h-auto block rounded-2xl transition-all",
            selected ? "ring-2 ring-blue ring-offset-2" : "",
          )}
        />
        {title && (
          <figcaption
            contentEditable={false}
            className="p-2 text-center text-xs text-muted font-medium bg-bg/50 border-t border-line"
          >
            {title}
          </figcaption>
        )}
      </figure>
    </NodeViewWrapper>
  );
}
