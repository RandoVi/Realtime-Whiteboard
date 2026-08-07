import { BoardObject } from "../modules/boardObjects/schemas/BoardObjectSchema";
import { ObjectSelectionCommand } from  "@whiteboard/common";
export type DocumentCommand = {
  id: string;
  userId: string;
  timestamp: number;

  command: Command;
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type ObjectPreviewCommand =
  | {
      type: "objectPreview";
      previewType: "create";
      boardObject: BoardObject;
    }
  | {
      type: "objectPreview";
      previewType: "update";
      boardObjectId: string;
      updates: Partial<BoardObject>;
    };

export  type CursorMovementCommand = {
    type: "cursorMovement";
    //TODO customization
}

// export type DuplicateBoardObjectCommand = {
//     type: "duplicateBoardObject";
//     BoardObjectId: string;
// };

export type Command =
    | CreateBoardObjectCommand
    | UpdateBoardObjectCommand
    | DeleteBoardObjectCommand
    | ObjectPreviewCommand
    | CursorMovementCommand
    | ObjectSelectionCommand;