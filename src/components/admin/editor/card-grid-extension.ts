import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CardGridNodeView } from "./CardGridNodeView";
import { CardItemNodeView } from "./CardItemNodeView";

export type CardGridLayout = "grid" | "bento";
export type CardItemSpan = 2 | 3 | 4 | 6; // 6-column base grid (2 = 1/3, 3 = 1/2, 4 = 2/3, 6 = full)
export type CardItemVariant = "white" | "highlight" | "soft";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    cardGrid: {
      insertCardGrid: (options?: {
        layout?: CardGridLayout;
        columns?: 2 | 3 | 4;
        count?: number;
      }) => ReturnType;
      insertBentoGrid: (preset?: "feature" | "balanced" | "triplet") => ReturnType;
    };
    cardItem: {
      setCardSpan: (span: CardItemSpan) => ReturnType;
      setCardVariant: (variant: CardItemVariant) => ReturnType;
    };
  }
}

export const CardItemExtension = Node.create({
  name: "cardItem",
  group: "block",
  content: "block+",
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      span: {
        default: 2,
        parseHTML: (el) => {
          const spanAttr = el.getAttribute("data-span");
          if (spanAttr) {
            const parsed = parseInt(spanAttr, 10);
            if ([2, 3, 4, 6].includes(parsed)) return parsed;
          }
          if (el.classList.contains("md:col-span-4")) return 4;
          if (el.classList.contains("md:col-span-3")) return 3;
          if (el.classList.contains("md:col-span-6")) return 6;
          return 2;
        },
        renderHTML: (attrs) => ({
          "data-span": attrs.span || 2,
        }),
      },
      variant: {
        default: "white",
        parseHTML: (el) => {
          const v = el.getAttribute("data-variant");
          if (v && ["white", "highlight", "soft"].includes(v)) return v;
          return "white";
        },
        renderHTML: (attrs) => ({
          "data-variant": attrs.variant || "white",
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-card-item]",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const span = (node.attrs.span as CardItemSpan) || 2;
    const variant = (node.attrs.variant as CardItemVariant) || "white";

    let spanClass = "col-span-1";
    if (span === 3) spanClass += " md:col-span-3";
    else if (span === 4) spanClass += " md:col-span-4";
    else if (span === 6) spanClass += " md:col-span-6";
    else spanClass += " md:col-span-2";

    let variantClass = "border-line bg-panel shadow-sm";
    if (variant === "highlight") {
      variantClass = "border-blue/50 bg-panel shadow-md ring-1 ring-blue/20";
    } else if (variant === "soft") {
      variantClass = "border-blue/20 bg-blue/[0.04]";
    }

    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: `rounded-2xl border p-6 transition-all ${spanClass} ${variantClass}`,
        "data-card-item": "",
        "data-span": String(span),
        "data-variant": variant,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setCardSpan:
        (span) =>
        ({ commands }) => {
          return commands.updateAttributes("cardItem", { span });
        },
      setCardVariant:
        (variant) =>
        ({ commands }) => {
          return commands.updateAttributes("cardItem", { variant });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CardItemNodeView);
  },
});

export const CardGridExtension = Node.create({
  name: "cardGrid",
  group: "block",
  content: "cardItem+",
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      layout: {
        default: "grid",
        parseHTML: (el) => {
          const l = el.getAttribute("data-layout");
          return l === "bento" ? "bento" : "grid";
        },
        renderHTML: (attrs) => ({
          "data-layout": attrs.layout || "grid",
        }),
      },
      columns: {
        default: 3,
        parseHTML: (el) => {
          const cols = el.getAttribute("data-columns");
          if (cols === "2") return 2;
          if (cols === "4") return 4;
          return 3;
        },
        renderHTML: (attrs) => ({
          "data-columns": String(attrs.columns || 3),
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-card-grid]",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const layout = (node.attrs.layout as CardGridLayout) || "grid";
    const cols = (node.attrs.columns as number) || 3;

    let gridClass = "not-prose grid gap-6 my-6 ";
    if (layout === "bento") {
      gridClass += "grid-cols-1 md:grid-cols-6";
    } else if (cols === 2) {
      gridClass += "grid-cols-1 md:grid-cols-2";
    } else if (cols === 4) {
      gridClass += "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    } else {
      gridClass += "grid-cols-1 md:grid-cols-3";
    }

    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: gridClass,
        "data-card-grid": "",
        "data-layout": layout,
        "data-columns": String(cols),
      }),
      0,
    ];
  },

  addCommands() {
    return {
      insertCardGrid:
        (options = {}) =>
        ({ chain }) => {
          const layout = options.layout || "grid";
          const columns = options.columns || 3;
          const count = options.count || columns;

          const defaultCards = Array.from({ length: count }, (_, i) => ({
            type: "cardItem",
            attrs: {
              span: 2,
              variant: "white",
            },
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: `عنوان کارت ${i + 1}`,
                  },
                ],
              },
              {
                type: "paragraph",
                content: [{ type: "text", text: "توضیحات و متن داخل این کارت..." }],
              },
            ],
          }));

          return chain()
            .insertContent({
              type: "cardGrid",
              attrs: { layout, columns },
              content: defaultCards,
            })
            .run();
        },

      insertBentoGrid:
        (preset = "feature") =>
        ({ chain }) => {
          let cards: Array<{ span: CardItemSpan; title: string; desc: string; variant?: CardItemVariant }> = [];

          if (preset === "feature") {
            // Asymmetrical Bento: 1 large card (span 4), 1 medium card (span 2), 3 small cards (span 2 each)
            cards = [
              { span: 4, title: "ویژگی اصلی و شاخص سیستم (کارت بزرگ ۲/۳)", desc: "توضیحات جامع درباره دستاورد کلیدی، مزیت استراتژیک یا قابلیت‌های اصلی راهکار با فضای دید بیشتر.", variant: "highlight" },
              { span: 2, title: "شاخص عددی یا متغیر سریع (۱/۳)", desc: "نرخ دسترسی ۹۹.۹٪ یا کاهش زمان پاسخ‌دهی.", variant: "white" },
              { span: 2, title: "ماژول یکپارچه‌سازی (۱/۳)", desc: "اتصال مستقیم به سامانه‌های مالی و VoIP.", variant: "white" },
              { span: 2, title: "امنیت داده‌ها (۱/۳)", desc: "حاکمیت کامل داده بر بستر سرورهای خصوصی.", variant: "white" },
              { span: 2, title: "پشتیبانی و SLA (۱/۳)", desc: "پایش ۲۴/۷ و قرارداد خدمات با تضمین کیفیت.", variant: "white" },
            ];
          } else if (preset === "balanced") {
            // Balanced Bento: 2 equal cards (span 3 each)
            cards = [
              { span: 3, title: "بخش اول: معماری داده و فرایند (۱/۲)", desc: "طراحی مدل داده تمیز، بدون افزونگی و متناسب با فرایند سازمان.", variant: "white" },
              { span: 3, title: "بخش دوم: رابط کاربری و عملکرد (۱/۲)", desc: "میز کار چابک با سرعت بالا و دسترسی بهینه کارشناسان.", variant: "white" },
            ];
          } else {
            // Triplet: 3 equal cards (span 2 each)
            cards = [
              { span: 2, title: "مزیت اول (۱/۳)", desc: "توضیح کوتاه و شفاف درباره مزیت اول.", variant: "white" },
              { span: 2, title: "مزیت دوم (۱/۳)", desc: "توضیح کوتاه و شفاف درباره مزیت دوم.", variant: "white" },
              { span: 2, title: "مزیت سوم (۱/۳)", desc: "توضیح کوتاه و شفاف درباره مزیت سوم.", variant: "white" },
            ];
          }

          const bentoContent = cards.map((c) => ({
            type: "cardItem",
            attrs: {
              span: c.span,
              variant: c.variant || "white",
            },
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: c.title,
                  },
                ],
              },
              {
                type: "paragraph",
                content: [{ type: "text", text: c.desc }],
              },
            ],
          }));

          return chain()
            .insertContent({
              type: "cardGrid",
              attrs: { layout: "bento", columns: 6 },
              content: bentoContent,
            })
            .run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CardGridNodeView);
  },
});
