import { Shape } from "./shape";

export type DocumentCommand = {
  id: string;
  clientId: string;
  timestamp: number;

  command: EditorCommand;
};

export type CreateShapeCommand = {
    type: "createShape"

    shape: Shape
}

export type UpdateShapeCommand = {
    type: "updateShape";

    shapeId: string;

    updates: Partial<Shape>;
};

export type DeleteShapeCommand = {
    type: "deleteShape";
    shapeId: string;
};

// export type DuplicateShapeCommand = {
//     type: "duplicateShape";
//     shapeId: string;
// };

export type EditorCommand =
    | CreateShapeCommand
    | UpdateShapeCommand
    | DeleteShapeCommand;