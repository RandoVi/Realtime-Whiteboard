import type { Object } from "../types/Object";

export type CreateObjectCommand = {
    type: "createBoardObject";
    boardObject: Object; //bcs object doesn't exist yet, we send the whole object
};

export type UpdateObjectCommand = {
    type: "updateBoardObject";
    boardObjectId: string;
    updates: Partial<Object>; //Partial object.
};

export type DeleteObjectCommand = {
    type: "deleteBoardObject";
    boardObjectId: string;
};

export type EditorCommand =
    | CreateObjectCommand
    | UpdateObjectCommand
    | DeleteObjectCommand;