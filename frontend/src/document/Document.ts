import type { BoardUser } from "../board/BoardUser";
import type { Object } from "@common/types";


export type Document = {
    objectsRef: {
        current: Object[];
    };

    usersRef: {
        current: BoardUser[];
    };

    addUser(
        user: BoardUser
    ): void;

    load(
        objects: Object[],
        users: BoardUser[]
    ): void;
};