import type { BoardUser } from "../../types/BoardUser";

export function getUserById(
    users: BoardUser[],
    id: string,
) {
    return users.find(
        user => user.userId === id
    );
}