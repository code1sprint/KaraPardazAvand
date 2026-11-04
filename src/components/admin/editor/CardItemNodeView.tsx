"use client";

import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { cn } from "@/lib/cn";
import { IconClose } from "./EditorIcons";

export function CardItemNodeView({
  node,
  updateAttributes,
  deleteNode,
}: NodeViewProps) {
  const span = ((node.attrs.span as number) || 2) as 2 | 3 | 4 | 6;
  const variant = ((node.attrs.variant as string) || "white") as
    | "white"
    | "highlight"
    | "soft";

  const spanClasses: Record<2 | 3 | 4 | 6, string> = {
    2: "col-span-1 md:col-span-2",
    3: "col-span-1 md:col-span-3",
    4: "col-span-1 md:col-span-4",
    6: "col-span-1 md:col-span-6",
  };

  const variantClasses: Record<"white" | "highlight" | "soft", string> = {
    white: "border-line bg-panel shadow-sm",
    highlight: "border-blue/50 bg-panel shadow-md ring-1 ring-blue/20",
    soft: "border-blue/25 bg-blue/[0.03]",
  };

  return (
    <NodeViewWrapper
      className={cn(
        "rounded-2xl border p-4 transition-all flex flex-col min-h-[140px] relative group hover:border-blue/40",
        spanClasses[span] || spanClasses[2],
        variantClasses[variant] || variantClasses.white,
      )}
    >
      {/* Individual Card Control Bar */}
      <div
        contentEditable={false}
        className="flex items-center justify-between gap-1 pb-2 mb-2 border-b border-line/40 select-none text-[10px]"
      >
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Span / Width Selector */}
          <div className="flex items-center rounded border border-line bg-panel p-0.5 font-bold">
            <span className="px-1 text-[9px] text-muted">عرض:</span>
            <button
              type="button"
              onClick={() => updateAttributes({ span: 2 })}
              className={cn(
                "px-1.5 py-0.5 rounded transition-all",
                span === 2 ? "bg-blue text-white" : "text-muted hover:text-text",
              )}
              title="یک‌سوم عرض (اسپن ۲ از ۶)"
            >
              ۱/۳
            </button>
            <button
              type="button"
              onClick={() => updateAttributes({ span: 3 })}
              className={cn(
                "px-1.5 py-0.5 rounded transition-all",
                span === 3 ? "bg-blue text-white" : "text-muted hover:text-text",
              )}
              title="نصف عرض (اسپن ۳ از ۶)"
            >
              ۱/۲
            </button>
            <button
              type="button"
              onClick={() => updateAttributes({ span: 4 })}
              className={cn(
                "px-1.5 py-0.5 rounded transition-all",
                span === 4 ? "bg-blue text-white" : "text-muted hover:text-text",
              )}
              title="دوسوم عرض (اسپن ۴ از ۶ - کارت پهن شاخص)"
            >
              ۲/۳
            </button>
            <button
              type="button"
              onClick={() => updateAttributes({ span: 6 })}
              className={cn(
                "px-1.5 py-0.5 rounded transition-all",
                span === 6 ? "bg-blue text-white" : "text-muted hover:text-text",
              )}
              title="تمام‌عرض (اسپن ۶ از ۶)"
            >
              کامل
            </button>
          </div>

          {/* Card Style Variant */}
          <div className="flex items-center rounded border border-line bg-panel p-0.5 font-bold">
            <button
              type="button"
              onClick={() => updateAttributes({ variant: "white" })}
              className={cn(
                "px-1.5 py-0.5 rounded transition-all",
                variant === "white" ? "bg-navy text-white" : "text-muted hover:text-text",
              )}
              title="سفید کلاسیک"
            >
              سفید
            </button>
            <button
              type="button"
              onClick={() => updateAttributes({ variant: "highlight" })}
              className={cn(
                "px-1.5 py-0.5 rounded transition-all",
                variant === "highlight" ? "bg-blue text-white" : "text-muted hover:text-text",
              )}
              title="کارت برجسته با خط آبی"
            >
              برجسته
            </button>
            <button
              type="button"
              onClick={() => updateAttributes({ variant: "soft" })}
              className={cn(
                "px-1.5 py-0.5 rounded transition-all",
                variant === "soft" ? "bg-sky text-white" : "text-muted hover:text-text",
              )}
              title="پس‌زمینه ملایم"
            >
              سافت
            </button>
          </div>
        </div>

        {/* Delete Card Button */}
        <button
          type="button"
          onClick={deleteNode}
          className="size-5 rounded bg-line/60 hover:bg-red-500 hover:text-white text-muted flex items-center justify-center transition-colors cursor-pointer shrink-0"
          title="حذف این کارت"
        >
          <IconClose className="size-2.5" />
        </button>
      </div>

      <NodeViewContent className="card-item-content flex-1 focus:outline-none [&>p:first-child]:font-bold [&>p:first-child]:text-text [&>p:first-child]:mb-1.5 [&>p:first-child]:text-[15px] [&>p:last-child]:text-muted [&>p:last-child]:text-sm [&>p:last-child]:leading-relaxed [&>p:last-child]:m-0" />
    </NodeViewWrapper>
  );
}
