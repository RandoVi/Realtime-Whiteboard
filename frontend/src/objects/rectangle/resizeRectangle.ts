import type { Rectangle } from "@common/shapes"
import type { Point } from "@common/types"
import type { ResizeHandle } from "../../types/selection"
import { inverseRotatePoint } from "../../interaction/helpers/rotatePoint"

export function resizeRectangle(
    rectangle: Rectangle,
    original: Rectangle,
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
            rectangle.width =
                localPoint.x - original.x

            rectangle.height =
                localPoint.y - original.y

            break

        case "sw":
            rectangle.x =
                localPoint.x

            rectangle.width =
                original.x + original.width - localPoint.x

            rectangle.height =
                localPoint.y - original.y

            break

        case "ne":
            rectangle.y =
                localPoint.y

            rectangle.width =
                localPoint.x - original.x

            rectangle.height =
                original.y + original.height - localPoint.y

            break

        case "nw":
            rectangle.x =
                localPoint.x

            rectangle.y =
                localPoint.y

            rectangle.width =
                original.x + original.width - localPoint.x

            rectangle.height =
                original.y + original.height - localPoint.y

            break
    }
}