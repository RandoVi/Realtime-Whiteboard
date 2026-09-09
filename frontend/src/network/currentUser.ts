import type { BoardUser } from "../types/BoardUser";

let currentUser: BoardUser | null = null;

export function setCurrentUser(user: BoardUser) {
    currentUser = user;
    // console.log("SETTING CURRENT USER", currentUser);
}

export function getCurrentUser() {

    return currentUser;
}