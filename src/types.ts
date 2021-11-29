export type JSONTextMark = {
  type: "u" | "strong" | "em" | "charParen";
};

export type JSONTextNode = {
  type: "text";
  marks: JSONTextMark[];
  text: string;
};

export type JSONFlatBlockNode = {
  type:
    | "scene"
    | "character"
    | "action"
    | "dialogue"
    | "parenthetical"
    | "characterInDual"
    | "dialogueInDual"
    | "parentheticalInDual"
    | "transition";
  content: JSONTextNode[];
};

export type JSONDualDialogueFlatBlockNode = {
  type:
    | "characterInDual"
    | "dialogueInDual"
    | "parentheticalInDual";
  content: JSONTextNode[];
};

export type JSONDualDialogueCol = {
  type: "dialogue";
  content: JSONDualDialogueFlatBlockNode[];
};

export type JSONDualDialogue = {
  type: "dualDialogue";
  content: [JSONDualDialogueCol, JSONDualDialogueCol];
};

export type JSONTopLevelBlockNode =
  | JSONFlatBlockNode
  | JSONDualDialogue;

export type JSONState = {
  doc: {
    type: "doc";
    content: JSONTopLevelBlockNode[];
  };
  selection?: {
    type: string;
    anchor: number;
    head: number;
  };
};
