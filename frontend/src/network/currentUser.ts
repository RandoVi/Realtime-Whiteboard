import type { BoardUser } from "../board/BoardUser";

let currentUser: BoardUser | null = null;

export function setCurrentUser(user: BoardUser) {
    console.log("SETTING CURRENT USER", currentUser);
    currentUser = user;
}

export function getCurrentUser() {
    return currentUser;
}