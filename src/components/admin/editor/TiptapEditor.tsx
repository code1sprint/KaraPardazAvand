"use client";

import { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import CharacterCount from "@tiptap/extension-character-count";
import { createLowlight, common } from "lowlight";

import { ZwnjExtension } from "./zwnj-extension";
import { CalloutExtension } from "./callout-extension";
import { InlineCtaExtension } from "./cta-extension";
import { VideoExtension } from "./video-extension";
import { CustomImageExtension } from "./image-extension";
import { SlashCommandExtension } from "./slash-command";
import { CodeBlockNodeView } from "./CodeBlockNodeView";
import { TiptapToolbar } from "./TiptapToolbar";
import { IconEraser, IconLightbulb } from "./EditorIcons";
import { MediaModal, type MediaInsertParams } from "./MediaModal";
import { CtaModal, type CtaModalParams } from "./CtaModal";
import { cn } from "@/lib/cn";

const lowlight = createLowlight(common);

const InteractiveCodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockNodeView);
  },
});

interface TiptapEditorProps {
  contentJson?: Record<string, unknown>;
  contentHtml?: string;
  locale?: "fa" | "en";
  placeholder?: string;
  onChange: (json: Record<string, unknown>, html: string) => void;
}

export function TiptapEditor({
  contentJson,
  contentHtml,
  locale = "fa",
  placeholder = "متن مقاله را اینجا بنویسید (برای دستورات سریع / را تایپ کنید)...",
  onChange,
}: TiptapEditorProps) {
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaModalType, setMediaModalType] = useState<"image" | "video">("image");
  const [ctaModalOpen, setCtaModalOpen] = useState(false);
  const [ctaModalParams, setCtaModalParams] = useState<Partial<CtaModalParams> | undefined>(undefined);
  const activeCtaUpdateRef = useRef<((params: CtaModalParams) => void) | null>(null);

  const initialContent =
    contentJson && Object.keys(contentJson).length > 0 && contentJson.type === "doc"
      ? contentJson
      : contentHtml || "<p></p>";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [2, 3],
        },
      }),
      InteractiveCodeBlock.configure({
        lowlight,
        defaultLanguage: "typescript",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue underline decoration-blue/40 hover:decoration-blue font-bold",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "w-full border-collapse my-6 text-sm",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-line bg-bg/80 px-4 py-2.5 font-bold text-start",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-line px-4 py-2.5 text-start",
        },
      }),
      CustomImageExtension.configure({
        inline: false,
      }),
      VideoExtension,
      CharacterCount,
      Placeholder.configure({
        placeholder,
      }),
      ZwnjExtension,
      CalloutExtension,
      InlineCtaExtension,
      SlashCommandExtension,
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-slate max-w-none focus:outline-none min-h-[420px] p-6 text-text",
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

  // Listen for Slash Command media requests
  useEffect(() => {
    const handleSlashMedia = (e: Event) => {
      const customEvent = e as CustomEvent<{ type: "image" | "video" }>;
      if (customEvent.detail?.type) {
        setMediaModalType(customEvent.detail.type);
        setMediaModalOpen(true);
      }
    };

    window.addEventListener("kara-open-media-modal", handleSlashMedia);
    return () => {
      window.removeEventListener("kara-open-media-modal", handleSlashMedia);
    };
  }, []);

  // Listen for Slash Command & toolbar CTA requests and edit events
  useEffect(() => {
    const handleSlashCta = () => {
      activeCtaUpdateRef.current = null;
      setCtaModalParams(undefined);
      setCtaModalOpen(true);
    };

    const handleEditCta = (e: Event) => {
      const customEvent = e as CustomEvent<{
        label: string;
        url: string;
        variant: "primary" | "secondary" | "outline";
        align: "center" | "left" | "right" | "full";
        update: (params: CtaModalParams) => void;
      }>;
      if (customEvent.detail) {
        activeCtaUpdateRef.current = customEvent.detail.update;
        setCtaModalParams({
          label: customEvent.detail.label,
          url: customEvent.detail.url,
          variant: customEvent.detail.variant,
          align: customEvent.detail.align,
        });
        setCtaModalOpen(true);
      }
    };

    window.addEventListener("kara-open-cta-modal", handleSlashCta);
    window.addEventListener("kara-edit-cta-node", handleEditCta);

    return () => {
      window.removeEventListener("kara-open-cta-modal", handleSlashCta);
      window.removeEventListener("kara-edit-cta-node", handleEditCta);
    };
  }, []);

  const handleConfirmCta = (params: CtaModalParams) => {
    if (activeCtaUpdateRef.current) {
      activeCtaUpdateRef.current(params);
      activeCtaUpdateRef.current = null;
    } else if (editor) {
      editor.chain().focus().insertInlineCta(params).run();
    }
  };

  const handleInsertImage = (attrs: MediaInsertParams) => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .setImage({
        src: attrs.src,
        alt: attrs.alt || "",
        title: attrs.title || "",
        width: attrs.width || "100%",
        align: attrs.align || "center",
      })
      .run();
  };

  const handleInsertVideo = (attrs: MediaInsertParams) => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertVideo({
        src: attrs.src,
        title: attrs.title || "ویدیو",
        width: attrs.width || "100%",
        align: attrs.align || "center",
      })
      .run();
  };

  const words = editor?.storage.characterCount?.words() ?? 0;
  const characters = editor?.storage.characterCount?.characters() ?? 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="rounded-2xl border border-line bg-panel shadow-sm overflow-hidden focus-within:border-blue transition-colors relative">
      {/* Floating Bubble Menu on text selection */}
      {editor && (
        <BubbleMenu
          editor={editor}
          className="flex items-center gap-1 bg-panel border border-line shadow-xl rounded-xl p-1 text-xs"
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "px-2 py-1 rounded font-bold transition-colors",
              editor.isActive("bold") ? "bg-blue/15 text-blue" : "text-muted hover:text-text",
            )}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "px-2 py-1 rounded font-semibold transition-colors",
              editor.isActive("italic") ? "bg-blue/15 text-blue" : "text-muted hover:text-text",
            )}
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={cn(
              "px-2 py-1 rounded font-mono text-[11px] transition-colors",
              editor.isActive("code") ? "bg-blue/15 text-blue" : "text-muted hover:text-text",
            )}
          >
            `کد`
          </button>
          {locale === "fa" && (
            <button
              type="button"
              onClick={() => editor.chain().focus().insertContent("\u200c").run()}
              className="px-2 py-1 rounded text-orange bg-orange/10 font-bold hover:bg-orange/20"
            >
              نیم‌فاصله
            </button>
          )}
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            className="px-1.5 py-1 rounded text-muted hover:text-red-500 flex items-center justify-center"
            title="حذف فرمت انتخاب"
          >
            <IconEraser className="size-3.5" />
          </button>
        </BubbleMenu>
      )}

      {/* Main Top Toolbar */}
      <TiptapToolbar
        editor={editor}
        locale={locale}
        onOpenMediaModal={(type) => {
          setMediaModalType(type);
          setMediaModalOpen(true);
        }}
        onOpenCtaModal={() => {
          activeCtaUpdateRef.current = null;
          setCtaModalParams(undefined);
          setCtaModalOpen(true);
        }}
      />

      {/* Editor Surface */}
      <div className="bg-panel min-h-[420px]">
        <EditorContent editor={editor} />
      </div>

      {/* Live Stats Footer */}
      <div className="flex flex-wrap items-center justify-between border-t border-line bg-bg/50 px-4 py-2 text-[11px] font-bold text-muted">
        <div className="flex items-center gap-4 font-mono">
          <span>{words} کلمه</span>
          <span>{characters} نویسه</span>
          <span>~ {readingTime} دقیقه مطالعه</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted">
          <IconLightbulb className="size-3 text-amber shrink-0" />
          <span>
            راهنما: برای منوی سریع <code className="bg-panel px-1 rounded border border-line">/</code>، برای عکس و ویدیو دکمه‌های نوار ابزار، و برای نیم‌فاصله <code className="bg-panel px-1 rounded border border-line">Shift+Space</code> بزنید.
          </span>
        </div>
      </div>

      {/* Dedicated Custom Media Modal (No window.prompt!) */}
      <MediaModal
        key={mediaModalOpen ? `${mediaModalType}-open` : "closed"}
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        defaultType={mediaModalType}
        onInsertImage={handleInsertImage}
        onInsertVideo={handleInsertVideo}
      />

      {/* Dedicated Custom CTA Modal (No window.prompt!) */}
      <CtaModal
        key={
          ctaModalOpen
            ? `${ctaModalParams?.label || ""}-${ctaModalParams?.url || ""}-${ctaModalParams?.variant || ""}-${ctaModalParams?.align || ""}`
            : "cta-closed"
        }
        isOpen={ctaModalOpen}
        onClose={() => {
          setCtaModalOpen(false);
          activeCtaUpdateRef.current = null;
        }}
        onConfirm={handleConfirmCta}
        initialParams={ctaModalParams}
      />
    </div>
  );
}
