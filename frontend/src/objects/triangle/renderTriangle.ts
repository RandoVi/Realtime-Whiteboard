
import type { Triangle } from "@common/shapes";
import type { Camera } from "../../camera/Camera";

export function renderTriangle(
    context: CanvasRenderingContext2D,
    triangle: Triangle,
    camera: Camera
) {
    let { x, y, width, height } = triangle

    if (width < 0) {
        x += width
        width = Math.abs(width)
    }

    if (height < 0) {
        y += height
        height = Math.abs(height)
    }

    const centerX =
        (x + width / 2) * camera.scale + camera.offsetX

    const centerY =
        (y + height / 2) * camera.scale + camera.offsetY

    const screenWidth = width * camera.scale
    const screenHeight = height * camera.scale

    context.save()

    context.translate(centerX, centerY)
    context.rotate(triangle.rotation)

    context.fillStyle = triangle.fill
    context.strokeStyle = triangle.stroke
    context.lineWidth = triangle.strokeWidth

    context.beginPath()

    context.moveTo(
        0,
        -screenHeight / 2
    )

    context.lineTo(
        -screenWidth / 2,
        screenHeight / 2
    )

    context.lineTo(
        screenWidth / 2,
        screenHeight / 2
    )

    context.closePath()

    context.fill()
    context.stroke()

    context.restore()
}