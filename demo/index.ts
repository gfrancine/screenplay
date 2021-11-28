import { ScreenplayEditor } from "../src/editor";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { bubbleMenuPlugin } from "../src/editor-plugins/bubble-menu";

import "./index.scss";
import { markupKeysPlugin, dualDialogueKeysPlugin } from "../src/editor-plugins/keybinds";

(window as any).sp = new ScreenplayEditor({
  root: document.getElementById("root"),
  plugins: [history(), keymap({ "Mod-z": undo, "Mod-y": redo }),
  bubbleMenuPlugin,  markupKeysPlugin, dualDialogueKeysPlugin,
],
});
