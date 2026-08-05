import type { Triangle } from './Triangle'
import type { Point } from '../../types/Types'


export function hitTestTriangle(
    point: Point,
    triangle: Triangle
): boolean {
    return (
        point.x >= triangle.x &&
        point.x <= triangle.x + triangle.width &&
        point.y >= triangle.y &&
        point.y <= triangle.y + triangle.height
    )
}