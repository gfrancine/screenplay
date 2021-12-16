import { setBlockType } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { schema } from "./schema";

const nodeCommandsMap = {
  character: setBlockType(schema.nodes.dialogue),
  parenthetical: setBlockType(schema.nodes.dialogue),
  dialogue: setBlockType(schema.nodes.character),
};

const setAction = setBlockType(schema.nodes.action);

export const enterPlugin = keymap({
  Enter(state, _dispatch, view) {
    if (!state.selection.empty) return false;

    const from = state.selection.from;
    let hasHandled = false;

    state.doc.nodesBetween(from, from, (node) => {
      if (hasHandled) return;
      const command = nodeCommandsMap[node.type.name];
      if (!command) return;

      // if node is blank, turn it back to an action
      if (node.content.size < 1 && setAction(view.state, view.dispatch)) {
        hasHandled = true;
        return;
      }

      hasHandled = command(view.state, view.dispatch);
    });

    return hasHandled;
  },
});
