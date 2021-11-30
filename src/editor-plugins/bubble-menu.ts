import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

class BubbleMenuPlugin {
  bubble: HTMLDivElement;

  constructor(view: EditorView) {
    this.bubble = document.createElement("div");
    this.bubble.className = "x-bubble-menu";
    view.dom.parentNode.appendChild(this.bubble);

    this.update(view, null);
  }

  update(view: EditorView, lastState: EditorState) {
    const state = view.state;
    if (
      lastState &&
      lastState.doc.eq(state.doc) &&
      lastState.selection.eq(state.selection)
    ) {
      return;
    }

    if (state.selection.empty) {
      this.bubble.classList.add("hidden");
      return;
    }

    this.bubble.classList.remove("hidden");

    const { from, to } = state.selection;
    const start = view.coordsAtPos(from),
      end = view.coordsAtPos(to);
    const box = this.bubble.offsetParent.getBoundingClientRect();
    // Find a center-ish x position from the selection endpoints (when
    // crossing lines, end may be more to the left)
    const left = Math.max((start.left + end.left) / 2, start.left + 3);
    this.bubble.style.left = left - box.left + "px";
    this.bubble.style.bottom = box.bottom - start.top + "px";
  }

  destroy() {
    this.bubble.remove();
  }
}

export const bubbleMenuPlugin = new Plugin({
  view(editorView) {
    return new BubbleMenuPlugin(editorView);
  },
});
