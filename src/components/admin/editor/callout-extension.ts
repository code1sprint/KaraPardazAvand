import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CalloutNodeView } from "./CalloutNodeView";

export type CalloutType = "note" | "warning" | "success" | "tip";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attributes?: { type: CalloutType }) => ReturnType;
      toggleCallout: (attributes?: { type: CalloutType }) => ReturnType;
    };
  }
}

export const CalloutExtension = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      type: {
        default: "note",
        parseHTML: (element) => {
          const typeAttr = element.getAttribute("data-callout-type");
          if (typeAttr && ["note", "warning", "success", "tip"].includes(typeAttr)) {
            return typeAttr;
          }
          if (element.classList.contains("callout-warning")) return "warning";
          if (element.classList.contains("callout-success")) return "success";
          if (element.classList.contains("callout-tip")) return "tip";
          if (element.classList.contains("callout-note")) return "note";
          return "note";
        },
        renderHTML: (attributes) => ({
          "data-callout-type": attributes.type,
          class: `callout callout-${attributes.type} rounded-2xl border p-4 my-4 leading-relaxed`,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-callout-type]",
      },
      {
        tag: "div.callout",
      },
      {
        tag: "div[data-card-box]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutNodeView);
  },

  addCommands() {
    return {
      setCallout:
        (attributes = { type: "note" }) =>
        ({ commands }) => {
          return commands.wrapIn(this.name, attributes);
        },
      toggleCallout:
        (attributes = { type: "note" }) =>
        ({ commands }) => {
          return commands.toggleWrap(this.name, attributes);
        },
    };
  },
});
