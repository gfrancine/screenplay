import { EditorState } from "prosemirror-state";

export function isBetween(nodeType: string, state: EditorState) {
  if (!state.selection.empty) return false;
  const { from } = state.selection;
  let found = false;
  state.doc.nodesBetween(from, from, (node) => {
    if (found) return true;
    if (node.type.name === nodeType) found = true;
  });
  return found;
}
