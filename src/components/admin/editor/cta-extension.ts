import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CtaNodeView } from "./CtaNodeView";

export interface CtaAttributes {
  label: string;
  url: string;
  variant?: "primary" | "secondary" | "outline";
  align?: "center" | "left" | "right" | "full";
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    inlineCta: {
      insertInlineCta: (attributes: CtaAttributes) => ReturnType;
    };
  }
}

export const InlineCtaExtension = Node.create({
  name: "inlineCta",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      label: {
        default: "درخواست جلسه ارزیابی فنی",
        parseHTML: (el) =>
          el.getAttribute("data-cta-label") ||
          el.querySelector("span")?.textContent?.trim() ||
          el.textContent?.trim() ||
          "درخواست مشاوره",
        renderHTML: (attrs) => ({ "data-cta-label": attrs.label }),
      },
      url: {
        default: "/contact",
        parseHTML: (el) =>
          el.getAttribute("data-cta-url") ||
          el.querySelector("a")?.getAttribute("href") ||
          el.getAttribute("href") ||
          "/contact",
        renderHTML: (attrs) => ({ "data-cta-url": attrs.url }),
      },
      variant: {
        default: "primary",
        parseHTML: (el) => (el.getAttribute("data-cta-variant") as CtaAttributes["variant"]) || "primary",
        renderHTML: (attrs) => ({ "data-cta-variant": attrs.variant }),
      },
      align: {
        default: "center",
        parseHTML: (el) => (el.getAttribute("data-cta-align") as CtaAttributes["align"]) || "center",
        renderHTML: (attrs) => ({ "data-cta-align": attrs.align }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-inline-cta]",
      },
      {
        tag: "div[data-cta-box]",
      },
      {
        tag: "a[data-inline-cta]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const label = HTMLAttributes["data-cta-label"] || "درخواست جلسه ارزیابی فنی";
    const url = HTMLAttributes["data-cta-url"] || "/contact";
    const variant = HTMLAttributes["data-cta-variant"] || "primary";
    const align = HTMLAttributes["data-cta-align"] || "center";

    let alignClasses = "justify-center";
    if (align === "right") {
      alignClasses = "justify-start";
    } else if (align === "left") {
      alignClasses = "justify-end";
    } else if (align === "full") {
      alignClasses = "w-full";
    }

    let btnClasses =
      "cta-btn cta-btn-primary inline-flex items-center gap-2 rounded-2xl bg-blue text-on-brand px-6 py-3.5 font-bold text-sm shadow hover:bg-navy-2 transition-all not-prose no-underline";

    if (variant === "secondary") {
      btnClasses =
        "cta-btn cta-btn-secondary inline-flex items-center gap-2 rounded-2xl border border-line bg-panel text-text px-6 py-3.5 font-bold text-sm hover:border-blue hover:text-blue transition-all not-prose no-underline";
    } else if (variant === "outline") {
      btnClasses =
        "cta-btn cta-btn-outline inline-flex items-center gap-2 rounded-2xl border-2 border-blue text-blue bg-transparent px-6 py-3.5 font-bold text-sm hover:bg-blue/10 transition-all not-prose no-underline";
    }

    if (align === "full") {
      btnClasses += " w-full text-center justify-center";
    }

    const spanTextClass =
      variant === "primary"
        ? "text-on-brand font-bold"
        : variant === "secondary"
          ? "text-text font-bold"
          : "text-blue font-bold";

    return [
      "div",
      mergeAttributes({
        "data-inline-cta": "",
        "data-cta-label": label,
        "data-cta-url": url,
        "data-cta-variant": variant,
        "data-cta-align": align,
        class: `my-8 flex items-center ${alignClasses} not-prose`,
      }),
      [
        "a",
        {
          href: url,
          class: btnClasses,
          "data-cta-variant": variant,
          target: url.startsWith("http") ? "_blank" : undefined,
          rel: url.startsWith("http") ? "noopener noreferrer" : undefined,
        },
        [
          "span",
          {
            class: spanTextClass,
          },
          label,
        ],
        [
          "svg",
          {
            class: "size-2.5 text-orange shrink-0",
            viewBox: "0 0 24 24",
            fill: "currentColor",
            "aria-hidden": "true",
          },
          ["polygon", { points: "18,4 6,12 18,20" }],
        ],
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CtaNodeView);
  },

  addCommands() {
    return {
      insertInlineCta:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },
});
