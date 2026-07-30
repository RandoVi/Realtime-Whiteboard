import type { Shape } from "../../types/Shape";
//TODO: Move elsewhere later!!!
export type BoardUser = {
    id: string;
    username: string;
};

export type BoardStateDTO = {
    boardId: string;
    ownerId: string;
    objects: Shape[];
    users: BoardUser[];
};