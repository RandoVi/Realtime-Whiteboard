import type { Camera } from "../camera/Camera"
import type { BoardObject } from '@common/types'
import {
    HANDLE_SIZE,
    type ResizeHandle,
} from "../types/selection"
import { getResizeHandles } from '../interaction/selection/getResizeHandles'
import { getSelectionBounds } from "../interaction/selection/getSelectionBounds"
import type { SelectionBounds } from '../interaction/selection/getSelectionBounds'
import { getObjectHandler } from '../objects/registry/getObjectHandler'
import { getRotationHandle, type RotationHandle } from '../interaction/selection/getRotationHandle'
import { type MultiSelectionBounds } from "../interaction/selection/getMultiSelectionBounds"


export function renderSelection(
    context: CanvasRenderingContext2D,
    object: BoardObject,
    camera: Camera,
    color: string,
    showHandles = true,
) {

    const bounds = getSelectionBounds(object)

    const handler = getObjectHandler(object)

    const resizeHandles =
        handler.resizeHandles

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
        resizeHandles,
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
    resizeHandles: ResizeHandle[] | undefined,
    rotationHandle: RotationHandle,
) {
    renderSelectionBox(
        context,
        bounds,
        camera,
        color,
    )

    if (!showHandles || !canResize) {
        return
    }

    context.fillStyle = "white"
    context.strokeStyle = color
    context.lineWidth = 2

    const handles = getResizeHandles(
        bounds,
        camera,
        resizeHandles,
    )

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
    context.strokeStyle = 'black'
    context.lineWidth = 2

    context.beginPath()

    context.arc(
        rotationHandle.x,
        rotationHandle.y,
        10,
        0,
        Math.PI * 2,
    )

    context.fill()
    context.stroke()
    context.save()

    context.fillStyle = "white"
    context.strokeStyle = color
    context.lineWidth = 2

    // Rotation icon
    context.save()

    context.translate(
        rotationHandle.x,
        rotationHandle.y,
    )

    context.strokeStyle = color
    context.fillStyle = color
    context.lineWidth = 2
    context.lineCap = "round"
    context.lineJoin = "round"

    // Curved arrow
    const radius = 5

    context.beginPath()

    context.arc(
        0,
        0,
        radius,
        -Math.PI * 0.75,
        Math.PI * 0.9,
    )

    context.stroke()

    // Arrow head
    const arrowAngle = Math.PI * 0.9

    const tipX = Math.cos(arrowAngle) * radius
    const tipY = Math.sin(arrowAngle) * radius

    context.beginPath()

    context.moveTo(tipX, tipY)

    context.lineTo(
        tipX - Math.cos(arrowAngle - Math.PI / 4) * 3,
        tipY - Math.sin(arrowAngle - Math.PI / 4) * 3,
    )

    context.lineTo(
        tipX - Math.cos(arrowAngle + Math.PI / 4) * 3,
        tipY - Math.sin(arrowAngle + Math.PI / 4) * 3,
    )

    context.closePath()
    context.fill()

    context.restore()

    context.restore()
}

// function renderMultiObjectSelection(
//     context: CanvasRenderingContext2D,
//     objects: BoardObject[],
//     camera: Camera,
//     color: string,
//     showHandles: boolean,
// ) {
//     const bounds = getMultiSelectionBounds(objects)

//     if (!bounds) {
//         return
//     }

//     renderSelectionBox(
//         context,
//         bounds,
//         camera,
//         color,
//     )

//     if (!showHandles) {
//         return
//     }

//     renderMultiResizeHandles(
//         context,
//         bounds,
//         camera,
//         color,
//     )

//     const rotationHandle =
//         getRotationHandle(bounds, camera)

//     renderRotationHandle(
//         context,
//         rotationHandle,
//         color,
//     )
// }

// function renderMultiResizeHandles(
//     context: CanvasRenderingContext2D,
//     bounds: MultiSelectionBounds,
//     camera: Camera,
//     color: string,
// ) {
//     const handles = getResizeHandles(
//         bounds,
//         camera,
//         [
//             "nw",
//             "ne",
//             "sw",
//             "se",
//         ],
//     );

//     context.fillStyle = "white";
//     context.strokeStyle = color;
//     context.lineWidth = 2;

//     for (const handle of handles) {
//         context.save();

//         context.translate(handle.x, handle.y);

//         context.beginPath();

//         context.rect(
//             -HANDLE_SIZE / 2,
//             -HANDLE_SIZE / 2,
//             HANDLE_SIZE,
//             HANDLE_SIZE,
//         );

//         context.fill();
//         context.stroke();

//         context.restore();
//     }
// }

function renderSelectionBox(
    context: CanvasRenderingContext2D,
    bounds: SelectionBounds | MultiSelectionBounds,
    camera: Camera,
    color: string,
) {
    const centerX =
        bounds.center.x * camera.scale +
        camera.offsetX

    const centerY =
        bounds.center.y * camera.scale +
        camera.offsetY

    const screenWidth =
        bounds.width * camera.scale

    const screenHeight =
        bounds.height * camera.scale

    context.save()

    context.translate(centerX, centerY)
    context.rotate(bounds.rotation ?? 0)

    context.globalAlpha = 0.5
    context.strokeStyle = color
    context.lineWidth = 4

    const padding = 2

    context.strokeRect(
        -screenWidth / 2 - padding,
        -screenHeight / 2 - padding,
        screenWidth + padding * 2,
        screenHeight + padding * 2,
    )

    context.restore()
}

// function renderRotationHandle(
//     context: CanvasRenderingContext2D,
//     rotationHandle: RotationHandle,
//     color: string,
// ) {
//     context.save()

//     context.fillStyle = "white"
//     context.strokeStyle = "black"
//     context.lineWidth = 2

//     context.beginPath()

//     context.arc(
//         rotationHandle.x,
//         rotationHandle.y,
//         10,
//         0,
//         Math.PI * 2,
//     )

//     context.fill()
//     context.stroke()

//     context.fillStyle = color
//     context.strokeStyle = color
//     context.lineWidth = 2
//     context.lineCap = "round"
//     context.lineJoin = "round"

//     context.save()

//     context.translate(
//         rotationHandle.x,
//         rotationHandle.y,
//     )

//     const radius = 5

//     context.beginPath()

//     context.arc(
//         0,
//         0,
//         radius,
//         -Math.PI * 0.75,
//         Math.PI * 0.9,
//     )

//     context.stroke()

//     const arrowAngle = Math.PI * 0.9

//     const tipX =
//         Math.cos(arrowAngle) * radius

//     const tipY =
//         Math.sin(arrowAngle) * radius

//     context.beginPath()

//     context.moveTo(tipX, tipY)

//     context.lineTo(
//         tipX -
//         Math.cos(arrowAngle - Math.PI / 4) * 3,
//         tipY -
//         Math.sin(arrowAngle - Math.PI / 4) * 3,
//     )

//     context.lineTo(
//         tipX -
//         Math.cos(arrowAngle + Math.PI / 4) * 3,
//         tipY -
//         Math.sin(arrowAngle + Math.PI / 4) * 3,
//     )

//     context.closePath()
//     context.fill()

//     context.restore()
//     context.restore()
// }