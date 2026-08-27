import type { BoardObject, Point } from "@common/types";
import { hitTestObject } from "./hitTestObject";

export function getObjectAtPoint(
    objects: BoardObject[],
    point: Point,
): BoardObject | undefined {
    for (let i = objects.length - 1; i >= 0; i--) {
        const object = objects[i];

        if (hitTestObject(point, object)) {
            return object;
        }
    }

    return undefined;
}