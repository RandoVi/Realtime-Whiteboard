import type { Object } from "../types/Object";
import type { EditorCommand } from "../../../common/src/commands/EditorCommand";

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