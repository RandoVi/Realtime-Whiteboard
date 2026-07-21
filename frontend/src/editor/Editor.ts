import type { Shape } from "../types/Shape";
import type { EditorCommand } from "./EditorCommand";

export type ExecuteOptions = {
  broadcast?: boolean;
};

export interface Editor {

  execute(
    command: EditorCommand,
    options?: ExecuteOptions
  ): void;

  bind<K extends keyof Shape>(
    property: K,
    transform?: (value: string) => Shape[K]
  ): (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  deleteSelectedShape(): void;

  duplicateSelectedShape(): void;
}