import type { Object } from "../types/Object";
export type CreateObjectCommand = {
    type: "createBoardObject";
    boardObject: Object;
};
export type UpdateObjectCommand = {
    type: "updateBoardObject";
    boardObjectId: string;
    updates: Partial<Object>;
};
export type DeleteObjectCommand = {
    type: "deleteBoardObject";
    boardObjectId: string;
};
export type BringBoardObjectToFrontCommand = {
    type: "bringBoardObjectToFront";
    boardObjectId: string;
};
export type EditorCommand = CreateObjectCommand | UpdateObjectCommand | DeleteObjectCommand | BringBoardObjectToFrontCommand;
//# sourceMappingURL=EditorCommand.d.ts.map