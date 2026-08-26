import type { Point, BoardObject } from "@common/types";

type Bounds = {
    left: number;
    right: number;
    top: number;
    bottom: number;
};

function getObjectBounds(object: BoardObject): Bounds | null {
    switch (object.type) {
        case "rectangle":
        case "textbox":
        case "triangle":
        case "arrow":
            return {
                left: object.x,
                right: object.x + object.width,
                top: object.y,
                bottom: object.y + object.height,
            };

        case "text":
            return {
                left: object.x,
                right: object.x + object.width,
                top: object.y,
                bottom: object.y + object.fontSize,
            };

        case "circle":
            return {
                left: object.x - object.radius,
                right: object.x + object.radius,
                top: object.y - object.radius,
                bottom: object.y + object.radius,
            };

        case "stroke": {
            if (object.points.length === 0) {
                return null;
            }

            let left = object.points[0].x;
            let right = object.points[0].x;
            let top = object.points[0].y;
            let bottom = object.points[0].y;

            for (const point of object.points) {
                left = Math.min(left, point.x);
                right = Math.max(right, point.x);
                top = Math.min(top, point.y);
                bottom = Math.max(bottom, point.y);
            }

            return {
                left,
                right,
                top,
                bottom,
            };
        }

        case "laser":
            return null;
    }
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
        // Check if the object's bounds intersect with the selection rectangle(even partially)
        return (
            bounds.right >= selection.left &&
            bounds.left <= selection.right &&
            bounds.bottom >= selection.top &&
            bounds.top <= selection.bottom
        );
    });
}