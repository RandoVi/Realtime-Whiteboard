import type { Camera } from "../../camera/Camera"
import type { Rectangle } from '@common/shapes'

export function renderRectangle(
    context: CanvasRenderingContext2D,
    rectangle: Rectangle,
    camera: Camera
) {
    const screenX =
        rectangle.x * camera.scale + camera.offsetX

    const screenY =
        rectangle.y * camera.scale + camera.offsetY

    const screenWidth =
        rectangle.width * camera.scale

    const screenHeight =
        rectangle.height * camera.scale

    const centerX =
        screenX + screenWidth / 2

    const centerY =
        screenY + screenHeight / 2

    context.save()

    context.translate(centerX, centerY)
    context.rotate(rectangle.rotation)

    context.fillStyle = rectangle.fill
    context.strokeStyle = rectangle.stroke
    context.lineWidth = 2

    context.beginPath()

    context.rect(
        -screenWidth / 2,
        -screenHeight / 2,
        screenWidth,
        screenHeight,
    )

    context.fill()
    context.stroke()

    context.restore()
}