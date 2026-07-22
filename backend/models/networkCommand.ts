import { EditorCommand } from "./command";

export type NetworkCommand = {
  id: string;
  clientId: string;
  boardId: string;
  command: EditorCommand;
};