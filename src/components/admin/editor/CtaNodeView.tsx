"use client";

import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { cn } from "@/lib/cn";
import { TriMarker } from "@/components/ui/TriMarker";
import {
  IconAlignRight,
  IconAlignCenter,
  IconAlignLeft,
  IconFullWidth,
  IconPencil,
  IconTrash,
} from "./EditorIcons";

export function CtaNodeView({
  node,
  updateAttributes,
  deleteNode,
  selected,
}: NodeViewProps) {
  const label = (node.attrs.label as string) || "درخواست جلسه ارزیابی فنی";
  const url = (node.attrs.url as string) || "/contact";
  const variant = (node.attrs.variant as "primary" | "secondary" | "outline") || "primary";
  const align = (node.attrs.align as "center" | "left" | "right" | "full") || "center";

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("kara-edit-cta-node", {
          detail: {
            label,
            url,
            variant,
            align,
            update: (params: { label: string; url: string; variant: string; align: string }) => {
              updateAttributes(params);
            },
          },
        }),
      );
    }
  };

  return (
    <NodeViewWrapper
      className="relative group my-8 select-none not-prose"
      data-inline-cta=""
      data-cta-label={label}
      data-cta-url={url}
      data-cta-variant={variant}
      data-cta-align={align}
    >
      {/* Floating Control Toolbar on Hover or Selection */}
      <div
        contentEditable={false}
        className={cn(
          "absolute -top-11 z-30 flex items-center gap-1.5 bg-panel border border-line shadow-xl rounded-xl p-1 text-xs select-none transition-all whitespace-nowrap",
          align === "left"
            ? "left-0"
            : align === "right"
              ? "right-0"
              : "left-1/2 -translate-x-1/2",
          selected ? "opacity-100 visible" : "opacity-0 group-hover:opacity-100 group-hover:visible",
        )}
      >
        {/* Layout Alignment Toggles */}
        <div className="flex items-center gap-0.5 bg-bg p-0.5 rounded-lg border border-line">
          {[
            { id: "right", label: "راست", icon: <IconAlignRight className="size-3" /> },
            { id: "center", label: "وسط", icon: <IconAlignCenter className="size-3" /> },
            { id: "left", label: "چپ", icon: <IconAlignLeft className="size-3" /> },
            { id: "full", label: "کامل", icon: <IconFullWidth className="size-3" /> },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => updateAttributes({ align: opt.id })}
              className={cn(
                "px-1.5 py-0.5 rounded font-bold transition-colors text-[11px] inline-flex items-center gap-1",
                align === opt.id ? "bg-blue/15 text-blue" : "text-muted hover:text-text",
              )}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Variant Toggles */}
        <div className="flex items-center gap-0.5 bg-bg p-0.5 rounded-lg border border-line text-[11px]">
          {[
            { id: "primary", label: "اصلی" },
            { id: "secondary", label: "روشن" },
            { id: "outline", label: "خطی" },
          ].map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => updateAttributes({ variant: v.id })}
              className={cn(
                "px-1.5 py-0.5 rounded transition-colors",
                variant === v.id
                  ? "bg-panel text-blue font-bold shadow-sm"
                  : "text-muted hover:text-text",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Edit Button */}
        <button
          type="button"
          onClick={handleEditClick}
          className="rounded-lg border border-line bg-bg px-2 py-0.5 text-xs font-bold text-muted hover:text-blue hover:border-blue/40 transition-colors flex items-center gap-1"
          title="ویرایش عنوان یا لینک دکمه"
        >
          <IconPencil className="size-3" />
          <span>ویرایش</span>
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={deleteNode}
          className="rounded-lg border border-line bg-bg p-1 text-xs font-bold text-muted hover:text-red-500 hover:border-red-300 transition-colors flex items-center justify-center"
          title="حذف دکمه"
        >
          <IconTrash className="size-3" />
        </button>
      </div>

      {/* Button Render Surface */}
      <div
        className={cn(
          "w-full flex items-center",
          align === "center" && "justify-center",
          align === "right" && "justify-start",
          align === "left" && "justify-end",
          align === "full" && "w-full",
        )}
      >
        <div
          onClick={(e) => {
            e.preventDefault();
          }}
          className={cn(
            "inline-flex items-center gap-2.5 rounded-2xl px-6 py-3.5 font-bold text-sm shadow-sm cursor-pointer transition-all select-none no-underline",
            align === "full" && "w-full justify-center text-center",
            variant === "primary" && "bg-blue text-on-brand shadow hover:bg-navy-2",
            variant === "secondary" && "bg-panel text-text border border-line hover:border-blue hover:text-blue",
            variant === "outline" && "border-2 border-blue text-blue bg-transparent hover:bg-blue/10",
          )}
        >
          <span
            className={cn(
              variant === "primary" && "text-on-brand font-bold",
              variant === "secondary" && "text-text font-bold",
              variant === "outline" && "text-blue font-bold",
            )}
          >
            {label}
          </span>
          {/* Orange triangle from the logo as small signature marker */}
          <TriMarker className="-rotate-90 size-2" />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
