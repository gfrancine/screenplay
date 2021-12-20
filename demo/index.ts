import "./index.scss";
import { ScreenplayEditor } from "../src/editor";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { bubbleMenuPlugin } from "../src/editor-plugins/bubble-menu";
import {
  dualDialogueKeysPlugin,
  markupKeysPlugin,
} from "../src/editor-plugins/keybinds";
import { docToFountain, docFromFountain } from "../src/fountain";
import { fountainInputRulesPlugin } from "../src/editor-plugins/fountain-inputrules";

const sp = new ScreenplayEditor({
  root: document.getElementById("root"),
  plugins: [
    history(),
    keymap({ "Mod-z": undo, "Mod-y": redo }),
    bubbleMenuPlugin,
    markupKeysPlugin,
    dualDialogueKeysPlugin,
    fountainInputRulesPlugin,
  ],
});

console.info("INFO: The editor object is in the global namespace as 'sp'.");

const global = window as unknown as Record<string, unknown>;
global.sp = sp;
global.toFountain = () => docToFountain(sp.toJSON());
global.fromFountain = (source: string) => {
  sp.loadJSON(docFromFountain(source));
};

sp.view.focus();
