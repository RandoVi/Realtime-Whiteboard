import type { Point, BoardObject } from "@common/types";
import { getObjectHandler } from "../../objects/registry/getObjectHandler";


type Bounds = {
    left: number;
    right: number;
    top: number;
    bottom: number;
};

function getObjectBounds(object: BoardObject): Bounds | null {
    return getObjectHandler(object).getBounds?.(object) ?? null;
}

function normalizeRectangle(start: Point, end: Point) {
    return {
        left: Math.min(start.x, end.x),
        right: Math.max(start.x, end.x),
        top: Math.min(start.y, end.y),
        bottom: Math.max(start.y, end.y),
    };
}

export function getObjectsInSelection(
    objects: BoardObject[],
    start: Point,
    end: Point,
): BoardObject[] {
    const selection = normalizeRectangle(start, end);

    return objects.filter(object => {
        const bounds = getObjectBounds(object);

        if (!bounds) {
            return false;
        }

        return (
            bounds.right >= selection.left &&
            bounds.left <= selection.right &&
            bounds.bottom >= selection.top &&
            bounds.top <= selection.bottom
        );
    });
}