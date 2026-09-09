import type { EditorCommand } from "@common/commands";

export type HistoryEntry = {
  id: string;
  userId: string;
  timestamp: number;

  command: EditorCommand;
  inverseCommand: EditorCommand;

  beforeVersions: Record<string, number>;
  afterVersions: Record<string, number>;
};