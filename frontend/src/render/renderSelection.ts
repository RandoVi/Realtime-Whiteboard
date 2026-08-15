import type { Camera } from '../types/Types'
import type { Object } from '@common/types'
import { HANDLE_SIZE } from '../types/selection'
import { getResizeHandles } from '../selection/getResizeHandles'
import { getSelectionBounds } from "../selection/getSelectionBounds"
import type { SelectionBounds } from '../selection/getSelectionBounds'
import { getObjectHandler } from '../objects/registry/getObjectHandler'
import { getRotationHandle, type RotationHandle } from '../selection/getRotationHandle'

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

    const rotationHandle = getRotationHandle(
        object,
        camera,
    )

    renderObjectSelection(
        context,
        bounds,
        camera,
        color,
        showHandles,
        canResize,
        rotationHandle,
    )
}

function renderObjectSelection(
    context: CanvasRenderingContext2D,
    bounds: SelectionBounds,
    camera: Camera,
    color: string,
    showHandles: boolean,
    canResize: boolean,
    rotationHandle: RotationHandle,
) {
    const centerX =
        bounds.center.x * camera.scale + camera.offsetX

    const centerY =
        bounds.center.y * camera.scale + camera.offsetY

    const screenWidth =
        bounds.width * camera.scale

    const screenHeight =
        bounds.height * camera.scale

    context.save()

    context.translate(centerX, centerY)
    context.rotate(bounds.rotation ?? 0)

    context.strokeStyle = color
    context.lineWidth = 2

    const padding = 2

    context.strokeRect(
        -screenWidth / 2 - padding,
        -screenHeight / 2 - padding,
        screenWidth + padding * 2,
        screenHeight + padding * 2,
    )

    context.restore()

    if (!showHandles || !canResize) {
        return
    }

    context.fillStyle = "white"
    context.strokeStyle = color

    const handles = getResizeHandles(bounds, camera)

    for (const handle of handles) {
        context.save()

        context.translate(handle.x, handle.y)
        context.rotate(bounds.rotation ?? 0)

        context.beginPath()

        context.rect(
            -HANDLE_SIZE / 2,
            -HANDLE_SIZE / 2,
            HANDLE_SIZE,
            HANDLE_SIZE,
        )

        context.fill()
        context.stroke()

        context.restore()
    }

    context.save()

    context.fillStyle = "white"
    context.strokeStyle = color
    context.lineWidth = 2

    context.beginPath()

    context.arc(
        rotationHandle.x,
        rotationHandle.y,
        6,
        0,
        Math.PI * 2,
    )

    context.fill()
    context.stroke()

    context.beginPath()

    const topHandle = getResizeHandles(
        bounds,
        camera,
    ).find(handle => handle.type === "nw")

    if (topHandle) {
        context.moveTo(
            rotationHandle.x,
            rotationHandle.y + 6,
        )

        context.lineTo(
            topHandle.x,
            topHandle.y,
        )

        context.stroke()
    }

    context.restore()
}