import type { EditorCommand } from "../../../common/src/commands/EditorCommand";

export type DocumentCommand = {
  id: string;
  userId: string;
  timestamp: number;

  command: EditorCommand;
};