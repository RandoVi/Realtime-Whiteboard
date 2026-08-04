import type { Rectangle } from './Rectangle'
import type { Point } from '../../types/Types'

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