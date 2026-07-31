import type { Object } from "../types/Object";
import type { Document } from "./Document";


export function createDocument(
    objects: Object[]
): Document {

    const objectsRef = {
        current: objects,
    };

    return {
        objectsRef,

        load(objects: Object[]) {
            objectsRef.current = objects;
        },
    };
}