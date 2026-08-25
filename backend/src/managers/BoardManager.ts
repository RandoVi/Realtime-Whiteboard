import { BoardUser } from "../models/boardUser";
import { BoardObject } from "../modules/board/schemas/BoardObjectSchema";
import { ObjectManager } from "./ObjectManager";
import { UserManager } from "./UserManager";

export class BoardManager {

    public users = new UserManager();
    public objects = new ObjectManager();
    public lastActivity: Date = new Date();

    constructor(
        public readonly id: string,
        public readonly ownerId: string,
    ) {}
    /// OBJECTS

    addObject(object:BoardObject): void {
        this.objects.create(object);
        this.lastActivity = new Date();
    }

    deleteObject(objectId: string): void {
        this.objects.delete(objectId);
        this.lastActivity = new Date();
    }

    applyObjectUpdate(changes: Partial<BoardObject>): void {
        this.objects.update(changes);
        this.lastActivity = new Date();
    }

    moveObjectToFrontInObjects(objectId: string) {
        this.objects.moveToFront(objectId)
        this.lastActivity = new Date();
    }

    /// USERS

    addUser(user:BoardUser): void {
        this.users.add(user);
        this.lastActivity = new Date();
    }

    deleteUser(userId:string): void {
        this.users.delete(userId);
        this.lastActivity = new Date();
    }

    upsertUser(changes: BoardUser): void {
        if (this.users.has(changes.userId)) {
            this.users.update(changes);
        } else {
            this.users.add(changes);
        }
        this.lastActivity = new Date();
    }

    /// BOARDS

    toPersistence() {
        return {
            id: this.id,
            ownerId: this.ownerId,
            users: this.users.toJSON(),
            objects: this.objects.toJSON(),
            lastActivity: this.lastActivity,
        };
    }

    static fromPersistence(data: {
        id: string,
        ownerId: string,
        users: BoardUser[],
        objects: BoardObject[],
        lastActivity: Date,
    }) : BoardManager {

        const newBoard = new BoardManager(data.id, data.ownerId)
        newBoard.users = UserManager.fromPersistence(data.users);
        newBoard.objects = ObjectManager.fromPersistence(data.objects);
        newBoard.lastActivity = data.lastActivity;

        return newBoard;
    }
}