import type { Triangle } from "@common/shapes";
import type { Point } from "@common/types";

export function updateTrianglePreview(
    triangle: Triangle,
    start: Point,
    current: Point,
) {
    triangle.width = current.x - start.x;
    triangle.height = current.y - start.y;
}