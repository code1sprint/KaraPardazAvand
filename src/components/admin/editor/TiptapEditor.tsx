"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import { ZwnjExtension } from "./zwnj-extension";
import { TiptapToolbar } from "./TiptapToolbar";
import { useEffect } from "react";
import { cn } from "@/lib/cn";

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  contentJson?: Record<string, any>;
  contentHtml?: string;
  locale?: "fa" | "en";
  placeholder?: string;
  onChange: (json: Record<string, any>, html: string) => void;
}

export function TiptapEditor({
  contentJson,
  contentHtml,
  locale = "fa",
  placeholder = "متن کامل مقاله خود را اینجا وارد کنید...",
  onChange,
}: TiptapEditorProps) {
  const initialContent =
    contentJson && Object.keys(contentJson).length > 0 && contentJson.type === "doc"
      ? contentJson
      : contentHtml || "<p></p>";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Replaced by CodeBlockLowlight
        heading: {
          levels: [2, 3],
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          dir: "ltr",
          class:
            "rounded-xl bg-win-bg text-win-text border border-win-line p-4 font-mono text-xs overflow-x-auto my-4 text-left",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue underline decoration-blue/40 hover:decoration-blue font-bold",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      ZwnjExtension,
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-slate max-w-none focus:outline-none min-h-[360px] p-5 text-text",
          locale === "fa" ? "font-vazirmatn text-start" : "text-start",
          "leading-relaxed",
        ),
        dir: locale === "fa" ? "rtl" : "ltr",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON(), editor.getHTML());
    },
  });

  // Keep editor content synchronized if contentJson changes externally
  useEffect(() => {
    if (!editor) return;
    if (contentJson && Object.keys(contentJson).length > 0 && contentJson.type === "doc") {
      const currentJson = JSON.stringify(editor.getJSON());
      const nextJson = JSON.stringify(contentJson);
      if (currentJson !== nextJson) {
        editor.commands.setContent(contentJson);
      }
    }
  }, [contentJson, editor]);

  return (
    <div className="rounded-2xl border border-line bg-panel shadow-sm overflow-hidden focus-within:border-blue transition-colors">
      <TiptapToolbar editor={editor} locale={locale} />
      <div className="bg-panel min-h-[360px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
