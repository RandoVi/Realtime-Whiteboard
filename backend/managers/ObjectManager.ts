import { Shape } from "../models/shape";

export class ObjectManager {

    private readonly objects = new Map<string, Shape>();

    create(shape: Shape): Shape {

        if (this.objects.has(shape.id)) {
            throw new Error("Shape already exists");
        }

        this.objects.set(shape.id, shape);

        return shape;
    }

    update(id: string, update: Partial<Shape>): Shape {

        const object = this.objects.get(id);

        if (!object) {
            throw new Error("Shape not found");
        }

        Object.assign(object, update);

        object.updatedAt = Date.now();

        return object;
    }

    delete(id: string): boolean {
        return this.objects.delete(id);
    }

    get(id: string): Shape | undefined {
        return this.objects.get(id);
    }

    getAll(): Shape[] {
        return [...this.objects.values()];
    }

    clear(): void {
        this.objects.clear();
    }
    toJSON(): Shape[] {
        return Array.from(this.objects.values());
    }
}
