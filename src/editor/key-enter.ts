import { Command, setBlockType } from "prosemirror-commands";
import { schema } from "./schema";

// Node behavior on enter.

const nodeCommandsMap = {
  character: setBlockType(schema.nodes.dialogue),
  parenthetical: setBlockType(schema.nodes.dialogue),
  dialogue: setBlockType(schema.nodes.character),
};

const setAction = setBlockType(schema.nodes.action);

/** Wraps an existing keymap with Enter implemented and returns a new keymap. */
export function makeEnterHandlerKeymap<T extends { Enter: Command }>(
  keymap: T,
): T {
  const command: Command = (state, dispatch, view) => {
    if (!state.selection.empty) {
      return keymap["Enter"](state, dispatch, view);
    }

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

      hasHandled = keymap["Enter"](state, dispatch, view) &&
        command(view.state, view.dispatch);
    });

    return hasHandled ? hasHandled : keymap["Enter"](state, dispatch, view); // make sure it doesn't evaluate this
  };

  return {
    ...keymap,
    Enter: command,
  };
}
