import type { BoardObject } from "../types/Object";
export type CreateObjectCommand = {
    type: "createBoardObject";
    boardObject: BoardObject;
};
export type UpdateObjectCommand = {
    type: "updateBoardObject";
    boardObjectId: string;
    updates: Partial<BoardObject>;
};
export type DeleteObjectCommand = {
    type: "deleteBoardObject";
    boardObjectId: string;
};
export type BringBoardObjectToFrontCommand = {
    type: "bringBoardObjectToFront";
    boardObjectId: string;
};
export type BringBoardObjectsToFrontCommand = {
    type: "bringBoardObjectsToFront";
    boardObjectIds: string[];
};
export type EditorCommand = CreateObjectCommand | UpdateObjectCommand | DeleteObjectCommand | BringBoardObjectToFrontCommand | BringBoardObjectsToFrontCommand;
//# sourceMappingURL=EditorCommand.d.ts.map