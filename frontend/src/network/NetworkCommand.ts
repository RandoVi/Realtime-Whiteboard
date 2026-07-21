import type { EditorCommand } from "../editor/EditorCommand";
//Wraps existing EditorCommand with additional metadata for network transmission
export type NetworkCommand = {
  id: string;
  clientId: string;
  boardId: string;
  command: EditorCommand;
};