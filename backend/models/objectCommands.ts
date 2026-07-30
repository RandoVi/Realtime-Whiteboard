import { BoardObject } from "../modules/boardObjects/schemas/BoardObjectSchema";

export type DocumentCommand = {
  id: string;
  clientId: string;
  timestamp: number;

  command: EditorCommand;
};

export type CreateBoardObjectCommand = {
    type: "createBoardObject"

    boardObject: BoardObject
}

export type UpdateBoardObjectCommand = {
    type: "updateBoardObject";

    boardObjectId: string;

    updates: Partial<BoardObject>;
};

export type DeleteBoardObjectCommand = {
    type: "deleteBoardObject";
    boardObjectId: string;
};

// export type DuplicateBoardObjectCommand = {
//     type: "duplicateBoardObject";
//     BoardObjectId: string;
// };

export type EditorCommand =
    | CreateBoardObjectCommand
    | UpdateBoardObjectCommand
    | DeleteBoardObjectCommand;