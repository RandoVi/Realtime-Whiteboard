import type { Object } from "../../types/Object";
//TODO: Move elsewhere later!!!
export type BoardUser = {
    id: string;
    username: string;
};

export type BoardStateDTO = {
    boardId: string;
    ownerId: string;
    objects: Object[];
    users: BoardUser[];
};