import { schema } from "./schema";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { keymap } from "prosemirror-keymap";
import { baseKeymap, Command } from "prosemirror-commands";
import { tabPlugin } from "./key-tab";
import { makeEnterHandlerKeymap } from "./key-enter";
import { parentheticalPlugin } from "./key-parenthesis";
import { JSONDoc } from "../types";
import { Node, Schema } from "prosemirror-model";
import { sceneNodeView } from "./scene";
import { sceneArrowUpPlugin } from "./key-arrowup";
import { basicInputRulesPlugin } from "./inputrules";

export { schema } from "./schema";
export { toggleDualDialogue } from "./dual-dialogue";
export { sceneNodeView } from "./scene";

export const defaultPlugins = [
  keymap(makeEnterHandlerKeymap(baseKeymap as { Enter: Command })),
  tabPlugin,
  parentheticalPlugin,
  sceneArrowUpPlugin,
  basicInputRulesPlugin,
];

export class ScreenplayEditor {
  view: EditorView;
  config: Record<string, unknown> & {
    schema: Schema;
  };

  constructor({
    root,
    plugins = [],
    jsonDoc,
  }: {
    root: Element;
    plugins?: Plugin[];
    jsonDoc?: JSONDoc;
  }) {
    this.config = {
      schema,
      plugins: [...defaultPlugins, ...plugins],
    };

    const state =
      jsonDoc !== undefined
        ? EditorState.fromJSON(this.config, jsonDoc)
        : EditorState.create(this.config);

    this.view = new EditorView(root, {
      state,
      nodeViews: {
        scene: sceneNodeView,
      },
    });
  }

  loadJSON(jsonDoc: JSONDoc) {
    this.view.updateState(
      EditorState.create({
        ...this.config,
        doc: Node.fromJSON(schema, jsonDoc),
      })
    );
  }

  toJSON(): JSONDoc {
    return this.view.state.doc.toJSON() as JSONDoc;
  }
}
