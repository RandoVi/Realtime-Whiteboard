import type { EditorCommand } from "../editor/EditorCommand";
//Wraps existing EditorCommand with additional metadata for network transmission
export type NetworkCommand = {
  id: string;
  userId: string;
  boardId: string;
  command: EditorCommand;
};