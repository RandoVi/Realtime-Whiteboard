import type { ResizeHandle } from "../types/selection"

export function constrainResize(
    object: {
        x: number
        y: number
        width: number
        height: number
    },
    original: {
        x: number
        y: number
        width: number
        height: number
    },
    handle: ResizeHandle,
) {
    const size = Math.max(
        Math.abs(object.width),
        Math.abs(object.height),
    )

    const widthSign = Math.sign(object.width) || 1
    const heightSign = Math.sign(object.height) || 1

    object.width = widthSign * size
    object.height = heightSign * size

    switch (handle) {
        case "se":
            break

        case "sw":
            object.x =
                original.x + original.width - object.width
            break

        case "ne":
            object.y =
                original.y + original.height - object.height
            break

        case "nw":
            object.x =
                original.x + original.width - object.width

            object.y =
                original.y + original.height - object.height
            break
    }
}