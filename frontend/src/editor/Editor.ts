import type { Object } from "@common/types";
import type { EditorCommand } from "@common/commands";

export type ExecuteOptions = {
  broadcast?: boolean;
};

export interface Editor {

  execute(
    command: EditorCommand,
    options?: ExecuteOptions
  ): void;

  getSelectedObject(): Object | undefined;
  bindProperty(
    property: string,
    transform?: (value: string) => unknown
  ): (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  deleteSelectedObject(): void;

  duplicateSelectedObject(): void;


}