import { JsonFlatBlockNode, JsonState, JsonTextNode } from "../types";

// https://fountain.io/syntax

function textNodeToFountain(textNode: JsonTextNode) {
  let { text } = textNode;
  textNode.marks.forEach((mark) => {
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

function flatBlockToFountain(block: JsonFlatBlockNode, opts?: {
  isDualDialogue?: boolean;
}) {
  let text = block.content.map(textNodeToFountain).join("");

  switch (block.type) {
    case "scene": {
      text = text.toUpperCase();
      if (!text.startsWith("INT") || !text.startsWith("EXT")) {
        text = "." + text;
      }
      text = "\n\n" + text;
      break;
    }
    case "character":
    case "characterInDual": {
      // todo: match group 1 and 2 ([^()]+)(\([^()\n]*\))?
      text = "\n\n" + text.toUpperCase();
      if (opts?.isDualDialogue) text += "\n"
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
    case "dialogueInDual":
    case "action": {
      text = "\n" + text;
      break;
    }
  }

  return text;
}

export function stateToFountain(state: JsonState) {
  let str = "";

  state.doc.content.forEach((block) => {
    if (block.type === "dualDialogue") {
      // parse the second column with the isDualDialogue option
    } else {
      str += flatBlockToFountain(block);
    }
  });

  return str;
}

export function stateFromFountain() {
}

export function titleToFountain() {
}

export function titleFromFountain() {
}
