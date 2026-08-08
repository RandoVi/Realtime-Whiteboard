import type { BoardUser } from "../board/BoardUser";

let currentUser: BoardUser | null = null;

export function setCurrentUser(user: BoardUser) {
    currentUser = user;
    console.log("SETTING CURRENT USER", currentUser);
}

export function getCurrentUser() {
    return currentUser;
}