import { EditorCommand } from "./objectCommands";

export type BoardObjectCommandDTO = {
  id: string;
  userId: string;
  boardId: string;
  command: EditorCommand;
};