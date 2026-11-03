import { mergeAttributes } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageNodeView } from "./ImageNodeView";

export interface CustomImageAttributes {
  src: string;
  alt?: string;
  title?: string;
  width?: string;
  align?: "center" | "left" | "right";
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customImage: {
      setImage: (options: CustomImageAttributes) => ReturnType;
    };
  }
}

export const CustomImageExtension = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (element) => element.getAttribute("data-width") || element.style.width || "100%",
        renderHTML: (attributes) => ({
          "data-width": attributes.width,
        }),
      },
      align: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align") || "center",
        renderHTML: (attributes) => ({
          "data-align": attributes.align,
        }),
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { src, alt, title, width = "100%", align = "center" } = HTMLAttributes;

    let floatClasses = "mx-auto block clear-both my-6";
    if (align === "left") {
      floatClasses = "float-left mr-6 mb-4 clear-left";
    } else if (align === "right") {
      floatClasses = "float-right ml-6 mb-4 clear-right";
    }

    if (title) {
      return [
        "figure",
        mergeAttributes({
          "data-align": align,
          "data-width": width,
          class: `${floatClasses} overflow-hidden rounded-2xl border border-line bg-panel shadow-sm not-prose`,
          style: `width: ${width}; max-width: 100%;`,
        }),
        [
          "img",
          {
            src,
            alt: alt || "",
            class: "w-full h-auto block rounded-t-2xl",
          },
        ],
        [
          "figcaption",
          {
            class: "p-2 text-center text-xs text-muted font-medium bg-bg/50 border-t border-line",
          },
          title,
        ],
      ];
    }

    return [
      "figure",
      mergeAttributes({
        "data-align": align,
        "data-width": width,
        class: `${floatClasses} overflow-hidden rounded-2xl border border-line bg-panel shadow-sm not-prose`,
        style: `width: ${width}; max-width: 100%;`,
      }),
      [
        "img",
        {
          src,
          alt: alt || "",
          class: "w-full h-auto block rounded-2xl",
        },
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
