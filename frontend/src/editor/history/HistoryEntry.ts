import type { EditorCommand } from "@common/commands";

export type HistoryEntry = {
  id: string;
  userId: string;
  timestamp: number;

  command: EditorCommand;
  inverseCommand: EditorCommand;

  objectVersions: Record<string, number>; // Maps object IDs to their version numbers at the time of the command, good 
  // if multiple objects are updated in a single command, and we want to know which version of each object was updated.
};