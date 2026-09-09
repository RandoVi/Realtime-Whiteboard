import type { BoardUser } from "../types/BoardUser";
import type { BoardObject } from "@common/types";


export type BoardDocument = {
    objectsRef: {
        current: BoardObject[];
    };

    usersRef: {
        current: BoardUser[];
    };

    addUser(
        user: BoardUser
    ): void;

    load(
        objects: BoardObject[],
        users: BoardUser[]
    ): void;
};