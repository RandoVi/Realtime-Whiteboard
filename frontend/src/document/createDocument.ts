import type { Shape } from "../types/Shape";
import type { Document } from "./Document";


export function createDocument(
    shapes: Shape[]
): Document {

    const shapesRef = {
        current: shapes,
    };

    return {
        shapesRef,

        load(shapes: Shape[]) {
            shapesRef.current = shapes;
        },
    };
}