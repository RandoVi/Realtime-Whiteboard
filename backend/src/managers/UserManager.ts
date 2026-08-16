import { BadRequestException, NotFoundException } from "@nestjs/common";
import { BoardUser } from "../models/boardUser";
import { UserColor, ColorManager } from "./ColorManager";

export class UserManager {

    private readonly users = new Map<string, BoardUser>();

    private readonly colors = new ColorManager([UserColor.RED, UserColor.GREEN, UserColor.BLUE, UserColor.BROWN, UserColor.CYAN,
        UserColor.ORANGE, UserColor.PINK, UserColor.PURPLE, UserColor.BLACK,  UserColor.YELLOW]);
    
    add(user: BoardUser) {
        const color = this.colors.takeColor();
        if (color !== null) {
            user.color = color;
            this.users.set(user.userId, user);
        } else {
            console.log("No colors available, falling back to default(RED).")
            user.color = UserColor.RED;
        }
    }

    update(update: Partial<BoardUser>): BoardUser {
    
            if (!update.userId) {
                throw new BadRequestException ("No id for user update @ UserManager")
            }
    
            const user = this.users.get(update.userId);
    
            if (!user) {
                throw new NotFoundException("Could not retrieve user to update @UserManager");
            }
    
            Object.assign(user, update);
    
            return user;
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

    toJSON(): BoardUser[] {
        return Array.from(this.users.values());
    }

    // factory for manager
    static fromPersistence(users: BoardUser[]): UserManager {
        const manager = new UserManager();

        for (const user of users) {
            manager.users.set(user.userId, user);
        }

        return manager;
    }

}