import type { BoardObject, Point } from "@common/types"
import { getObjectHandler } from "../../objects/registry/getObjectHandler"

export type SelectionBounds = {
    left: number
    top: number
    right: number
    bottom: number

    width: number
    height: number

    center: Point

    rotation?: number
}

export function getSelectionBounds(
    object: BoardObject
): SelectionBounds {

    const bounds = getObjectHandler(object).getBounds(object)

    return {
        ...bounds,
        rotation:
            "rotation" in object && typeof object.rotation === "number"
                ? object.rotation
                : 0,
    }
}