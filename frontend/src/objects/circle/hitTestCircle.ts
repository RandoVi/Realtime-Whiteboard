import type { Circle } from './Circle'
import type { Point } from '../../types/Types'

export function hitTestCircle(
    point: Point,
    circle: Circle
): boolean {
    const dx = point.x - circle.x
    const dy = point.y - circle.y

    return Math.sqrt(dx * dx + dy * dy) <= circle.radius
}