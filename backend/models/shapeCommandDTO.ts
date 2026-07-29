import { EditorCommand } from "./shapeCommands";

export type ShapeCommandDTO = {
  id: string;
  clientId: string;
  boardId: string;
  command: EditorCommand;
};