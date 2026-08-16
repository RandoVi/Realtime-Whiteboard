import type { Textbox } from "@common/shapes/Textbox"
import type { Point } from "@common/types";
import type { ResizeHandle } from "../../types/selection"
import { inverseRotatePoint } from "../../interaction/helpers/rotatePoint";
import { constrainResize } from "../constrainResize";

// Resizes a textbox based on the original dimensions, the handle being dragged, and the current mouse position.
// rotation is taken into account to ensure the resizing behaves correctly even when the textbox is rotated.
export function resizeTextbox(
    textbox: Textbox,
    original: Textbox,
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

    switch (handle) {

        case "se":
            textbox.width =
                localPoint.x - original.x

            textbox.height =
                localPoint.y - original.y

            break

        case "sw":
            textbox.x =
                localPoint.x

            textbox.width =
                original.x +
                original.width -
                localPoint.x

            textbox.height =
                localPoint.y -
                original.y

            break

        case "ne":
            textbox.y =
                localPoint.y

            textbox.width =
                localPoint.x -
                original.x

            textbox.height =
                original.y +
                original.height -
                localPoint.y

            break

        case "nw":
            textbox.x =
                localPoint.x

            textbox.y =
                localPoint.y

            textbox.width =
                original.x +
                original.width -
                localPoint.x

            textbox.height =
                original.y +
                original.height -
                localPoint.y

            break
    }

    if (constrain) {
        constrainResize(
            textbox,
            original,
            handle,
        )
    }
}


