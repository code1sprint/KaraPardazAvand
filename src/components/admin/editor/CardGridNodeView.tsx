"use client";

import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { cn } from "@/lib/cn";
import { IconTrash, IconPlus, IconSparkles, IconLayers, IconCards } from "./EditorIcons";

export function CardGridNodeView({
  node,
  updateAttributes,
  deleteNode,
  editor,
  getPos,
}: NodeViewProps) {
  const layout = (node.attrs.layout as "grid" | "bento") || "grid";
  const columns = (node.attrs.columns as number) || 3;

  const handleAddCard = (span: 2 | 3 | 4 | 6 = layout === "bento" ? 2 : 2) => {
    if (typeof getPos !== "function") return;
    const pos = getPos();
    if (typeof pos !== "number") return;

    const endPos = pos + node.nodeSize - 1;
    editor
      .chain()
      .focus()
      .insertContentAt(endPos, {
        type: "cardItem",
        attrs: { span, variant: "white" },
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [{ type: "bold" }],
                text: "عنوان کارت جدید",
              },
            ],
          },
          {
            type: "paragraph",
            content: [{ type: "text", text: "توضیحات و متن داخل این کارت..." }],
          },
        ],
      })
      .run();
  };

  return (
    <NodeViewWrapper className="my-6 rounded-2xl border border-dashed border-blue/30 p-3 bg-blue/[0.02] relative group">
      {/* Grid Controls Header */}
      <div
        contentEditable={false}
        className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-2 mb-3 select-none text-xs"
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Layout Mode Switcher */}
          <div className="flex items-center rounded-lg border border-line bg-panel p-0.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => updateAttributes({ layout: "grid", columns: 3 })}
              className={cn(
                "inline-flex items-center gap-1.5 rounded px-2.5 py-1 transition-all",
                layout === "grid"
                  ? "bg-blue text-white shadow-xs"
                  : "text-muted hover:text-text",
              )}
            >
              <IconCards className="size-3" />
              <span>شبکه‌ای (Grid)</span>
            </button>
            <button
              type="button"
              onClick={() => updateAttributes({ layout: "bento", columns: 6 })}
              className={cn(
                "inline-flex items-center gap-1.5 rounded px-2.5 py-1 transition-all",
                layout === "bento"
                  ? "bg-blue text-white shadow-xs"
                  : "text-muted hover:text-text",
              )}
            >
              <IconLayers className="size-3" />
              <span>بنتو گرید (Bento)</span>
            </button>
          </div>

          {/* Grid Columns Controls (when in grid mode) */}
          {layout === "grid" && (
            <div className="flex items-center rounded-lg border border-line bg-panel p-0.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => updateAttributes({ columns: 2 })}
                className={cn(
                  "rounded px-2 py-0.5 transition-all",
                  columns === 2 ? "bg-navy-2 text-white" : "text-muted hover:text-text",
                )}
              >
                ۲ ستونه
              </button>
              <button
                type="button"
                onClick={() => updateAttributes({ columns: 3 })}
                className={cn(
                  "rounded px-2 py-0.5 transition-all",
                  columns === 3 ? "bg-navy-2 text-white" : "text-muted hover:text-text",
                )}
              >
                ۳ ستونه
              </button>
              <button
                type="button"
                onClick={() => updateAttributes({ columns: 4 })}
                className={cn(
                  "rounded px-2 py-0.5 transition-all",
                  columns === 4 ? "bg-navy-2 text-white" : "text-muted hover:text-text",
                )}
              >
                ۴ ستونه
              </button>
            </div>
          )}

          {/* Bento Mode Hint */}
          {layout === "bento" && (
            <span className="text-[11px] text-muted flex items-center gap-1 bg-panel px-2.5 py-1 rounded-lg border border-line">
              <IconSparkles className="size-3 text-amber" />
              <span>بنتو گرید ۶‌ستونه (سایز هر کارت را از بالای آن تغییر دهید)</span>
            </span>
          )}

          {/* Add Card Button */}
          <button
            type="button"
            onClick={() => handleAddCard(layout === "bento" ? 2 : 2)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-line bg-panel text-text hover:border-blue hover:text-blue transition-all text-[11px] font-bold cursor-pointer"
          >
            <IconPlus className="size-3 text-blue" />
            <span>افزودن کارت</span>
          </button>
        </div>

        <button
          type="button"
          onClick={deleteNode}
          className="text-muted hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-500/10 cursor-pointer"
          title="حذف کل شبکه کارت‌ها"
        >
          <IconTrash className="size-3.5" />
        </button>
      </div>

      {/* Cards Grid Container */}
      <NodeViewContent
        className={cn(
          "grid gap-4 w-full",
          layout === "bento"
            ? "grid-cols-1 md:grid-cols-6"
            : columns === 2
              ? "grid-cols-1 md:grid-cols-2"
              : columns === 4
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                : "grid-cols-1 md:grid-cols-3",
        )}
      />
    </NodeViewWrapper>
  );
}
