import type { Object } from "../types/Object";
import type { EditorCommand } from "./EditorCommand";

export type ExecuteOptions = {
  broadcast?: boolean;
};

export interface Editor {

  execute(
    command: EditorCommand,
    options?: ExecuteOptions
  ): void;

  getSelectedObject(): Object | undefined;
  bind<K extends keyof Object>(
    property: K,
    transform?: (value: string) => Object[K]
  ): (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  deleteSelectedObject(): void;

  duplicateSelectedObject(): void;

  
}