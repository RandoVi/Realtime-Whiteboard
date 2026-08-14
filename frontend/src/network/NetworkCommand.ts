import type { EditorCommand } from "@common/commands";
//Wraps existing EditorCommand with additional metadata for network transmission
export type NetworkCommand = {
  id: string;
  userId: string;
  boardId: string;
  command: EditorCommand;
};