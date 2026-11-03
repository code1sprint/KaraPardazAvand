"use client";

import type { Editor } from "@tiptap/react";
import { cn } from "@/lib/cn";

interface TiptapToolbarProps {
  editor: Editor | null;
  locale: "fa" | "en";
  onOpenMediaModal?: (type: "image" | "video") => void;
  onOpenCtaModal?: () => void;
}

export function TiptapToolbar({
  editor,
  locale,
  onOpenMediaModal,
  onOpenCtaModal,
}: TiptapToolbarProps) {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("آدرس لینک را وارد کنید (URL):", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleOpenImage = () => {
    onOpenMediaModal?.("image");
  };

  const handleOpenVideo = () => {
    onOpenMediaModal?.("video");
  };

  const insertCta = () => {
    if (onOpenCtaModal) {
      onOpenCtaModal();
    } else {
      editor
        .chain()
        .focus()
        .insertInlineCta({
          label: "درخواست جلسه ارزیابی فنی",
          url: "/contact",
          variant: "primary",
          align: "center",
        })
        .run();
    }
  };

  const insertZwnj = () => {
    editor.chain().focus().insertContent("\u200c").run();
  };

  const btnClass = (isActive: boolean) =>
    cn(
      "px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors border select-none",
      isActive
        ? "bg-blue/15 text-blue border-blue/40 font-bold"
        : "text-muted hover:text-text hover:bg-bg/60 border-transparent",
    );

  const isTableActive = editor.isActive("table");

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-line bg-panel p-2 rounded-t-2xl">
      {/* Headings */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive("heading", { level: 2 }))}
        title="سرتیتر اصلی (H2)"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btnClass(editor.isActive("heading", { level: 3 }))}
        title="سرتیتر فرعی (H3)"
      >
        H3
      </button>

      <div className="h-4 w-px bg-line mx-1" />

      {/* Formatting */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive("bold"))}
        title="پررنگ (Bold)"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive("italic"))}
        title="مورب (Italic)"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={btnClass(editor.isActive("code"))}
        title="کد درون‌متنی (Inline Code)"
      >
        `کد`
      </button>

      <div className="h-4 w-px bg-line mx-1" />

      {/* Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive("bulletList"))}
        title="لیست نشانه‌دار"
      >
        • فهرست
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive("orderedList"))}
        title="لیست شماره‌دار"
      >
        ۱. لیست
      </button>

      <div className="h-4 w-px bg-line mx-1" />

      {/* Quote & Code Block */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive("blockquote"))}
        title="نقل‌قول (Quote)"
      >
        ❝ نقل‌قول
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={btnClass(editor.isActive("codeBlock"))}
        title="بلوک کد (LTR Code Block)"
      >
        &lt;/&gt; کد LTR
      </button>

      <div className="h-4 w-px bg-line mx-1" />

      {/* Callouts & Nested Containers */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCallout({ type: "note" }).run()}
        className={btnClass(editor.isActive("callout", { type: "note" }))}
        title="کادر نکته (Note)"
      >
        ℹ نکته
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCallout({ type: "warning" }).run()}
        className={btnClass(editor.isActive("callout", { type: "warning" }))}
        title="کادر هشدار (Warning)"
      >
        ⚠ هشدار
      </button>
      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertContent({
              type: "callout",
              attrs: { type: "tip" },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "متن کادر تو در تو..." }],
                },
              ],
            })
            .run()
        }
        className={btnClass(false)}
        title="ایجاد کادر تو در تو (Nested Container)"
      >
        + کادر تو در تو
      </button>

      <div className="h-4 w-px bg-line mx-1" />

      {/* Table Controls */}
      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
        className={btnClass(isTableActive)}
        title="درج جدول ۳×۳"
      >
        ▦ جدول
      </button>

      {isTableActive && (
        <div className="flex items-center gap-1 bg-bg p-0.5 rounded-lg border border-line text-[11px]">
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="px-1.5 py-0.5 hover:bg-panel rounded text-muted hover:text-text"
            title="افزودن ستون"
          >
            + ستون
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="px-1.5 py-0.5 hover:bg-panel rounded text-red-500"
            title="حذف ستون"
          >
            - ستون
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="px-1.5 py-0.5 hover:bg-panel rounded text-muted hover:text-text"
            title="افزودن سطر"
          >
            + سطر
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="px-1.5 py-0.5 hover:bg-panel rounded text-red-500"
            title="حذف سطر"
          >
            - سطر
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="px-1.5 py-0.5 hover:bg-panel rounded text-red-500 font-bold"
            title="حذف کل جدول"
          >
            × جدول
          </button>
        </div>
      )}

      <div className="h-4 w-px bg-line mx-1" />

      {/* Media & Interactive */}
      <button
        type="button"
        onClick={setLink}
        className={btnClass(editor.isActive("link"))}
        title="افزودن / ویرایش لینک"
      >
        🔗 لینک
      </button>
      <button
        type="button"
        onClick={handleOpenImage}
        className={btnClass(editor.isActive("image"))}
        title="درج و مرور تصویر (از سیستم یا کتابخانه)"
      >
        🖼 عکس
      </button>
      <button
        type="button"
        onClick={handleOpenVideo}
        className={btnClass(editor.isActive("video"))}
        title="درج و مرور ویدیو (از سیستم یا لینک آپارات / یوتیوب)"
      >
        🎬 ویدیو
      </button>
      <button
        type="button"
        onClick={insertCta}
        className={btnClass(editor.isActive("inlineCta"))}
        title="درج دکمه اقدام (CTA Button)"
      >
        🔘 دکمه CTA
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={btnClass(false)}
        title="خط جداکننده (Divider)"
      >
        ― خط
      </button>

      {/* Persian ZWNJ Button */}
      {locale === "fa" && (
        <button
          type="button"
          onClick={insertZwnj}
          className="px-2 py-1 text-xs font-semibold rounded-lg border border-orange/30 bg-orange/10 text-orange hover:bg-orange/20 transition-colors"
          title="درج نیم‌فاصله (میانبر: Shift+Space یا Ctrl+Shift+2)"
        >
          نیم‌فاصله [‌]
        </button>
      )}

      {/* Clear format */}
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        className="px-2 py-1 text-xs text-muted hover:text-red-500 transition-colors"
        title="پاکسازی تمام قالب‌بندی‌ها"
      >
        🧹 پاکسازی
      </button>

      {/* Undo / Redo */}
      <div className="ms-auto flex items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="px-2 py-1 text-xs text-muted hover:text-text disabled:opacity-30 disabled:pointer-events-none rounded"
          title="بازگشت (Undo)"
        >
          ↶
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="px-2 py-1 text-xs text-muted hover:text-text disabled:opacity-30 disabled:pointer-events-none rounded"
          title="انجام مجدد (Redo)"
        >
          ↷
        </button>
      </div>
    </div>
  );
}
