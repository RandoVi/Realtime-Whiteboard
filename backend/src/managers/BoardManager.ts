import { BoardUser } from "../models/boardUser";
import { BoardUpdateDTO } from "../modules/board/dto/BoardUpdateDTO";
import { BoardObject } from "../modules/boardObjects/schemas/BoardObjectSchema";
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

    applyUpdate(changes: BoardUpdateDTO): void {
        if (Array.isArray(changes.boardObjects)) {
        for (const boardObjectUpdate of changes.boardObjects) {
            // Skip invalid updates that lack an ID
            if (!boardObjectUpdate.id) continue;

            // Apply each boardObject update to the ObjectManager individually
            this.objects.update(boardObjectUpdate.id, boardObjectUpdate);
        }
        }
    }

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