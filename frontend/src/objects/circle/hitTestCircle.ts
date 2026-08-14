import type { Point } from "@common/types";
import type { Circle } from "@common/shapes";

export function hitTestCircle(
    point: Point,
    circle: Circle
): boolean {
    const dx = point.x - circle.x
    const dy = point.y - circle.y

    return Math.sqrt(dx * dx + dy * dy) <= circle.radius
}