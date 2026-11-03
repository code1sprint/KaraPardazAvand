"use client";

import type { Editor } from "@tiptap/react";
import { cn } from "@/lib/cn";

interface TiptapToolbarProps {
  editor: Editor | null;
  locale: "fa" | "en";
}

export function TiptapToolbar({ editor, locale }: TiptapToolbarProps) {
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

  const insertZwnj = () => {
    editor.chain().focus().insertContent("\u200c").run();
  };

  const btnClass = (isActive: boolean) =>
    cn(
      "px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors border",
      isActive
        ? "bg-blue/15 text-blue border-blue/40 font-bold"
        : "text-muted hover:text-text hover:bg-bg/60 border-transparent",
    );

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

      {/* Link */}
      <button
        type="button"
        onClick={setLink}
        className={btnClass(editor.isActive("link"))}
        title="افزودن / ویرایش لینک"
      >
        🔗 لینک
      </button>

      {/* Persian ZWNJ Button (especially in fa locale) */}
      {locale === "fa" && (
        <button
          type="button"
          onClick={insertZwnj}
          className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-orange/30 bg-orange/10 text-orange hover:bg-orange/20 transition-colors"
          title="درج نیم‌فاصله (میانبر: Shift+Space یا Ctrl+Shift+2)"
        >
          نیم‌فاصله [‌]
        </button>
      )}

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
