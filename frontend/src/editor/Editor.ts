import type { BoardObject } from "@common/types";
import type { EditorCommand } from "@common/commands";

export type ExecuteOptions = {
  broadcast?: boolean;
  recordHistory?: boolean;
};

export interface Editor {

  execute(
    command: EditorCommand,
    options?: ExecuteOptions
  ): void;

  getSelectedObject(): BoardObject | undefined;
  bindProperty(
    property: string,
    transform?: (value: string) => unknown
  ): (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  deleteSelectedObject(): void;

  duplicateSelectedObject(): void;

  undo(): void;

  redo(): void;

  canUndo(): boolean;

  canRedo(): boolean;

  resetHistory(): void;
}