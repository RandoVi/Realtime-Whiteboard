import type { Rectangle } from "./Rectangle";
import type { Point } from "../../types/Types";

export function updateRectanglePreview(
    rectangle: Rectangle,
    start: Point,
    current: Point,
) {
    rectangle.width = current.x - start.x;
    rectangle.height = current.y - start.y;
}