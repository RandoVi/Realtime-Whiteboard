import { BoardUpdateDTO } from "../modules/board/dto/BoardUpdateDTO";
import { ObjectManager } from "./ObjectManager";
import { UserManager } from "./UserManager";

export class BoardManager {

    users = new UserManager();
    objects = new ObjectManager();

    constructor(
        public readonly id: string,
        public readonly ownerId: string,
    ) {}

    applyUpdate(changes: BoardUpdateDTO): void {
        if (Array.isArray(changes.boardObjects)) {
        for (const boardObjectUpdate of changes.boardObjects) {
            // Skip invalid updates that lack an ID
            if (!boardObjectUpdate._id) continue;

            // Apply each shape update to the ObjectManager individually
            this.objects.update(boardObjectUpdate._id, boardObjectUpdate);
        }
        }
    }

    toPersistence() {
        return {
        _id: this.id,
        ownerId: this.ownerId,
        objects: this.objects.toJSON(),
        };
    }
}