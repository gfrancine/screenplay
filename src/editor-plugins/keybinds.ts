import { toggleMark } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { createDualDialogue, schema } from "../editor";

export const markupKeysPlugin = keymap({
  "Mod-b": toggleMark(schema.marks.strong),
  "Mod-u": toggleMark(schema.marks.u),
  "Mod-i": toggleMark(schema.marks.em),
});

export const dualDialogueKeysPlugin = keymap({
  "Mod-Alt-u": createDualDialogue,
});
