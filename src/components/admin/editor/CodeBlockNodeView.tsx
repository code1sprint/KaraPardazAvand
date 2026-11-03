"use client";

import { useState } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { IconCheck, IconCopy, IconTrash } from "./EditorIcons";

const POPULAR_LANGUAGES = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "bash", label: "Bash / Shell" },
  { value: "json", label: "JSON" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "yaml", label: "YAML" },
  { value: "diff", label: "Git Diff" },
];

export function CodeBlockNodeView({
  node,
  updateAttributes,
  deleteNode,
}: NodeViewProps) {
  const currentLang = (node.attrs.language as string) || "typescript";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = node.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <NodeViewWrapper className="my-6 rounded-2xl border border-win-line bg-win-bg overflow-hidden shadow-md select-none group text-start" dir="ltr">
      {/* Terminal Title Bar */}
      <div
        contentEditable={false}
        className="flex items-center justify-between border-b border-win-line/80 bg-win-deep px-4 py-2.5 text-xs text-win-muted select-none"
      >
        {/* Left: 3 macOS / Window Dots */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#FF5F56] inline-block shadow-sm" />
            <span className="h-3 w-3 rounded-full bg-[#FFBD2E] inline-block shadow-sm" />
            <span className="h-3 w-3 rounded-full bg-[#27C93F] inline-block shadow-sm" />
          </div>
          <span className="ms-2 font-mono text-[11px] text-win-muted font-bold">
            console.code
          </span>
        </div>

        {/* Right: Language Selector & Controls */}
        <div className="flex items-center gap-2">
          <select
            value={currentLang}
            onChange={(e) => updateAttributes({ language: e.target.value })}
            className="rounded-lg border border-win-line bg-win-bg px-2.5 py-1 font-mono text-[11px] text-win-text focus:border-blue focus:outline-none cursor-pointer"
          >
            {POPULAR_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg border border-win-line bg-win-bg px-2 py-1 font-mono text-[11px] text-win-muted hover:text-win-text hover:border-blue transition-colors inline-flex items-center gap-1"
            title="کپی کردن متن کد"
          >
            {copied ? (
              <span className="inline-flex items-center gap-1 text-ok">
                <IconCheck className="size-3" /> Copied
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <IconCopy className="size-3" /> Copy
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={deleteNode}
            className="rounded-lg border border-win-line bg-win-bg p-1 text-[11px] text-win-muted hover:text-red-400 hover:border-red-400 transition-colors flex items-center justify-center"
            title="حذف بلوک کد"
          >
            <IconTrash className="size-3" />
          </button>
        </div>
      </div>

      {/* Code Editor Content */}
      <pre className="p-4 font-mono text-xs text-win-text leading-relaxed overflow-x-auto text-left bg-transparent m-0 focus:outline-none" dir="ltr">
        <NodeViewContent className={`language-${currentLang}`} />
      </pre>
    </NodeViewWrapper>
  );
}
