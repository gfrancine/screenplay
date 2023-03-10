// implementation for .fountain files
// https://fountain.io/syntax

import { Fountain } from "fountain.ts";
import {
  JSONDoc,
  JSONDualDialogue,
  JSONDualDialogueFlatBlockNode,
  JSONTextMark,
  JSONFlatBlockNode,
  JSONTextNode,
} from "../types";

// serialize

function textNodeToFountain(textNode: JSONTextNode) {
  let { text } = textNode;
  textNode.marks?.forEach((mark) => {
    switch (mark.type) {
      case "em": {
        text = "*" + text + "*";
        break;
      }
      case "strong": {
        text = "**" + text + "**";
        break;
      }
      case "u": {
        text = "_" + text + "_";
        break;
      }
    }
  });

  return text;
}

function flatBlockToFountain(
  block: JSONFlatBlockNode,
  opts?: {
    isDualDialogue?: boolean;
  }
) {
  let text = block.content
    ? block.content.map(textNodeToFountain).join("")
    : "";

  switch (block.type) {
    case "scene": {
      text = "." + text.toUpperCase();
      if (block.attrs.number.length > 0) {
        text += " #" + block.attrs.number + "#";
      }
      text = "\n\n" + text;
      break;
    }
    case "character":
    case "characterInDual": {
      const matches = text.match(/([^()]+)(\([^()\n]*\))?/);
      if (matches) {
        const character = matches[1];
        const paren = matches[2] || "";
        text = "\n\n@" + character.toUpperCase() + paren;
      } else {
        text = "\n\n@" + text.toUpperCase();
      }
      if (opts?.isDualDialogue) text += " ^";
      break;
    }
    case "transition": {
      text = "\n\n> " + text;
      break;
    }
    case "centered": {
      text = "\n\n>" + text + "<";
      break;
    }
    case "synopsis": {
      text = "\n\n= " + text;
      break;
    }
    case "parenthetical":
    case "dialogue":
    case "parentheticalInDual":
    case "dialogueInDual": {
      text = "\n" + text;
      break;
    }
    case "action": {
      text = "\n\n" + text;
      break;
    }
  }

  return text;
}

export function docToFountain(doc: JSONDoc) {
  let str = "";

  doc.content.forEach((block) => {
    if (block.type === "dualDialogue") {
      block = block as JSONDualDialogue;
      str +=
        block.content[0].content
          .map((node) => flatBlockToFountain(node))
          .join("") +
        block.content[1].content
          .map((node) => flatBlockToFountain(node, { isDualDialogue: true }))
          .join("");
    } else {
      str += flatBlockToFountain(block);
    }
  });

  return str.trim();
}

// deserialize

function contentsFromHtmlString(html: string) {
  const contents: JSONTextNode[] = [];

  if (html.length === 0) return contents;

  new DOMParser()
    .parseFromString(html, "text/html")
    .body.childNodes.forEach((node) => {
      if (node.nodeType === 1) {
        const marks: JSONTextMark[] = [];
        const el = node as HTMLElement;

        if (el.classList.contains("bold"))
          marks.push({
            type: "strong",
          });

        if (el.classList.contains("italic"))
          marks.push({
            type: "em",
          });

        if (el.classList.contains("underline"))
          marks.push({
            type: "u",
          });

        if (node.textContent.length > 0) {
          contents.push({
            type: "text",
            text: node.textContent,
            marks,
          });
        }
      } else if (node.nodeType === 3) {
        if (node.textContent.length > 0) {
          contents.push({
            type: "text",
            text: node.textContent,
          });
        }
      }
    });
  return contents;
}

export function docFromFountain(source: string) {
  const tokens = new Fountain().parse(source, true).tokens;

  const doc: JSONDoc = {
    type: "doc",
    content: [],
  };

  let currentDualDialogue: JSONDualDialogue | null = null;
  const dualDialogueEmptyContent = [];

  const dualTypeMap: Record<string, JSONDualDialogueFlatBlockNode["type"]> = {
    dialogue: "dialogueInDual",
    character: "characterInDual",
    parenthetical: "parentheticalInDual",
  };

  tokens.forEach((token) => {
    switch (token.type) {
      case "action":
      case "transition":
      case "centered":
      case "synopsis": {
        doc.content.push({
          type: token.type,
          content: contentsFromHtmlString(token.text || ""),
        });
        break;
      }
      case "scene_heading": {
        doc.content.push({
          type: "scene",
          attrs: {
            number: token.scene_number || "",
          },
          content: contentsFromHtmlString(token.text || ""),
        });
        break;
      }
      case "dual_dialogue_begin": {
        currentDualDialogue = {
          type: "dualDialogue",
          content: [
            {
              type: "dualDialogueCol",
              content: dualDialogueEmptyContent,
            },
            {
              type: "dualDialogueCol",
              content: dualDialogueEmptyContent,
            },
          ],
        };
        break;
      }
      case "dual_dialogue_end": {
        if (currentDualDialogue) doc.content.push(currentDualDialogue);
        currentDualDialogue = null;
        break;
      }
      case "dialogue":
      case "character":
      case "parenthetical": {
        if (currentDualDialogue) {
          const node: JSONDualDialogueFlatBlockNode = {
            type: dualTypeMap[token.type],
            content: contentsFromHtmlString(token.text || ""),
          };

          const firstCol = currentDualDialogue.content[0],
            secondCol = currentDualDialogue.content[1];

          if (token.type === "character") {
            const colContents = [node];
            if (firstCol.content === dualDialogueEmptyContent) {
              firstCol.content = colContents;
            } else if (secondCol.content === dualDialogueEmptyContent) {
              secondCol.content = colContents;
            }
          } else if (firstCol.content !== dualDialogueEmptyContent) {
            if (
              secondCol.content.some(
                (value) => value.type === "characterInDual"
              )
            ) {
              secondCol.content.push(node);
            } else {
              firstCol.content.push(node);
            }
          }
        } else {
          doc.content.push({
            type: token.type,
            content: contentsFromHtmlString(token.text),
          });
        }
        break;
      }
    }
  });

  return doc;
}
