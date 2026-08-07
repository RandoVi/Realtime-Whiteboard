import type { BoardUser } from "../board/BoardUser";
import type { Object } from "../types/Object";


export type Document = {
    objectsRef: {
        current: Object[];
    };

    usersRef: {
        current: BoardUser[];
    };

    load(
        objects: Object[],
        users: BoardUser[]
    ): void;
};