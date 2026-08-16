import type { Rectangle } from "@common/shapes"
import type { Point } from "@common/types"
import type { ResizeHandle } from "../../types/selection"
import { inverseRotatePoint } from "../../interaction/helpers/rotatePoint"
import { constrainResize } from "../constrainResize"

export function resizeRectangle(
    rectangle: Rectangle,
    original: Rectangle,
    handle: ResizeHandle,
    point: Point,
    constrain: boolean,
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

    let x = localPoint.x
    let y = localPoint.y

    switch (handle) {

        case "se":
            rectangle.width =
                x - original.x

            rectangle.height =
                y - original.y

            break

        case "sw":
            rectangle.x =
                x

            rectangle.width =
                original.x + original.width - x

            rectangle.height =
                y - original.y

            break

        case "ne":
            rectangle.y =
                y

            rectangle.width =
                x - original.x

            rectangle.height =
                original.y + original.height - y

            break

        case "nw":
            rectangle.x =
                x

            rectangle.y =
                y

            rectangle.width =
                original.x + original.width - x

            rectangle.height =
                original.y + original.height - y

            break
    }

    if (constrain) {
        constrainResize(
            rectangle,
            original,
            handle,
        )
    }
}