import type { EditorCommand } from "@common/commands";

export type DocumentCommand = {
  id: string;
  userId: string;
  timestamp: number;

  command: EditorCommand;
};