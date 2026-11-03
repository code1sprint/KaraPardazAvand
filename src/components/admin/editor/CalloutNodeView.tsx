"use client";

import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { cn } from "@/lib/cn";
import {
  IconInfo,
  IconAlertTriangle,
  IconCheckCircle,
  IconLightbulb,
  IconLayers,
  IconTrash,
} from "./EditorIcons";

export function CalloutNodeView({
  node,
  updateAttributes,
  deleteNode,
  editor,
  getPos,
}: NodeViewProps) {
  const type = (node.attrs.type as "note" | "warning" | "success" | "tip") || "note";

  const typeConfig = {
    note: {
      label: "نکته (Note)",
      badgeBg: "bg-blue/15 text-blue border-blue/30",
      borderColor: "border-blue/30 bg-blue/[0.03]",
      icon: <IconInfo className="size-3.5" />,
    },
    warning: {
      label: "هشدار (Warning)",
      badgeBg: "bg-orange/15 text-orange border-orange/30",
      borderColor: "border-orange/30 bg-orange/[0.04]",
      icon: <IconAlertTriangle className="size-3.5 text-orange" />,
    },
    success: {
      label: "موفقیت (Success)",
      badgeBg: "bg-ok/15 text-ok border-ok/30",
      borderColor: "border-ok/30 bg-ok/[0.03]",
      icon: <IconCheckCircle className="size-3.5 text-ok" />,
    },
    tip: {
      label: "راهنما (Tip)",
      badgeBg: "bg-amber/15 text-amber border-amber/30",
      borderColor: "border-amber/30 bg-amber/[0.04]",
      icon: <IconLightbulb className="size-3.5 text-amber" />,
    },
  };

  const current = typeConfig[type] || typeConfig.note;

  const handleAddNestedCallout = () => {
    if (typeof getPos !== "function") return;
    const pos = getPos();
    if (typeof pos !== "number") return;
    // Insert a child callout at the end of this callout node
    const endPos = pos + node.nodeSize - 1;
    editor
      .chain()
      .focus()
      .insertContentAt(endPos, {
        type: "callout",
        attrs: { type: type === "note" ? "tip" : "note" },
        content: [{ type: "paragraph", content: [{ type: "text", text: "متن کادر تو در تو..." }] }],
      })
      .run();
  };

  return (
    <NodeViewWrapper
      className={cn(
        "my-4 rounded-2xl border p-3.5 transition-all relative group",
        current.borderColor,
      )}
      data-callout-type={type}
    >
      {/* Callout Header Controls */}
      <div
        contentEditable={false}
        className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-2 mb-2 select-none text-xs"
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[11px] font-bold",
              current.badgeBg,
            )}
          >
            <span>{current.icon}</span>
            <span>{current.label}</span>
          </span>

          <select
            value={type}
            onChange={(e) => updateAttributes({ type: e.target.value })}
            className="rounded-lg border border-line bg-panel px-2 py-0.5 text-[11px] font-bold text-text focus:border-blue focus:outline-none cursor-pointer"
          >
            <option value="note">نکته (Note) - آبی</option>
            <option value="warning">هشدار (Warning) - نارنجی</option>
            <option value="success">موفقیت (Success) - سبز</option>
            <option value="tip">راهنما (Tip) - کهربایی</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={handleAddNestedCallout}
            className="inline-flex items-center gap-1 rounded-lg border border-line bg-panel px-2 py-0.5 text-[11px] font-bold text-muted hover:text-blue hover:border-blue transition-colors"
            title="ایجاد کادر جدید داخل این کادر"
          >
            <IconLayers className="size-3" />
            <span>کادر تو در تو</span>
          </button>
          <button
            type="button"
            onClick={deleteNode}
            className="rounded-lg border border-line bg-panel p-1 text-[11px] font-bold text-muted hover:text-red-500 hover:border-red-300 transition-colors"
            title="حذف این کادر"
          >
            <IconTrash className="size-3" />
          </button>
        </div>
      </div>

      {/* Nested / Child Content Area */}
      <NodeViewContent className="callout-body min-h-[2rem] focus:outline-none" />
    </NodeViewWrapper>
  );
}
