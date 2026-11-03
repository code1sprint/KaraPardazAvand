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
        parseHTML: (element) => element.getAttribute("data-callout-type") || "note",
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
