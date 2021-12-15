import { ScreenplayEditor } from "../src/editor";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { bubbleMenuPlugin } from "../src/editor-plugins/bubble-menu";
import { basicInputRulesPlugin } from "../src/editor-plugins/inputrules";
import {
  dualDialogueKeysPlugin,
  markupKeysPlugin,
} from "../src/editor-plugins/keybinds";
import { docToFountain, docFromFountain } from "../src/fountain";
import "./index.scss";

const sp = new ScreenplayEditor({
  root: document.getElementById("root"),
  plugins: [
    history(),
    keymap({ "Mod-z": undo, "Mod-y": redo }),
    bubbleMenuPlugin,
    markupKeysPlugin,
    dualDialogueKeysPlugin,
    basicInputRulesPlugin,
  ],
});

const global = window as unknown as Record<string, unknown>;
global.sp = sp;
global.toFountain = () => docToFountain(sp.toJSON());
global.fromFountain = (source: string) => {
  sp.loadJSON(docFromFountain(source));
};

sp.view.focus();
