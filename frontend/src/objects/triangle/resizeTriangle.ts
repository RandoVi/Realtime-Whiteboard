import type { Triangle } from "@common/shapes";
import type { Point } from "@common/types";
import type { ResizeHandle } from "../../types/selection";
import { inverseRotatePoint } from "../../interaction/helpers/rotatePoint";
import { constrainResize } from "../constrainResize";

export function resizeTriangle(
    triangle: Triangle,
    original: Triangle,
    handle: ResizeHandle,
    point: Point,
    constrain: boolean
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
            triangle.width =
                localPoint.x - original.x

            triangle.height =
                localPoint.y - original.y

            break

        case "sw":
            triangle.x =
                localPoint.x

            triangle.width =
                original.x + original.width - localPoint.x

            triangle.height =
                localPoint.y - original.y

            break

        case "ne":
            triangle.y =
                localPoint.y

            triangle.width =
                localPoint.x - original.x

            triangle.height =
                original.y + original.height - localPoint.y

            break

        case "nw":
            triangle.x =
                localPoint.x

            triangle.y =
                localPoint.y

            triangle.width =
                original.x + original.width - localPoint.x

            triangle.height =
                original.y + original.height - localPoint.y

            break
    }

    if (constrain) {
        constrainResize(
            triangle,
            original,
            handle,
        )
    }
}

