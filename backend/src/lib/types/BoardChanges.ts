import { BoardUser } from "../../models/boardUser";
import { BoardObject } from "../../modules/board/schemas/BoardObjectSchema";

export type ObjectChange =
    | { type: 'create'; boardId: string; object: BoardObject; }
    | { type: 'update'; boardId: string; object: BoardObject; }
    | { type: 'delete'; boardId: string; objectId: string; }
    | { type: 'reorder'; boardId: string; objectId: string; };

export type UserChange =
    | {type: 'create'; boardId: string; user: BoardUser;}
    | {type: 'update'; boardId: string; user: BoardUser;}
    | {type: 'delete'; boardId: string; userId: string;};