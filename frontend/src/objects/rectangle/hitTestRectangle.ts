import type { Point } from '@common/types'
import type { Rectangle } from '@common/shapes'

export function hitTestRectangle(
    point: Point,
    rectangle: Rectangle
): boolean {
    return (
        point.x >= rectangle.x &&
        point.x <= rectangle.x + rectangle.width &&
        point.y >= rectangle.y &&
        point.y <= rectangle.y + rectangle.height
    )
}