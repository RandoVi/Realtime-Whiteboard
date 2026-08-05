import { BoardUser } from "../models/boardUser";

export class UserManager {

    private readonly users = new Map<string, BoardUser>();

    add(user: BoardUser) {

        this.users.set(user.id, user);
    }

    remove(id: string) {

        this.users.delete(id);
    }

    get(id: string) {

        return this.users.get(id);
    }

    has(id: string) {

        return this.users.has(id);
    }

    getAll() {

        return [...this.users.values()];
    }

    count() {

        return this.users.size;
    }

}