import type { ResizeHandle } from "../types/selection"
import type { Camera } from "../types/Types"
import type { SelectionBounds } from "./getSelectionBounds"

export type ResizeHandlePosition = {
    type: ResizeHandle
    x: number
    y: number
}
// Returns the positions of the resize handles for a given selection bounds and camera.
export function getResizeHandles(
    bounds: SelectionBounds,
    camera: Camera,
): ResizeHandlePosition[] {

    const centerX =
        bounds.center.x * camera.scale +
        camera.offsetX

    const centerY =
        bounds.center.y * camera.scale +
        camera.offsetY

    const halfWidth =
        bounds.width * camera.scale / 2

    const halfHeight =
        bounds.height * camera.scale / 2

    const rotation = bounds.rotation ?? 0

    const cos = Math.cos(rotation)
    const sin = Math.sin(rotation)

    function rotate(
        localX: number,
        localY: number,
    ) {
        return {
            x:
                centerX +
                localX * cos -
                localY * sin,

            y:
                centerY +
                localX * sin +
                localY * cos,
        }
    }

    return [
        {
            type: "nw",
            ...rotate(-halfWidth, -halfHeight),
        },
        {
            type: "ne",
            ...rotate(halfWidth, -halfHeight),
        },
        {
            type: "sw",
            ...rotate(-halfWidth, halfHeight),
        },
        {
            type: "se",
            ...rotate(halfWidth, halfHeight),
        },
    ]
}