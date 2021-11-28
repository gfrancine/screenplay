import { ScreenplayEditor } from "../src/editor";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { bubbleMenuPlugin } from "../src/editor-plugins/bubble-menu";

import "./index.scss";
import {
  dualDialogueKeysPlugin,
  markupKeysPlugin,
} from "../src/editor-plugins/keybinds";

(window as unknown as { sp: ScreenplayEditor }).sp = new ScreenplayEditor({
  root: document.getElementById("root"),
  plugins: [
    history(),
    keymap({ "Mod-z": undo, "Mod-y": redo }),
    bubbleMenuPlugin,
    markupKeysPlugin,
    dualDialogueKeysPlugin,
  ],
});
