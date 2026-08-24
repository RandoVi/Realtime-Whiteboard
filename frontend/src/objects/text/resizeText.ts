import type { CanvasText } from "@common/shapes/CanvasText"
import type { Point } from "@common/types"
import type { ResizeHandle } from "../../types/selection"
import { inverseRotatePoint } from "../../interaction/helpers/rotatePoint"
import { getTextBounds } from "./getTextBounds"

const MIN_WIDTH = 20

export function resizeText(
    text: CanvasText,
    original: CanvasText,
    handle: ResizeHandle,
    point: Point,
) {
    const bounds = getTextBounds(original)

    const localPoint = inverseRotatePoint(
        point,
        bounds.center,
        original.rotation,
    )

    switch (handle) {

        case "e": {
            const width =
                localPoint.x - bounds.left

            text.width =
                Math.max(MIN_WIDTH, width)

            break
        }

        case "w": {
            const width =
                bounds.right - localPoint.x

            text.width =
                Math.max(MIN_WIDTH, width)

            text.x =
                bounds.right - text.width

            break
        }
    }
}