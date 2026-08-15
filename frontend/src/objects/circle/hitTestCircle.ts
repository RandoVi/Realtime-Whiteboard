import type { Point } from "@common/types";
import type { Circle } from "@common/shapes";
import { inverseRotatePoint } from "../../interaction/helpers/rotatePoint";

export function hitTestCircle(
    point: Point,
    circle: Circle
): boolean {

    const localPoint = inverseRotatePoint(
        point,
        {
            x: circle.x,
            y: circle.y,
        },
        circle.rotation,
    )

    const dx = localPoint.x - circle.x
    const dy = localPoint.y - circle.y

    return Math.sqrt(dx * dx + dy * dy) <= circle.radius
}