import { keymap } from "prosemirror-keymap";
import { TextSelection } from "prosemirror-state";

// fix pressing arrow up at the beginning of
// a scene heading not behaving as expected

export const sceneArrowUpPlugin = keymap({
  ArrowUp(state, _dispatch, view) {
    const { from } = state.selection;
    if (!state.selection.empty) return false;
    let hasHandled = false;

    state.doc.nodesBetween(from, from, (node) => {
      if (node.type.name === "scene") {
        if (view.state.selection.$anchor.parentOffset > 0) return;
        const pos = view.state.tr.doc.resolve(view.state.selection.from - 2);
        view.dispatch(view.state.tr.setSelection(new TextSelection(pos, pos)));
        hasHandled = true;
        return hasHandled;
      }
    });

    return hasHandled;
  },
});
