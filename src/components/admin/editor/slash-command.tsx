import type { ReactNode } from "react";
import { Extension } from "@tiptap/core";
import Suggestion, {
  type SuggestionProps,
  type SuggestionKeyDownProps,
} from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import type { Editor, Range } from "@tiptap/core";
import { SlashCommandList, type SlashCommandListRef } from "./SlashCommandList";
import {
  IconCodeBlock,
  IconTable,
  IconInfo,
  IconAlertTriangle,
  IconLayers,
  IconCards,
  IconImage,
  IconVideo,
  IconBulletList,
  IconOrderedList,
  IconQuote,
  IconMinus,
  IconCta,
  IconLink,
} from "./EditorIcons";

export interface CommandItem {
  title: string;
  description: string;
  icon: ReactNode;
  command: (params: { editor: Editor; range: Range }) => void;
}

export const SUGGESTION_ITEMS: CommandItem[] = [
  {
    title: "تیتر اصلی (H2)",
    description: "بخش‌بندی اصلی با سایز بزرگ",
    icon: <span className="font-bold text-xs">H2</span>,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    },
  },
  {
    title: "تیتر فرعی (H3)",
    description: "زیربخش‌های مقاله",
    icon: <span className="font-bold text-xs">H3</span>,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    },
  },
  {
    title: "بلوک کد ترمینال LTR",
    description: "کدنویسی فنی با انتخاب زبان و کپی",
    icon: <IconCodeBlock className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: "جدول اطلاعاتی",
    description: "درج جدول ۳ در ۳ برای مقایسه و داده‌ها",
    icon: <IconTable className="size-4" />,
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
    icon: <IconInfo className="size-4 text-blue" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setCallout({ type: "note" }).run();
    },
  },
  {
    title: "کادر هشدار (Warning)",
    description: "کادر نارنجی برای نکات احتیاطی",
    icon: <IconAlertTriangle className="size-4 text-orange" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setCallout({ type: "warning" }).run();
    },
  },
  {
    title: "کادر تو در تو (Nested Container)",
    description: "ایجاد کادر داخل کادر با استایل چندلایه",
    icon: <IconLayers className="size-4" />,
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
    title: "شبکه کارت‌ها (Card Grid)",
    description: "چیدمان کارت‌های سفید در ۲، ۳ یا ۴ ستون یکنواخت",
    icon: <IconCards className="size-4 text-blue" />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertCardGrid({ layout: "grid", columns: 3 })
        .run();
    },
  },
  {
    title: "بنتو گرید (Bento Grid)",
    description: "چیدمان مدرن بنتو با اندازه‌های متنوع (۱/۳، ۱/۲، ۲/۳ و تمام‌عرض)",
    icon: <IconLayers className="size-4 text-amber" />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertBentoGrid("feature")
        .run();
    },
  },
  {
    title: "تصویر (Image Browser)",
    description: "آپلود و مرور فایل از سیستم یا کتابخانه",
    icon: <IconImage className="size-4" />,
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
    icon: <IconVideo className="size-4" />,
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
    icon: <IconBulletList className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "فهرست شماره‌دار",
    description: "لیست ترتیبی عددی",
    icon: <IconOrderedList className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "نقل‌قول (Quote)",
    description: "برجسته کردن متن یا گفتاورد",
    icon: <IconQuote className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: "پیوند و لینک (Link)",
    description: "درج یا ویرایش لینک به همراه کاتالوگ صفحات سایت",
    icon: <IconLink className="size-4 text-blue" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("kara-open-link-modal"));
      }
    },
  },
  {
    title: "خط جداکننده",
    description: "تفکیک بصری افقی بین بخش‌ها",
    icon: <IconMinus className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: "دکمه اقدام (CTA)",
    description: "درج دکمه ارتباط، رزرو جلسه یا لینک به خدمات و اسلاگ‌ها",
    icon: <IconCta className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("kara-open-cta-modal"));
      }
    },
  },
];

export const SlashCommandExtension = Extension.create({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: CommandItem;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) => {
          return SUGGESTION_ITEMS.filter((item) => {
            if (!query) return true;
            return (
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase())
            );
          });
        },
        render: () => {
          let component: ReactRenderer<SlashCommandListRef> | null = null;
          let popupEl: HTMLDivElement | null = null;

          return {
            onStart: (props: SuggestionProps<CommandItem>) => {
              component = new ReactRenderer(SlashCommandList, {
                props,
                editor: props.editor,
              });

              if (!props.clientRect) {
                return;
              }

              popupEl = document.createElement("div");
              popupEl.style.position = "absolute";
              popupEl.style.zIndex = "9999";
              document.body.appendChild(popupEl);

              const rect = props.clientRect();
              if (rect && popupEl) {
                popupEl.style.top = `${rect.bottom + window.scrollY + 8}px`;
                popupEl.style.left = `${rect.left + window.scrollX}px`;
              }

              if (popupEl && component.element) {
                popupEl.appendChild(component.element);
              }
            },

            onUpdate(props: SuggestionProps<CommandItem>) {
              component?.updateProps(props);

              if (!props.clientRect || !popupEl) {
                return;
              }

              const rect = props.clientRect();
              if (rect) {
                popupEl.style.top = `${rect.bottom + window.scrollY + 8}px`;
                popupEl.style.left = `${rect.left + window.scrollX}px`;
              }
            },

            onKeyDown(props: SuggestionKeyDownProps) {
              if (props.event.key === "Escape") {
                if (popupEl && popupEl.parentNode) {
                  popupEl.parentNode.removeChild(popupEl);
                }
                component?.destroy();
                return true;
              }

              return component?.ref?.onKeyDown(props) ?? false;
            },

            onExit() {
              if (popupEl && popupEl.parentNode) {
                popupEl.parentNode.removeChild(popupEl);
              }
              component?.destroy();
            },
          };
        },
      }),
    ];
  },
});
