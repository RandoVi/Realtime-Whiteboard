import type { Shape } from "../types/Shape";

export type CreateShapeCommand = {
    type: "createBoardObject";
    boardObject: Shape; //bcs object doesn't exist yet, we send the whole object
};

export type UpdateShapeCommand = {
    type: "updateBoardObject";
    boardObjectId: string;
    updates: Partial<Shape>; //Partial object.
};

export type DeleteShapeCommand = {
    type: "deleteBoardObject";
    boardObjectId: string;
};

export type EditorCommand =
    | CreateShapeCommand
    | UpdateShapeCommand
    | DeleteShapeCommand;