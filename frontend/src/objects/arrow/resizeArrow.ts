import type { ResizeHandle } from "../../types/selection"
import type { Arrow } from "@common/shapes"
import type { Point } from "@common/types"
import { inverseRotatePoint } from "../../interaction/helpers/rotatePoint"

export function resizeArrow(
    arrow: Arrow,
    original: Arrow,
    handle: ResizeHandle,
    point: Point
) {
    const center = {
        x: original.x + original.width / 2,
        y: original.y + original.height / 2,
    }

    const localPoint = inverseRotatePoint(
        point,
        center,
        original.rotation,
    )

    switch (handle) {

        case "se":
            arrow.width =
                localPoint.x - original.x

            arrow.height =
                localPoint.y - original.y

            break

        case "sw":
            arrow.x =
                localPoint.x

            arrow.width =
                original.x +
                original.width -
                localPoint.x

            arrow.height =
                localPoint.y -
                original.y

            break

        case "ne":
            arrow.y =
                localPoint.y

            arrow.width =
                localPoint.x -
                original.x

            arrow.height =
                original.y +
                original.height -
                localPoint.y

            break

        case "nw":
            arrow.x =
                localPoint.x

            arrow.y =
                localPoint.y

            arrow.width =
                original.x +
                original.width -
                localPoint.x

            arrow.height =
                original.y +
                original.height -
                localPoint.y

            break
    }
}