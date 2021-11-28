import { schema } from "./schema";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { keymap } from "prosemirror-keymap";
import { baseKeymap, Command } from "prosemirror-commands";
import { tabPlugin } from "./key-tab";
import { makeEnterHandlerKeymap } from "./key-enter";
import { parentheticalPlugin } from "./key-parenthesis";
import { JsonState } from "../types";
import { Node, Schema } from "prosemirror-model";

export { schema } from "./schema";
export { createDualDialogue } from "./dual-dialogue";

export const defaultPlugins = [
  keymap(makeEnterHandlerKeymap(baseKeymap as { Enter: Command })),
  tabPlugin,
  parentheticalPlugin,
];

export class ScreenplayEditor {
  view: EditorView;
  config: Record<string, unknown> & {
    schema: Schema;
  };

  constructor({ root, plugins = [], jsonState }: {
    root: Element;
    plugins?: Plugin[];
    jsonState?: JsonState;
  }) {
    this.config = {
      schema,
      plugins: [
        ...defaultPlugins,
        ...plugins,
      ],
    };

    const state = jsonState !== undefined
      ? EditorState.fromJSON(
        this.config,
        jsonState,
      )
      : EditorState.create(this.config);

    this.view = new EditorView(root, { state });
  }

  loadJson(jsonState: JsonState) {
    this.view.updateState(EditorState.create({
      ...this.config,
      doc: Node.fromJSON(schema, jsonState),
    }));
  }

  toJson(): JsonState {
    return this.view.state.doc.toJSON() as JsonState;
  }
}
