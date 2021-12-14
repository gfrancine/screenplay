import { Fountain } from "fountain.ts";
import {
  JSONDoc,
  JSONDualDialogue,
  JSONDualDialogueFlatBlockNode,
  JSONTextMark,
  JSONTextNode,
} from "../types";

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
      case "transition": {
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
            number: "",
          },
          content: contentsFromHtmlString(token.text || ""),
        });
        break;
      }
      case "scene_number": {
        const lastNode = doc.content[doc.content.length - 1];
        if (!lastNode || lastNode.type !== "scene") break;
        lastNode.attrs.number = token.text || "";
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

export function titleFromFountain() {}
