import type { BoardUser } from "../types/BoardUser";
import type { BoardObject } from "@common/types";
import type { BoardDocument } from "./Document";


export function createDocument(
    objects: BoardObject[],
    users: BoardUser[] = [],
): BoardDocument {

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
        addUser(user) {
            const exists = usersRef.current.some(
                u => u.userId === user.userId
            );

            if (exists) {
                return;
            }

            usersRef.current.push(user);
        },
    };
}