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

    const left = bounds.left * camera.scale + camera.offsetX
    const top = bounds.top * camera.scale + camera.offsetY
    const right = bounds.right * camera.scale + camera.offsetX
    const bottom = bounds.bottom * camera.scale + camera.offsetY

    return [
        { type: 'nw', x: left, y: top },
        { type: 'ne', x: right, y: top },
        { type: 'sw', x: left, y: bottom },
        { type: 'se', x: right, y: bottom },
    ]
}