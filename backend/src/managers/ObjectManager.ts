import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { BoardObject } from "../modules/board/schemas/BoardObjectSchema";


export class ObjectManager {

    private readonly objects = new Map<string, BoardObject>();
    
    create(boardObject: BoardObject): BoardObject {
        if (!boardObject.id) {
            throw new NotFoundException("BoardObject id is missing")
        }
        if (this.objects.has(boardObject.id)) {
            throw new ConflictException("BoardObject already exists");
        }

        this.objects.set(boardObject.id, boardObject);

        return boardObject;
    }

    update(update: Partial<BoardObject>): BoardObject {

        if (!update.id) {
            throw new BadRequestException ("No id for object update @ ObjectManager")
        }

        const object = this.objects.get(update.id);

        if (!object) {
            throw new NotFoundException("BoardObject not found");
        }
        Object.assign(object, update);
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

    has(id: string) {
        return this.objects.has(id);
    }

    moveToFront(objectId: string) {
        const object = this.objects.get(objectId);

        if (!object) {
            throw new BadRequestException("Could not find object to bring to front")
        }

        if (object !== undefined) {
            this.objects.delete(objectId)
            this.objects.set(objectId, object)
        }
    }


    clear(): void {
        this.objects.clear();
    }
    toJSON(): BoardObject[] {
        return Array.from(this.objects.values());
    }

    // factory for manager
    static fromPersistence(objects: BoardObject[]): ObjectManager {
        const manager = new ObjectManager();

        for (const object of objects) {
        manager.objects.set(object.id, object);
        }

        return manager;
    }
}
