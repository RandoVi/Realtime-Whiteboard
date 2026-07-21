import type { EditorCommand } from "../editor/EditorCommand";

export type DocumentCommand = {
  id: string;
  clientId: string;
  timestamp: number;

  command: EditorCommand;
};