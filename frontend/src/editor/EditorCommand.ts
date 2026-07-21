import type { Shape } from "../types/Shape";

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

export type DuplicateShapeCommand = {
    type: "duplicateShape";
    shapeId: string;
};

export type EditorCommand =
    | CreateShapeCommand
    | UpdateShapeCommand
    | DeleteShapeCommand
    | DuplicateShapeCommand;