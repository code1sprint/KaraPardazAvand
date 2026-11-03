import { Node, mergeAttributes } from "@tiptap/core";

export interface CtaAttributes {
  label: string;
  url: string;
  variant?: "primary" | "secondary";
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
        default: "درخواست مشاوره اختصاصی",
        parseHTML: (el) => el.getAttribute("data-cta-label") || "درخواست مشاوره",
        renderHTML: (attrs) => ({ "data-cta-label": attrs.label }),
      },
      url: {
        default: "/contact",
        parseHTML: (el) => el.getAttribute("data-cta-url") || "/contact",
        renderHTML: (attrs) => ({ "data-cta-url": attrs.url }),
      },
      variant: {
        default: "primary",
        parseHTML: (el) => el.getAttribute("data-cta-variant") || "primary",
        renderHTML: (attrs) => ({ "data-cta-variant": attrs.variant }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-inline-cta]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const isPrimary = HTMLAttributes["data-cta-variant"] === "primary";
    const btnClasses = isPrimary
      ? "inline-flex items-center gap-2 rounded-2xl bg-blue text-white px-6 py-3 font-bold text-sm shadow hover:bg-navy-2 transition-all not-prose"
      : "inline-flex items-center gap-2 rounded-2xl border border-line bg-panel text-text px-6 py-3 font-bold text-sm hover:border-blue transition-all not-prose";

    return [
      "div",
      mergeAttributes(
        {
          "data-inline-cta": "",
          class: "my-8 flex justify-center not-prose",
        },
        HTMLAttributes,
      ),
      [
        "a",
        {
          href: HTMLAttributes["data-cta-url"] || "/contact",
          class: btnClasses,
          target: "_blank",
          rel: "noopener noreferrer",
        },
        HTMLAttributes["data-cta-label"] || "مشاهده جزییات",
      ],
    ];
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
