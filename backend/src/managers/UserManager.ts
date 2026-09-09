import { appError, AppErrorCode } from "../lib/errors/app.exception";
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
            user.color = UserColor.RED;
        }
    }

    update(update: Partial<BoardUser>): BoardUser | null{
    
            if (!update.userId) {
                throw appError(AppErrorCode.NO_DATA, {
                    details: "No user id provided",
                })
            }
    
            const user = this.users.get(update.userId);
    
            if (!user) {
                throw appError(AppErrorCode.NOT_FOUND, {
                    details: "No user with id in server",
                    context: {
                        userId: update.userId
                    }
                })
            }
    
            Object.assign(user, update);
    
            return user;
        }

    delete(id: string) {
        const user = this.users.get(id);
        if(user) {
            this.colors.returnColor(user!.color!);
            this.users.delete(id);
        } else {
            throw appError(AppErrorCode.NOT_FOUND, {
                details: "No user with id in server",
                context: {
                    userId: id
                }
            })
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