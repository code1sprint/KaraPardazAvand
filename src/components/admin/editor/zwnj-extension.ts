import { Extension } from "@tiptap/core";

export const ZwnjExtension = Extension.create({
  name: "zwnj",

  addKeyboardShortcuts() {
    return {
      "Shift-Space": () => {
        return this.editor.commands.insertContent("\u200c");
      },
      "Mod-Shift-2": () => {
        return this.editor.commands.insertContent("\u200c");
      },
    };
  },
});
