import type { Camera } from '../types/Types'
import type { Object } from '../types/Object'
import { HANDLE_SIZE } from '../types/selection'
import { getResizeHandles } from '../selection/getResizeHandles'
import { getSelectionBounds } from "../selection/getSelectionBounds"
import type { SelectionBounds } from '../selection/getSelectionBounds'
import { getObjectHandler } from '../objects/registry/getObjectHandler'

export function renderSelection(
    context: CanvasRenderingContext2D,
    object: Object,
    camera: Camera,
    color: string,
    showHandles = true,
) {
    const bounds = getSelectionBounds(object)

    const handler = getObjectHandler(object)

    const canResize =
        handler.resize !== undefined &&
        handler.getResizeHandle !== undefined &&
        handler.getResizeUpdates !== undefined

    renderObjectSelection(
        context,
        bounds,
        camera,
        color,
        showHandles,
        canResize
    )
}

function renderObjectSelection(
    context: CanvasRenderingContext2D,
    bounds: SelectionBounds,
    camera: Camera,
    color: string,
    showHandles: boolean,
    canResize: boolean
) {
    const screenX = bounds.left * camera.scale + camera.offsetX
    const screenY = bounds.top * camera.scale + camera.offsetY

    const screenWidth = bounds.width * camera.scale
    const screenHeight = bounds.height * camera.scale

    context.save()

    context.strokeStyle = color
    context.lineWidth = 2

    const padding = 2

    context.strokeRect(
        screenX - padding,
        screenY - padding,
        screenWidth + padding * 2,
        screenHeight + padding * 2,
    )

    context.restore()

    if (!showHandles) {
        return
    }

    if (!canResize) {
        return
    }

    context.fillStyle = 'white'
    context.strokeStyle = color

    const handles = getResizeHandles(bounds, camera)

    for (const handle of handles) {
        context.beginPath()

        context.rect(
            handle.x - HANDLE_SIZE / 2,
            handle.y - HANDLE_SIZE / 2,
            HANDLE_SIZE,
            HANDLE_SIZE,
        )

        context.fill()
        context.stroke()
    }
}