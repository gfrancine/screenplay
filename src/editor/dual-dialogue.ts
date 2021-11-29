import { Command } from "prosemirror-commands";
import { TextSelection } from "prosemirror-state";
import { schema } from "./schema";

const createCol = () =>
  schema.nodes.dualDialogueCol.createAndFill(null, [
    schema.nodes.characterInDual.create(null, schema.text(".")),
  ]);

export const insertDualDialogue: Command = (state, dispatch, view) => {
  if (!state.selection.empty) return false;
  const tr = state.tr.insert(
    state.selection.from,
    [
      schema.nodes.dualDialogue.create(null, [
        createCol(),
        createCol(),
      ]),
      schema.nodes.action.createAndFill(),
    ],
  )
    .scrollIntoView();
  dispatch(tr);

  const pos = view.state.tr.doc.resolve(view.state.selection.from + 1);
  view.dispatch(view.state.tr.setSelection(new TextSelection(pos, pos)));
  return true;
};
