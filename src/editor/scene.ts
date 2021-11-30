import { EditorView, NodeView } from "prosemirror-view";
import { Node } from "prosemirror-model";
import { el } from "../internal-util/elbuilder";

export function sceneNodeView(
  node: Node,
  outerView: EditorView,
  getPos: boolean | (() => number)
): NodeView {
  node = node as Node & { attrs: { number: string } };
  const getPosition = getPos as () => number;

  const scenenum = el("input")
    .attr("value", node.attrs.number)
    .class("x-scenenum-left")
    .on("blur", (e) =>
      outerView.dispatch(
        outerView.state.tr.setNodeMarkup(getPosition(), null, {
          number: (e.target as HTMLInputElement).value,
        })
      )
    ).element;

  const contentDOM = el("p").element;

  const dom = el("div")
    .class("x-scene")
    .attr("data-scene-number", node.attrs.number)
    .children(
      scenenum,
      el("div").inner(node.attrs.number).class("x-scenenum-right").element,
      contentDOM
    ).element;

  const stopEvent = (e: Event) => {
    if (e.target === scenenum) return true;
    return false;
  };

  return {
    dom,
    contentDOM,
    stopEvent,
  };
}
