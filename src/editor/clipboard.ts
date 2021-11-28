import { DOMParser, DOMSerializer } from "prosemirror-model";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "./schema";

export const clipboardPlugin = new Plugin({
  props: {
    clipboardParser: DOMParser.fromSchema(schema),
    clipboardSerializer: DOMSerializer.fromSchema(schema)
  }
});
