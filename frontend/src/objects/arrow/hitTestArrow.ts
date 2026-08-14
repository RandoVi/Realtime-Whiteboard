import type { Point } from "@common/types"
import type { Arrow } from "@common/shapes"

export function hitTestArrow(
    point: Point,
    arrow: Arrow
): boolean {
    return (
        point.x >= arrow.x &&
        point.x <= arrow.x + arrow.width &&
        point.y >= arrow.y &&
        point.y <= arrow.y + arrow.height
    )
}