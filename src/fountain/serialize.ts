import {
  JSONDoc,
  JSONDualDialogue,
  JSONFlatBlockNode,
  JSONSceneNode,
  JSONTextNode,
  JSONTitlePage,
} from "../types";

// https://fountain.io/syntax

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
      text = text.toUpperCase();
      if (!text.startsWith("INT") && !text.startsWith("EXT")) {
        text = "." + text;
      }
      const sceneBlock = block as JSONSceneNode;
      if (sceneBlock.attrs.number.length > 0) {
        text += " #" + sceneBlock.attrs.number + "#";
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
        text = "\n\n" + character.toUpperCase() + paren;
      } else {
        text = "\n\n" + text.toUpperCase();
      }
      if (opts?.isDualDialogue) text += " ^";
      break;
    }
    case "transition": {
      if (!text.endsWith("TO:")) text = "> " + text;
      text = "\n\n" + text;
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

export function titleToFountain(_titlePage: JSONTitlePage): string {
  throw new Error("unimplemented");
}
