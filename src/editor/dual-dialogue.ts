import { Command } from "prosemirror-commands";
import { Fragment, Node } from "prosemirror-model";
import { EditorState, TextSelection, Transaction } from "prosemirror-state";
import { schema } from "./schema";

const createCol = ({
  character,
  dialogueNodes = [],
}: {
  character?: Fragment;
  dialogueNodes?: Node[];
}) =>
  schema.nodes.dualDialogueCol.createAndFill(null, [
    schema.nodes.characterInDual.create(null, character || schema.text(".")),
    ...dialogueNodes,
  ]);

export function intoDualDialogue(state: EditorState) {
  const { from, to } = state.selection;
  let start = from,
    end = to;

  let character1: Fragment;
  let c1DialogueNodes: Node[] = [];
  let character2: Fragment;
  let c2DialogueNodes: Node[] = [];

  const toDualNode = (node: Node) => {
    if (node.type.name === "dialogue") {
      return schema.nodes.dialogueInDual.create(null, node.content);
    } else if (node.type.name === "parenthetical") {
      return schema.nodes.parentheticalInDual.create(null, node.content);
    }
  };

  state.doc.nodesBetween(from, to, (node, nodeStart) => {
    if (nodeStart < start) start = nodeStart;
    const nodeEnd = nodeStart + node.nodeSize;
    if (nodeEnd > end) end = nodeEnd;
    if (node.type.name === "character") {
      if (!character1) {
        character1 = node.content;
      } else if (!character2) {
        character2 = node.content;
      }
    } else if (
      node.type.name === "dialogue" ||
      node.type.name === "parenthetical"
    ) {
      if (character2) {
        c2DialogueNodes.push(toDualNode(node));
      } else {
        c1DialogueNodes.push(toDualNode(node));
      }
    }
  });

  return state.tr
    .replaceWith(start, end, [
      schema.nodes.dualDialogue.create(null, [
        createCol({
          character: character1,
          dialogueNodes: c1DialogueNodes,
        }),
        createCol({
          character: character2,
          dialogueNodes: c2DialogueNodes,
        }),
      ]),
      schema.nodes.action.createAndFill(),
    ])
    .scrollIntoView();
}

export function fromDualDialogue(state: EditorState) {
  let tr: Transaction | null = null;

  const fromDualNode = (node: Node) => {
    if (node.type.name === "dialogueInDual") {
      return schema.nodes.dialogue.create(null, node.content);
    } else if (node.type.name === "parentheticalInDual") {
      return schema.nodes.parenthetical.create(null, node.content);
    } else if (node.type.name === "characterInDual") {
      return schema.nodes.character.create(null, node.content);
    }
  };

  const { from, to } = state.selection;
  state.doc.nodesBetween(from, to, (node, start) => {
    if (tr) return;
    if (node.type.name !== "dualDialogue") return;
    const end = start + node.nodeSize;
    const flatNodes: Node[] = [];

    node.content.forEach((col) =>
      col.forEach((dialogueNode) => {
        const flatNode = fromDualNode(dialogueNode);
        if (flatNode) flatNodes.push(flatNode);
      })
    );

    tr = state.tr.replaceWith(start, end, flatNodes);
  });

  return tr;
}

export const toggleDualDialogue: Command = (state, dispatch, view) => {
  const convertFromDualTr = fromDualDialogue(state);

  if (convertFromDualTr) {
    dispatch(convertFromDualTr);
    return true;
  }

  dispatch(intoDualDialogue(state));
  return true;
};
