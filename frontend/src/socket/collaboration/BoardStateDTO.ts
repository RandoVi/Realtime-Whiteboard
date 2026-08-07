import type { Object } from "../../types/Object";
import type { BoardUser } from "../../board/BoardUser";


export type BoardStateDTO = {
    userId: string;
    boardId: string;
    ownerId: string;
    objects: Object[];
    users: BoardUser[];
};