import type { Point } from "@common/types"
import type { Rectangle } from "@common/shapes"

export function updateRectanglePreview(
    rectangle: Rectangle,
    start: Point,
    current: Point,
) {
    rectangle.width = current.x - start.x;
    rectangle.height = current.y - start.y;
}