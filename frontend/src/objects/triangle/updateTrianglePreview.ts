import type { Triangle } from "./Triangle";
import type { Point } from "../../types/Types";

export function updateTrianglePreview(
    triangle: Triangle,
    start: Point,
    current: Point,
) {
    triangle.width = current.x - start.x;
    triangle.height = current.y - start.y;
}