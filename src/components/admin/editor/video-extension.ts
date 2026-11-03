import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { VideoNodeView } from "./VideoNodeView";

export interface VideoAttributes {
  src: string;
  title?: string;
  poster?: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      insertVideo: (attributes: VideoAttributes) => ReturnType;
    };
  }
}

export const VideoExtension = Node.create({
  name: "video",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: {
        default: "",
        parseHTML: (el) => el.getAttribute("data-video-src") || el.getAttribute("src") || "",
        renderHTML: (attrs) => ({ "data-video-src": attrs.src }),
      },
      title: {
        default: "",
        parseHTML: (el) => el.getAttribute("data-video-title") || "",
        renderHTML: (attrs) => ({ "data-video-title": attrs.title }),
      },
      poster: {
        default: "",
        parseHTML: (el) => el.getAttribute("data-video-poster") || "",
        renderHTML: (attrs) => ({ "data-video-poster": attrs.poster }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-video-container]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const src = HTMLAttributes["data-video-src"] || "";
    const title = HTMLAttributes["data-video-title"] || "ویدیو";
    const isEmbed = src.includes("youtube.com") || src.includes("youtu.be") || src.includes("aparat.com");

    const getEmbedUrl = (raw: string): string => {
      if (raw.includes("aparat.com/v/")) {
        const parts = raw.split("/v/")[1]?.split("?")[0];
        return parts ? `https://www.aparat.com/video/video/embed/videohash/${parts}/vt/frame` : raw;
      }
      if (raw.includes("youtube.com/watch")) {
        const match = raw.match(/[?&]v=([^&]+)/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : raw;
      }
      if (raw.includes("youtu.be/")) {
        const id = raw.split("youtu.be/")[1]?.split("?")[0];
        return id ? `https://www.youtube.com/embed/${id}` : raw;
      }
      return raw;
    };

    if (isEmbed) {
      return [
        "div",
        mergeAttributes({ "data-video-container": "", class: "my-8 not-prose" }),
        [
          "div",
          { class: "relative aspect-video w-full rounded-2xl overflow-hidden border border-line shadow-sm" },
          [
            "iframe",
            {
              src: getEmbedUrl(src),
              class: "w-full h-full border-0",
              allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
              allowFullScreen: "true",
              title,
            },
          ],
        ],
      ];
    }

    return [
      "div",
      mergeAttributes({ "data-video-container": "", class: "my-8 not-prose" }),
      [
        "video",
        {
          src,
          controls: "true",
          class: "w-full rounded-2xl border border-line shadow-sm aspect-video bg-black/90",
          preload: "metadata",
        },
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoNodeView);
  },

  addCommands() {
    return {
      insertVideo:
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
