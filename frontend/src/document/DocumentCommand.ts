import type { EditorCommand } from "../editor/EditorCommand";

export type DocumentCommand = {
  id: string;
  userId: string;
  timestamp: number;

  command: EditorCommand;
};