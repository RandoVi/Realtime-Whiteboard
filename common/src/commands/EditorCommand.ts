import type { BoardObject } from "../types/Object";

export type CreateObjectCommand = {
    type: "createBoardObject";
    boardObject: BoardObject; //bcs object doesn't exist yet, we send the whole object
};

export type UpdateObjectCommand = {
    type: "updateBoardObject";
    boardObjectId: string;
    updates: Partial<BoardObject>; //Partial object.
};

export type DeleteObjectCommand = {
    type: "deleteBoardObject";
    boardObjectId: string;
};

export type BringBoardObjectToFrontCommand = {
    type: "bringBoardObjectToFront";
    boardObjectId: string;
};

export type EditorCommand =
    | CreateObjectCommand
    | UpdateObjectCommand
    | DeleteObjectCommand
    | BringBoardObjectToFrontCommand;