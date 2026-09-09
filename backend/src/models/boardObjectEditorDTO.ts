import { EditorCommand } from "@whiteboard/common";

export type BoardObjectEditorDTO = {
  id: string;
  userId: string;
  boardId: string;
  command: EditorCommand;
};