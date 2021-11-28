import { DOMParser, DOMSerializer } from "prosemirror-model";
import { Plugin } from "prosemirror-state";
import { schema } from "./schema";

export const clipboardPlugin = new Plugin({
  props: {
    clipboardParser: DOMParser.fromSchema(schema),
    clipboardSerializer: DOMSerializer.fromSchema(schema),
  },
});
