import { Schema } from "prosemirror-model";

// forked from prosemirror-schema-basic
// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js

export const schema = new Schema({
  nodes: {
    doc: {
      content: "block+",
    },
    action: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p.x-action" }],
      toDOM() {
        return ["p", { class: "x-action" }, 0];
      },
    },
    character: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p.x-character" }],
      toDOM() {
        return ["p", { class: "x-character" }, 0];
      },
    },
    dialogue: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p.x-dialogue" }],
      toDOM() {
        return ["p", { class: "x-dialogue" }, 0];
      },
    },
    characterInDual: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p.x-character.dual" }],
      toDOM() {
        return ["p", { class: "x-character dual" }, 0];
      },
    },
    dialogueInDual: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p.x-dialogue.dual" }],
      toDOM() {
        return ["p", { class: "x-dialogue dual" }, 0];
      },
    },
    parentheticalInDual: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p.x-parenthetical.dual" }],
      toDOM() {
        return ["p", { class: "x-parenthetical dual" }, 0];
      },
    },
    dualDialogueCol: {
      content: "characterInDual (dialogueInDual | parentheticalInDual)*",
      group: "block",
      parseDOM: [{ tag: "div.x-dual-dialogue-col" }],
      toDOM() {
        return ["div", { class: "x-dual-dialogue-col" }, 0];
      },
    },

    dualDialogue: {
      content: "dualDialogueCol{2}",
      group: "block",
      parseDOM: [{ tag: "div.x-dual-dialogue" }],
      toDOM() {
        return ["div", { class: "x-dual-dialogue" }, 0];
      },
    },
    scene: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p.x-scene" }],
      toDOM() {
        return ["p", { class: "x-scene" }, 0];
      },
    },
    parenthetical: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p.x-parenthetical" }],
      toDOM() {
        return ["p", { class: "x-parenthetical" }, 0];
      },
    },
    transition: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p.x-transition" }],
      toDOM() {
        return ["p", { class: "x-transition" }, 0];
      },
    },
    text: {
      group: "inline",
    },
    hardBreak: {
      inline: true,
      group: "inline",
      selectable: false,
      parseDOM: [{ tag: "br" }],
      toDOM() {
        return ["br"];
      },
    },
  },
  marks: {
    charParen: {
      parseDOM: [{ tag: "span.x-char-paren" }],
      inclusive: false,
      spanning: false,
      toDOM() {
        return ["span", { class: "x-char-paren" }, 0];
      },
    },
    u: {
      parseDOM: [{ tag: "u" }],
      toDOM() {
        return ["u", 0];
      },
    },
    em: {
      parseDOM: [{ tag: "i" }, { tag: "em" }],
      toDOM() {
        return ["em", 0];
      },
    },
    strong: {
      parseDOM: [{ tag: "strong" }],
      toDOM() {
        return ["strong", 0];
      },
    },
  },
});
