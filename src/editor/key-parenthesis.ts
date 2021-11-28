import { schema } from "./schema";
import { setBlockType, toggleMark } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { TextSelection } from "prosemirror-state";

// when within a dialog, automatically start a new parenthetical
// when ( is pressed.

const setParen = setBlockType(schema.nodes.parenthetical);
const setParenDual = setBlockType(schema.nodes.parentheticalInDual);
const toggleCharParen = toggleMark(schema.marks.charParen);

export const parentheticalPlugin = keymap({
  "(": (state, dispatch, view) => {
    const { from } = state.selection;
    if (!state.selection.empty) return false;
    let hasHandled = false;

    state.doc.nodesBetween(from, from, (node) => {
      if (hasHandled) return;
      if (
        node.type.name === "dialogue" || node.type.name === "dialogueInDual"
      ) {
        if (node.content.size < 1) {
          if (node.type.name === "dialogueInDual") {
            setParenDual(state, dispatch);
          } else {
            setParen(state, dispatch);
          }
          view.dispatch(view.state.tr.insertText("()"));
          // move selection to the middle
          const pos = view.state.tr.doc.resolve(view.state.selection.from - 1);
          view.dispatch(
            view.state.tr.setSelection(new TextSelection(pos, pos)),
          );
        } else {
          // is it at the end of the node?
          // todo: https://prosemirror.net/docs/ref/#view.EditorView.endOfTextblock ?
          const resolvedPos = state.tr.doc.resolve(from);
          if (node.content.size !== resolvedPos.parentOffset) return;

          if (node.type.name === "dialogueInDual") {
            view.dispatch(
              state.tr.insert(
                from + 1,
                schema.nodes.parentheticalInDual.create(null, [
                  schema.text("()"),
                ]),
              ),
            );
          } else {
            view.dispatch(
              state.tr.insert(
                from + 1,
                schema.nodes.parenthetical.create(null, [schema.text("()")]),
              ),
            );
          }

          const pos = view.state.tr.doc.resolve(view.state.selection.from + 3);
          view.dispatch(
            view.state.tr.setSelection(new TextSelection(pos, pos)),
          );
        }

        hasHandled = true;
      } else if (
        node.type.name === "character" || node.type.name === "characterInDual"
      ) {
        // is it at the end of the node?
        const resolvedPos = state.tr.doc.resolve(from);
        if (node.content.size !== resolvedPos.parentOffset) return;
        toggleCharParen(state, dispatch);
        view.dispatch(view.state.tr.insertText("()"));
        const pos = view.state.tr.doc.resolve(view.state.selection.from - 1);
        view.dispatch(view.state.tr.setSelection(new TextSelection(pos, pos)));
        hasHandled = true;
      }
    });

    return hasHandled;
  },
});
