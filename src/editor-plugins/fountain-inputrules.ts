import { inputRules, InputRule } from "prosemirror-inputrules";
import { NodeType, MarkType } from "prosemirror-model";
import { Transaction } from "prosemirror-state";
import { schema } from "../editor";
import { isBetween } from "../internal-util/prosemirror";

// replace the current node with a new blank node on input rule match
function replacingInputRule(pattern: RegExp, nodeType: NodeType) {
  return new InputRule(pattern, (state, _matches) => {
    let tr: Transaction | null = null;

    if (!state.selection.empty) return tr;
    const { from } = state.selection;
    state.doc.nodesBetween(from, from, (node, start) => {
      if (node.type.name !== "action") return;
      const end = start + node.nodeSize;
      tr = state.tr.replaceWith(start, end, nodeType.create()).scrollIntoView();
    });

    return tr;
  });
}

// from https://discuss.prosemirror.net/t/input-rules-for-wrapping-marks/537/
function markInputRule(regexp: RegExp, markType: MarkType, matchNumber = 1) {
  return new InputRule(regexp, (state, match, start, end) => {
    const tr = state.tr;
    if (match[matchNumber]) {
      const textStart = start + match[0].indexOf(match[matchNumber]);
      const textEnd = textStart + match[matchNumber].length;
      if (textEnd < end) tr.delete(textEnd, end);
      if (textStart > start) tr.delete(start, textStart);
      end = start + match[matchNumber].length;
    }
    return tr.addMark(start, end, markType.create());
  });
}

export const fountainInputRulesPlugin = inputRules({
  rules: [
    replacingInputRule(/^> $/, schema.nodes.transition),
    replacingInputRule(/^\. $/, schema.nodes.scene),
    replacingInputRule(/^@ $/, schema.nodes.character),
    markInputRule(/\*\*([^*]+)\*\*/, schema.marks.strong),
    markInputRule(/(?:^|[^*])\*([^*]+)\*/, schema.marks.em, 2),
    markInputRule(/_([^_]+)_/, schema.marks.u),
  ],
});
