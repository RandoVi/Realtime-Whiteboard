import type { BoardUser } from "../../board/BoardUser";

export function getUserById(
    users: BoardUser[],
    id: string,
) {
    return users.find(
        user => user.userId === id
    );
}