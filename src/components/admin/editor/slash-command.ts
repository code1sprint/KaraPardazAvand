import { Extension } from "@tiptap/core";
import Suggestion, {
  type SuggestionProps,
  type SuggestionKeyDownProps,
} from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import type { Editor, Range } from "@tiptap/core";
import { SlashCommandList, type SlashCommandListRef } from "./SlashCommandList";

export interface CommandItem {
  title: string;
  description: string;
  icon: string;
  command: (params: { editor: Editor; range: Range }) => void;
}

export const SUGGESTION_ITEMS: CommandItem[] = [
  {
    title: "تیتر اصلی (H2)",
    description: "بخش‌بندی اصلی با سایز بزرگ",
    icon: "H2",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    },
  },
  {
    title: "تیتر فرعی (H3)",
    description: "زیربخش‌های مقاله",
    icon: "H3",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    },
  },
  {
    title: "بلوک کد ترمینال LTR",
    description: "کدنویسی فنی با انتخاب زبان و کپی",
    icon: "</>",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: "جدول اطلاعاتی",
    description: "درج جدول ۳ در ۳ برای مقایسه و داده‌ها",
    icon: "▦",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    },
  },
  {
    title: "کادر نکته (Note)",
    description: "کادر رنگی آبی برای توضیحات کلیدی",
    icon: "ℹ",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setCallout({ type: "note" }).run();
    },
  },
  {
    title: "کادر هشدار (Warning)",
    description: "کادر نارنجی برای نکات احتیاطی",
    icon: "⚠",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setCallout({ type: "warning" }).run();
    },
  },
  {
    title: "کادر تو در تو (Nested Container)",
    description: "ایجاد کادر داخل کادر با استایل چندلایه",
    icon: "❐",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
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
        .run();
    },
  },
  {
    title: "تصویر (Image Browser)",
    description: "آپلود و مرور فایل از سیستم یا کتابخانه",
    icon: "🖼",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("kara-open-media-modal", { detail: { type: "image" } }),
        );
      }
    },
  },
  {
    title: "ویدیو (Video Browser & Embed)",
    description: "آپلود فایل ویدیو یا پخش از آپارات / یوتیوب",
    icon: "🎬",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("kara-open-media-modal", { detail: { type: "video" } }),
        );
      }
    },
  },
  {
    title: "فهرست نشانه‌دار",
    description: "لیست ترتیبی با بولت",
    icon: "•",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "فهرست شماره‌دار",
    description: "لیست ترتیبی عددی",
    icon: "۱.",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "نقل‌قول (Quote)",
    description: "برجسته کردن متن یا گفتاورد",
    icon: "❝",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: "خط جداکننده",
    description: "تفکیک بصری افقی بین بخش‌ها",
    icon: "―",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: "دکمه اقدام (CTA)",
    description: "درج دکمه ارتباط یا مشاهده پروژه",
    icon: "🔘",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertInlineCta({
          label: "درخواست ارزیابی فنی",
          url: "/contact",
          variant: "primary",
        })
        .run();
    },
  },
];

export const SlashCommandExtension = Extension.create({
  name: "slashCommand",

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: "/",
        items: ({ query }: { query: string }) => {
          return SUGGESTION_ITEMS.filter(
            (item) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase()),
          );
        },
        render: () => {
          let component: ReactRenderer<SlashCommandListRef> | null = null;
          let popup: HTMLDivElement | null = null;

          const updatePosition = (props: SuggestionProps<CommandItem>) => {
            if (!popup) return;
            const rect = props.clientRect?.();
            if (!rect) return;

            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

            popup.style.position = "absolute";
            popup.style.left = `${rect.left + scrollX}px`;
            popup.style.top = `${rect.bottom + scrollY + 8}px`;
            popup.style.zIndex = "9999";
          };

          return {
            onStart: (props: SuggestionProps<CommandItem>) => {
              popup = document.createElement("div");
              document.body.appendChild(popup);

              component = new ReactRenderer(SlashCommandList, {
                props: {
                  items: props.items,
                  command: (item: CommandItem) => {
                    item.command({ editor: props.editor, range: props.range });
                  },
                },
                editor: props.editor,
              });

              popup.appendChild(component.element);
              updatePosition(props);
            },

            onUpdate: (props: SuggestionProps<CommandItem>) => {
              component?.updateProps({
                items: props.items,
                command: (item: CommandItem) => {
                  item.command({ editor: props.editor, range: props.range });
                },
              });
              updatePosition(props);
            },

            onKeyDown: (props: SuggestionKeyDownProps) => {
              if (props.event.key === "Escape") {
                popup?.remove();
                component?.destroy();
                popup = null;
                component = null;
                return true;
              }
              return component?.ref?.onKeyDown(props) ?? false;
            },

            onExit: () => {
              popup?.remove();
              component?.destroy();
              popup = null;
              component = null;
            },
          };
        },
      }),
    ];
  },
});
