import { inputRules, InputRule } from "prosemirror-inputrules";
import { NodeType } from "prosemirror-model";
import { schema } from "../editor";
import { isBetween } from "../internal-util/prosemirror";

function replacingInputRule(pattern: RegExp, nodeType: NodeType) {
  return new InputRule(pattern, (state, _matches, start, end) => {
    if (!isBetween("action", state)) return null;
    return state.tr.replaceWith(start, end, nodeType.createAndFill());
  });
}

export const fountainInputRulesPlugin = inputRules({
  rules: [
    replacingInputRule(/^> $/, schema.nodes.transition),
    replacingInputRule(/^. $/, schema.nodes.scene),
    replacingInputRule(/^@ $/, schema.nodes.character),
  ],
});
