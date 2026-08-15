import type { Rectangle } from "@common/shapes"
import type { Point } from "@common/types"

export function hitTestRectangle(
    point: Point,
    rectangle: Rectangle
): boolean {

    const centerX =
        rectangle.x + rectangle.width / 2

    const centerY =
        rectangle.y + rectangle.height / 2

    // Translate point relative to rectangle center
    const dx = point.x - centerX
    const dy = point.y - centerY

    // Rotate the point backwards
    const cos = Math.cos(-rectangle.rotation)
    const sin = Math.sin(-rectangle.rotation)

    const localX =
        dx * cos - dy * sin

    const localY =
        dx * sin + dy * cos

    // Move back to rectangle's local coordinates
    const x =
        localX + rectangle.width / 2

    const y =
        localY + rectangle.height / 2

    return (
        x >= 0 &&
        x <= rectangle.width &&
        y >= 0 &&
        y <= rectangle.height
    )
}