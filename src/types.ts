export type JSONTextMark = {
  type: "u" | "strong" | "em" | "charParen";
};

export type JSONTextNode = {
  type: "text";
  marks?: JSONTextMark[];
  text: string;
};

export type JSONSceneNode = {
  type: "scene";
  attrs: {
    number: string;
  };
  content?: JSONTextNode[];
};

export type JSONFlatBlockNode =
  | {
      type:
        | "character"
        | "action"
        | "dialogue"
        | "parenthetical"
        | "transition"
        | "centered"
        | "synopsis";
      content?: JSONTextNode[];
    }
  | JSONDualDialogueFlatBlockNode
  | JSONSceneNode;

export type JSONDualDialogueFlatBlockNode = {
  type: "characterInDual" | "dialogueInDual" | "parentheticalInDual";
  content?: JSONTextNode[];
};

export type JSONDualDialogueCol = {
  type: "dualDialogueCol";
  content: JSONDualDialogueFlatBlockNode[];
};

export type JSONDualDialogue = {
  type: "dualDialogue";
  content: [JSONDualDialogueCol, JSONDualDialogueCol];
};

export type JSONTopLevelBlockNode = JSONFlatBlockNode | JSONDualDialogue;

export type JSONDoc = {
  type: "doc";
  content: JSONTopLevelBlockNode[];
};
