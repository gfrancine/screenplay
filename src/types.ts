export type JsonTextMark = {
  type: "u" | "strong" | "em" | "charParen";
};

export type JsonTextNode = {
  type: "text";
  marks: JsonTextMark[];
  text: string;
};

export type JsonFlatBlockNode = {
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
  content: JsonTextNode[];
};

export type JsonDualDialogueFlatBlockNode = {
  type:
    | "characterInDual"
    | "dialogueInDual"
    | "parentheticalInDual";
  content: JsonTextNode[];
};

export type JsonDualDialogueCol = {
  type: "dialogue";
  content: JsonDualDialogueFlatBlockNode[];
};

export type JsonDualDialogue = {
  type: "dualDialogue";
  content: [JsonDualDialogueCol, JsonDualDialogueCol];
};

export type JsonTopLevelBlockNode =
  | JsonFlatBlockNode
  | JsonDualDialogue;

export type JsonState = {
  doc: {
    type: "doc";
    content: JsonTopLevelBlockNode[];
  };
  selection?: {
    type: string;
    anchor: number;
    head: number;
  };
};
