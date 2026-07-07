import type { Camera } from '../Types'
import type { Rectangle } from '../shapes/Rectangle'

export function renderRectangle(context: CanvasRenderingContext2D, rectangle: Rectangle, camera: Camera, isSelected: boolean) {
    // Convert world coordinates to screen coordinates
    const screenX = rectangle.x * camera.scale + camera.offsetX
    const screenY = rectangle.y * camera.scale + camera.offsetY

    const screenWidth = rectangle.width * camera.scale
    const screenHeight = rectangle.height * camera.scale

    context.fillStyle = rectangle.fill
    context.strokeStyle = rectangle.stroke
    context.lineWidth = 2

    context.beginPath()
    // Draw the rectangle using screen coordinates and scaled dimensions
    context.rect(screenX, screenY, rectangle.width * camera.scale, rectangle.height * camera.scale)
    context.fill()
    context.stroke()

    if (isSelected) {
        context.save()

        const padding = 2

        context.strokeRect(
        screenX - padding,
        screenY - padding,
        screenWidth + padding * 2,
        screenHeight + padding * 2,
        )

        context.restore()
    }
}