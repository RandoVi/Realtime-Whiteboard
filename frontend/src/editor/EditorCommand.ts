import type { Shape } from "../types/Shape";

export type CreateShapeCommand = {
    type: "createBoardObject";
    boardObject: Shape;
};

export type UpdateShapeCommand = {
    type: "updateBoardObject";
    boardObjectId: string;
    updates: Partial<Shape>;
};

export type DeleteShapeCommand = {
    type: "deleteBoardObject";
    boardObjectId: string;
};

export type EditorCommand =
    | CreateShapeCommand
    | UpdateShapeCommand
    | DeleteShapeCommand;