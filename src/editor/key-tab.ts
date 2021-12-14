import { schema } from "./schema";
import { setBlockType } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";

const nodeCommandsMap = {
  // action > character > centered > transition > scene >
  action: setBlockType(schema.nodes.character),
  character: setBlockType(schema.nodes.centered),
  centered: setBlockType(schema.nodes.transition),
  transition: setBlockType(schema.nodes.scene),
  scene: setBlockType(schema.nodes.action),

  // dialog > parenthetical >
  dialogue: setBlockType(schema.nodes.parenthetical),
  parenthetical: setBlockType(schema.nodes.dialogue),
};

export const tabPlugin = keymap({
  Tab(state, dispatch) {
    const { from } = state.selection;
    if (!state.selection.empty) return false;
    let hasHandled = false;

    state.doc.nodesBetween(from, from, (node) => {
      const command = nodeCommandsMap[node.type.name];
      if (!command) return;
      hasHandled = command(state, dispatch);
    });

    return hasHandled;
  },
});
