import type { Point } from "@common/types"
import type { Arrow } from "@common/shapes"
import { inverseRotatePoint } from "../../interaction/helpers/rotatePoint"

export function hitTestArrow(
    point: Point,
    arrow: Arrow
): boolean {

    const center = {
        x: arrow.x + arrow.width / 2,
        y: arrow.y + arrow.height / 2,
    }

    const localPoint = inverseRotatePoint(
        point,
        center,
        arrow.rotation,
    )

    return (
        localPoint.x >= arrow.x &&
        localPoint.x <= arrow.x + arrow.width &&
        localPoint.y >= arrow.y &&
        localPoint.y <= arrow.y + arrow.height
    )
}