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
export type EditorCommand = CreateObjectCommand | UpdateObjectCommand | DeleteObjectCommand;
//# sourceMappingURL=EditorCommand.d.ts.map