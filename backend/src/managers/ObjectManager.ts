import { appError, AppErrorCode } from "../lib/errors/app.exception";
import { BoardObject } from "../modules/board/schemas/BoardObjectSchema";


export class ObjectManager {

    private readonly objects = new Map<string, BoardObject>();
    
    create(boardObject: BoardObject): BoardObject | null {
        if (!boardObject.id) {
            throw appError(AppErrorCode.NO_DATA, {
                details: "No board Object id provided",
            })
        }
        if (this.objects.has(boardObject.id)) {
            throw appError(AppErrorCode.ALREADY_EXISTS, {
                details: "Object with id already exists, cannot create",
                context: {
                    objectId: boardObject.id,
                    objectType: boardObject.type
                }
            })
        }

        this.objects.set(boardObject.id, boardObject);
        return boardObject;
    }

    update(update: Partial<BoardObject>): BoardObject | null {

        if (!update.id) {
            throw appError(AppErrorCode.NO_DATA, {
                details: "No board Object id provided",
            })
        }

        const object = this.objects.get(update.id);

        if (!object) {
            throw appError(AppErrorCode.NOT_FOUND, {
                details: "No object with id in server",
                context: {
                    objectId: update.id
                }
            })
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
            throw appError(AppErrorCode.NOT_FOUND, {
                details: "No object with id in server",
                context: {
                    objectId: objectId
                }
            })
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
