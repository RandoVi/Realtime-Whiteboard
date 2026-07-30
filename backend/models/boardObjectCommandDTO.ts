import { EditorCommand } from "./objectCommands";

export type BoardObjectCommandDTO = {
  id: string;
  clientId: string;
  boardId: string;
  command: EditorCommand;
};