import { inputRules, InputRule } from "prosemirror-inputrules";
import { EditorState } from "prosemirror-state";
import { NodeType } from "prosemirror-model";
import { schema } from "../editor";
import { isBetween } from "../internal-util/prosemirror";

// copied from prosemirror-commands setBlockType
function setBlockTypeTr(
  state: EditorState,
  nodeType: NodeType,
  attrs?: Record<string, unknown>
) {
  const { from, to } = state.selection;
  let applicable = false;

  state.doc.nodesBetween(from, to, (node, pos) => {
    if (applicable) return false;
    if (!node.isTextblock || node.hasMarkup(nodeType, attrs)) return;
    if (node.type == nodeType) {
      applicable = true;
    } else {
      const $pos = state.doc.resolve(pos),
        index = $pos.index();
      applicable = $pos.parent.canReplaceWith(index, index + 1, nodeType);
    }
  });

  if (!applicable) return null;
  return state.tr.setBlockType(from, to, nodeType, attrs).scrollIntoView();
}

export const basicInputRulesPlugin = inputRules({
  rules: [
    new InputRule(/^(INT|EXT)\. $/, (state) => {
      if (!isBetween("action", state)) return null;
      return setBlockTypeTr(state, schema.nodes.scene).insertText(" ");
    }),
    new InputRule(/TO: $/, (state) => {
      if (!isBetween("action", state)) return null;
      return setBlockTypeTr(state, schema.nodes.transition);
    }),
  ],
});
