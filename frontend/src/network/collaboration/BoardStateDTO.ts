import type { BoardObject } from "@common/types";
import type { BoardUser } from "../../types/BoardUser";


export type BoardStateDTO = {
    userId: string;
    boardId: string;
    ownerId: string;
    objects: BoardObject[];
    users: BoardUser[];
};