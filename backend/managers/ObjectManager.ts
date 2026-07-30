import { BoardObject } from "../modules/boardObjects/schemas/BoardObjectSchema";


export class ObjectManager {

    private readonly objects = new Map<string, BoardObject>();

    create(boardObject: BoardObject): BoardObject {

        if (this.objects.has(boardObject._id)) {
            throw new Error("BoardObject already exists");
        }

        this.objects.set(boardObject._id, boardObject);

        return boardObject;
    }

    update(id: string, update: Partial<BoardObject>): BoardObject {

        const object = this.objects.get(id);

        if (!object) {
            throw new Error("BoardObject not found");
        }

        Object.assign(object, update);

        object.updatedAt = Date.now();

        return object;
    }

    delete(id: string): boolean {
        return this.objects.delete(id);
    }

    get(id: string): BoardObject | undefined {
        return this.objects.get(id);
    }

    getAll(): BoardObject[] {
        return [...this.objects.values()];
    }

    clear(): void {
        this.objects.clear();
    }
    toJSON(): BoardObject[] {
        return Array.from(this.objects.values());
    }
}
