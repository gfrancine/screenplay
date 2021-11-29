import { ScreenplayEditor } from "../src/editor";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { bubbleMenuPlugin } from "../src/editor-plugins/bubble-menu";
import {
  dualDialogueKeysPlugin,
  markupKeysPlugin,
} from "../src/editor-plugins/keybinds";
import { docToFountain } from "../src/fountain";

import "./index.scss";

const sp = new ScreenplayEditor({
  root: document.getElementById("root"),
  plugins: [
    history(),
    keymap({ "Mod-z": undo, "Mod-y": redo }),
    bubbleMenuPlugin,
    markupKeysPlugin,
    dualDialogueKeysPlugin,
  ],
});

(window as unknown as { sp: ScreenplayEditor }).sp = sp;
(window as unknown as { toFountain: typeof docToFountain }).toFountain = () =>
  docToFountain(sp.toJSON());

sp.view.focus();
