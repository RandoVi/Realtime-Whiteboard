import { userInfo } from "node:os";
import { BoardUser } from "../models/boardUser";
import { UserColor, ColorManager } from "./ColorManager";

export class UserManager {

    private readonly users = new Map<string, BoardUser>();

    private readonly colors = new ColorManager([UserColor.BLACK, UserColor.BLUE, UserColor.BROWN, UserColor.CYAN,
        UserColor.GREEN, UserColor.ORANGE, UserColor.PINK, UserColor.PURPLE, UserColor.RED, UserColor.YELLOW]);
    
    add(user: BoardUser) {
        const color = this.colors.takeColor();
        if (color !== null) {
            user.color = color;
            this.users.set(user.id, user);
        } else {
            console.log("No colors available, falling back to default(BLACK).")
            user.color = UserColor.BLACK;
        }
    }

    remove(id: string) {
        const user = this.users.get(id);
        if(user) {
            this.colors.returnColor(user!.color!);
            this.users.delete(id);
        }
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