import type { BoardUser } from "../board/BoardUser";
import type { Object } from "../types/Object";
import type { Document } from "./Document";


export function createDocument(
    objects: Object[],
    users: BoardUser[] = [],
): Document {

    const objectsRef = {
        current: objects,
    };

    const usersRef = {
        current: users,
    };

    return {
        objectsRef,
        usersRef,

        load(
            objects,
            users,
        ) {
            objectsRef.current = objects;
            usersRef.current = users;
        },
    };
}