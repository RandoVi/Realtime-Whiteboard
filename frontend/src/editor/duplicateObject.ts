import type { Object } from "../types/Object";

export function duplicateObject(object: Object): Object {

    switch (object.type) {

        case "rectangle":
            return {
                ...object,
                id: crypto.randomUUID(),
                x: object.x + 20,
                y: object.y + 20,
            };


        case "circle":
            return {
                ...object,
                id: crypto.randomUUID(),
                x: object.x + 20,
                y: object.y + 20,
            };


        case "stroke":
            return {
                ...object,
                id: crypto.randomUUID(),
                points: object.points.map(point => ({
                    x: point.x + 20,
                    y: point.y + 20,
                })),
            };
    }
}