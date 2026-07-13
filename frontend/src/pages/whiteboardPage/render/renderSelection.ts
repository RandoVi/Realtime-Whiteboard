import type { Camera } from '../Types'
import type { Shape } from '../shapes/Shape'
import { HANDLE_SIZE } from '../tools/selection'
import { getResizeHandles } from './selection/getResizeHandles'
import { getSelectionBounds} from "./selection/getSelectionBounds"
import type { SelectionBounds } from './selection/getSelectionBounds'

export function renderSelection(
    context: CanvasRenderingContext2D,
    shape: Shape,
    camera: Camera,
) {

    const bounds = getSelectionBounds(shape)

    switch (shape.type) {
        case 'rectangle':
            renderRectangleSelection(context, bounds, camera)
            break
    }
}

function renderRectangleSelection(
    context: CanvasRenderingContext2D,
    bounds: SelectionBounds,
    camera: Camera,
) {
    const screenX = bounds.left * camera.scale + camera.offsetX
    const screenY = bounds.top * camera.scale + camera.offsetY

    const screenWidth = bounds.width * camera.scale
    const screenHeight = bounds.height * camera.scale

    context.save()

    context.strokeStyle = '#3b82f6'
    context.lineWidth = 2

    const padding = 2

    context.strokeRect(
        screenX - padding,
        screenY - padding,
        screenWidth + padding * 2,
        screenHeight + padding * 2,
    )

    context.restore()

    context.fillStyle = 'white'
    context.strokeStyle = '#3b82f6'

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